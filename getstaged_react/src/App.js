import React, {Component} from 'react';
//*import logo from './logo.svg';
import {Route, withRouter, Switch} from 'react-router-dom';
import {TransitionGroup, CSSTransition} from "react-transition-group";

import './App.css';
import 'antd/dist/antd.css';
import Profile from './components/user/Profile'
import Login from './components/login/Login'
import Signup from './components/signup/Signup';
import {getCurrentUser} from './components/utils/Utils';
import VotreEntreprise from './components/votreEntreprise/VotreEntreprise';
import Offres from './components/votreEntreprise/Offres';
import EvaluationVue from './components/votreEntreprise/EvaluationVue'
import EvaluationStagiaire from './components/votreEntreprise/EvaluationStagiaire';
import NouvelleOffre from './components/votreEntreprise/NouvelleOffre';
import OffreVue from './components/votreEntreprise/OffreVue';
import {getSampleStage} from './components/votreEntreprise/StageSample';
import AppHeader from './components/common/AppHeader';
import AppFooter from './components/common/AppFooter';
import MainContent from './components/common/MainContent';
import PrivateRoute from './components/common/PrivateRoute';
import LoadingIndicator from './components/common/LoadingIndicator';
import NotFound from './components/error/NotFound';

import {ACCESS_TOKEN, APPLICATION_NAME} from "./components/constants/Constants";
import {Layout, notification} from 'antd';
import {getAllNotifications} from "./components/utils/Utils"
const {Content} = Layout;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: false,
            isLoading: false,
            notifications: [],
            sizeNotifications: 0
        };

        this.handleLogout = this.handleLogout.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.printNotification = this.printNotification.bind(this);

        notification.config({
            placement: 'topRight',
            top: 70,
            duration: 3,
        });
    }

    printNotification() {
        console.log("PRINT  NOTIFSS");
        console.log(this.state.notifications);
        this.state.notifications.map((notif) => {
            console.log("PASSER LOPPP", notif.statusNotification.toString().toLowerCase());
            notification[notif.statusNotification.toString().toLowerCase()]({
                message: notif.title,
                description: notif.message,
                duration: 8,
                style: {
                    width: 400,
                },
            });
        });
    }

    componentWillMount() {
        this.loadCurrentUser();
    }

    loadCurrentUser() {
        this.setState({
            isLoading: true
        });
        getCurrentUser()
            .then(response => {
                this.setState({
                    currentUser: response,
                    isAuthenticated: true,
                    isLoading: false
                });
            }).catch(error => {
            this.setState({
                isLoading: false
            });
        });

        console.log(this.state);
    }

    handleLogin() {
        notification.success({
            message: APPLICATION_NAME,
            description: "Vous êtes connecté avec succès.",
        });
        this.loadCurrentUser();
        console.log(this.state.currentUser);
        this.props.history.push("/Home");
        //this.loadNotificationList();
    }

    loadNotificationList() {
        let promise;
        promise = getAllNotifications(this.props.currentUser.id);

        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        if (this.state.notifications.length !== 0) {
            this.setState({
                notifications: [],
            });
        }

        promise
            .then(response => {
                const notifications = this.state.notifications.slice();
                this.setState({
                    notifications: notifications.concat(response)
                });
                console.log("Notifs => ", this.state.notifications);
                console.log("Notifs 2 => ", this.state.notifications);
                this.printNotification();

            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });

    }

    handleLogout(redirectTo = "/login", notificationType = "success", description = "Vous êtes déconnecté avec succès.") {
        localStorage.removeItem(ACCESS_TOKEN);

        this.setState({
            currentUser: null,
            isAuthenticated: false
        });

        this.props.history.push(redirectTo);

        notification[notificationType]({
            message: APPLICATION_NAME,
            description: description,
        });
    }


    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator/>
        }
        return (

            /*<TransitionGroup>
                <CSSTransition
                    key={location.key}
                    timeout={{ enter: 300, exit: 300 }}
                    classNames={'fade'}
                >*/
            <Layout className="app-container">
                <AppHeader isAuthenticated={this.state.isAuthenticated}
                           currentUser={this.state.currentUser}
                           onLogout={this.handleLogout}/>

                <Content className="app-content">
                    <div className="container">
                        <Switch>
                            <Route exact path="/"/>
                            <PrivateRoute authenticated={this.state.isAuthenticated} path="/Home"
                                          component={MainContent}
                                          handleLogout={this.handleLogout}
                                          currentUser={this.state.currentUser}/>
                            <Route path="/login"
                                   render={(props) => <Login onLogin={this.handleLogin} {...props} />}/>
                            <Route path="/signup" component={Signup}/>
                            <Route path="/users/:username"
                                   render={(props) => <Profile isAuthenticated={this.state.isAuthenticated}
                                                               currentUser={this.state.currentUser} {...props}  />}>
                            </Route>
                            <Route path="/VotreEntreprise/NouvelleOffre"
                                   render={(props) => <NouvelleOffre isAuthenticated={this.state.isAuthenticated}
                                                                     currentUser={this.state.currentUser} {...props}  />}/>
                            <Route path="/EvaluationStagiaire/:eval_id"
                                   render={(props) => <EvaluationVue {...props} />}/>
                            <Route component={NotFound}/>
                            <PrivateRoute authenticated={this.state.isAuthenticated} path="/offer/new"
                                          handleLogout={this.handleLogout}/>
                            <PrivateRoute authenticated={this.state.isAuthenticated} path="/offers"
                                          handleLogout={this.handleLogout}/>
                            <PrivateRoute authenticated={this.state.isAuthenticated} path="/offers"
                                          handleLogout={this.handleLogout}/>

                        </Switch>
                    </div>
                </Content>

                <AppFooter/>
            </Layout>
            /*</CSSTransition>
        </TransitionGroup>*/
            /*<Route exact path="/votreEntreprise" component={votreEntreprise}/>
                            <Route exact path="/votreEntreprise/offres" component={Offres}/>
                            <Route exact path="/votreEntreprise/nouvelleOffre" component={NouvelleOffre}/>*/

        );
    }
}

export default withRouter(App);
