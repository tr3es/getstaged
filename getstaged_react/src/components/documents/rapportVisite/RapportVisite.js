import {API_BASE_URL} from "../../constants/Constants";
import {uploadFileToServer} from '../../utils/Utils';
import {Button, Icon, Upload} from "antd";
import React, {Component} from 'react';

class RapportVisite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadDownload: "",
            downloadLink: "",
            response: "",
            upload:
                <Upload multiple={false} listType="application/pdf" onChange={this.handleRapportUpload}
                        showUploadList={false}>
                    <Button type={"primary"}>
                        <Icon type="upload"/>Upload Rapport
                    </Button>
                </Upload>
            ,
            download:
                <Button type="success"
                        icon="download"
                        onClick={() => window.location.href = `${this.state.downloadLink}`}
                >
                    Download
                </Button>
            ,
            isLoading: true,
        };
        this.getDownload = this.getDownload.bind(this);
        this.handleRapportUpload = this.handleRapportUpload.bind(this);
    }

    getDownload() {
        fetch(API_BASE_URL + `/monitors/rapportVisite/${this.props.studentId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        }).then((response) => this.setState({response: response.status})
        ).then(this.setState({
            downloadLink: API_BASE_URL + "/monitors/rapportVisite/" + this.props.studentId,
            isLoading: false
        })).catch(error => {
            console.log("Le rapport de visite n'existe pas");
        });
    }

    componentDidMount() {
        this.setState({isLoading: true});
        this.getDownload();
    }

    handleRapportUpload = (event) => {
        const data = new FormData();
        let file = event.file.originFileObj;
        data.append('file', file);
        data.append('name', 'my_file');
        data.append('description', 'Ce fichier etait uploader par un etudiant');
        uploadFileToServer(data, this.props.email, "RAPPORTVISITE");
        this.getDownload();
        this.setState({
            upload:
                <div>
                    <Upload multiple={false} listType="application/pdf" onChange={this.handleRapportUpload}
                            showUploadList={false}>
                        <Button type={"primary"}><Icon type="upload"/>Upload Rapport</Button>
                    </Upload>
                    <Button type="success"
                            icon="download"
                            onClick={() => window.location.href = `${this.state.downloadLink}`}
                    >
                        Download
                    </Button>
                </div>
        });
    };

    render() {
        console.log(this.state.response);
        if (this.state.response === 200) {
            return (
                <div>
                    {this.state.upload}
                    {this.state.download}
                </div>
            );
        }
        return this.state.upload;
    };
}

export default RapportVisite;