import React, { Component } from 'react';
import './votreEntreprise.css';
import { Link } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import 'antd/dist/antd.css';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import {postEval} from '../utils/Utils';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import EntrepriseToolbar from './VotreEntreprise';
import {getSampleStage} from './StageSample';
import {Layout, Form, Input, Button, notification, Row, Col, Icon, Tabs, DatePicker} from 'antd';
import EntrepriseMenuContent from './EntrepriseMenuContent';
import {
    NOMRE_RANGEES_QUESTIONS, NOMBRE_QUESTIONS, NOMBRE_QUESTIONS_CHAMP_1,
    NOMBRE_QUESTIONS_CHAMP_2, NOMBRE_QUESTIONS_CHAMP_3, NOMBRE_QUESTIONS_CHAMP_4,
    NOMBRE_CHOIX_RECAP, QUESTION_1_A, QUESTION_1_B, QUESTION_1_C, QUESTION_1_D,
    QUESTION_1_E, QUESTION_2_A, QUESTION_2_B, QUESTION_2_C, QUESTION_2_D, QUESTION_2_E,
    QUESTION_3_A, QUESTION_3_B, QUESTION_3_C, QUESTION_3_D, QUESTION_3_E, QUESTION_3_F,
    QUESTION_4_A, QUESTION_4_B, QUESTION_4_C, QUESTION_4_D, QUESTION_4_E, QUESTION_4_F,
    TITRE_RECAP, CHOIX_RECAP_0, CHOIX_RECAP_1, CHOIX_RECAP_2, CHOIX_RECAP_3, CHOIX_RECAP_4,
    TITRE_1, TITRE_2, TITRE_3, TITRE_4, SOUS_TITRE_1, SOUS_TITRE_2, SOUS_TITRE_3, SOUS_TITRE_4,
    TITRE_FORMULAIRE,NOMELEVE, NOMPROGRAMME, NOMENTREPRISE, NOMSUPERVISEUR, FONCTION, TELEPHONE,
    INDICATIONAIDE, INDICATIONAIDE2, PRECISION_RECAP,DISCUSSION_RECAP, TITRE_OUVERTURE,QUESTION1_OUVERTURE,
    NONAPPLICABLE, ATTESTATION_COUVERTURE, APPLICATION_NAME,

    COMMENTAIRE_MIN_LENGTH, COMMENTAIRE_MAX_LENGTH, FORMATION_MIN_LENGTH,
    LONGUEUR_MIN_TITRE_POSTE, LONGUEUR_MAX_TITRE_POSTE, NBHEURESRECAP,
    NOMBRE_POSTE_LENGTH, LONGUEUR_MIN_TAUX_HORAIRE, LONGUEUR_MIN_DESCRIPTION_MANDAT,
    LONGUEUR_MAX_DESCRIPTION_MANDAT, LONGUEUR_MIN_EXIGENCES, LONGUEUR_MAX_EXIGENCES
} from '../constants/Constants';

const {Content} = Layout;
const FormItem = Form.Item;
const {TabPane} = Tabs;
const { TextArea } = Input;

class EvaluationStagiaire extends Component {
  constructor(props) {
    super(props);

    let liste_initiale = new Array(NOMBRE_QUESTIONS);
    for(var i =0; i< NOMBRE_QUESTIONS; i++){
      liste_initiale[i] = {};
    }

    let tableau_initial = new Array(22);
    for(var i = 0; i < 22; i++){
      tableau_initial[i] = {};
    }
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
          evalGlobale: {
            value: ''
          },
          nomEleve: {
            value: ''
          },
          programmeEtude: {
            value: ''
          },
          nomEntreprise: {
            value: ''
          },
          nomSuperviseur: {
            value: ''
          },
          fonctionSuperviseur: {
            value: ''
          },
          telephoneSuperviseur: {
            value: ''
          },
          tableauReponses: {
            reponses: tableau_initial,
          },
          listeCommentaires: liste_initiale,
          niveauAppreciationGlobale: {
            value: ''
          },
          precisionsAppreciationGlobale: {
            value: ''
          },
          discuterEvalStagiaire: {
            value: ''
          },
          heuresEncadrement: {
            value: ''
          },
          AccueilProchain: {
            value: ''
          },
          formationStagiaire: {
            value: ''
          },
          consentement: false,
          dateSoumission: {
            value: new Date().toDateString()
          }
        };

        //this.stage =  getSampleStage();
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReponse = this.handleReponse.bind(this);
        this.handleCommentaire = this.handleCommentaire.bind(this);
        this.handlePrecision = this.handlePrecision.bind(this);
        this.handleNbHeures = this.handleNbHeures.bind(this);
        this.handleDiscussion = this.handleDiscussion.bind(this);
        this.handleFormationStagiaire = this.handleFormationStagiaire.bind(this);
        this.handleAccueilProchain = this.handleAccueilProchain.bind(this);
        this.handleEvalGlobale = this.handleEvalGlobale.bind(this);
        this.handleConsentement = this.handleConsentement.bind(this);
        this.isTabValid = this.isTabValid.bind(this);
        this.initChampsInvalides = this.initChampsInvalides.bind(this);
        this.isChecked = this.isChecked.bind(this);
        this.initTableauReponses = this.initTableauReponses.bind(this);
        this.validateCommentaire = this.validateCommentaire.bind(this);
        this.validateAccueilProchain = this.validateAccueilProchain.bind(this);
        this.handleAccueilProchain = this.validateAccueilProchain.bind(this);
        this.handleEvalGlobale = this.validateEvalGlobale.bind(this);
        this.initTableauReponses();
        this.isFormValid = this.isFormValid.bind(this);
        this.isListeValid = this.isListeValid.bind(this);
        this.isCheckBoxesValid = this.isCheckBoxesValid.bind(this);
        this.menuContent = this.menuContent.bind(this);
        this.getFormContent = this.getFormContent.bind(this);
    }

    menuContent(contenu){
      const evalComponent = <TabPane tab={<span><Icon type="laptop"/>Évaluer un stagiaire</span>} key="1">
          <Content style={{padding: '0 24px', minHeight: 300, paddingLeft: '40px'}}>
              {contenu}
          </Content>
      </TabPane>;
      return(
        <div>
          <EntrepriseMenuContent isAuthenticated={this.state.isAuthenticated} content={evalComponent}
              keybase={1} currentUser={this.state.currentUser} {...this.props}/>
        </div>
      );
    }

    initTableauReponses(){
        this.setState({niveauAppreciationGlobale: {value: -1}})
    }

    handleAccueilProchain(val, validationMethod){
      this.setState({
        AccueilProchain: {...validationMethod(val)}
      })
    }

    handleDiscussion(val, validationMethod){
      this.setState({
        discuterEvalStagiaire: {...validationMethod(val)}
      })
    }

    isChecked(i, j, val){
      let tableauReponses = [this.state.tableauReponses];
      return tableauReponses[i][j] === val;
    }

    handleNbHeures(evt){
      this.setState({
        heuresEncadrement: {value: evt.target.value}
      })
    }

    handleEvalGlobale(val, validationMethod){
      this.setState({
        niveauAppreciationGlobale: {...validationMethod(val)}
      });
    }

    componentWillMount() {
        this.setState({
            stage : this.props.stage,
            currentUser: this.props.currentUser,
            isAuthenticated: this.props.isAuthenticated,
          tableauReponses : this.initTableauReponses()
        })
        const stage_id =  this.props.match.params.stage_id;
    }

    componentDidMount(){
      this.validateAccueilProchain("");
      this.validateDiscussion("");
      this.validateEvalGlobale("");
      this.validateNbHeures("");
      this.initChampsInvalides();
    }

    handleInputChange(event, validationFun) {
      const target = event.target;
      const inputName = target.name;
      const inputValue = target.value;
      this.setState({
          [inputName]: {
              value: inputValue,
              ...validationFun(inputValue)
          }
      });
    }

    handleFormationStagiaire(evt){
      this.setState({formationStagiaire: {value: evt.target.value}})
    }

    handleCommentaire(evt, index){
      const newArray = [...this.state.listeCommentaires];
      newArray[index] = evt.target.value;
      this.setState({ listeCommentaires: newArray });
    }

    handlePrecision(evt){
      this.setState({precisionsAppreciationGlobale:{value:evt.target.value}});
      this.handleInputChange(evt, this.validatePrecision);
    }

    handleReponse(indexI, val){
      const newArray = [...this.state.tableauReponses];
      newArray.splice(indexI, 0, val);
      this.setState({tableauReponses: newArray});
    }

    handleConsentement(evt){
      let consenti = this.state.consentement
      this.setState({consentement: !consenti})
      let checkBoxesValid = this.isCheckBoxesValid();
    }

  handleSubmit(event) {
      event.preventDefault();
      const evaluation = {
          eleveID : this.state.stage.studentResponse.id,
          entrepriseID : this.state.currentUser.id,
          offreID : this.state.stage.offerResponse.id,
          discussion : this.state.discuterEvalStagiaire.value,
          tableauReponses : this.state.tableauReponses,
          listeCommentaires : this.state.listeCommentaires,
          niveauAppreciationGlobale : this.state.niveauAppreciationGlobale.value,
          precisionsAppreciationGlobale : this.state.precisionsAppreciationGlobale.value,
          discuterEvalStagiaire : this.state.discuterEvalStagiaire.value,
          heuresEncadrement : this.state.heuresEncadrement.value,
          AccueilProchain : this.state.AccueilProchain.value,
          formationStagiaire : this.state.formationStagiaire.value,
          consentement : this.state.consentement.value,
          dateSoumission : this.state.dateSoumission.value
      }
      postEval(evaluation).then(response => {
        notification.success({
          message: APPLICATION_NAME,
          description: "Succès! L'offre a été reçue.",
        });
        this.props.history.push("/VotreEntreprise");
      }).catch(error => {
        notification.error({
        message: APPLICATION_NAME,
        description: error.message || 'Sorry! Something went wrong. Please try again!'
        });
      });
    }

  isFormValid(){
    let tabValid = this.isTabValid();
    let checkBoxesValid = this.isCheckBoxesValid();
    let listeValid = this.isListeValid();
    /*this.isFormValid = this.validateCommentaires.bind(this);
    this.isFormValid = this.validatePrecision.bind(this);
    this.isFormValid = this.validateNbHeures.bind(this);
    this.isFormValid = this.validateDiscussion.bind(this);
    this.isFormValid = this.validateFormationStagiaire.bind(this);
    this.isFormValid = this.validateAccueilProchain.bind(this);
    this.isFormValid = this.validateEvalGlobale.bind(this);*/
    return this.state.consentement && tabValid && listeValid &&
      this.state.niveauAppreciationGlobale.validateStatus === 'success' &&
      this.state.precisionsAppreciationGlobale.validateStatus === 'success' &&
      this.state.formationStagiaire.validateStatus === 'success' &&
      checkBoxesValid;
  }

  isCheckBoxesValid(){
    if(this.state.formationStagiaire && this.state.AccueilProchain)
      return(this.state.discuterEvalStagiaire.errorMsg == null && this.state.AccueilProchain.errorMsg == null);
    else return false;
  }

  isTabValid(){
    if(this.state.tableauReponses)
      return(this.state.tableauReponses.length==22);
    else return false;
  }

  isListeValid(){
    if(this.state.listeCommentaires)
      return(this.state.listeCommentaires.length==4);
    else return false;
  }

  getFormContent(){
    console.log(this.state.stage);
    const stage = this.stage;
    const question1 = [QUESTION_1_A, QUESTION_1_B, QUESTION_1_C, QUESTION_1_D, QUESTION_1_E];
    const question2 = [QUESTION_2_A, QUESTION_2_B, QUESTION_2_C, QUESTION_2_D, QUESTION_2_E];
    const question3 = [QUESTION_3_A, QUESTION_3_B, QUESTION_3_C, QUESTION_3_D, QUESTION_3_E, QUESTION_3_F];
    const question4 = [QUESTION_4_A, QUESTION_4_B, QUESTION_4_C, QUESTION_4_D, QUESTION_4_E, QUESTION_4_F];
    const tabQuestions = [question1, question2, question3, question4];
    const tabTitres = [TITRE_1, TITRE_2, TITRE_3, TITRE_4];
    const tabSousTitres = [SOUS_TITRE_1, SOUS_TITRE_2, SOUS_TITRE_3, SOUS_TITRE_4];
    const lineSymbol = ["a)","b)","c)","d)","e)","f)"];
    const tabChoix = [CHOIX_RECAP_0, CHOIX_RECAP_1, CHOIX_RECAP_2, CHOIX_RECAP_3, CHOIX_RECAP_4];
    const { classes } = this.props;
    const tableauReponses = this.state.tableauReponses;

      return(

        <div className="signup-container">

        <Form onSubmit={this.handleSubmit} className="signup-form">
          <div>
          <h1 align="center">{TITRE_FORMULAIRE}</h1>
            <table align="center">

              <tbody>
                <tr>
                  <td width="50%">
                    <b>{NOMELEVE}</b>
                  </td>
                  <td width="50%">
                    <b>{this.state.stage.studentResponse.firstName}</b><b>{this.state.stage.studentResponse.lastName}</b>
                  </td>
                </tr>
                <tr>
                  <td width="50%">
                    <b>{NOMPROGRAMME}</b>
                  </td>
                  <td width="50%">
                    <b>{this.state.stage.offerResponse.programme}</b>
                  </td>
                </tr>
                <tr>
                  <td width="50%">
                    <b>{NOMENTREPRISE}</b>
                  </td>
                  <td width="50%">
                    <b>{this.state.stage.offerResponse.nameEntreprise}</b>
                  </td>
                </tr>
                <tr>
                  <td width="50%">
                    <b>{NOMSUPERVISEUR}</b>
                  </td>
                  <td width="50%">
                    <b>{/*this.stage["entreprise"]["firstName"].value}</b> <b>{this.stage["entreprise"]["lastName"].value*/}</b>
                  </td>
                </tr>
                <tr>
                  <td width="50%">
                    <b>{FONCTION}</b>
                    <b>{this.state.stage.offerResponse.titrePoste}</b>
                  </td>
                  <td width="50%">
                    <b>{TELEPHONE}</b>
                    <b>{/*this.stage["entreprise"]["telephone"].value*/}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        <p align="center" width="66%"> {INDICATIONAIDE}</p>
        <p width="66%" align="center">{NONAPPLICABLE}</p>

        <div>
          {tabQuestions.map(function(object, i){
            return (
              <div>
              <h3><b>{tabTitres[i]}</b></h3>
              {tabSousTitres[i]}
              <table align="center">

                <tbody>
                  <tr>
                    <td width="50%"><b>Le stagiaire a été en mesure de:</b></td>
                    <td align="center"><b>Totalement en accord</b></td>
                    <td align="center"><b>Plutôt en accord</b></td>
                    <td align="center"><b>Plutôt en désaccord</b></td>
                    <td align="center"><b>Totalement en désaccord</b></td>
                    <td align="center"><b>N/A*</b></td>
                  </tr>
                  {object.map(function(objectInterne, j){
                    return(

                      <tr>
                        <td key={j}>{lineSymbol[j]}{objectInterne}</td>
                        <td align="center">
                          <input
                            type="radio"
                            name={""+i+j}
                            selected={() => this.isChecked(i,j,0)}
                            onChange={() => this.handleReponse((i*tabQuestions.length+ j),0)}/>
                        </td>
                        <td align="center">
                          <input
                            type="radio"
                            name={""+i+j}
                            selected={() => this.isChecked(i,j,1)}
                            onChange={() => this.handleReponse((i*tabQuestions.length+ j),1)}/>
                        </td>
                        <td align="center">
                          <input
                            type="radio"
                            name={""+i+j}
                            selected={() => this.isChecked(i,j,2)}
                            onChange={() => this.handleReponse((i*tabQuestions.length+ j),2)}/>
                        </td>
                        <td align="center">
                          <input
                            type="radio"
                            name={""+i+j}
                            selected={() => this.isChecked(i,j,3)}
                            onChange={() => this.handleReponse((i*tabQuestions.length+ j),3)}/>
                        </td>
                        <td align="center">
                          <input
                            type="radio"
                            name={""+i+j}
                            selected={() => this.isChecked(i,j,4)}
                            onChange={() => this.handleReponse((i*tabQuestions.length+ j), 4)}/>
                        </td>
                      </tr>
                    )
                  }, this)}

                </tbody>
                <tfoot>
                  <tr>
                    <td><b>Commentaires:</b></td>
                  </tr>
                  <tr>
                    <td colSpan="6">
                    <FormItem
                        label="Commentaires: ">
                        <Input
                            type="text"
                            size="large"
                            name="commentaire"
                            placeholder="Commentaires: "
                            onChange={(text) =>this.handleCommentaire(text, i)}
                            />
                    </FormItem>

                    </td>
                  </tr>
                </tfoot>
              </table>
              </div>
            )
          },this)}
        </div>
        <br/>
        <div>
          <table>
            <thead>
              <tr>
                <td ><h2> {TITRE_RECAP} </h2></td><td></td><td></td><td></td>
              </tr>
            </thead>
            <tbody align="left">
              <FormItem
                label={PRECISION_RECAP}
                precisionsAppreciationGlobale={this.state.niveauAppreciationGlobale.validateStatus}
                help={this.state.niveauAppreciationGlobale.errorMsg}>
                {tabChoix.map(function(object, i){
                  return(
                  <tr>
                    <td >{tabChoix[i]}</td>
                    <td><Input
                      type="radio"
                      name="niveauAppreciationGlobale"
                      onChange={() => this.handleEvalGlobale(i, this.validateEvalGlobale)}/></td>
                    <td></td>
                  </tr>
                )
              },this)}
              </FormItem>
                <tr><td colSpan="6" >
                <FormItem
                    label={PRECISION_RECAP}
                    precisionsAppreciationGlobale={this.state.precisionsAppreciationGlobale.validateStatus}
                    help={this.state.precisionsAppreciationGlobale.errorMsg}>
                    <Input
                        size="large"
                        name="precisionsAppreciationGlobale"
                        placeholder={PRECISION_RECAP}
                        value={this.state.precisionsAppreciationGlobale.value}
                        onChange={(event) => this.handleInputChange(event, this.validatePrecision)}
                        />
                </FormItem>
                </td></tr>
                <tr>
                  <td> {DISCUSSION_RECAP} </td>
                </tr>
                <tr>
                  <td>
                  <FormItem
                    discuterEvalStagiaire={this.state.discuterEvalStagiaire.validateStatus}
                    help={this.state.discuterEvalStagiaire.errorMsg}>
                  Oui <Input
                    type="radio"
                    name="discuterEvalStagiaire"
                    onChange={() => this.handleDiscussion(0, this.validateDiscussion)}/>

                    Non <Input
                      type="radio"
                      name="discuterEvalStagiaire"
                      onChange={() => this.handleDiscussion(1, this.validateDiscussion)}/>
                  </FormItem>
                  </td>
                </tr>
            </tbody>
          </table>
          <table >
          <tbody>
            <tr><td>
              <FormItem
                label={NBHEURESRECAP}
                heuresEncadrement={this.state.heuresEncadrement.validateStatus}
                help={this.state.heuresEncadrement.errorMsg}>
                  <Input
                  size="large"
                  name="heuresEncadrement"
                  placeholder="Heures d'encadrement par semaine"
                  heuresEncadrement={this.state.heuresEncadrement.value}
                  onChange={(event) => this.handleInputChange(event, this.validateNbHeures)}
                  />
                </FormItem>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <br></br>
        <div>
          <table >
            <thead width="100%">
              <tr>
                <td><h3>{TITRE_OUVERTURE}</h3></td>
              </tr>
            </thead>
            <tbody>
              <tr>
              <FormItem
                AccueilProchain={this.state.AccueilProchain.validateStatus}
                help={this.state.AccueilProchain.errorMsg}>
              <td>
                Oui <Input
                  type="radio"
                  name="AccueilProchain"
                  onChange={() => this.handleAccueilProchain(0, this.validateAccueilProchain)}/>

                Non <Input
                  type="radio"
                  name="AccueilProchain"
                  onChange={() => this.handleAccueilProchain(1, this.validateAccueilProchain)}/>

                Peut-être<Input
                  type="radio"
                  name="AccueilProchain"
                  onChange={() => this.handleAccueilProchain(2, this.validateAccueilProchain)}/>
                </td>
              </FormItem>
              </tr>
              <tr>
              <FormItem
                  label={QUESTION1_OUVERTURE}
                  formationStagiaire={this.state.formationStagiaire.validateStatus}
                  help={this.state.formationStagiaire.errorMsg}>
                  <Input
                      size="large"
                      name="formationStagiaire"
                      placeholder={"Veuillez élaborer"}
                      value={this.state.formationStagiaire.value}
                      onChange={(event) => this.handleInputChange(event, this.validateFormationStagiaire)}/>
              </FormItem>
              </tr>
            </tbody>
            <Row>
            <Col span={10}>
                <FormItem
                    label="Nom du superviseur">
                    <p><b>{this.state.stage.nameEntreprise}</b> <b>{/*this.stage["entreprise"]["lastName"].value*/}</b></p>
                </FormItem>
            </Col>
            <Col span={4}></Col>
            <Col span={10}>
              <FormItem
                  label="Fonction du superviseur"
                  fonctionSuperviseur={this.state.fonctionSuperviseur.validationStatus}
                  help={this.state.fonctionSuperviseur.errorMsg}>
                  <p><b>{this.state.stage.offerResponse.titrePoste}</b></p>
              </FormItem>
          </Col>
          </Row><Row>
          <Col span={4}>
            <FormItem
                label="Date de Soumission: "
                descriptionMandat={this.state.dateSoumission}
                help={this.state.dateSoumission.errorMsg}>
                <Input
                    disabled={true}
                    size="30"
                    name="FormationStagiaire"
                    placeholder="Date: "
                    value={this.state.dateSoumission.value}/>
            </FormItem>
          </Col>
          <Col span={10}></Col>
          <Col span={10}>
            <FormItem
              label="Attestation"
              consentement={this.state.consentement}
              help={this.state.consentement.errorMsg}>
              <Input
                type="checkbox"
                size="large"
                name="consentement"
                defaultChecked={this.state.consentement.value}
                placeholder="J'atteste que les informations présentes sont correctes."
                value={this.state.consentement.value}
                onChange={evt => this.handleConsentement(evt)}/>&nbsp;{ATTESTATION_COUVERTURE}
              </FormItem>
          </Col>
          <Col span={4}></Col>
          </Row><Row>
          <Col span={10}>
            <Button type="primary"
              htmlType="submit"
              size="large"
              className="signup-form-button"AccueilProchain
              disabled={!this.isFormValid()}>Envoyer
            </Button>
            

        </Col>
        <Col span={4}></Col>
        <Col span={10}></Col>

        </Row>
          </table>
        </div>
        </Form>
        </div>
      );
  }

  render(){
    return (this.getFormContent());
  }

    initChampsInvalides(){
      this.setState({
        heuresEncadrement: {
          validationStatus: 'error',
          errorMsg: 'Veuillez remplir le champ.'
        }
      });
      this.setState({
        precisionsAppreciationGlobale: {
          validationStatus: 'error',
          errorMsg: 'Veuillez remplir le champ.'
        }
      });
      this.setState({
        formationStagiaire: {
          validationStatus: 'error',
          errorMsg: 'Veuillez remplir le champ.'
        }
      });
      this.setState({
        listeCommentaires: ''
      });
      this.setState({
        tableauReponses: ''
      })
    }

    validateCommentaires(){}
    validatePrecision(){}

    validateEvalGlobale = (niveauAppreciationGlobale) => {
      const ACCUEIL_REGEX = RegExp('^[0-4]$');
      if(!ACCUEIL_REGEX.test(niveauAppreciationGlobale)){
        this.setState({
          niveauAppreciationGlobale: {
            value: '',
            validationStatus: 'error',
            errorMsg: `Mauvais format: (Une case doit être cochée.)`
          }
        })
      } else{
        this.setState({
          niveauAppreciationGlobale: {
            value: niveauAppreciationGlobale,
            validateStatus: 'success',
            errorMsg: null
          }
        });
      }
    }

    validateDiscussion = (discuterEvalStagiaire) => {
      const ACCUEIL_REGEX = RegExp('^[0-1]$');
      if(!ACCUEIL_REGEX.test(discuterEvalStagiaire)){
        this.setState({
          discuterEvalStagiaire: {
            value: '',
            validationStatus: 'error',
            errorMsg: `Mauvais format: (Une case doit être cochée.)`
          }
        })
      } else{
        this.setState({
          discuterEvalStagiaire: {
            value: discuterEvalStagiaire,
            validateStatus: 'success',
            errorMsg: null
          }
        });
      }
    }

    validateAccueilProchain = (AccueilProchain) => {
      const ACCUEIL_REGEX = RegExp('^[0-2]$');
      if(!ACCUEIL_REGEX.test(AccueilProchain)){
        this.setState({
          AccueilProchain: {
            value: '',
            validationStatus: 'error',
            errorMsg: `Mauvais format: (Une case doit être cochée.)`
          }
        })
      } else{
        this.setState({
          AccueilProchain: {
            value: AccueilProchain,
            validateStatus: 'success',
            errorMsg: null
          }
        });
      }
    };

    validateFormationStagiaire = (formationStagiaire) => {
      return this.validateLength(formationStagiaire, FORMATION_MIN_LENGTH, COMMENTAIRE_MAX_LENGTH);
    }

    validateNbHeures = (heuresEncadrement) => {
      const DUREE_REGEX = RegExp('^[0-9\./]+$');
      if (!DUREE_REGEX.test(heuresEncadrement)){
        return {
          validationStatus: 'error',
          errorMsg: `Mauvais format: (Seulement un nombre sera accepté.)`
        }
      } else {
        return {
          validateStatus: 'success',
          errorMsg: null
        }
      }
    };

    validateCommentaire = (commentaire) => {
        return this.validateLength(commentaire, COMMENTAIRE_MIN_LENGTH, COMMENTAIRE_MAX_LENGTH);
    };

    validatePrecision = (precision) => {
      return this.validateLength(precision, COMMENTAIRE_MIN_LENGTH, COMMENTAIRE_MAX_LENGTH);
    }

    validateLength(variable, longueurMin, longueurMax){
      if(variable.length < longueurMin) {
        return {
            validationStatus: 'error',
            errorMsg: `Champ invalide: (Minimum ${longueurMin} caracteres.)`
        }
      } else if(variable.length > longueurMax) {
        return {
            validationStatus: 'error',
            errorMsg: `Champ invalide: (Maximum ${longueurMax} caracteres.)`
        }
      } else {
          return {
              validateStatus: 'success',
              errorMsg: null,
          };
      }
    };
    validateLongueurMin(variable, longueurMin){
      if(variable.length < longueurMin) {
        return {
            validationStatus: 'error',
            errorMsg: `Champ invalide: (Minimum ${longueurMin} caracteres.)`
        }
      } else {
          return {
              validateStatus: 'success',
              errorMsg: null,
          };
      }
    };
    validateLongueurMax(variable, longueurMax){
      if(variable.length > longueurMax) {
        return {
            validationStatus: 'error',
            errorMsg: `Champ invalide: (Maximum ${longueurMax} caracteres.)`
        }
      } else {
          return {
              validateStatus: 'success',
              errorMsg: null,
          };
      }
    };
}
export default EvaluationStagiaire;
