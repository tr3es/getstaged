import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import LoadingIndicator  from '../../common/LoadingIndicator';
import {getStudentsCoordinator, blockUser} from '../../utils/Utils'

import {APPLICATION_NAME, STUDENT_LIST_SIZE, TEXT_REQUEST_ERROR_COMMON} from '../../constants/Constants';
import {Button, Icon, notification, Table, Tag} from 'antd'
import "./StudentDetailList.css"
import UUID from 'uuid';

class StudentDetailList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
        };
        this.loadStudentList = this.loadStudentList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleBlockUser = this.handleBlockUser.bind(this);
    }

    componentWillMount() {
        this.loadStudentList();
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            this.setState({
                students: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false
            });
            this.loadStudentList();
        }
    }

    handleLoadMore() {
        this.loadStudentList(this.state.page + 1);
    }

    loadStudentList(page = 0, size = STUDENT_LIST_SIZE){
        let promise;
        promise = getStudentsCoordinator(page, size);

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        if (this.state.students.length !== 0) {
            this.setState({
                students: [],
            });
        }

        promise
            .then(response => {
                const students = this.state.students.slice();
                this.setState({
                    students: students.concat(response.content),
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    isLoading: false
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });
    }

    handleBlockUser(record, e){
        this.setState({
            isLoading: true
        });

        blockUser(record.id)
            .then(response => {
                this.loadStudentList();
                this.setState({
                    isLoading: false,
                });
                notification.success({
                    message: APPLICATION_NAME,
                    description: "L'utilisateur a été bloqué avec succès.",
                    placement: "topRight"
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            });
            notification.error({
                message: APPLICATION_NAME,
                description: TEXT_REQUEST_ERROR_COMMON,
                placement: "topRight"
            });
        });
    }

    render(){
        console.log("Students details => ", this.state.students);
        const columns = [ {
            title: 'Prénom, Nom',
            key: 'name',
            render: (record) => (
                <span>
                    {record.firstName}, {record.lastName}
                 </span>
            ),
        }, {
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email',
        }, {
            title: 'Statut Cv',
            key: 'statusCv',
            render: (record) => (
                <span>
                    {record.statusCv === 'none' ? <Tag color="grey" key={record.id + 'cv'}>Pas de Cv</Tag> :
                        record.statusCv === 'En approbation' ? <Tag color="gold" key={record.id + 'Approbation'}>En approbation</Tag> :
                            record.statusCv === 'Approuvé' ? <Tag color="green" key={record.id + 'cvApprouver'}>Approuvée</Tag> :
                                <Tag color="volcano" key={record.id + 'refus'}>Refusée</Tag>
                    }
                 </span>
            ),
        }, {
            title: 'Statut moniteur',
            key: 'statusMoniteur',
            render: (record) => (
                <span>
                    {record.monitored === false ? <Tag color="volcano" key={record.id + 'monitor'}>Non-Assigné</Tag> :
                         <Tag color="#13CE66" key={record.id + 'approuver'}>Assigné</Tag>
                    }
                 </span>
            ),
        }, {
            title: 'Statut stage',
            key: 'statusStage',
            render: (record) => (
                <span>
                    {!record.staged ? <Tag color="volcano" key={record.id + 'stage'}>Pas de stage</Tag> :
                        <Tag color="green" key={record.id + 'stagiaire'}>Stagiaire</Tag>
                    }
                 </span>
            ),
        }, {
            title: 'Bloquer',
            key: 'bloquer',
            render: (record) => (
                <span>
                    { !record.blocked ? <Button key={record.id} type="danger" ghost onClick={(e) => this.handleBlockUser(record, e)}>Bloquer</Button>
                        : <Tag color="volcano" key={record.id + 'block'} >Utilisateur bloqué</Tag> }
                 </span>
            )
        }];


        return (
            <div className="student-details-container">
                {<Table
                    rowKey={UUID()}
                    className="student-details-table"
                    loading={this.state.isLoading}
                    pagination={{pageSize: 10}}
                    columns={columns}
                    dataSource={this.state.students}
                    locale={{emptyText: "Pas d'étudiants inscrits"}}
                />}
                {/*{
                    !this.state.isLoading && this.state.students.length === 0 ? (
                        <div className="no-students-found">
                            <span>Aucun étudiant.</span>
                        </div>
                    ): null
                }*/}
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-students">
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus"/> Charger plus
                            </Button>
                        </div>) : null
                }
                {
                    this.state.isLoading ?
                        <LoadingIndicator />: null
                }
            </div>
        );

    }
}

export default withRouter(StudentDetailList);
