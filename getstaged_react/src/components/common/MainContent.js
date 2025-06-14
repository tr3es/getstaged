import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import './MainContent.css';
import {Layout, Menu, Icon, Tabs, Row, Col, notification} from 'antd';
import OfferList from '../offer/OfferList';
import StudentList from '../user/StudentList';
import StudentPeriodeList from '../students/StudentPeriodeList';
import {
    TYPE_FORM_STUDENT, TYPE_FORM_MONITOR,
    TYPE_FORM_ENTERPRISE, TYPE_FORM_COORDINATOR, API_BASE_URL
} from '../constants/Constants';
import EntrepriseMenuContent from '../votreEntreprise/EntrepriseMenuContent';
import CVUploadDownload from "../documents/cv/CVUploadDownload";
import EntenteUploadDownload from "../documents/entente/EntenteStageUploadDownload";
import RapportUploadDownload from "../documents/rapportStage/RapportUploadDownload";
import StudentOffre from "../offer/StudentOffre";
import Students from "../monitor/Students";
import {getAllNotifications} from "../utils/Utils"
import MonitorList from "../user/monitor/MonitorList";
import StudentDetailList from "../user/student/StudentDetailList";
import OffrePeriode from "../user/Supervisor/OffrePeriode";
import CVCoordList from "../documents/cv/CVCoordList";
import MyOffers from "../students/MyOffers";
import {Icon as IconStic} from 'semantic-ui-react'

const {SubMenu} = Menu;
const {Content} = Layout;
const TabPane = Tabs.TabPane;

class MainContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: false,
            stage: null,
            isLoading: false,
            notifications: [],
            sizeNotifications: 0
        };

        this.loadNotificationList = this.loadNotificationList.bind(this);
        this.printNotification = this.printNotification.bind(this);
    }

    componentWillMount() {
        this.setState({
            currentUser: this.props.currentUser,
            isAuthenticated: this.props.isAuthenticated,
        });
        if (this.props.currentUser.typeRole === TYPE_FORM_STUDENT) {
            fetch(API_BASE_URL + "/students/stage/get/" + this.props.currentUser.id)
                .then(response => response.json())
                .then(data => this.setState({stage: data}))
                .catch(error => {
                    console.log(error)
                });
            console.log("stage  => " + this.state.stage);
        }
        //this.loadNotificationList();
        /*console.log("Notifs 2 => ", this.state.notifications);
        this.printNotification();*/
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


    render() {
        console.log('MainContent => ', this.state.currentUser.typeRole);
        console.log('MainContent => ', this.state.currentUser);
        console.log("stage  => " + this.state.stage);
        return (
            <Content style={{padding: '0 50px'}}>
                <Layout style={{padding: '24px 0', background: '#fff', margin: '16px 0'}}>
                    {this.state.currentUser.typeRole === TYPE_FORM_STUDENT ? (
                        <Tabs
                            tabPosition={'center'}
                            size={'default'}
                        >
                            <TabPane tab={<span><IconStic bordered name="calendar plus" color="yellow"/>Choisir les périodes</span>}
                                     key="3">
                                <StudentPeriodeList currentUser={this.state.currentUser}
                                                    email={this.state.currentUser.email}
                                                    isAuthenticated={this.state.isAuthenticated} {...this.props}/>
                            </TabPane>
                            <TabPane tab={<span><IconStic bordered name="upload" color="yellow"/>Mes documents</span>}
                                     key="4">
                                <Content style={{marginTop: "2%", marginBottom: "2%"}}>
                                    <Row gutter={8}>
                                        <Col span={6} />
                                        <Col span={12}>
                                            <h1 className="titre-offer">
                                                <IconStic name="file word" color="yellow"/>
                                                Mon Cv
                                            </h1>
                                            <CVUploadDownload currentUser={this.state.currentUser}
                                                              email={this.state.currentUser.email}
                                                              isAuthenticated={this.state.isAuthenticated} {...this.props}/>
                                        </Col>
                                        <Col span={6} />
                                    </Row>

                                </Content>
                            </TabPane>
                            {this.state.stage === null ? (
                                <TabPane tab={<span><IconStic bordered name="file pdf" color="yellow"/>Offres diponibles</span>} key="5">
                                    <Content style={{padding: '0 24px', minHeight: 380}}>
                                        <h1 className="titre-offer" style={{marginLeft: '30%'}}>Voici les offres
                                            disponibles</h1>
                                        <OfferList
                                            isAuthenticated={this.state.isAuthenticated}
                                            currentUser={this.state.currentUser}
                                            {...this.props}
                                        />
                                    </Content>
                                </TabPane>
                            ) : null}
                            {this.state.stage === null ? (
                                <TabPane tab={<span><IconStic bordered name="folder" color="yellow"/>Mes offres</span>}
                                         key="6">
                                    <Content style={{
                                        padding: '0 24px',
                                        minHeight: 380,
                                        position: "center"
                                    }}>
                                        <h1 className="titre-offer">Offres pour lesquelles vous avez appliqué</h1>
                                        <MyOffers {...this.props}/>
                                    </Content>
                                </TabPane>
                            ) : null}
                            {this.state.stage !== null ? (
                                <TabPane tab={<span><IconStic circular name="user circle" color="yellow"/>Stage</span>} key="7">
                                    <Content>
                                        <div>
                                            <Row gutter={8}>
                                                <Col span={2} />
                                                <Col span={18}>
                                                    <h2 className="titre-offer">
                                                        <IconStic name="graduation cap" color="yellow"/>
                                                        Mon stage
                                                    </h2>
                                                    <br/>
                                                    <Row gutter={8}>
                                                        <Col span={12} >
                                                            <b>Programme: </b>{this.state.stage.offerResponse.programme.toString()}
                                                            <br/>
                                                            <b>{"Durée du stage (semaines): "}</b>{this.state.stage.offerResponse.duree.toString()}
                                                            <br/>
                                                            <b>{"Nombre de postes: "}</b>{this.state.stage.offerResponse.nombrePoste.toString()}
                                                            <br/>
                                                            <b>{"Taux horaire: "}</b>{this.state.stage.offerResponse.tauxHoraire.toString()}
                                                            <br/>
                                                            <h6>{"Description du mandat: "}</h6>
                                                            {this.state.stage.offerResponse.description}
                                                            <h6>{"Exigences pour le stage: "}</h6>
                                                            {this.state.stage.offerResponse.exigences.toString()}
                                                        </Col>
                                                        <Col span={12} >
                                                            <b>{"Période du stage: "}</b>{this.state.stage.offerResponse.periode.saison.concat(" ")
                                                            .concat(this.state.stage.offerResponse.periode.annee)}
                                                            <br/>
                                                            <b>{"Titre du poste: "}</b>{this.state.stage.offerResponse.titrePoste.toString()}
                                                            <br/>
                                                            <b>{"Horaire de travail: "}</b>{this.state.stage.offerResponse.horaireTravail}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col span={4} />
                                            </Row>
                                        </div>
                                        <br/>
                                        <hr/>
                                        <div className="files-stage-student">
                                            <Row gutter={8}>
                                                <Col span={2} />
                                                <Col span={10}>
                                                    <h2 className="titre-offer">
                                                        <IconStic name="file word" color="yellow"/>
                                                        Mon entente de stage
                                                    </h2>
                                                    <EntenteUploadDownload currentUser={this.state.currentUser}
                                                                           email={this.state.currentUser.email}
                                                                           isAuthenticated={this.state.isAuthenticated} {...this.props}/>
                                                </Col>
                                                <Col span={10}>
                                                    <h2 className="titre-offer">
                                                        <IconStic name="file word" color="yellow"/>
                                                        Mon rapport de stage
                                                    </h2>
                                                    <RapportUploadDownload currentUser={this.state.currentUser}
                                                                           email={this.state.currentUser.email}
                                                                           isAuthenticated={this.state.isAuthenticated} {...this.props}/>
                                                </Col>
                                                <Col span={2} />
                                            </Row>
                                        </div>
                                    </Content>
                                </TabPane>
                            ) : null}
                        </Tabs>
                    ) : null}
                    {
                        this.state.currentUser.typeRole === TYPE_FORM_COORDINATOR ? (

                            <Tabs defaultActiveKey="1">
                                <TabPane style={{
                                    paddingLeft: '0px'
                                }} tab={<span><IconStic circular name="home" color="yellow"/>Accueil</span>} key="1">
                                    <Content style={{
                                        padding: '0 14px',
                                        minHeight: 480,
                                    }}>
                                        <div id="div-periode">
                                            <h1 className="titre-periode">
                                                <IconStic name="calendar alternate outline" className="icon-space" color="grey"/>
                                                {"Périodes disponibles pour les stages"}
                                            </h1>

                                            <p className="titre-periode">{"Une période active permet aux entreprises de déposer des offres pour cette Période"
                                            + " et aux étudiants de postuler pour ces offres"}</p>
                                            <OffrePeriode
                                                isAuthenticated={this.state.isAuthenticated}
                                                currentUser={this.state.currentUser}
                                                {...this.props}
                                            />
                                        </div>
                                        <hr/>
                                        <h1 id="titre-gestion"><IconStic name="folder open" className="icon-space" color="grey"/>Gestion</h1>
                                        <Tabs
                                            tabPosition={'left'}
                                            size={'default'}
                                        >
                                            <TabPane
                                                tab={<span><Icon type="file-pdf" theme="outlined"/>Offres</span>}
                                                key="1">
                                                <Content style={{
                                                    padding: '0 24px',
                                                    minHeight: 380,
                                                    paddingLeft: '0px'
                                                }}>
                                                    <h1 className="titre-offer">Les offres</h1>
                                                    <OfferList
                                                        isAuthenticated={this.state.isAuthenticated}
                                                        currentUser={this.state.currentUser}
                                                        {...this.props}
                                                    />
                                                </Content>
                                            </TabPane>
                                            <TabPane tab={<span><Icon type="team"/>Assigner Moniteurs</span>}
                                                     key="2">
                                                <Content style={{
                                                    padding: '0 24px',
                                                    minHeight: 380,
                                                    paddingLeft: '40px'
                                                }}>
                                                    <h1 className="titre-offer">Assigner les moniteurs</h1>
                                                    <StudentList
                                                        isAuthenticated={this.state.isAuthenticated}
                                                        currentUser={this.state.currentUser}
                                                        {...this.props}
                                                    />
                                                </Content>
                                            </TabPane>
                                            <TabPane
                                                tab={<span><Icon type="file-pdf"
                                                                 theme="outlined"/>Consulter les C.V. des étudiants</span>}
                                                key="3">
                                                <Content style={{
                                                    padding: '0 24px',
                                                    minHeight: 380,
                                                    paddingLeft: '15px'
                                                }}>
                                                    <CVCoordList isAuthenticated={this.state.isAuthenticated}
                                                                 currentUser={this.state.currentUser}
                                                                 {...this.props}/>
                                                </Content>
                                            </TabPane>
                                        </Tabs>
                                    </Content>

                                </TabPane>
                                <TabPane tab={<span>
                                                <IconStic circular name="users" color="yellow"/>
                                                 Admnistration des utilisateurs
                                                </span>}
                                         key="2">
                                    <Content>
                                        <Tabs
                                            tabPosition={'left'}
                                            size={'default'}
                                        >
                                            <TabPane
                                                tab={<span><Icon type="team"
                                                                 theme="outlined"/>Voir les étudiants</span>}
                                                key="5">
                                                <Content style={{
                                                    padding: '0 24px',
                                                    minHeight: 380,
                                                    paddingLeft: '40px'
                                                }}>
                                                    <h1 className="titre-offer">Tous les étudiants inscrits</h1>
                                                    <StudentDetailList isAuthenticated={this.state.isAuthenticated}
                                                                       currentUser={this.state.currentUser}
                                                                       {...this.props}/>
                                                </Content>
                                            </TabPane>
                                            <TabPane
                                                tab={<span><Icon type="team"
                                                                 theme="outlined"/>Voir les moniteurs</span>}
                                                key="4">
                                                <Content style={{
                                                    padding: '0 24px',
                                                    minHeight: 380,
                                                    paddingLeft: '40px'
                                                }}>
                                                    <h1 className="titre-offer">Tous les moniteurs inscrits</h1>
                                                    <MonitorList isAuthenticated={this.state.isAuthenticated}
                                                                 currentUser={this.state.currentUser}
                                                                 {...this.props}/>
                                                </Content>
                                            </TabPane>
                                        </Tabs>

                                    </Content>
                                </TabPane>
                            </Tabs>
                        ) : null
                    }
                    {
                        this.state.currentUser.typeRole === TYPE_FORM_ENTERPRISE ? (
                            <EntrepriseMenuContent isAuthenticated={this.state.isAuthenticated}
                                                   currentUser={this.state.currentUser} {...this.props}/>
                        ) : null
                    }
                    {
                        this.state.currentUser.typeRole === TYPE_FORM_MONITOR ? (
                            <Tabs
                                tabPosition={"top"}
                                size={'default'}
                            >
                                <TabPane tab={<span><IconStic circular name="users" color="yellow"/>Mes Étudiants</span>}
                                         width={"100%"}
                                         key="2">
                                    <Content style={{padding: '0 24px', minHeight: 300, paddingLeft: '40px'}}>
                                        <h1 className="titre-offer">
                                            <IconStic name="id card" color="grey"/>
                                            Mes étudiants
                                        </h1>
                                        <Students {...this.props} />
                                    </Content>
                                </TabPane>
                            </Tabs>
                        ) : null
                    }
                </Layout>
            </Content>
        );
    }
}

export default withRouter(MainContent);
