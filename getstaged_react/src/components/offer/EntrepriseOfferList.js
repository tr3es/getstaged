import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import LoadingIndicator from '../common/LoadingIndicator';
import {
    deleteOffer,
    getAllEntrepriseOffers
} from '../utils/Utils'
import {APPLICATION_NAME, OFFER_LIST_SIZE, API_BASE_URL_DOWNLOAD} from '../constants/Constants';
import {Button, Icon, notification, Modal, Table, Tag} from 'antd';
import './EntrepriseOfferList.css';
import UUID from 'uuid';
const confirm = Modal.confirm;

class EntrepriseOfferList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offers: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
            periodes: []
        };
        this.loadOfferList = this.loadOfferList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleDeleteOffer = this.handleDeleteOffer.bind(this);
    }

    loadOfferList(page = 0, size = OFFER_LIST_SIZE) {
        let promise;
        promise = getAllEntrepriseOffers(page, size);

        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        if (this.state.offers.length !== 0) {
            this.setState({
                offers: [],
            });
        }

        promise
            .then(response => {
                const offers = this.state.offers.slice();
                this.setState({
                    offers: offers.concat(response.content),
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
        this.loadOfferList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
            this.setState({
                offers: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false
            });
            this.loadOfferList();
        }
    }

    handleLoadMore() {
        this.loadOfferList(this.state.page + 1);
    }

    handleDeleteOffer(record, e) {
        console.log('DeleteOffer => ', record.id);

        this.setState({
            isLoading: true
        });

        deleteOffer(record.id)
            .then(response => {
                console.log("DELETE OFFER => ",response);
                this.setState({
                    isLoading: false
                });
                this.loadOfferList();
                notification.success({
                    message: APPLICATION_NAME,
                    description: "Votre application a été supprimée avec succès.",
                    placement: "topRight"
                });
            }).catch(error => {
                console.log("DELETE OFFER ERROR => ",error);
            this.setState({
                isLoading: false
            });
            notification.error({
                key: 'suppressOffer',
                message: APPLICATION_NAME,
                description: "Veuillez patienter... \nIl se peut que nous\n éprouvons des problèmes.",
                placement: "topRight"
            });
        });

    }
    /*handleConfirmDeleteOffer(record, e){
        confirm({
            title: 'Êtes-vous sur de supprimer cette offre ?',
            okText: 'Oui',
            okType: 'danger',
            cancelText: 'Non',
            onOk() {
                console.log('DeleteOffer => ', record.id);

                this.setState({
                    isLoading: true
                });

                deleteOffer(record.id)
                    .then(response => {
                        this.setState({
                            isLoading: false
                        });
                        notification.success({
                            message: APPLICATION_NAME,
                            description: "Votre application a été supprimée avec succès.",
                            placement: "topRight"
                        });
                    }).catch(error => {
                    this.setState({
                        isLoading: false
                    });
                    notification.error({
                        key: 'suppressOffer',
                        message: APPLICATION_NAME,
                        description: "Veuillez patienter... \nIl se peut que nous\n éprouvons des problèmes.",
                        placement: "topRight"
                    });
                });

            },
            onCancel() {

            },
        });
    }*/

    handleDisabledButton(record) {
        return record.applies.length !== 0;
    }

    render() {
        const offerViews = [];
        const columns = [{
            title: 'Titre du poste',
            dataIndex: 'titrePoste',
            key: 'titrePoste',
        }, {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (description) => (
                <span>
                    {description.substring(0, 10) + "..."}
                </span>
            ),
        }, {
            title: 'Salaire',
            dataIndex: 'tauxHoraire',
            key: 'tauxHoraire',
            render: (salary) => (
                <span>
                  {<Tag color="green" key={salary}>{salary + ' $/h'}</Tag>}
                </span>
            ),
        }, {
            title: 'Supprimer',
            key: 'supprimer',
            render: (record) => (
                <span>
                     <Button key={record.id} disabled={this.handleDisabledButton(record)} type="danger" ghost
                             onClick={(e) => this.handleDeleteOffer(record, e)}>Supprimer</Button>
                </span>
            ),
        }];

        const columnApplies = [{
            title: 'Prénom, Nom',
            key: "name",
            render: (record) => (
                <span>
                    {record.firstName + ', ' + record.lastName}
                </span>
            ),
        }, {
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email',
        }, {
            title: 'Consulter le Cv',
            key: 'cv',
            render: (record) => (
                <span>
                    <Button key={record.id}  type="primary" icon="download" onClick={() =>
                        window.location.href = `${API_BASE_URL_DOWNLOAD}${record.id}`}>Cv</Button>
                </span>
            ),
        }/*, {
            title: 'Accepter',
            key: 'accepter',
            render: (record) => (
                <span>
                    <Button key={record.id} className="btn_modify1_green"
                            type="primary" ghost>Accepter</Button>
                </span>
            ),
        }*/];


        return (
            <div className="offers-container">
                {
                    <Table
                        rowKey={UUID()}
                        className="offer-table"
                        columns={columns}
                        locale={{emptyText: "Pas d'offres disponibles."}}
                        dataSource={this.state.offers}
                        expandedRowRender={record => (
                            record.applies.length == 0 ? <span>
                                    <p><span className='titreMiniSection'>Programme : </span><span
                                        style={{margin: 0}}>{record.programme}</span></p>
                                    <p><span className='titreMiniSection'>Période de stage : </span><span
                                        style={{margin: 0}}>{record.periode.saison+" "+record.periode.annee}</span></p>
                                    <p><span className='titreMiniSection'>Durée de stage : </span><span
                                        style={{margin: 0}}>{record.duree} semaines</span></p>
                                    <p><span className='titreMiniSection'>Nombre de postes : </span><span
                                        style={{margin: 0}}>{record.nombrePoste}</span></p>

                                    <h5>Description</h5>
                                    <p style={{margin: 0, marginBottom: 10}}>{record.description}</p>
                                    <h5>Exigences</h5>
                                    <p style={{margin: 0}}>{record.exigences}</p>
                                </span> :
                                <Table
                                    key={UUID()}
                                    rowKey={record.id}
                                    className='appliers-table'
                                    dataSource={record.applies}
                                    columns={columnApplies}
                                    pagination={false}
                                />
                        )
                        }
                        pagination={{pageSize: 10}}
                        onRow={(record) => {
                            return {
                                  onClick: () => {
                                },
                            };
                        }}

                    />
                }
               {/* {
                    !this.state.isLoading && this.state.offers.length === 0 ? (
                        <div className="no-offers-found">
                            <span>Pas d'offres disponibles.</span>
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

export default withRouter(EntrepriseOfferList);
