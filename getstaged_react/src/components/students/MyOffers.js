import moment from "moment";
import React, {Component} from 'react';
import NouveauStage from "../stage/NouveauStage";
import {API_BASE_URL, APPLICATION_NAME} from "../constants/Constants";
import {Button, DatePicker, Popover, Table, notification} from 'antd';

class MyOffers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mesOffres: [],
            isLoading: true,
            visible: false,
            visibles: [],
            id: 0,
            stage: false
        };
        this.action = this.action.bind(this);
        this.update = this.update.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});

        fetch(API_BASE_URL + `/students/mesOffres/${this.props.currentUser.id}`).then((response) => response.json())
            .then((data) => this.setState({mesOffres: data, isLoading: false}));
    }

    handleChangeDate(value, offre) {
        console.log(value.format("YYYY-MM-DD"));
        offre.date = value.format("YYYY-MM-DD");
        this.update(offre, "");
    };

    handleSelect(value, offre) {
        this.update(offre, value.target.value);
    };

    async update(offer, action) {
        let message = "";
        if (action === "CONVOQUÉ") {
            offer.statusOfferName = "CONVOQUÉ";
            message = "Veuillez choisir la date de l'entrevue";
        } else if (action === "ACCEPTÉ") {
            offer.statusOfferName = "ACCEPTÉ";
            message = "Veuillez choisir l'offre pour débuter le stage";
        } else if (action === "REFUSÉ") {
            offer.statusOfferName = "REFUSÉ";
            message = "Vous pouvez supprimer l'offre comme que la compagnie a refusé de vous engager";
        }
        await fetch(API_BASE_URL + "/students/mesOffres", {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(offer),
        }).then(() => {
            let updatedOffers = [...this.state.mesOffres];
            this.setState({mesOffres: updatedOffers});
            notification.success({
                message: APPLICATION_NAME,
                description: message,
            });
        });
    }

    action(offre) {
        const dateFormat = 'YYYY/MM/DD';
        if (offre.statusOfferName === "APPROVE") {
            return (
                <select onChange={() => this.update(offre, "CONVOQUÉ")}>
                    <option/>
                    <option value={"Convoqué en entrevue"}>Convoqué en entrevue</option>
                </select>
            );
        } else if (offre.statusOfferName === "CONVOQUÉ") {
            return (
                <div style={{marginLeft: "-170px"}}>
                    <DatePicker style={{marginLeft:"-20px"}} defaultValue={moment(offre.date, dateFormat)} format={dateFormat}
                                onChange={(value) => this.handleChangeDate(value, offre)}/>
                    <select style={{marginLeft: "10px"}} onChange={(value) => this.handleSelect(value, offre)}>
                        <option/>
                        <option value={"ACCEPTÉ"}>ACCEPTÉ</option>
                        <option value={"REFUSÉ"}>REFUSÉ</option>
                    </select>
                </div>
            );
        } else if (offre.statusOfferName === "ACCEPTÉ") {
            return (
                <Popover
                    content={
                        <div>
                            <NouveauStage offer={offre}/>
                        </div>
                    }
                >
                    <Button id={this.state.id} type="primary" ghost>Confirmer le Stage</Button>
                </Popover>
            )
        } else if (offre.statusOfferName === "NONE" || offre.statusOfferName === "REFUSÉ") {
            return (
                <Button type="danger" ghost>Impossible</Button>
            );
        }
        return "";
    }

    render() {
        const {mesOffres} = this.state;
        const columns = [
            {title: 'Entreprise', dataIndex: 'entreprise', key: 'entreprise'},
            {title: 'Statut', dataIndex: 'statut', key: 'statut'},
            {title: 'Changer le statut', dataIndex: 'action', key: 'action'},
        ];
        let counter = 0;
        const list = mesOffres.map(offre => {
            counter++;
            return ({
                key: counter,
                entreprise: offre.entrepriseNom,
                statut: offre.statusOfferName,
                action: this.action(offre),
            })
        });

        return (
            <Table
                bordered={true}
                columns={columns}
                dataSource={list}
                locale={{emptyText: "Vous n'avez pas d'offres"}}
                pagination={{pageSize: 10}}
            />
        )
    }
}

export default MyOffers;
