import React, {Component} from 'react';
import {ButtonGroup} from 'reactstrap';
import {Button, Icon, Table} from 'antd';
import {API_BASE_URL} from '../../constants/Constants';

class CVCoordList extends Component {
    constructor(props) {
        super(props);
        this.state = {cvs: [], isLoading: true};
        this.remove = this.remove.bind(this);
        this.update = this.update.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});

        fetch(API_BASE_URL + '/cvs').then((response) => response.json())
            .then((data) => this.setState({cvs: data, isLoading: false}));
    }

    async update(id, cv) {
        console.log("CV: ", cv);
        cv.approved = "Approuvé";
        console.log("CV: ", cv);
        await fetch(API_BASE_URL + `/cv/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cv),
        }).then(() => {
            let updatedCVS = [...this.state.cvs];
            this.setState({cvs: updatedCVS});
        });
    }

    async remove(id) {
        await fetch(API_BASE_URL + `/cv/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedCVS = [...this.state.cvs].filter(i => i.id !== id);
            this.setState({cvs: updatedCVS});
        });
    }

    render() {
        const {cvs, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const columns = [
            {title: 'Nom', dataIndex: 'name', key: 'name'},
            {title: 'Courriel', dataIndex: 'email', key: 'email'},
            {title: 'Statut', dataIndex: 'statut', key: 'statut'},
            {title: 'Action', dataIndex: 'action', key: 'action'},
        ];

        let list = [];
        let color;
        if (this.state.cvs !== null) {
            list = cvs.map(cv => {
                if(cv.approved === "Approuvé")color ="check";
                else if(cv.approved === "En attente d'approbation")color ="loading";
                else color = "close";
                return (
                    {
                        key: cv.id,
                        name: cv.name,
                        email: cv.email,
                        statut: <Icon type={color} />,
                        action:
                            <ButtonGroup>
                                <Button size={"small"} type={"primary"} icon={"like"}
                                        onClick={() => this.update(cv.id, cv)} ghost>Approuver</Button>
                                <Button size={"small"} type={"danger"} icon={"delete"} onClick={() => this.remove(cv.id)} ghost>Supprimer</Button>
                                <Button size={"small"} type={"primary"} icon={"download"}
                                        onClick={() => window.location.href = cv.download_uri} ghost>Consulter</Button>
                            </ButtonGroup>
                    }
                );
            });
        }
        console.log("CVS" + this.state.cvs);
        return (
            <div>
                <h1 className="titre-offer"> Voici les C.V. des étudiants</h1>
                <Table
                    width={"100%"}
                    columns={columns}
                    dataSource={list}
                    locale={{emptyText: "Aucun C.V. trouvé"}}
                    pagination={{pageSize: 10}}
                />
            </div>
        )
    }
}

export default CVCoordList;
