import React, { Component } from 'react';
import './votreEntreprise.css';
import { Link } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import 'antd/dist/antd.css';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EntrepriseToolbar from './VotreEntreprise';
import {postOffre, getAllActivePeriodes} from '../utils/Utils';
import { getUserProfile, getCurrentUser } from '../utils/Utils';
import {Layout, Form, Input, Button, notification, Row, Col, Icon, Tabs, DatePicker, Select} from 'antd';
import {
  PROGRAMME_MIN_LENGTH, LONGUEUR_MIN_DUREE, LONGUEUR_MAX_DUREE,
  PROGRAMME_MAX_LENGTH, APPLICATION_NAME, LONGUEUR_MAX_PERIODE,
  LONGUEUR_MIN_TITRE_POSTE, LONGUEUR_MAX_TITRE_POSTE, OFFER_LIST_SIZE,
  NOMBRE_POSTE_LENGTH, LONGUEUR_MIN_TAUX_HORAIRE, LONGUEUR_MIN_DESCRIPTION_MANDAT,
  LONGUEUR_MAX_DESCRIPTION_MANDAT, LONGUEUR_MIN_EXIGENCES, LONGUEUR_MAX_EXIGENCES
} from '../constants/Constants';

const FormItem = Form.Item;
const {TabPane} = Tabs;
const { TextArea } = Input;
const Option = Select.Option;

class NouvelleOffre extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      },
      user: {
        id: ""
      },
      isLoading: false,
      periodes: [],
    };

    this.loadPeriodeList = this.loadPeriodeList.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePeriode = this.handlePeriode.bind(this);
    this.isOffreFormInvalid = this.isOffreFormInvalid.bind(this);
    this.isOffreFormInvalid = this.validateProgramme.bind(this);
    this.isOffreFormInvalid = this.validatePeriode.bind(this);
    this.isOffreFormInvalid = this.validateDuree.bind(this);
    this.isOffreFormInvalid = this.validateTitrePoste.bind(this);
    this.isOffreFormInvalid = this.validateNombrePoste.bind(this);
    this.validateTauxHoraire = this.validateTauxHoraire.bind(this);
    this.validateDescription = this.validateDescription.bind(this);
    this.validateHoraireTravail = this.validateHoraireTravail.bind(this);
    this.validateExigences = this.validateExigences.bind(this);
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

  loadPeriodeList(page = 0, size = OFFER_LIST_SIZE) {
    let promise;
    promise = getAllActivePeriodes(page, size);

    if(!promise){
      return;
    }

    this.setState({
      isLoading: true
    })

    if(this.state.periodes.length != 0){
      this.setState({
        periodes: [],
      });
    }

    promise
      .then( response => {
        const periodes = this.state.periodes.slice();
        this.setState({
          periodes: periodes.concat(response.content),
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          last: response.last,
          isLoading: false
        });
      }).catch(error =>{
        this.setState({
          isLoading: false
        })
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    const entrepriseID = this.state.user.id;

    const offreSubmit = {
      entrepriseID: entrepriseID,
      programme: this.state.programme.value,
      periode: this.state.periode.value,
      duree: this.state.duree.value,
      titrePoste: this.state.titrePoste.value,
      nombrePoste: this.state.nombrePoste.value,
      horaireTravail: this.state.horaireTravail.value,
      tauxHoraire: this.state.tauxHoraire.value,
      descriptionMandat: this.state.descriptionMandat.value,
      exigences: this.state.exigences.value
    };

    postOffre(offreSubmit).then(response => {
      notification.success({
        message: APPLICATION_NAME,
        description: "Succès! L'offre a été reçue.",
      });
    }).catch(error => {
      notification.error({
        message: APPLICATION_NAME,
        description: error.message || 'Sorry! Something went wrong. Please try again!'
      });
    });

  };

  componentDidMount(){
    const usr = this.props.currentUser;
    this.setState({
      user: usr
    });
  }

  handleOfferButtonSubmit(){

  }

  handlePeriode(periode){
    if (this.validatePeriode(periode).validateStatus === 'success')
      this.setState({
        periode: {
          value: periode
        }
      });
  }

  componentWillMount() {
    this.loadPeriodeList();
  }

  isOffreFormInvalid(){
    return (!(this.state.periode.validateStatus === 'success' &&
      this.state.duree.validateStatus === 'success' &&
      this.state.titrePoste.validateStatus === 'success' &&
      this.state.nombrePoste.validateStatus === 'success' &&
      this.state.tauxHoraire.validateStatus === 'success' &&
      this.state.descriptionMandat.validateStatus === 'success' &&
      this.state.exigences.validateStatus === 'success' ));
  };

  render(){
    //console.log(periodeList);
    return(
    <div>
      <div className="signup-container">
        <div className="signup-content">
          <Row>
            <Col span={4}>
            </Col>
            <Col span={15}>
            <h1 className="page-title">Nouvelle offre</h1>
            <Row>
              <Tabs defaultActiveKey="1">
                <TabPane tab={<span>Veuillez remplir les champs suivants:</span>} key="1">
                  <Form onSubmit={this.handleSubmit} className="signup-form">
                    <Row>
                    <Col span={10}>
                    <FormItem label="Programme" programme={this.state.programme.validateStatus}
                      help={this.state.programme.errorMsg}>
                      <Input size="large" name="programme" placeholder="Programme"
                        value={this.state.programme.value} onChange={(event)=> this.handleInputChange(event, this.validateProgramme)}/>
                    </FormItem>
                    </Col>
                    <Col span={4}>
                    </Col>
                    <Col span={10}>
                    <FormItem label="Période du stage" periode={this.state.periode.validateStatus}
                      help={this.state.periode.errorMsg}>
                      <Select size="large" name="periode" defaultValue="Hiver" value={this.state.periode.value?this.state.periode.value:undefined}
                        onChange={(event) => this.handlePeriode(event)}>
                        {
                          this.state.periodes.map((item) =>
                              <Option key={item.id} value={item.id}>{item.saison.concat(" ").concat(item.annee)}</Option>
                          )
                        }
                      </Select>
                    </FormItem>
                    </Col>
                    </Row>
                    <Row>
                    <Col span={10}>
                    <FormItem label="Durée du stage (semaines)" duree={this.state.duree.validateStatus}
                      help={this.state.duree.errorMsg}>
                      <Input size="large" name="duree" placeholder="Durée" value={this.state.duree.value}
                        onChange={(event)=> this.handleInputChange(event, this.validateDuree)}/>
                    </FormItem>
                    </Col>
                    <Col span={4}>
                    </Col>
                    <Col span={10}>
                    <FormItem label="Titre du Poste" titrePoste={this.state.titrePoste.validateStatus}
                      help={this.state.titrePoste.errorMsg}>
                      <Input size="large" name="titrePoste" placeholder="Titre du Poste"
                        value={this.state.titrePoste.value} onChange={(event)=> this.handleInputChange(event, this.validateTitrePoste)}/>
                    </FormItem>
                    </Col>
                    </Row>
                    <Row>
                    <Col span={10}>
                    <FormItem label="Nombre de Postes" nombrePoste={this.state.nombrePoste.validateStatus}
                      help={this.state.nombrePoste.errorMsg}>
                      <Input size="large" name="nombrePoste" placeholder="Nombre de postes" value={this.state.nombrePoste.value}
                        onChange={(event)=> this.handleInputChange(event, this.validateNombrePoste)}/>
                    </FormItem>
                    </Col>
                    <Col span={4}>
                    </Col>
                    <Col span={10}>
                    <FormItem label="Horaire de travail" horaireTravail={this.state.horaireTravail.validateStatus}
                      help={this.state.horaireTravail.errorMsg}>
                      <Input size="large" name="horaireTravail" placeholder="Horaire de travail"
                      value={this.state.horaireTravail.value} onChange={(event)=> this.handleInputChange(event, this.validateHoraireTravail)}/>
                    </FormItem>
                    </Col>
                    </Row>
                    <Row>
                    <Col span={10}>
                    <FormItem label="Taux Horaire ($)" tauxHoraire={this.state.tauxHoraire.validateStatus}
                      help={this.state.tauxHoraire.errorMsg}>
                      <Input size="large" name="tauxHoraire" placeholder="Taux horaire"
                        value={this.state.tauxHoraire.value} onChange={(event)=> this.handleInputChange(event, this.validateTauxHoraire)}/>
                    </FormItem>
                    </Col>
                    </Row>
                    <Col span={24}>
                    <FormItem label="Description du mandat" descriptionMandat={this.state.descriptionMandat.validateStatus}
                      help={this.state.descriptionMandat.errorMsg}>
                      <TextArea size="large" width="100%" name="descriptionMandat" placeholder="Description du mandat"
                        value={this.state.descriptionMandat.value} onChange={(event)=> this.handleInputChange(event, this.validateDescription)}/>
                    </FormItem>
                    </Col>
                    <Col span={24}>
                    <FormItem label="Exigences pour le stage" exigences={this.state.exigences.validateStatus}
                      help={this.state.exigences.errorMsg}>
                      <TextArea size="large" name="exigences" placeholder="Exigences du stage"
                        value={this.state.exigences.value} onChange={(event)=> this.handleInputChange(event, this.validateExigences)}/>
                    </FormItem>
                    <FormItem>
                      <Button type="primary" htmlType="submit" size="large" onClick={() => this.handleOfferButtonSubmit()}
                        className="signup-form-button">Envoyer</Button>
                    </FormItem>
                    </Col>
                    <Col span={4}></Col>
                    </Form>
                  </TabPane>
                </Tabs>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    );
  }

  validateProgramme = (programme) => {
    return this.validateLength(programme, PROGRAMME_MIN_LENGTH, PROGRAMME_MAX_LENGTH);
  };

  validatePeriode = (periode) => {
    return this.validateLongueurMax(periode, LONGUEUR_MAX_PERIODE);
  };

  validateDuree = (duree) => {
    if (!duree) {
      return {
        validateStatus: null,
        errorMsg: null
      }
    }
    const DUREE_REGEX = RegExp('^[0-9\./]+$');
    if (!DUREE_REGEX.test(duree)){
      return {
        validationStatus: 'error',
        errorMsg: `Mauvais format: seulement des nombres sont acceptes.)`
      }
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null
      }
    }
  };

  validateTitrePoste = (titrePoste) => {
    return this.validateLength(titrePoste, LONGUEUR_MIN_TITRE_POSTE, LONGUEUR_MAX_TITRE_POSTE);
  };

  validateNombrePoste = (nombrePoste) => {
    if (!nombrePoste) {
      return {
        validateStatus: 'error',
        errorMsg: 'Ce champ ne peut pas etre vide.'
      }
    }
    const POSTE_REGEX = RegExp('^[0-9\./]+$');
    if (nombrePoste.length > NOMBRE_POSTE_LENGTH) {
      return {
        validateStatus: 'error',
        errorMsg: `Le nombre de postes ne peut dépasser ${NOMBRE_POSTE_LENGTH} caracteres.)`
      }
    } else if (!POSTE_REGEX.test(nombrePoste)) {
      return {
        validationStatus: 'error',
        errorMsg: `Mauvais format: seulement des nombres sont acceptes.)`
      }
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null
      }
    }
  };

  validateTauxHoraire = (tauxHoraire) => {
    if (!tauxHoraire) {
      return {
        validateStatus: 'error',
        errorMsg: 'Ce champ ne peut pas etre vide.'
      }
    }
    const TAUX_REGEX = RegExp('^[0-9\./]+$');
    if (!TAUX_REGEX.test(tauxHoraire)) {
      return {
        validationStatus: 'error',
        errorMsg: `Mauvais format: seulement des nombres sont acceptes.)`
      }
    } else {
      return {
        validateStatus: 'success',
        errorMsg: null
      }
    }

  };

  validateHoraireTravail = (horaireTravail) => {
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  };

  validateDescription = (descriptionMandat) => {
    return this.validateLength(descriptionMandat, LONGUEUR_MIN_DESCRIPTION_MANDAT, LONGUEUR_MAX_DESCRIPTION_MANDAT);
  };

  validateExigences = (exigences) => {
    return this.validateLength(exigences, LONGUEUR_MIN_EXIGENCES, LONGUEUR_MAX_EXIGENCES);
  };

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

export default NouvelleOffre;
