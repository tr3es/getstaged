import React from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppFooter.css';
import {Layout, Row, Col, Icon} from 'antd';
import {APPLICATION_NAME} from '../constants/Constants'
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {
    faInstagram,
    faGoogle,
    faFacebook,
    faTwitter
} from '@fortawesome/free-brands-svg-icons';

const Footer = Layout.Footer;
library.add(
    fab,
    faGoogle,
    faFacebook,
    faTwitter
);

const AppFooter = () => {
    return (
        <Footer className="app-footer"
                style={{textAlign: 'center'}}
                zindex="1"
        >
            <Row>
                <Col span={2}></Col>
                <Col span={6}>
                    <h4 className="h05">{APPLICATION_NAME}.</h4>
                    <hr className="hrFoot"/>
                    <p className="textFoot">GetStaged est une application qui permet aux étudiants d'obtenir un stage en
                        ligne. Grâce à
                        cette application, cela facilitera la gestion des informations.</p>
                </Col>
                <Col span={8}>
                    <h4 className="h05">Nous joindre.</h4>
                    <hr className="hrFoot"/>
                    <div className="home-social-list">
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
                </Col>
                <Col span={8} id="copFooter">
                    <h4 className="h05">Équipe {APPLICATION_NAME}.</h4>
                    <hr className="hrFoot"/>
                    <div >
                        <h6>Ivan Nguemegne</h6>
                        <h6>Gabriel Labbé</h6>
                        <h6>Nikita Doroshenko</h6>
                        <h6>Cégep André-Laurendeau</h6>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={6}></Col>
                <Col span={12}>
                    <div id="copyright">
                        <span>© Copyright GetStaged 2018-2019. </span>
                        <span>Design by Ivan - EQ3</span>
                    </div>
                </Col>
                <Col span={6}></Col>
            </Row>
        </Footer>
    );
};
export default withRouter(AppFooter);