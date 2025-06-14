import React, {Component, Text} from 'react';
import {Layout, Form, Input, Button, notification, Row, Col, Icon, Tabs, Menu} from 'antd';
import EntrepriseToolbar from './VotreEntreprise';
import {getEvaluation, postPDF, postEvalHTML} from '../utils/Utils';
import {getSampleStage} from './StageSample';
import EvaluationStagiaire from './EvaluationStagiaire';
import axios from 'axios';
import './ExportableEvaluation.css';
import {
    APPLICATION_NAME,
    NOMBRE_CHOIX_RECAP,
    QUESTION_1_A,
    QUESTION_1_B,
    QUESTION_1_C,
    QUESTION_1_D,
    QUESTION_1_E,
    QUESTION_2_A,
    QUESTION_2_B,
    QUESTION_2_C,
    QUESTION_2_D,
    QUESTION_2_E,
    QUESTION_3_A,
    QUESTION_3_B,
    QUESTION_3_C,
    QUESTION_3_D,
    QUESTION_3_E,
    QUESTION_3_F,
    QUESTION_4_A,
    QUESTION_4_B,
    QUESTION_4_C,
    QUESTION_4_D,
    QUESTION_4_E,
    QUESTION_4_F,
    TITRE_RECAP,
    CHOIX_RECAP_0,
    CHOIX_RECAP_1,
    CHOIX_RECAP_2,
    CHOIX_RECAP_3,
    CHOIX_RECAP_4,
    TITRE_1,
    TITRE_2,
    TITRE_3,
    TITRE_4,
    SOUS_TITRE_1,
    SOUS_TITRE_2,
    SOUS_TITRE_3,
    SOUS_TITRE_4,
    TITRE_PDF_EVAL,
    HEADER_PDF_EVAL,
    NOMELEVE,
    NOMPROGRAMME,
    NOMENTREPRISE,
    NOMSUPERVISEUR,
    FONCTION,
    TELEPHONE,
    PRECISION_RECAP,
    PRECISION_DETAILS,
    DISCUSSION_RECAP,
    TITRE_OUVERTURE,
    QUESTION1_OUVERTURE,
    NBHEURESRECAP,
    API_BASE_URL
} from '../constants/Constants';

class ExportableEvaluation extends Component {
    constructor(props) {
        super(props);
        this.stage = getSampleStage();
        this.state = {
            evaluation: {
                eleveID: '',
                entrepriseID: '',
                offreID: '',
                discussion: '',
                tableauReponses: '',
                listeCommentaires: '',
                niveauAppreciationGlobale: '',
                precisionsAppreciationGlobale: '',
                discuterEvalStagiaire: '',
                heuresEncadrement: '',
                accueilProchain: '',
                formationStagiaire: '',
                consentement: '',
                dateSoumission: ''
            },
            tableauReponses: '',
            listeCommentaires: ''
        }
        this.parseReponseValue = this.parseReponseValue.bind(this);
    }


    parseReponseValue(reponse) {
        switch (reponse) {
            case 0 :
                return "Totalement en accord";
            case 1 :
                return "Plutôt en accord";
            case 2 :
                return "Plutôt en désaccord";
            case 3 :
                return "Totalement en désaccord";
            default :
                return "Non applicable";
        }
    }

    render() {

        const question1 = [QUESTION_1_A, QUESTION_1_B, QUESTION_1_C, QUESTION_1_D, QUESTION_1_E];
        const question2 = [QUESTION_2_A, QUESTION_2_B, QUESTION_2_C, QUESTION_2_D, QUESTION_2_E];
        const question3 = [QUESTION_3_A, QUESTION_3_B, QUESTION_3_C, QUESTION_3_D, QUESTION_3_E, QUESTION_3_F];
        const question4 = [QUESTION_4_A, QUESTION_4_B, QUESTION_4_C, QUESTION_4_D, QUESTION_4_E, QUESTION_4_F];
        const tabQuestions = [question1, question2, question3, question4];
        const tabTitres = [TITRE_1, TITRE_2, TITRE_3, TITRE_4];
        const tabSousTitres = [SOUS_TITRE_1, SOUS_TITRE_2, SOUS_TITRE_3, SOUS_TITRE_4];
        const lineSymbol = ["a)", "b)", "c)", "d)", "e)", "f)"];
        const tabChoix = [CHOIX_RECAP_0, CHOIX_RECAP_1, CHOIX_RECAP_2, CHOIX_RECAP_3, CHOIX_RECAP_4];
        const tabDiscussion = ["Oui", "Non", "Peut-être"];
        const reponses = JSON.parse(this.props.reps);
        return (
            <div>
                <div>
                    <table width="100%" className="tabStyle">
                        <tr>
                            <td><img src="PDF/images/logocegep.jpg"/></td>
                            <td><br/><br/><br/><b>{HEADER_PDF_EVAL}</b></td>
                        </tr>
                    </table>
                </div>
                <div className="signup-container">
                    <h1>{TITRE_PDF_EVAL}</h1>
                    <table>
                        <tbody>
                        <tr>
                            <td width="50%">
                                <b>{NOMELEVE}</b>
                            </td>
                            <td width="50%">
                                <b>{this.stage["etudiant"]["firstName"].value}</b><b>{this.stage["etudiant"]["lastName"].value}</b>
                            </td>
                        </tr>
                        <tr>
                            <td width="50%">
                                <b>{NOMPROGRAMME}</b>
                            </td>
                            <td width="50%">
                                <b>{this.stage["offre"]["programme"].value}</b>
                            </td>
                        </tr>
                        <tr>
                            <td width="50%">
                                <b>{NOMENTREPRISE}</b>
                            </td>
                            <td width="50%">
                                <b>{this.stage["entreprise"]["nomEntreprise"].value}</b>
                            </td>
                        </tr>
                        <tr>
                            <td width="50%">
                                <b>{NOMSUPERVISEUR}</b>
                            </td>
                            <td width="50%">
                                <b>{this.stage["entreprise"]["firstName"].value}</b>
                                <b>{this.stage["entreprise"]["lastName"].value}</b>
                            </td>
                        </tr>
                        <tr>
                            <td width="50%">
                                <b>{FONCTION}</b>
                                <b>{this.stage["offre"]["titrePoste"].value}</b>
                            </td>
                            <td width="50%">
                                <b>{TELEPHONE}</b>
                                <b>{this.stage["entreprise"]["telephone"].value}</b>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <br/>

                    <div>
                        {tabQuestions.map(function (object, i) {
                            return (
                                <div width="100%">
                                    <h3><b>{tabTitres[i]}</b></h3>
                                    {tabSousTitres[i]}
                                    <table align="center">
                                        <tbody>
                                        <tr>
                                            <td width="50%"><b>Le stagiaire a été en mesure de:</b></td>
                                            <td></td>
                                        </tr>
                                        {object.map(function (objectInterne, j) {
                                            return (
                                                <tr>
                                                    <td key={j} width="50%">{lineSymbol[j]} {objectInterne}</td>
                                                    <td width="50%"
                                                        align="left">{this.parseReponseValue(reponses[(i * tabQuestions.length + j)])}</td>
                                                </tr>
                                            )
                                        }, this)}
                                        <tr></tr>
                                        <tr>
                                            <td><b>Commentaires:</b></td>
                                        </tr>
                                        <tr>
                                            <td colSpan="6">
                                                <div>{JSON.parse(this.props.comms)[i]}</div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )
                        }, this)}
                    </div>
                    <br/>
                    <div>
                        <table>
                            <thead>
                            <tr>
                                <td><h2><b>{TITRE_RECAP}</b></h2></td>
                            </tr>
                            </thead>
                            <tbody align="left">
                            <tr>
                                <td><b>{PRECISION_RECAP}</b></td>
                            </tr>
                            <tr>
                                <td>{tabChoix[this.props.evalProp.niveauAppreciationGlobale]}</td>
                            </tr>
                            <tr>
                                <td><b>{PRECISION_DETAILS}</b></td>
                            </tr>
                            <tr>
                                <td>{this.props.evalProp.precisionsAppreciationGlobale}</td>
                            </tr>
                            <tr>
                                <td><b>{DISCUSSION_RECAP}</b></td>
                            </tr>
                            <tr>
                                <td>{tabDiscussion[this.props.evalProp.discussion]}</td>
                            </tr>
                            </tbody>
                        </table>
                        <table>
                            <tbody>
                            <tr>
                                <td><b>{NBHEURESRECAP}</b></td>
                            </tr>
                            <tr>
                                <td>{this.props.evalProp.heuresEncadrement}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <br></br>
                    <div>
                        <table>
                            <thead width="100%">
                            <tr>
                                <td><h3><b>{TITRE_OUVERTURE}</b></h3></td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{tabDiscussion[this.props.evalProp.accueilProchain]}</td>
                            </tr>
                            <tr>
                                <td><b>{QUESTION1_OUVERTURE}</b></td>
                            </tr>
                            <tr>
                                <td>{this.props.evalProp.formationStagiaire}</td>
                            </tr>
                            </tbody>
                        </table>
                        <p>
                            <b>{"Nom:  "}</b><b>_______________________________</b><b>{" Fonction:  "}</b><b>______________________________</b>
                        </p>
                        <p>
                            <b>{"Signature:  "}</b><b>____________________________</b><b>{"    Date de Soumission:   "}</b>{this.props.evalProp.dateSoumission}
                        </p>
                    </div>
                    <br/>
                    <div>
                        <table>
                            <tr>
                                <td><b>{"Veuillez retourner ce formulaire à: "}</b></td>
                                <td>{"Mihoubi Karim"}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>{"Cégep André-Laurendeau"}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>{"1111, rue Lapierre"}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>{"LASALLE (Québec)"}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>{"H8N 2J4"}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>{"Numéro de télécopieur : (514) 364-7130"}</td>
                            </tr>
                        </table>
                        <br/><b>{"Nous vous remercions de votre appui!"}</b><br/>
                        <p>
                            {"Collège André-Laurendeau"}<br/>{"ALTERNANCE TRAVAIL-ÉTUDES"}<br/>{"2015-08-21"}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default ExportableEvaluation;
