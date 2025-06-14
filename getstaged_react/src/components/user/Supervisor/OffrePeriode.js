import React, {Component} from 'react';
import {Row, Col, Form, Tabs, Layout, Menu, Icon, Button, Table, Dropdown, Input, Select, Radio} from 'antd';
import {postPeriode, getAllPeriodes, updatePeriode} from '../../utils/Utils';
import {
    OFFER_LIST_SIZE
} from '../../constants/Constants';

const FormItem = Form.Item;
const Option = Select.Option;

class OffrePeriode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nouvellePeriode: {
                saison: '',
                annee: '',
                estActive: '',
            },
            updatePeriode: {
                saison: '',
                annee: '',
                estActive: '',
            },
            actifbuffer: '',
            periodes: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
        }

        this.removePeriode = this.removePeriode.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.loadPeriodeList = this.loadPeriodeList.bind(this);
        this.handleSaison = this.handleSaison.bind(this);
        this.handleActif = this.handleActif.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.handleUpdateActif = this.handleUpdateActif.bind(this);
    }

    loadPeriodeList(page = 0, size = OFFER_LIST_SIZE) {
        let promise;
        promise = getAllPeriodes(page, size);

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

    componentWillMount() {
        this.setState({
            currentUser: this.props.currentUser,
            isAuthenticated: this.props.isAuthenticated,
        });
        this.loadPeriodeList();
    }

    removePeriode(record) {

    }

    handleUpdateActif(actif, record) {
        this.setState({
            actifbuffer: actif.target.value,
        })
        updatePeriode(record);
    }


    handleActif(actif) {
        this.setState({
            nouvellePeriode: {
                saison: this.state.nouvellePeriode.saison,
                annee: this.state.nouvellePeriode.annee,
                estActive: actif.target.value
            }
        })
    }

    handleAnnee(annee) {
        this.setState({
            nouvellePeriode: {
                saison: this.state.nouvellePeriode.saison,
                annee: annee,
                estActive: this.state.nouvellePeriode.estActive
            }
        })
    }

    handleSaison(periode) {
        this.setState({
            nouvellePeriode: {
                saison: periode,
                annee: this.state.nouvellePeriode.annee,
                estActive: this.state.nouvellePeriode.estActive
            }
        })
    }

    validateForm() {
        return !((this.state.nouvellePeriode.estActive !== '') && this.state.nouvellePeriode.saison != ''
            && this.state.nouvellePeriode.annee != '');
    }

    handleSubmit() {
        const periodeOutput = {
            saison: this.state.nouvellePeriode.saison,
            annee: this.state.nouvellePeriode.annee,
            estActive: this.state.nouvellePeriode.estActive
        }
        postPeriode(periodeOutput);
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
            }, {
                title: 'Actif',
                render: (record) => (<span>
          {record.estActive === true ? <Icon type="check-circle" size="large" theme="twoTone" twoToneColor="#52c41a"/> :
              <Icon type="close-circle" size="large" theme="twoTone" twoToneColor="#FF0000"/>}
          </span>
                ),
            },
        ]

        return (
            <div className="offers-container">
                {
                    <Table
                        rowKey="uide"
                        className="offer-table"
                        columns={columns}
                        dataSource={this.state.periodes}
                        pagination={false}
                        expandedRowRender={record => (
                            <div style={{margin: 0}}>
                  <span>
                  <table>
                    <thead>
                      <tr><td><b>{"Modifier la disponibilité: "}</b></td></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{"Disponible pour sélection: "}</td>
                        <td><br/>
                        <FormItem>
                            <Radio.Group size="large" defaultValue={record.estActive}
                                         onChange={(event) => this.handleUpdateActif(event, record)}>
                              <Radio.Button value={true}>Actif</Radio.Button>
                              <Radio.Button value={false}>Non-Actif</Radio.Button>
                            </Radio.Group>
                          </FormItem>
                        </td>
                      </tr>
                    </tbody>
                  </table>
             </span>
                            </div>
                        )}
                        footer={() =>
                            <span>
                      <Form onSubmit={this.handleSubmit} className="signup-form">
                          <br/>
                          <br/>
                      <table>
                        <thead>
                          <tr><td><b>{"Ajouter une nouvelle période: "}</b></td></tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <FormItem label="Saison: " saison={this.state.nouvellePeriode.saison}>
                                <Select size="large" name="saison" defaultValue="Printemps"
                                        value={this.state.nouvellePeriode.saison ? this.state.nouvellePeriode.saison : undefined}
                                        onChange={(event) => this.handleSaison(event)}>
                                    <Option value="Été">{"Été"}</Option>
                                    <Option value="Hiver">{"Hiver"}</Option>
                                </Select>
                              </FormItem>
                            </td>
                            <td>
                              <FormItem label="Année: " annee={this.state.nouvellePeriode.annee}>
                                <Select size="large" name="annee" defaultValue="2018"
                                        value={this.state.nouvellePeriode.annee ? this.state.nouvellePeriode.annee : undefined}
                                        onChange={(event) => this.handleAnnee(event)}>
                                    <Option value="2018">{"2018"}</Option>
                                    <Option value="2019">{"2019"}</Option>
                                    <Option value="2020">{"2020"}</Option>
                                    <Option value="2021">{"2021"}</Option>
                                    <Option value="2021">{"2022"}</Option>
                                </Select>
                              </FormItem>
                            </td>
                            <td>
                              <FormItem label="Disponible pour sélection: ">
                                <Radio.Group value={this.state.nouvellePeriode.estActive}
                                             size="large" onChange={this.handleActif}>
                                  <Radio.Button value={true}>Actif</Radio.Button>
                                  <Radio.Button value={false}>Non-Actif</Radio.Button>
                                </Radio.Group>
                              </FormItem>
                            </td>
                            <td>
                            <FormItem label="Confirmer: ">
                              <Button key={"ajout"} type="primary" disabled={this.validateForm()} size="large"
                                      htmlType="submit" ghost className='titreMiniSection'>Ajouter</Button>
                            </FormItem>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Form>
                  </span>
                        }
                    />
                }
            </div>
        );
    }
}

export default OffrePeriode;
