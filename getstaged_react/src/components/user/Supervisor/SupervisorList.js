import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import LoadingIndicator  from '../../common/LoadingIndicator';
import {getAllSupervisors} from '../../utils/Utils'

import {APPLICATION_NAME, STUDENT_LIST_SIZE} from '../../constants/Constants';
import {Icon, Table, InputNumber, Badge} from 'antd'
import './SupervisorList.css';

class SupervisorList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            supervisors: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
        };
        this.loadSupervisorList = this.loadSupervisorList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    componentWillMount() {
        this.loadStudentList();
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            this.setState({
                supervisors: [],
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

    loadSupervisorList(page = 0, size = STUDENT_LIST_SIZE){
        let promise;
        promise = getAllSupervisors(page, size);

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                const supervisors = this.state.supervisors.slice();
                console.log(response);
                this.setState({
                    supervisors: supervisors.concat(response.content),
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    isLoading: false
                })
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });
    }

    render(){

        const columns = [ {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName'
        }, {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
        }, {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        }];


        return (
            <div className="supervisors-container">
                {<Table
                    rowKey="uid"
                    className="supervisor-table"
                    columns={columns}
                    dataSource={this.state.supervisors}
                    pagination={{ pageSize: 10}}
                />}
                {
                    !this.state.isLoading && this.state.supervisors.length === 0 ? (
                        <div className="no-supervisors-found">
                            <span>No Supervisors Found.</span>
                        </div>
                    ): null
                }
                {
                    this.state.isLoading ?
                        <LoadingIndicator />: null
                }
            </div>
        );

    }
}

export default withRouter(SupervisorList);