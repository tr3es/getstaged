import React, {Component} from 'react';
import {Layout, Menu, Icon, Tabs} from 'antd';
import NouvelleOffre from "../votreEntreprise/NouvelleOffre";
import EntrepriseOfferList from "../offer/EntrepriseOfferList";
import EntrepriseStageList from "../stage/EntrepriseStageList";
import EvaluationStagiaire from "./EvaluationStagiaire";

const TabPane = Tabs.TabPane;
const {Content} = Layout;

class EntrepriseMenuContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isAuthenticated: false,
            isLoading: false
        };
    }

    componentWillMount() {
        this.setState({
            currentUser: this.props.currentUser,
            isAuthenticated: this.props.isAuthenticated,

        })
    }

    render() {
        const keybase = this.props.keybase;

        return (
            <Content style={{padding: '0 50px'}}>
                <Layout style={{padding: '24px 0', background: '#fff', margin: '16px 0'}}>
                    <Tabs
                        tabPosition={'left'}
                        size={'default'}
                    >
                        {this.props.content}
                        <TabPane tab={<span><Icon type="laptop"/>Nouvelle Offre</span>} key={keybase + 1}>
                            <Content style={{padding: '0 24px', minHeight: 300, paddingLeft: '40px'}}>
                                <NouvelleOffre isAuthenticated={this.state.isAuthenticated}
                                               currentUser={this.state.currentUser} {...this.props} />
                            </Content>
                        </TabPane>
                        <TabPane tab={<span><Icon type="user"/>Vos offres de stage</span>} key={keybase + 2}>
                            <Content style={{padding: '0 24px', minHeight: 300, paddingLeft: '40px'}}>
                                <h1>Vos offres de stage</h1>
                                <br/>
                                <div>
                                    <EntrepriseOfferList isAuthenticated={this.state.isAuthenticated}
                                                         currentUser={this.state.currentUser}
                                                         {...this.props} />
                                </div>
                            </Content>
                        </TabPane>

                        <TabPane tab={<span><Icon type="user"/>Vos Stagiaires</span>} key={keybase + 3}>
                            <Content style={{padding: '0 24px', minHeight: 300, paddingLeft: '40px'}}>
                                <h1>Vos Stagiaires</h1>
                                <br/>
                                <div>
                                    <EntrepriseStageList isAuthenticated={this.state.isAuthenticated}
                                                         currentUser={this.state.currentUser}
                                                         {...this.props} />
                                </div>
                            </Content>
                        </TabPane>
                    </Tabs>
                </Layout>
            </Content>
        );
    }
}

EntrepriseMenuContent.defaultProps = {
    keybase: 0,
}
export default EntrepriseMenuContent;
