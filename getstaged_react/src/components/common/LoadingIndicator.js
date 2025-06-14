import React from 'react';
import {ScaleLoader} from 'react-spinners';
import {Col, Row} from 'antd';
import './AppFooter.css';
import {APPLICATION_NAME} from '../constants/Constants';

export default function LoadingIndicator(props) {
    return (
        <div className='-loading-block'>
            <Row>
                <Col span={8}/>
                <Col span={8}>
                    <h1 className="title-loader">{APPLICATION_NAME}</h1>
                </Col>
                <Col span={8}> </Col>
            </Row>
            <Row>
                <Col span={9}/>
                <Col span={7}>
                    <ScaleLoader
                        className="-loading"
                        height={100}
                        width={20}
                        margin={'20px'}
                        color={'#f9b10b'}
                    />
                </Col>
                <Col span={8}> </Col>
            </Row>

        </div>
    );
}