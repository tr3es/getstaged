import React, { Component } from 'react';
import EntrepriseToolbar from './VotreEntreprise';
import {getOffre, printablePeriode} from '../utils/Utils';
import axios from 'axios';
import {Row, Col, Tabs, Layout, Menu, Icon,} from 'antd';
import NouvelleOffre from './NouvelleOffre';
import EvaluationStagiaire from './EvaluationStagiaire';
import {getSampleStage} from './StageSample';
import EntrepriseMenuContent from './EntrepriseMenuContent';
import {
  API_BASE_URL
} from '../constants/Constants';

const {SubMenu} = Menu;
const {Content} = Layout;

const TabPane = Tabs.TabPane;

class OffreVue extends Component{
  constructor(props){
    super(props);
    this.state = {
        offre: {
          offre_ID: {
            value: ''
          },
          entrepriseID: {
            value: ''
          },
          programme: {
            value: ''
          },
          periode: {
            value: ''
          },
          duree: {
            value: ''
          },
          titrePoste: {
            value: ''
          },
          nombrePoste: {
            value: ''
          },
          horaireTravail: {
            value: ''
          },
          tauxHoraire: {
            value: ''
          },
          descriptionMandat: {
            value: ''
          },
          exigences: {
            value: ''
          }
        },
        entreprise: {

        },
        periode: ''
    }
    this.loadOffre = this.loadOffre.bind(this);
    this.getVueContent = this.getVueContent.bind(this);
    this.menuContent = this.menuContent.bind(this);
  }

  componentWillMount(){
    const offre_id = this.props.match.params.offre_id;
    this.loadOffre(offre_id);

  }

  loadOffre(offre_id){
    fetch(API_BASE_URL+"/VotreEntreprise/Offre/"+ offre_id)
      .then(response => response.json())
      .then(data => {
        this.setState({
          offre: data,
        })
        fetch(API_BASE_URL+"/offers/Periodes/"+ data.periode)
        .then(data2 => data2.json())
        .then(dats =>{
          this.setState({
            periode: dats
          })
        })
      });
  }

  menuContent(contenu){
    const offreComponent = <TabPane tab={<span><Icon type="laptop"/>{"Détail de l'offre"}</span>} key="1">
        <Content style={{padding: '0 24px', minHeight: 300, paddingLeft: '40px'}}>
            {contenu}
        </Content>
    </TabPane>;
    return(
      <div>
        <EntrepriseMenuContent isAuthenticated={this.state.isAuthenticated} content={offreComponent}
            keybase={1} currentUser={this.state.currentUser} {...this.props}/>
      </div>
    );
  }

  getVueContent(){
    return(
        <div className="signup-container">
          <h1 className="page-title">Offre #{this.props.match.params.offre_id}</h1>
          <Row>
            <Col span={10}>
              <b>Programme: </b>{this.state.offre.programme.toString()}
            </Col>
            <Col span={10}>
              <b>{"Période du stage: "}</b>{this.state.offre.periode.saison+ " "+this.state.offre.periode.annee}
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <b>{"Durée du stage (semaines): "}</b>{this.state.offre.duree.toString()}
            </Col>
            <Col span={10}>
              <b>{"Titre du poste: "}</b>{this.state.offre.titrePoste.toString()}
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <b>{"Nombre de postes: "}</b>{this.state.offre.nombrePoste.toString()}
            </Col>
            <Col span={10}>
              <b>{"Horaire de travail: "}</b>{this.state.offre.horaireTravail.toString()}
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <b>{"Taux horaire: "}</b>{this.state.offre.tauxHoraire.toString()}
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <b>{"Description du mandat: "}</b>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              {this.state.offre.description}
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <b>{"Exigences pour le stage: "}</b>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              {this.state.offre.exigences.toString()}
            </Col>
          </Row>
        </div>

    );
  }

  render(){
    return (this.menuContent(this.getVueContent()));
  }
}

export default OffreVue;
