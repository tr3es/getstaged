import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

class NotificationManager extends Component{
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
    }
}

export default withRouter(NotificationManager);