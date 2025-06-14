import React, {Component} from 'react';
import '../votreEntreprise/votreEntreprise.css';
import 'antd/dist/antd.css';
import {postStage} from '../utils/Utils';
import {Form, Button, notification, Row, Col, Tabs, DatePicker} from 'antd';
import {APPLICATION_NAME, API_BASE_URL} from '../constants/Constants';
import {studentAcceptedEmail} from '../utils/Utils';

const FormItem = Form.Item;
const {TabPane} = Tabs;

class NouveauStage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateStart: "",
            dateEnd: "",
            isLoading: false
        };

        this.handleChangeDateStart = this.handleChangeDateStart.bind(this);
        this.handleChangeDateEnd = this.handleChangeDateEnd.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const stage = {
            studentId: this.props.offer.applicationId.studentId,
            offerId: this.props.offer.applicationId.offerId,
            dateDebut: this.state.dateStart,
            dateFin: this.state.dateEnd
        };
        console.log("Stage: " + stage);

        postStage(stage.studentId, stage.offerId, stage).then(response => {
            console.log("AAH " + response);
            notification.success({
                message: APPLICATION_NAME,
                description: "Succès! Le stage a été choisie.",
            });
        }).then(
              studentAcceptedEmail(stage.offerId, stage.studentId)
        ).catch(error => {
            notification.error({
                message: APPLICATION_NAME,
                description: 'Erreur! Le nombre de stages disponibles pour un étudiant est excedé (2) ou le stage 1 n\'est pas encore terminé'
            });
        });
        window.location.reload();
    };

    componentDidMount() {

    }

    handleChangeDateStart(date) {
        console.log("Date de début: " + date.format("YYYY-MM-DD"));
        this.setState({
            dateStart: date.format("YYYY-MM-DD")
        });
    };

    handleChangeDateEnd(date) {
        console.log("Date de fin: " + date.format("YYYY-MM-DD"));
        this.setState({
            dateEnd: date.format("YYYY-MM-DD")
        });
    };

    render() {
        const dateFormat = 'YYYY/MM/DD';
        return (

            <div className="signup-content" style={{width: "600px", height: "200px"}}>
                <Row>
                    <Col span={4}>
                    </Col>
                    <Col span={15}>
                        <h2 className="page-title">Confirmer les dates</h2>
                        <Row>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab={<span span={10}>Veuillez sélectionner une date de début et de fin:</span>} key="1">
                                    <Form onSubmit={this.handleSubmit} className="signup-form">
                                        <Row>
                                            <Col span={10}>
                                                <DatePicker format={dateFormat} placeholder={"Date début"}
                                                            onChange={(date) => this.handleChangeDateStart(date)}/>
                                            </Col>
                                            <Col span={4}>
                                            </Col>
                                            <Col span={10}>
                                                <DatePicker format={dateFormat} placeholder={"Date fin"}
                                                            onChange={(date) => this.handleChangeDateEnd(date)}/>
                                            </Col>
                                        </Row>
                                        <Col span={24}>
                                            <FormItem>
                                                <Button type="primary" htmlType="submit" size="small" icon="lock"
                                                        className="signup-form-button" ghost>Confirmer</Button>
                                            </FormItem>
                                        </Col>
                                        <Col span={4}/>
                                    </Form>
                                </TabPane>
                            </Tabs>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default NouveauStage;
