import React, {Component} from 'react';
import {
    API_BASE_URL,
    API_BASE_URL_DOWNLOAD,
    API_BASE_URL_DOWNLOAD_ENTENTE,
    API_BASE_URL_DOWNLOAD_RAPPORT_VISITE,
    API_BASE_URL_DOWNLOAD_FICHE_SUIVIE
} from "../constants/Constants";
import {Button, Table} from 'antd';
import '../offer/EntrepriseOfferList.css';
import {withRouter} from "react-router-dom";
import RapportVisite from "../documents/rapportVisite/RapportVisite";
import FicheSuivie from "../documents/ficheSuivie/FicheSuivie";
import CVDownload from "../documents/cv/CVDownload";
import EntenteDownload from "../documents/entente/EntenteDownload";

class Students extends Component {

    constructor(props) {
        super(props);
        this.state = {
            students: [],
            suivie: "",
            rapport: " ",
            isLoading: true,
        };
        this.buildStudentApplies = this.buildStudentApplies.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});

        fetch(API_BASE_URL + '/monitors/students/' + this.props.currentUser.id).then((response) => response.json()).then((data) => this.setState({
            students: data,
            isLoading: false
        }));
    }

    buildStudentApplies(id){
      let columnApplyList= {};
      if (this.state.students !== null) {
          columnApplyList = this.state.students.map(student => {

            if(student.id === id){
              console.log(student);
              return (
                  {
                      key: student.id,
                      cv:
                          <CVDownload student={student}/>
                      ,
                      entente:
                          <EntenteDownload student={student}/>
                      ,
                      visite:
                          <RapportVisite email={student.email} studentId={student.id}/>
                      ,
                      suivie:
                          <FicheSuivie email={student.email} studentId={student.id}/>
                  }
              )

            }
          });
        }
    }

    render() {
        const {students, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const columns = [
            {title: 'Nom', dataIndex: 'name', key: 'name'},
            {title: 'Courriel', dataIndex: 'email', key: 'email'},
            {title: 'Statut du stage', dataIndex: 'staged', key: 'staged'},
        ];
        const columnApplies = [
            {
                title: 'Consulter le CV',
                dataIndex: 'cv',
                key: 'cv'
            },
            {
                title: 'Consulter l\'entente',
                dataIndex: 'entente',
                key: 'entente'
            },
            {
                title: 'Envoyer/Consulter le rapport de Visite',
                dataIndex: 'visite',
                key: 'visite'
            },
            {
                title: 'Envoyer/Consulter la fiche de suivie',
                dataIndex: 'suivie',
                key: 'suivie'
            }
        ];
        let columnApplyList = {};
        let list = {};
        if (this.state.students !== null) {

            let counter = 0;
            list = students.map(student => {
                let stage = " ";
                if (student.staged === false) stage = "En recherche";
                counter++;
                console.log(student.id);
                return (
                    {
                        key: counter,
                        name: student.firstName + ", " + student.lastName,
                        email: student.email,
                        staged: stage,
                        columnApplyList : this.buildStudentApplies(student.id),
                    }
                );

            });
        }
        console.log(list);
        return (
            <Table
                locale={{emptyText: "Aucun des étudiants ne vous êtes assigné"}}
                columns={columns}
                dataSource={list}
                expandedRowRender={record => (
                    <Table
                        rowKey={record.id}
                        columns={columnApplies}
                        dataSource={record.columnApplyList}
                        pagination={false}
                    />)}
                pagination={{pageSize: 10}}
            />
        )
    };
}

export default withRouter(Students);
