import React, {Component} from 'react';
import './NotFound.css';
import {Link} from 'react-router-dom';
import {Button, Row, Col, Icon} from 'antd';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {
    faInstagram,
    faGoogle,
    faFacebook,
    faTwitter
} from '@fortawesome/free-brands-svg-icons';


class NotFound extends Component {

    render() {
        return (
            <div id="notFoundPage">
                <Row gutter={8} type="flex" justify="space-around" align="middle">
                    <Col span={7}/>
                    <Col span={11}>
                        <div id="notfound">
                            <div className="notfound">
                                <div className="notfound-404"></div>
                                <h1>404</h1>
                                <h2>Oops! Page non trouvée!</h2>
                                <p>Désolé mais la page que vous essayée d'accéder, n'existe pas ou a été enlevé.</p>
                                <Link to="/Home">
                                    <Button
                                        className="btn-back"
                                        type="primary"
                                        size="large">
                                        <Icon type="left-square" theme="filled" />
                                        Revenir</Button>
                                </Link>
                                <div className="home-social-list-notfound-page">
                                    <a className="iconBrand" href="https://fr-ca.facebook.com/CegepAndreLaurendeau/">
                                        <FontAwesomeIcon
                                            icon={faFacebook}
                                            color="#F9B10B"
                                            size="sm"
                                        />
                                    </a>
                                    <a className="iconBrand" href="https://twitter.com/claurendeau?lang=fr">
                                        <FontAwesomeIcon
                                            icon={faTwitter}
                                            color="#F9B10B"
                                            size="sm"
                                        />
                                    </a>
                                    <a className="iconBrand" href="https://accounts.google.com/ServiceLogin?service=mail">
                                        <FontAwesomeIcon
                                            icon={faGoogle}
                                            color="#F9B10B"
                                            size="sm"
                                        />
                                    </a>
                                    <a className="iconBrand" href="https://www.instagram.com/andre_laurendeau_sports/">
                                        <FontAwesomeIcon
                                            icon={faInstagram}
                                            color="#F9B10B"
                                            size="sm"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span={6}/>
                </Row>
            </div>
        );
    }
}

export default NotFound;