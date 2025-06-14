import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import LoadingIndicator from '../common/LoadingIndicator';
import {
    getAllOffers, validateOffer,
    getAllValidOffers, applyOnOffer
} from '../utils/Utils'
import {APPLICATION_NAME, OFFER_LIST_SIZE, TYPE_FORM_COORDINATOR, TYPE_FORM_STUDENT} from '../constants/Constants';
import {Button, Icon, notification} from 'antd';
import Offer from './Offer'
import './OfferList.css';

import {Table, Tag} from 'antd'

class EntrepriseStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offers: [],
            validOffers: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadOfferList = this.loadOfferList.bind(this);
        this.loadValidOfferList = this.loadValidOfferList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleValidateOffer = this.handleValidateOffer.bind(this);
        this.handleApplyOnOffer = this.handleApplyOnOffer.bind(this);
        this.handleLoadMoreValidOffer = this.handleLoadMoreValidOffer.bind(this);
    }

    loadOfferList(page = 0, size = OFFER_LIST_SIZE) {
        let promise;
        promise = getAllOffers(page, size);

        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

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

    loadValidOfferList(page = 0, size = OFFER_LIST_SIZE) {
        let promise;
        promise = getAllValidOffers(page, size);

        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                const validOffers = this.state.validOffers.slice();
                this.setState({
                    validOffers: validOffers.concat(response.content),
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

    handleValidateOffer(record, e) {
        this.setState({
            isLoading: true
        });

        validateOffer(record.id)
            .then(response => {
                let updatedOffers = [...this.state.offers];
                this.setState({
                    isLoading: false,
                    offers: updatedOffers
                });
                notification.info({
                    message: APPLICATION_NAME,
                    description: "L'offre a été validée avec succès.",
                    placement: "topRight"
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            });
            notification.error({
                message: APPLICATION_NAME,
                description: "L'offre n'a pas été validée avec succès.",
                placement: "topRight"
            });
        });

        this.forceUpdate();
        //this.props.history.push("/Home");
    }

    handleApplyOnOffer(record, e) {
        console.log('ApplyOnOffer => ', this.state.currentUser.id);
        this.setState({
            isLoading: true
        });

        applyOnOffer(this.state.currentUser.id, record.id)
            .then(response => {
                this.setState({
                    isLoading: false
                });
                notification.info({
                    message: APPLICATION_NAME,
                    description: "Votre application a été enregistrée avec succès.",
                    placement: "topRight"
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            });
            notification.error({
                message: APPLICATION_NAME,
                description: "Veuillez patienter... \nIl se peut que nous\n éprouvons des problèmes.",
                placement: "topRight"
            });
        });

        this.forceUpdate();
        //this.props.history.push("/Home");
    }

    componentWillMount() {
        this.setState({
            currentUser: this.props.currentUser,
            isAuthenticated: this.props.isAuthenticated,
        });
        this.loadOfferList();
        this.loadValidOfferList();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
            this.setState({
                offers: [],
                validOffers: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false
            });
            this.loadOfferList();
            this.loadValidOfferList();
        }
    }

    handleLoadMore() {
        this.loadOfferList(this.state.page + 1);
    }

    handleLoadMoreValidOffer() {
        this.loadValidOfferList(this.state.page + 1);
    }

    render() {
        console.log('OfferList => ', this.state.currentUser.typeRole);
        const offerViews = [];
        console.log(this.state.offers);
        this.state.offers.forEach((offer, offerIndex) => {
            offerViews.push(<Offer
                key={offer.id}
                offer={offer}
            />)
        });

        const columns = [{
            title: 'Entreprise',
            dataIndex: 'nameEnterprise',
            key: 'nameEnterprise'
        }, {
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
            title: 'Validation',
            key: 'validate',
            render: (record) => (
                <span>
                    <Button key={record.id} type="primary" ghost
                            onClick={(e) => this.handleValidateOffer(record, e)}>validate</Button>
                 </span>
            ),
        }];

        const columnValidOffers = [{
            title: 'Entreprise',
            dataIndex: 'nameEnterprise',
            key: 'nameEnterprise'
        }, {
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
            title: 'Appliquer',
            key: 'appliquer',
            render: (record) => (
                <span>
                    <Button key={record.id} type="primary" ghost
                            onClick={(e) => this.handleApplyOnOffer(record, e)}>Appliquer</Button>
                 </span>
            ),
        }];

        return (
            <div className="offers-container">
                {
                    <Table
                        rowKey="uid"
                        className="offer-table"
                        columns={this.state.currentUser.typeRole === TYPE_FORM_COORDINATOR
                            ? columns : this.state.currentUser.typeRole === TYPE_FORM_STUDENT
                                ? columnValidOffers : null}
                        dataSource={this.state.currentUser.typeRole === TYPE_FORM_COORDINATOR
                            ? this.state.offers : this.state.currentUser.typeRole === TYPE_FORM_STUDENT
                                ? this.state.validOffers : null}
                        expandedRowRender={record =>
                            <span>
                            <p><span className='titreMiniSection'>Programme : </span><span
                                style={{margin: 0}}>{record.programme}</span></p>
                            <p><span className='titreMiniSection'>Période de stage : </span><span
                                style={{margin: 0}}>{record.periode}</span></p>
                            <p><span className='titreMiniSection'>Durée de stage : </span><span
                                style={{margin: 0}}>{record.duree} semaines</span></p>
                            <p><span className='titreMiniSection'>Nombre de postes : </span><span
                                style={{margin: 0}}>{record.nombrePoste}</span></p>

                            <h4>Description</h4>
                            <p style={{margin: 0, marginBottom: 10}}>{record.description}</p>
                            <h4>Exigences</h4>
                            <p style={{margin: 0}}>{record.exigences}</p>
                        </span>
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
                {
                    !this.state.isLoading && this.state.offers.length === 0 ? (
                        <div className="no-polls-found">
                            <span>No Offers Found.</span>
                        </div>
                    ) : null
                }
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

export default withRouter(EntrepriseStudent);
