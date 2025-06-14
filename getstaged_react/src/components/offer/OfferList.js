import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import LoadingIndicator from '../common/LoadingIndicator';
import {
    getAllOffers, validateOffer, getAllValidOffersForStudent,
    getAllValidOffers, applyOnOffer,
    approveApplyStudent, refuseApplyStudent,
    checkStudentCvUpload, printablePeriode
} from '../utils/Utils'
import {
    APPLICATION_NAME, OFFER_LIST_SIZE,
    TYPE_FORM_COORDINATOR, TYPE_FORM_STUDENT,
    TEXT_REQUEST_ERROR_COMMON, STATUS_APPROUVEE,
    STATUS_EN_APPROBATION
} from '../constants/Constants';
import {Button, Icon, notification, Table, Tag, message, Card} from 'antd';
import Offer from './Offer'
import './OfferList.css';
import UUID from 'uuid';

class OfferList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offers: [],
            validOffers: [],
            expandedRowKeys: [],
            currentIdOffer: 0,
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
            cvUpload: 'none'
        };
        this.loadOfferList = this.loadOfferList.bind(this);
        this.loadValidOfferList = this.loadValidOfferList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleValidateOffer = this.handleValidateOffer.bind(this);
        this.handleApplyOnOffer = this.handleApplyOnOffer.bind(this);
        this.handleApproveApplyStudent = this.handleApproveApplyStudent.bind(this);
        this.handleRefuseApplyStudent = this.handleRefuseApplyStudent.bind(this);
        this.handleVerifyStudentCvUpload = this.handleVerifyStudentCvUpload.bind(this);
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
                });
                console.log(this.state.offers);
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });

    }

    loadValidOfferList(page = 0, size = OFFER_LIST_SIZE) {
        let promise;
        //promise = getAllValidOffers(page, size);
        promise = getAllValidOffersForStudent(this.props.currentUser.id,page, size);

        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        if (this.state.validOffers.length !== 0) {
            this.setState({
                validOffers: [],
            });
        }

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

    handleValidateOffer(record) {
        this.setState({
            isLoading: true
        });

        validateOffer(record.id)
            .then(response => {
                this.loadOfferList();
                this.setState({
                    isLoading: false,
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
    }

    handleVerifyStudentCvUpload(record) {
        if (this.state.cvUpload !== STATUS_APPROUVEE) {
            checkStudentCvUpload(this.state.currentUser.id)
                .then(response => {
                    if (response.status === STATUS_APPROUVEE) {
                        this.setState({
                            cvUpload: response
                        });
                        this.handleApplyOnOffer(record);
                    } else if (response.status === STATUS_EN_APPROBATION ){
                        message.error('Votre cv doit être approuver par le coordinateur !', 8);
                    }else {
                        message.error('Vous devez déposer votre cv avant d\'appliquer !', 8);
                    }
                }).catch(error => {

            });
        }
        else {
            this.handleApplyOnOffer(record);
        }
    }

    handleApplyOnOffer(record) {
        this.setState({
            isLoading: true
        });

        applyOnOffer(this.state.currentUser.id, record.id)
            .then(response => {
                this.loadValidOfferList();
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
                description: TEXT_REQUEST_ERROR_COMMON,
                placement: "topRight"
            });
        });
    }

    handleApproveApplyStudent(record, e) {

        this.setState({
            isLoading: true
        });

        approveApplyStudent(record.offerId, record.id)
            .then(response => {
                this.loadOfferList();
                this.setState({
                    currentIdOffer: 0,
                    isLoading: false
                });
                notification.success({
                    message: APPLICATION_NAME,
                    description: "Votre approbation a été enregistrée avec succès.",
                    placement: "topRight"
                });
            }).catch(error => {
            this.setState({
                currentIdOffer: 0,
                isLoading: false
            });
            notification.error({
                message: APPLICATION_NAME,
                description: TEXT_REQUEST_ERROR_COMMON,
                placement: "topRight"
            });
        });
    }

    handleRefuseApplyStudent(record, e) {
        this.setState({
            isLoading: true
        });

        refuseApplyStudent(record.offerId, record.id)
            .then(response => {
                this.loadOfferList();
                this.setState({
                    currentIdOffer: 0,
                    isLoading: false
                });
                notification.success({
                    message: APPLICATION_NAME,
                    description: "Votre refus a été enregistrée avec succès.",
                    placement: "topRight"
                });
            }).catch(error => {
            this.setState({
                currentIdOffer: 0,
                isLoading: false
            });
            notification.error({
                message: APPLICATION_NAME,
                description: TEXT_REQUEST_ERROR_COMMON,
                placement: "topRight"
            });
        });
    }

    componentWillMount() {
        this.setState({
            currentUser: this.props.currentUser,
            isAuthenticated: this.props.isAuthenticated,
        });
        console.log("WillMount => ", this.props.currentUser.typeRole);
        this.props.currentUser.typeRole === TYPE_FORM_COORDINATOR ? this.loadOfferList() :
            this.props.currentUser.typeRole === TYPE_FORM_STUDENT ? this.loadValidOfferList() : null;
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
            console.log("WillRECEIVEProps => ", this.props.currentUser.typeRole);
            this.props.currentUser.typeRole === TYPE_FORM_COORDINATOR ? this.loadOfferList() :
                this.props.currentUser.typeRole === TYPE_FORM_STUDENT ? this.loadValidOfferList() : null;
        }
    }

    handleLoadMore() {
        this.state.currentUser.typeRole === TYPE_FORM_COORDINATOR ? this.loadOfferList(this.state.page + 1) :
            this.state.currentUser.typeRole === TYPE_FORM_STUDENT ? this.loadValidOfferList(this.state.page + 1) : null;
    }

    handleDisabledButton(record) {
        return record.status !== 'NONE';
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
                    {!record.valid ? <Button key={record.id} type="primary" ghost
                                             onClick={(e) => this.handleValidateOffer(record, e)}>Valider</Button> :
                        <Tag color="green" key={record.id + 'valid'}>Offre valide</Tag>}
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
                            onClick={(e) => this.handleVerifyStudentCvUpload(record)}>Appliquer</Button>
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
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        }, {
            title: 'Approuver',
            key: 'approuver',
            render: (record) => (
                <span>
                    <Button key={record.id} type="primary" ghost disabled={this.handleDisabledButton(record)}
                            onClick={(e) => this.handleApproveApplyStudent(record, e)}>Approuver</Button>
                </span>
            ),
        }, {
            title: 'Refuser',
            key: 'refuser',
            render: (record) => (
                <span>
                    <Button key={record.id} type="danger" block disabled={this.handleDisabledButton(record)}
                            onClick={(e) => this.handleRefuseApplyStudent(record, e)}>Refuser</Button>
                </span>
            ),
        }, {
            title: 'Statut',
            key: 'status',
            render: (record) => (
                <span>
                    {record.status === 'NONE' ? <Tag color="grey" key={record.id + 'none'}>N/A</Tag> :
                        record.status === 'APPROVE' ? <Tag color="gold" key={record.id + 'approuver'}>Approuvée</Tag> :
                            <Tag color="volcano" key={record.id + 'refus'}>Refusée</Tag>
                    }
                 </span>
            ),
        }];
        return (
            <div className="offers-container">
                {
                    <Table
                        locale={{emptyText: "Pas d'offres disponibles"}}
                        rowKey={UUID()}
                        className="offer-table"
                        loading={this.state.isLoading}
                        columns={this.state.currentUser.typeRole === TYPE_FORM_COORDINATOR
                            ? columns : this.state.currentUser.typeRole === TYPE_FORM_STUDENT
                                ? columnValidOffers : null}
                        dataSource={this.state.currentUser.typeRole === TYPE_FORM_COORDINATOR
                            ? this.state.offers : this.state.currentUser.typeRole === TYPE_FORM_STUDENT
                                ? this.state.validOffers : null}
                        expandedRowRender={record => (
                            record.applies.length > 0 && this.state.currentUser.typeRole === TYPE_FORM_COORDINATOR ?
                                <Table
                                    rowKey={record.id}
                                    className='appliers-table'
                                    dataSource={record.applies}
                                    columns={columnApplies}
                                    pagination={false}
                                /> :
                                <span>
                                    <Card title={record.programme} bordered={false} style={{width: 590}}>
                                         <p><span className='titreMiniSection'>Programme : </span><span
                                             style={{margin: 0}}>{record.programme}</span></p>
                                        <p><span className='titreMiniSection'>Période de stage : </span><span
                                            style={{margin: 0}}>{record.periode.saison.concat(" ").concat(record.periode.annee)}</span></p>
                                        <p><span className='titreMiniSection'>Durée de stage : </span><span
                                            style={{margin: 0}}>{record.duree} semaines</span></p>
                                        <p><span className='titreMiniSection'>Nombre de postes : </span><span
                                            style={{margin: 0}}>{record.nombrePoste}</span></p>

                                        <h6>Description</h6>
                                        <p style={{margin: 0, marginBottom: 10}}>{record.description}</p>
                                        <h6>Exigences</h6>
                                        <p style={{margin: 0}}>{record.exigences}</p>
                                    </Card>
                                </span>
                        )
                        }
                        pagination={{pageSize: 10}}
                        onRow={(record) => {
                            return {
                                onClick: () => {
                                },
                                onMouseEnter: () => {
                                }
                            };
                        }}

                    />
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

export default withRouter(OfferList);
