import React, {Component} from 'react';
import {signup,  checkEmailAvailability} from '../utils/Utils';
import './Signup.css';
import {Link} from 'react-router-dom';
import {
    NAME_MIN_LENGTH, NAME_MAX_LENGTH, EMAIL_MAX_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, APPLICATION_NAME,
    ENTERPRISE_NAME_MIN_LENGTH, ENTERPRISE_NAME_MAX_LENGTH,
    TYPE_FORM_SCHOOL, TYPE_FORM_ENTERPRISE,
    VALIDATION_SUCCESS, TEXT_REQUEST_ERROR_TRYAGAIN,
    CHAMP_NOM, CHAMP_PRENOM, CHAMP_PASSWORD_DESCRIPTION, CHAMP_NOM_ENTERPRISE,
    CHAMP_CONFIRM_PASSWORD, CHAMP_EMAIL, CHAMP_PASSWORD, CHAMP_ALREADY_REGISTER,
    CHAMP_TYPE_SCHOOL, CHAMP_TYPE_ENTERPRISE, ERROR_EMAIL_ALREADY_REGISTER,
    ERROR_CONFIRM_PASSWORD
} from '../constants/Constants';
import {Button as ButtonStic, Icon as IconStic} from 'semantic-ui-react'
import {Form, Input, Button, notification, Row, Col, Icon, Tabs, Radio} from 'antd';

const {TabPane} = Tabs;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const FormItem = Form.Item;

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: { value: ''},
            lastName: { value: '' },
            email: { value: ''},
            password: { value: ''},
            confirmPassword: {value: ''},
            roleFormSchool: 'student',
            emailEnt: {
                value: ''
            },
            passwordEnt: {
                value: ''
            },
            confirmPasswordEnt: {
                value: ''
            },
            enterpriseName: {
                value: ''
            },
            typeForm: {
                value: ''
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangeRole = this.handleChangeRole.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
        this.validateEmailEntrepriseAvailability = this.validateEmailEntrepriseAvailability.bind(this);
        this.validateConfirmPassword = this.validateConfirmPassword.bind(this);
        this.validateConfirmPasswordEntreprise= this.validateConfirmPasswordEntreprise.bind(this);
        this.isSchoolFormInvalid = this.isSchoolFormInvalid.bind(this);
        this.isEnterpriseFormInvalid = this.isEnterpriseFormInvalid.bind(this);
        this.handleFormSchoolButtonSubmit = this.handleFormSchoolButtonSubmit.bind(this);
        this.handleFormEnterpriseButtonSubmit = this.handleFormEnterpriseButtonSubmit.bind(this);
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

    handleSubmit(event) {
        event.preventDefault();
        var signupRequest;
        if(this.state.typeForm.value === TYPE_FORM_SCHOOL){
            signupRequest = {
                firstName: this.state.firstName.value,
                lastName: this.state.lastName.value,
                email: this.state.email.value,
                password: this.state.password.value,
                typeForm: this.state.typeForm.value,
                typeRole : this.state.roleFormSchool,
            };
        }
        else if(this.state.typeForm.value === TYPE_FORM_ENTERPRISE){
            signupRequest = {
                email: this.state.emailEnt.value,
                password: this.state.passwordEnt.value,
                typeForm: this.state.typeForm.value,
                enterpriseName: this.state.enterpriseName.value,
                typeRole : 'enterprise'
            };
            console.log(signupRequest);
        }

        signup(signupRequest)
            .then(response => {
                notification.success({
                    message: APPLICATION_NAME,
                    description: "Merci! Vous avez été enregistré avec succès. Veuillez-vous connecter pour continuer!",
                });
                this.props.history.push("/login");
            }).catch(error => {
            notification.error({
                message: APPLICATION_NAME,
                description: /*error.message ||*/ TEXT_REQUEST_ERROR_TRYAGAIN
            });
        });
    }

    isSchoolFormInvalid() {
        return !(this.state.firstName.validateStatus === VALIDATION_SUCCESS &&
            this.state.lastName.validateStatus === VALIDATION_SUCCESS &&
            this.state.email.validateStatus === VALIDATION_SUCCESS &&
            this.state.password.validateStatus === VALIDATION_SUCCESS &&
            this.state.confirmPassword.validateStatus === VALIDATION_SUCCESS
        );
    }

    isEnterpriseFormInvalid() {
        return !(this.state.enterpriseName.validateStatus === VALIDATION_SUCCESS &&
            this.state.emailEnt.validateStatus === VALIDATION_SUCCESS &&
            this.state.passwordEnt.validateStatus === VALIDATION_SUCCESS &&
            this.state.confirmPasswordEnt.validateStatus === VALIDATION_SUCCESS
        );
    }

    handleFormSchoolButtonSubmit(){
        this.setState({
            typeForm: {
                value: TYPE_FORM_SCHOOL
            }
        });
    }

    handleFormEnterpriseButtonSubmit(){
        this.setState({
            typeForm: {
                value: TYPE_FORM_ENTERPRISE
            }
        });
    }

    handleChangeRole(e){
        this.setState({
            roleFormSchool : e.target.value
        });
    }

    render() {
        return (
            <div className="signup-container">
                <div className="signup-content">

                    <Row>
                        <Col span={4}></Col>
                        <Col span={15}>
                            <h1 className="page-title">S'inscrire</h1>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab={<span><Icon type="user-add"/>{CHAMP_TYPE_SCHOOL}</span>} key="1">
                                    <Form onSubmit={this.handleSubmit} className="signup-form">
                                        <Row>
                                            <Col span={10}>
                                                <FormItem
                                                    label={CHAMP_PRENOM}
                                                    validateStatus={this.state.firstName.validateStatus}
                                                    help={this.state.firstName.errorMsg}>
                                                    <Input
                                                        size="large"
                                                        name="firstName"
                                                        autoComplete="on"
                                                        placeholder={CHAMP_PRENOM}
                                                        value={this.state.firstName.value}
                                                        onChange={(event) => this.handleInputChange(event, this.validateName)}/>
                                                </FormItem>
                                            </Col>
                                            <Col span={4}></Col>
                                            <Col span={10}>
                                                <FormItem
                                                    label={CHAMP_NOM}
                                                    validateStatus={this.state.lastName.validateStatus}
                                                    help={this.state.lastName.errorMsg}>
                                                    <Input
                                                        size="large"
                                                        name="lastName"
                                                        autoComplete="on"
                                                        placeholder={CHAMP_NOM}
                                                        value={this.state.lastName.value}
                                                        onChange={(event) => this.handleInputChange(event, this.validateName)}/>
                                                </FormItem>
                                            </Col>
                                        </Row>
                                        <FormItem
                                            label="Email"
                                            hasFeedback
                                            validateStatus={this.state.email.validateStatus}
                                            help={this.state.email.errorMsg}>
                                            <Input
                                                size="large"
                                                name="email"
                                                type="email"
                                                autoComplete="on"
                                                placeholder={CHAMP_EMAIL}
                                                value={this.state.email.value}
                                                onBlur={this.validateEmailAvailability}
                                                onChange={(event) => this.handleInputChange(event, this.validateEmail)}/>
                                        </FormItem>
                                        <FormItem
                                            label={CHAMP_PASSWORD}
                                            validateStatus={this.state.password.validateStatus}
                                            help={this.state.password.errorMsg}>
                                            <Input
                                                size="large"
                                                name="password"
                                                type="password"
                                                autoComplete="on"
                                                placeholder={CHAMP_PASSWORD_DESCRIPTION}
                                                value={this.state.password.value}
                                                onChange={(event) => this.handleInputChange(event, this.validatePassword)}/>
                                        </FormItem>
                                        <FormItem
                                            label={CHAMP_CONFIRM_PASSWORD}
                                            validateStatus={this.state.confirmPassword.validateStatus}
                                            help={this.state.confirmPassword.errorMsg}>
                                            <Input
                                                size="large"
                                                name="confirmPassword"
                                                type="password"
                                                autoComplete="on"
                                                placeholder={CHAMP_CONFIRM_PASSWORD}
                                                value={this.state.confirmPassword.value}
                                                onChange={(event) => this.handleInputChange(event, this.validateConfirmPassword)}/>
                                        </FormItem>
                                        <br/>
                                        <br/>
                                        <Row gutter="16px">
                                            <Col span={8}/>
                                            <Col span={10}>
                                                <FormItem>
                                                    <h4>Quel est votre position : </h4>
                                                    <div id="div-position-school" style={{marginLeft: 10}}>
                                                        <RadioGroup onChange={(e) => this.handleChangeRole(e)} defaultValue="student">
                                                            <RadioButton value="student">Étudiant</RadioButton>
                                                            <RadioButton value="monitor">Enseignant</RadioButton>
                                                        </RadioGroup>
                                                    </div>
                                                </FormItem>
                                            </Col>
                                            <Col span={6} />
                                        </Row>
                                        <br/>
                                        <br/>
                                        <FormItem>
                                            <Button type="primary"
                                                    htmlType="submit"
                                                    size="large"
                                                    className="signup-form-button btnCustom"
                                                    onClick={() => this.handleFormSchoolButtonSubmit()}
                                                    disabled={this.isSchoolFormInvalid()}>S'inscrire</Button>
                                            <span id="spanOu"> {CHAMP_ALREADY_REGISTER} </span>
                                            <Link to="/login">
                                                <ButtonStic animated className="btnInscrire" color='grey'>
                                                    <ButtonStic.Content visible>Connectez-vous à la place</ButtonStic.Content>
                                                    <ButtonStic.Content hidden>
                                                        <IconStic color='yellow' name='users'/>
                                                    </ButtonStic.Content>
                                                </ButtonStic>
                                            </Link>
                                        </FormItem>
                                    </Form>
                                </TabPane>
                                <TabPane tab={<span><Icon type="usergroup-add"/>{CHAMP_TYPE_ENTERPRISE}</span>} key="2">
                                    <Form onSubmit={this.handleSubmit} className="signup-form">
                                        <FormItem
                                            label={CHAMP_NOM_ENTERPRISE}
                                            validateStatus={this.state.enterpriseName.validateStatus}
                                            help={this.state.enterpriseName.errorMsg}>
                                            <Input
                                                size="large"
                                                name="enterpriseName"
                                                autoComplete="on"
                                                placeholder={CHAMP_NOM_ENTERPRISE}
                                                value={this.state.enterpriseName.value}
                                                onChange={(event) => this.handleInputChange(event, this.validateEnterpriseName)}/>
                                        </FormItem>
                                        <FormItem
                                            label="Email"
                                            hasFeedback
                                            validateStatus={this.state.emailEnt.validateStatus}
                                            help={this.state.emailEnt.errorMsg}>
                                            <Input
                                                size="large"
                                                name="emailEnt"
                                                type="email"
                                                autoComplete="on"
                                                placeholder={CHAMP_EMAIL}
                                                value={this.state.emailEnt.value}
                                                onBlur={this.validateEmailEntrepriseAvailability}
                                                onChange={(event) => this.handleInputChange(event, this.validateEmail)}/>
                                        </FormItem>
                                        <FormItem
                                            label={CHAMP_PASSWORD}
                                            validateStatus={this.state.passwordEnt.validateStatus}
                                            help={this.state.passwordEnt.errorMsg}>
                                            <Input
                                                size="large"
                                                name="passwordEnt"
                                                type="password"
                                                autoComplete="on"
                                                placeholder={CHAMP_PASSWORD_DESCRIPTION}
                                                value={this.state.passwordEnt.value}
                                                onChange={(event) => this.handleInputChange(event, this.validatePassword)}/>
                                        </FormItem>
                                        <FormItem
                                            label={CHAMP_CONFIRM_PASSWORD}
                                            validateStatus={this.state.confirmPasswordEnt.validateStatus}
                                            help={this.state.confirmPasswordEnt.errorMsg}>
                                            <Input
                                                size="large"
                                                name="confirmPasswordEnt"
                                                type="password"
                                                autoComplete="on"
                                                placeholder={CHAMP_CONFIRM_PASSWORD}
                                                value={this.state.confirmPasswordEnt.value}
                                                onChange={(event) => this.handleInputChange(event,
                                                    this.validateConfirmPasswordEntreprise)}/>
                                        </FormItem>
                                        <FormItem>
                                            <Button type="primary"
                                                    htmlType="submit"
                                                    size="large"
                                                    className="signup-form-button btnCustom"
                                                    onClick={() => this.handleFormEnterpriseButtonSubmit()}
                                                    disabled={this.isEnterpriseFormInvalid()}>S'inscrire</Button>
                                            <span id="spanOu"> {CHAMP_ALREADY_REGISTER} </span>

                                            <Link to="/login">
                                                <ButtonStic animated className="btnInscrire" color='grey'>
                                                    <ButtonStic.Content visible>Connectez-vous à la place</ButtonStic.Content>
                                                    <ButtonStic.Content hidden>
                                                        <IconStic color='yellow' name='users'/>
                                                    </ButtonStic.Content>
                                                </ButtonStic>
                                            </Link>
                                        </FormItem>
                                    </Form>
                                </TabPane>
                            </Tabs>

                        </Col>
                        <Col span={2}/>
                    </Row>
                </div>
            </div>
        );
    }

    // Section validation

    validateName = (name) => {
        if (name.length < NAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Le nom est trop court (Minimum ${NAME_MIN_LENGTH} charactères nécessaires.)`
            }
        } else if (name.length > NAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Le nom est trop long (Maximum ${NAME_MAX_LENGTH} charactères autorisés.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    };

    validateEnterpriseName = (name) => {
        if (name.length < ENTERPRISE_NAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Le nom de l'entreprise est trop court (Minimum ${ENTERPRISE_NAME_MIN_LENGTH} charactères.)`
            }
        } else if (name.length > ENTERPRISE_NAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Le nom de l'entreprise est trop long (Maximum ${ENTERPRISE_NAME_MAX_LENGTH} charactères.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    };

    validateEmail = (email) => {
        if (!email) {
            return {
                validateStatus: 'error',
                errorMsg: 'E-mail est requis!'
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if (!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: 'E-mail rentré n\'est pas valide'
            }
        }

        if (email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `E-mail est très long (Maximum ${EMAIL_MAX_LENGTH} charactères)`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    };


    validateEmailAvailability() {
        // First check for client side errors in email
        const emailValue = this.state.email.value;
        const emailValidation = this.validateEmail(emailValue);

        if (emailValidation.validateStatus === 'error') {
            this.setState({
                email: {
                    value: emailValue,
                    ...emailValidation
                }
            });
            return;
        }

        this.setState({
            email: {
                value: emailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkEmailAvailability(emailValue)
            .then(response => {
                if (response.available) {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'error',
                            errorMsg: ERROR_EMAIL_ALREADY_REGISTER
                        }
                    });
                }
            }).catch(error => {
            this.setState({
                email: {
                    value: emailValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validateEmailEntrepriseAvailability() {
        const emailValue = this.state.emailEnt.value;
        const emailValidation = this.validateEmail(emailValue);

        if (emailValidation.validateStatus === 'error') {
            this.setState({
                emailEnt: {
                    value: emailValue,
                    ...emailValidation
                }
            });
            return;
        }

        this.setState({
            emailEnt: {
                value: emailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkEmailAvailability(emailValue)
            .then(response => {
                if (response.available) {
                    this.setState({
                        emailEnt: {
                            value: emailValue,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        emailEnt: {
                            value: emailValue,
                            validateStatus: 'error',
                            errorMsg: ERROR_EMAIL_ALREADY_REGISTER
                        }
                    });
                }
            }).catch(error => {
            this.setState({
                emailEnt: {
                    value: emailValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validatePassword = (password) => {
        if (password.length < PASSWORD_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `${CHAMP_PASSWORD} trop court (Minimum ${PASSWORD_MIN_LENGTH} charactères.)`
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `${CHAMP_PASSWORD} trop long (Maximum ${PASSWORD_MAX_LENGTH} charactères.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    };

    validateConfirmPassword = (password) => {

        if (password !== this.state.password.value) {
            return {
                validateStatus: 'error',
                errorMsg: ERROR_CONFIRM_PASSWORD
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    };

    validateConfirmPasswordEntreprise = (password) => {
        if (password !== this.state.passwordEnt.value) {
            return {
                validateStatus: 'error',
                errorMsg: ERROR_CONFIRM_PASSWORD
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

}

export default Signup;