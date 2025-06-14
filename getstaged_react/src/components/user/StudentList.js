import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import LoadingIndicator from '../common/LoadingIndicator';
import {getAllStudents, getAllMonitors, assignMonitor} from '../utils/Utils'
import {APPLICATION_NAME, STUDENT_LIST_SIZE} from '../constants/Constants';
import {Table, Badge, Select, notification, Button, Icon} from 'antd'
import PropTypes from 'prop-types'
import './StudentList.css';

const {Option, OptGroup} = Select;

class StudentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            monitors: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
        };
        this.loadStudentList = this.loadStudentList.bind(this);
        this.loadMonitorList = this.loadMonitorList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.getMonitorName = this.getMonitorName.bind(this);
        this.handleSelectMonitor = this.handleSelectMonitor.bind(this);
    }

    componentWillMount() {
        this.loadStudentList();
        this.loadMonitorList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
            this.setState({
                students: [],
                monitors: [],
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

    loadStudentList(page = 0, size = STUDENT_LIST_SIZE) {
        let promise;
        promise = getAllStudents(page, size);

        if (!promise) {
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
                console.log(response);
                this.setState({
                    students: students.concat(response.content),
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

    loadMonitorList(page = 0, size = STUDENT_LIST_SIZE) {
        let promise;
        promise = getAllMonitors(page, size);

        if (!promise) {
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
                })
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });
    }

    handleSelectMonitor(value, record) {
        console.log(this.state.monitors[value].id)
        const monitorId = this.state.monitors[value].id;
        assignMonitor(record.id, monitorId)
            .then(response => {
                this.loadStudentList();
                this.loadMonitorList();
                this.setState({
                    isLoading: false
                });
                notification.info({
                    message: APPLICATION_NAME,
                    description: "Le moniteur a été assigné correctement.",
                    placement: "topRight"
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            });
            notification.error({
                message: APPLICATION_NAME,
                description: "Le moniteur n'a pas été assigné correctement.",
                placement: "topRight"
            });
        });
        console.log("StudentList => ", this.state.students);
        console.log("StudentList => ", this.state.monitors);
        this.forceUpdate();
    }

    getMonitorName(monitorId) {
        return this.state.monitors
            .filter((monitor) => monitor.id === monitorId)
            .map((monitor, index) => <h6 key={index}>{monitor.firstName}, {monitor.lastName}</h6>)
    }

    render() {
        const monitors = this.state.monitors;
        const students = this.state.students;
        const columns = [{
            title: 'Prénom, Nom',
            key: 'name',
            render: (record) => (
                <span>
                    {record.firstName}, {record.lastName}
                 </span>
            ),
        },{
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email'
        }, {
            title: 'Nom du Moniteur',
            key: 'monitorName',
            render: (record) => (
                <span>
                    {this.getMonitorName(record.monitorId) !== null ? this.getMonitorName(record.monitorId) : <p>Aucun</p>}
                </span>
            ),
        }, {
            title: 'Moniteurs',
            key: 'monitor',
            render: (record) => (
                <Select
                    //defaultValue={monitors[0].firstName}
                    style={{width: 120}}
                    placeholder="Sélectionner..."
                    onChange={(value) => this.handleSelectMonitor(value, record)}
                >
                    <OptGroup label="Moniteurs">
                        {
                            monitors.map((monitor, index) =>
                                <Option
                                    key={index}>{`${monitor.lastName}, ${monitor.firstName}`}
                                </Option>
                            )
                        }
                    </OptGroup>
                </Select>
            )
        }, {
            title: 'Statut',
            key: 'status',
            render: (record) => (
                <span>
                   {record.monitorId === null ? <Badge status={"default"}/> : <Badge status={"processing"}/>}
                </span>
            ),
        }];


        return (
            <div className="students-container">
                {<Table
                    rowKey="uid"
                    className="student-table"
                    columns={columns}
                    dataSource={this.state.students}
                    pagination={{pageSize: 10}}
                    locale={{emptyText: "Aucun étudiant."}}
                    loading={this.state.isLoading}
                />}
                {
                    !this.state.isLoading && this.state.students.length === 0 ? (
                        <div className="no-students-found">
                            <span>Aucun étudiant.</span>
                        </div>
                    ) : null
                }
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
                        <LoadingIndicator/> : null
                }
            </div>
        );

    }
}

StudentList.propTypes = {
    students: PropTypes.arrayOf(PropTypes.object),
    monitors: PropTypes.arrayOf(PropTypes.object),
    page: PropTypes.number,
    size: PropTypes.number,
    totalElements: PropTypes.number,
    totalPages: PropTypes.number,
    last: PropTypes.bool,
    isLoading: PropTypes.bool,
};

export default withRouter(StudentList);
