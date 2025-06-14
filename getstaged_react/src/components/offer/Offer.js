import React, { Component } from 'react';
import './Offer.css';
import { Avatar, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { Radio, Button } from 'antd';
import { getAvatarColor } from '../utils/Colors';
import { formatDateTime } from '../utils/Helpers';

const RadioGroup = Radio.Group;


class Offer extends Component {
    render() {
        console.log(this.props.offer);
        return(
            <div className="poll-header">
                <div className="poll-creator-info">
                    <Link className="creator-link" to={`/users/${this.props.offer.createdBy.email}`}>
                        <Avatar className="poll-creator-avatar"
                                style={{ backgroundColor: getAvatarColor(this.props.offer.createdBy.lastName)}} >
                            {this.props.offer.createdBy.lastName[0].toUpperCase()}
                        </Avatar>
                        <span className="poll-creator-name">
                            {this.props.offer.createdBy.lastName}
                        </span>
                        <span className="poll-creator-username">
                            @{this.props.offer.createdBy.lastName}
                        </span>
                        <span className="poll-creation-date">

                        </span>
                    </Link>
                </div>
            </div>
        );
    }

}

export default Offer;