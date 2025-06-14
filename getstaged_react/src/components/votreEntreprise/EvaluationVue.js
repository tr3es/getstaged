import React, {Component} from 'react';
import {Layout, Form,  Button,  Row, Col, Icon, Tabs, Menu} from 'antd';
import {postEvalHTML, downloadEval} from '../utils/Utils';
import {getSampleStage} from './StageSample';
import NouvelleOffre from './NouvelleOffre';
import {renderToString} from 'react-dom/server';
import ExportableEvaluation from './ExportableEvaluation';
import EvaluationStagiaire from './EvaluationStagiaire';
import EntrepriseMenuContent from './EntrepriseMenuContent';
import axios from 'axios';
import {
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
    TITRE_VUE_EVAL,
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

const {SubMenu} = Menu;
const {Content} = Layout;

class EvaluationVue extends Component {
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
            listeCommentaires: '',
            download: ''
        }
        this.loadEval = this.loadEval.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        //this.menuContent = this.menuContent.bind(this);
        this.evalVueContent = this.evalVueContent.bind(this);
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

    componentDidMount() {
        const eval_id = this.props.match.params.eval_id;
        this.loadEval(eval_id);
    }

    loadEval(eval_id) {
        fetch(API_BASE_URL + "/EvaluationStagiaire/" + eval_id)
            .then(response => response.json())
            .then(data => this.setState({evaluation: data}));

        this.setState({isLoading: true});
        axios.get(API_BASE_URL + "/EvaluationStagiaire/" + eval_id)
            .then(result => this.setState({
                tableauReponses: JSON.stringify(result.data.tableauReponses),
                isLoading: false
            }));
        axios.get(API_BASE_URL + "/EvaluationStagiaire/" + eval_id)
            .then(result => this.setState({
                listeCommentaires: JSON.stringify(result.data.listeCommentaires),
                isLoading: false
            }));
    }

    handleSubmit(event) {
        event.preventDefault();
        postEvalHTML(this.props.match.params.eval_id, renderToString(<ExportableEvaluation
            eval_id={this.props.match.params.eval_id}
            comms={this.state.listeCommentaires} reps={this.state.tableauReponses} evalProp={this.state.evaluation}/>));
        downloadEval(this.props.match.params.eval_id);
    }

    evalVueContent(){
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

      return (
          <div>
            <div className="signup-container">
                <h1>{TITRE_VUE_EVAL}</h1>
                <table align="center" width="66%">
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
                <hr/>
                <div>
                    {tabQuestions.map(function (object, i) {
                        return (
                            <div>
                                <h3><b>{tabTitres[i]}</b></h3>
                                {tabSousTitres[i]}
                                <table align="center">
                                    <tbody>
                                    <tr>
                                        <td width="50%"><b>Le stagiaire a été en mesure de:</b>
                                        </td>
                                    </tr>
                                    {object.map(function (objectInterne, j) {
                                        return (

                                            <tr>
                                                <td key={j}>{lineSymbol[j]} {objectInterne}</td>
                                                <td align="left">
                                                    {this.parseReponseValue(this.state.evaluation.tableauReponses[(i * tabQuestions.length + j)])}
                                                </td>
                                            </tr>
                                        )
                                    }, this)}
                                    <tr/>
                                    </tbody>
                                    <tfoot>
                                    <tr>
                                        <td><b>Commentaires:</b></td>
                                    </tr>
                                    <tr>
                                        <td colSpan="6">
                                            <p>{this.state.evaluation.listeCommentaires[i]}</p>
                                        </td>
                                    </tr>
                                    </tfoot>
                                </table><hr/>
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
                            <td>{tabChoix[this.state.evaluation.niveauAppreciationGlobale]}</td>
                        </tr>
                        <tr>
                            <td><b>{PRECISION_DETAILS}</b></td>
                        </tr>
                        <tr>
                            <td>{this.state.evaluation.precisionsAppreciationGlobale}</td>
                        </tr>
                        <tr>
                            <td><b>{DISCUSSION_RECAP}</b></td>
                        </tr>
                        <tr>
                            <td>{tabDiscussion[this.state.evaluation.discussion]}</td>
                        </tr>
                        </tbody>
                    </table>
                    <table>
                        <tbody>
                        <tr>
                            <td><b>{NBHEURESRECAP}</b></td>
                        </tr>
                        <tr>
                            <td>{this.state.evaluation.heuresEncadrement}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <br/><hr/>
                <div>
                    <table>
                        <thead width="100%">
                        <tr>
                            <td><h3><b>{TITRE_OUVERTURE}</b></h3></td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{tabDiscussion[this.state.evaluation.accueilProchain]}</td>
                        </tr>
                        <tr>
                            <td><b>{QUESTION1_OUVERTURE}</b></td>
                        </tr>
                        <tr>
                            <td>{this.state.evaluation.formationStagiaire}</td>
                        </tr>
                        </tbody>
                        <Row>
                            <Col span={10}>
                                <tr>
                                    <td><b>Nom du superviseur:</b></td>
                                    <td>
                                        <p>{this.stage["entreprise"]["firstName"].value} {this.stage["entreprise"]["lastName"].value}</p>
                                    </td>
                                </tr>
                            </Col>
                            <Col span={4}/>
                            <Col span={10}>
                                <tr>
                                    <td>{}</td>
                                </tr>
                            </Col>
                        </Row><Row>
                        <Col span={10}>
                            <tr>
                                <td><b>Date de Soumission: </b></td>
                            </tr>
                            <tr>
                                <td>{this.state.evaluation.dateSoumission}</td>
                            </tr>
                        </Col>
                        <Col span={10}/>
                    </Row>
                    </table>
                </div>
                <Form onSubmit={this.handleSubmit}> <hr/>
                    <Button type="primary"
                            htmlType="submit"
                            size="large"
                            className="signup-form-button">{"Télécharger le PDF"}
                    </Button><br/><br/>
                    <Button type= "primary"
                            size="large"
                            onClick={() => window.location.replace("/Home")}
                            className="signup-form-button">{"Retour vers la page d'accueil"}
                    </Button>
                    
                </Form>
            </div>
          </div>
      );
    }
    render() {
        return this.evalVueContent();
    }
}

export default EvaluationVue;
