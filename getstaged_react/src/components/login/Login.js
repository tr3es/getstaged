import React, {Component} from 'react';
import {login} from '../utils/Utils';
import './Login.css';
import {Link} from 'react-router-dom';
import Cookies from 'universal-cookie';
import {ACCESS_TOKEN, APPLICATION_NAME, CHAMP_PASSWORD, TEXT_REQUEST_ERROR_TRYAGAIN} from '../constants/Constants';
import {Form, Input, Button, Icon, notification, Col, Row, Checkbox} from 'antd';
//import '../semantic/dist/semantic.min.css';
import {Button as ButtonStic, Icon as IconStic} from 'semantic-ui-react'

const FormItem = Form.Item;

class Login extends Component {
    render() {
        const AntWrappedLoginForm = Form.create()(LoginForm);
        return (
            <div className="login-container">
                <Row>
                    <Col span={7}/>
                    <Col span={9}>
                        <h1 className="page-title">Connexion</h1>
                        <div className="login-content">
                            <AntWrappedLoginForm onLogin={this.props.onLogin}/>
                        </div>
                    </Col>
                    <Col span={4}/>
                </Row>

            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isRemember: false
        };

        this.handleRememberMe = this.handleRememberMe.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        const cookies = new Cookies();
        if (cookies.get('email') != null) {
            this.setState({
                email: cookies.get('email'),
                isRemember: true
            });
        }
    }

    handleRememberMe = (event) => {
        const {getFieldValue} = this.props.form;
        const cookies = new Cookies();
        if (event.target.checked === true)
            cookies.set('email', getFieldValue('email'), {path: '/'});
        else
            cookies.remove('email', {path: '/'});

        this.setState({
            isRemember: event.target.checked
        });
    };

    handleSubmit(event) {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const loginRequest = Object.assign({}, values);
                login(loginRequest)
                    .then(response => {
                        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                        this.props.onLogin();
                    }).catch(error => {
                    if (error.status === 401) {
                        notification.error({
                            message: APPLICATION_NAME,
                            description: 'Votre E-mail ou mot de passe est incorrect. Veuillez réessayer!'
                        });
                    } else {
                        notification.error({
                            message: APPLICATION_NAME,
                            description: TEXT_REQUEST_ERROR_TRYAGAIN
                        });
                    }
                });
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const rememberMe = this.state.isRemember;

        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('email', {
                        initialValue: this.state.email,
                        rules: [{required: true, message: 'L\'E-mail est requis!'}],
                    })(
                        <Input
                            prefix={<Icon type="user"/>}
                            size="large"
                            name="email"
                            placeholder="Email"/>
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: 'Le mot de passe est requis!'}],
                    })(
                        <Input
                            prefix={<Icon type="lock"/>}
                            size="large"
                            name="password"
                            type="password"
                            placeholder={CHAMP_PASSWORD}/>
                    )}
                </FormItem>
                <FormItem>
                    <Checkbox
                        defaultChecked={false}
                        checked={rememberMe}
                        onChange={(event) => this.handleRememberMe(event)}
                        value="rememberMe"> Se souvenir de mon e-mail</Checkbox>
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button btnCustom">Se
                        connecter</Button>
                    <span id="spanOu">Ou</span>

                    <Link to="/signup">
                        <ButtonStic animated className="btnInscrire" color='grey'>
                            <ButtonStic.Content visible>S'incrire maintenant!</ButtonStic.Content>
                            <ButtonStic.Content hidden>
                                <IconStic color='yellow' name='users'/>
                            </ButtonStic.Content>
                        </ButtonStic>
                    </Link>
                </FormItem>
            </Form>
        );
    }
}


export default Login;