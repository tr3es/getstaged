import React, {Component} from 'react';
import {getUserProfile} from '../utils/Utils';
import {Avatar, Tabs} from 'antd';
import {getAvatarColor} from '../utils/Colors';
import {formatDate} from '../utils/Helpers';
import LoadingIndicator from '../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../error/NotFound';
import ServerError from '../error/ServerError';
import {
    API_BASE_URL,
    TYPE_FORM_COORDINATOR,
    TYPE_FORM_ENTERPRISE,
    TYPE_FORM_MONITOR,
    TYPE_FORM_STUDENT
} from "../constants/Constants";

const TabPane = Tabs.TabPane;

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
            avatar: ""
        };
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    loadUserProfile(username) {
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
            .then(response => {
                this.setState({
                    user: response,
                    isLoading: false
                });
            }).catch(error => {
            if (error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    componentDidMount() {
        const username = this.props.match.params.username;
        let name;
        if (this.state.user.typeRole === TYPE_FORM_ENTERPRISE) {
            fetch(API_BASE_URL + '/entreprise/' + "?id=" + this.state.user.id)
                .then((response) => response.text())
                .then(data => this.setState({
                    avatar:
                        <Avatar className="user-avatar-circle"
                                style={{backgroundColor: getAvatarColor(data)}}>
                            {data[0].toUpperCase()}
                        </Avatar>
                }))
        }else {
            name = this.state.user.firstName;
            this.setState({
                avatar:
                    <Avatar className="user-avatar-circle"
                            style={{backgroundColor: getAvatarColor(name)}}>
                        {name[0].toUpperCase()}
                    </Avatar>
            })
        }
        this.loadUserProfile(username);
    }

    componentWillMount() {
        this.setState({
            user: this.props.currentUser
        })
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }
    }

    render() {
        console.log(this.props.currentUser);
        if (this.state.isLoading) {
            return <LoadingIndicator/>;
        }

        if (this.state.notFound) {
            return <NotFound/>;
        }

        if (this.state.serverError) {
            return <ServerError/>;
        }

        const tabBarStyle = {
            textAlign: 'center'
        };

        return (
            <div className="profile">
                {
                    this.state.user ? (
                        <div className="user-profile">
                            <div className="user-details">
                                <div className="user-avatar">
                                    {this.state.avatar}
                                </div>
                                <div className="user-summary">
                                    <div className="full-name">{this.state.user.name}</div>
                                    <div className="username">{this.state.user.email}</div>
                                    <div className="user-joined">
                                        Membre depuis {formatDate(this.state.user.joinedAt)}
                                    </div>
                                    <div className="user-offer-details">
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null
                }
            </div>

        );
    }
}

export default Profile;
