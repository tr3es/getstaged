import React, {Component} from 'react';
import {Row, Col, Form, Tabs, Layout, Menu, Icon, Button, Table, Dropdown, Input, Select, Radio} from 'antd';
import {
    OFFER_LIST_SIZE
} from '../constants/Constants';
import {
    getAllActivePeriodes, studentMarkUpPeriode, studentMarkDownPeriode,
    isStudentPeriodeAvailable, getAllPeriodesForStudent
} from '../utils/Utils';

const FormItem = Form.Item;

class StudentPeriodeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            periodes: [],
            disponibilites: [],
        }
        this.loadPeriodeList = this.loadPeriodeList.bind(this);
        this.handleDisponible = this.handleDisponible.bind(this);
        this.periodeAv = this.periodeAv.bind(this);
        this.loadMyPeriodes = this.loadMyPeriodes.bind(this);
    }

    componentWillMount() {
        this.setState({
            currentUser: this.props.currentUser,
            isAuthenticated: this.props.isAuthenticated,
        });
        this.loadPeriodeList();
    }

    componentDidMount() {
        this.loadMyPeriodes();
    }

    loadPeriodeList(page = 0, size = OFFER_LIST_SIZE) {
        let promise;
        promise = getAllActivePeriodes(page, size).then(x => {
            return x
        });
        console.log(promise.then(x => {
            return x
        }));
        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        })

        if (this.state.periodes.length != 0) {
            this.setState({
                periodes: [],
            });
        }
        promise
            .then(response => {
                const periodes = this.state.periodes.slice();
                console.log(response.content);
                //let disp = isStudentPeriodeAvailable(this.state.currentUser.id,response.content.id);
                //console.log(disp);
                response.content.map(x => {
                    let dispo = isStudentPeriodeAvailable(this.state.currentUser.id, x.id).then(x => {
                        return x
                    });
                    console.log(dispo);
                    x.dispo = dispo.then(x => {
                        return x
                    });
                    console.log(x.dispo);
                });
                console.log(response.content);
                this.setState({
                    periodes: periodes.concat(response.content),
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

    handleDisponible(actif, record) {
        console.log(record);
        console.log(actif.target.value);
        this.setState({
            disponibleBuffer: actif.target.value,
        })
        if (actif.target.value === true) {
            studentMarkUpPeriode(this.state.currentUser.id, record);
        } else {
            studentMarkDownPeriode(this.state.currentUser.id, record);
        }
    }

    loadMyPeriodes(perid) {
        let ret;
        ret = getAllPeriodesForStudent(this.state.currentUser.id);
        if (!ret) {
            return;
        }
        this.setState({
            isLoading: true
        })
        if (this.state.disponibilites.length != 0) {
            this.setState({
                disponibilites: [],
            });
        }
        ret
            .then(response => {
                const disponibilites = this.state.disponibilites.slice();
                this.setState({
                    disponibilites: disponibilites.concat(response.content),
                    isLoading: false
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });
    }

    periodeAv(periode) {
        return isStudentPeriodeAvailable(this.state.currentUser.id, periode).then(token => {
            return token
        }).then(test => {
            return test
        });
    }

    render() {
        const columns = [
            {
                title: 'Période',
                dataIndex: 'saison',
                key: 'saison'
            }, {
                title: 'Année',
                dataIndex: 'annee',
                key: 'annee'
            },
        ]
        const columns2 = [
            {
                title: 'Période',
                dataIndex: 'saison',
                key: 'saison'
            }, {
                title: 'Année',
                dataIndex: 'annee',
                key: 'annee'
            },
        ]
        let dispos = this.state.periodes;
        let dispos2 = this.state.disponibilites;
        return (
            <Row glutter={8}>
                <Col span={4}/>
                <Col span={16}>
                    <h3 className="titre-periode-student" style={{paddingTop: "10px"}}>{"Toutes les périodes de stage disponibles"}</h3>
                    <Table
                        bordered={true}
                        rowKey="uide"
                        className="offer-table"
                        columns={columns}
                        dataSource={dispos}
                        expandedRowRender={record => (
                            <div style={{margin: 0}}>
                    <span>
                    <table>
                      <thead>
                        <tr><td><b>{"Modifier la disponibilité: "}</b></td></tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{"Je cherche un stage pour cette période: "}</td>
                          <td><br/>
                          <FormItem>
                              <Radio.Group  onChange={(event) => this.handleDisponible(event, record)}>
                                <Radio.Button value={true}>Oui</Radio.Button>
                                <Radio.Button value={false}>Non</Radio.Button>
                              </Radio.Group>
                            </FormItem>
                          </td>
                          <td>
                          <Form>
                            <Button key={"ajout"} type="primary"  onClick={() => window.location.reload()}
                                    ghost className='titreMiniSection'>Confirmer</Button>
                            </Form>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    </span>
                            </div>
                        )}/>
                    <h3 className="titre-periode-student">{"Vos périodes"}</h3>
                    <Table
                        bordered={true}
                        rowKey="uide"
                        className="offer-table"
                        columns={columns2}
                        dataSource={dispos2}/>
                </Col>
                <Col span={4}/>
            </Row>

        );
    }
}

export default StudentPeriodeList;
