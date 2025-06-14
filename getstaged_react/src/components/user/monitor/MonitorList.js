import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import LoadingIndicator  from '../../common/LoadingIndicator';
import {getMonitorsCoordinator, blockUser} from '../../utils/Utils'

import {APPLICATION_NAME, STUDENT_LIST_SIZE, TEXT_REQUEST_ERROR_COMMON} from '../../constants/Constants';
import {Button, Icon, notification, Table, Tag} from 'antd'
import './MonitorList.css';
import UUID from 'uuid';

class MonitorList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            monitors: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
        };
        this.loadMonitorList = this.loadMonitorList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleBlockUser = this.handleBlockUser.bind(this);
    }

    componentWillMount() {
        this.loadMonitorList();
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            this.setState({
                monitors: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false
            });
            this.loadMonitorList();
        }
    }

    handleLoadMore() {
        this.loadMonitorList(this.state.page + 1);
    }

    loadMonitorList(page = 0, size = STUDENT_LIST_SIZE){
        let promise;
        promise = getMonitorsCoordinator(page, size);

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        if (this.state.monitors.length !== 0) {
            this.setState({
                monitors: [],
            });
        }

        promise
            .then(response => {
                const monitors = this.state.monitors.slice();
                this.setState({
                    monitors: monitors.concat(response.content),
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    isLoading: false
                });
                console.log("Monitors => ",response);
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
                this.loadMonitorList();
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

        const columns = [ {
            title: 'Prénom',
            dataIndex: 'firstName',
            key: 'firstName'
        }, {
            title: 'Nom',
            dataIndex: 'lastName',
            key: 'lastName',
        }, {
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email',
        }, {
            title: 'Nombre de stagiaires',
            dataIndex: 'numberStagiaires',
            key: 'numberStagiaires',
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
            <div className="monitors-container">
                {<Table
                    rowKey={UUID()}
                    className="monitor-table"
                    loading={this.state.isLoading}
                    pagination={{pageSize: 10}}
                    columns={columns}
                    dataSource={this.state.monitors}
                    locale={{emptyText: "Aucun moniteur disponible"}}
                />}
                {/*{
                    !this.state.isLoading && this.state.monitors.length === 0 ? (
                        <div className="no-monitors-found">
                            <span>Plus de moniteurs</span>
                        </div>
                    ): null
                }*/}
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-monitors">
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

export default withRouter(MonitorList);
