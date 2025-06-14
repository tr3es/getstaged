import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import LoadingIndicator from '../common/LoadingIndicator';
import EntenteUploadDownload from "../documents/entente/EntenteStageUploadDownload"
import {
    downloadCV,
    getAllEntrepriseStages
} from '../utils/Utils'
import {APPLICATION_NAME, STAGE_LIST_SIZE, API_BASE_URL_DOWNLOAD} from '../constants/Constants';
import {Button, Icon, Popover, Modal, Table, Tabs, Layout} from 'antd';
import './EntrepriseStageList.css';
import EvaluationStagiaire from '../votreEntreprise/EvaluationStagiaire';
import {getSampleStage} from '../votreEntreprise/StageSample';
import EntrepriseMenuContent from '../votreEntreprise/EntrepriseMenuContent';

const TabPane = Tabs.TabPane;
const {Content} = Layout;
const confirm = Modal.confirm;

class EntrepriseStageList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            stages: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadStageList = this.loadStageList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    hide = () => {
        this.setState({
            visible: false,
        });
    }
    handleVisibleChange = (visible) => {
        this.setState({visible});
    }


    loadStageList(page = 0, size = STAGE_LIST_SIZE) {
        let promise;
        promise = getAllEntrepriseStages(page, size);

        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                const stages = this.state.stages.slice();
                this.setState({
                    stages: stages.concat(response.content),
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

    componentWillMount() {
        this.setState({
            currentUser: this.props.currentUser,
            isAuthenticated: this.props.isAuthenticated,
        });
        this.loadStageList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
            this.setState({
                stages: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false
            });
            this.loadStageList();
        }
    }

    handleLoadMore() {
        this.loadStageList(this.state.page + 1);
    }

    render() {
        const offerViews = [];

        const columns = [
            {title: 'Prénom', dataIndex: 'studentResponse.firstName', key: 'studentResponse.firstName'},
            {title: 'Nom', dataIndex: 'studentResponse.lastName', key: 'studentResponse.lastName'},
            {title: 'Courriel', dataIndex: 'studentResponse.email', key: 'studentResponse.email'},
            {title: 'Poste', dataIndex: 'offerResponse.titrePoste', key: 'offerResponse.titrePoste'},
        ];
        let counter = 0;
        return (
            <div className="offers-container">
                {
                    <Table
                        className="offer-table"
                        columns={columns}
                        dataSource={this.state.stages}
                        locale={{emptyText: "Aucun stagiaire trouvé."}}
                        expandedRowRender={record => (
                            <div style={{margin: 0}}>
                                <table width="66%">
                                    <thead>
                                    <tr>
                                        <td>
                                            <h3>{"Détails du stage"}</h3>
                                        </td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <b> {"Date de début du stage: "}</b>{record.dateDebut} </td>
                                        <td><b>{"Date de fin du stage: "}</b>{record.dateDebut}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>{"Taux horaire: "}</b>{record.offerResponse.tauxHoraire}<br/>
                                        </td>
                                        <td>
                                            <b>{"Durée: "}</b>{record.offerResponse.duree}<br/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>{"Période: "}</b>{record.offerResponse.periode.saison.concat(" ").concat(record.offerResponse.periode.annee)}<br/>
                                        </td>
                                        <td>
                                            <b>{"Programme: "}</b>{record.offerResponse.programme}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>{"Description du stage: "}</b>{record.offerResponse.description}<br/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>{"Exigences: "}</b>{record.offerResponse.exigences}<br/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Button key={record.id} type="primary" icon="download" size={"large"} ghost
                                                    onClick={(e) => downloadCV(record.studentResponse.id, record.studentResponse.firstName + '_' + record.studentResponse.lastName)}>{"Télécharger le C.V."}</Button>
                                        </td>
                                        <td>
                                            <Popover
                                                content={
                                                    <div>
                                                        <EvaluationStagiaire stage={record}
                                                                             currentUser={this.state.currentUser} {...this.props} >
                                                        </EvaluationStagiaire>
                                                        <Button type={"primary"} onClick={this.hide} ghost>Fermer</Button>
                                                    </div>
                                                }
                                                trigger="click"
                                                visible={this.state.visible}
                                                onVisibleChange={this.handleVisibleChange}
                                            >
                                                <Button type="primary" ghost>Évaluer le stagiaire</Button>
                                            </Popover>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <br/>
                                <table>
                                    <thead>
                                    <tr>
                                        <td>
                                        </td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <EntenteUploadDownload currentUser={this.state.currentUser}
                                                                   email={this.state.currentUser.email}
                                                                   stagiaire={record.studentResponse}
                                                                   isAuthenticated={this.state.isAuthenticated} {...this.props}/>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                        pagination={{pageSize: 10}}
                        onRow={(record) => {
                            return {
                                onClick: () => {
                                },
                            };
                        }}

                    />
                }
                {/*{
                    !this.state.isLoading && this.state.stages.length === 0 ? (
                        <div className="no-offers-found">
                            <span>No stages Found.</span>
                        </div>
                    ) : null
                }*/}
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-offers">
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

export default withRouter(EntrepriseStageList);
