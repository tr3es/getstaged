import {API_BASE_URL, API_BASE_URL_DOWNLOAD} from "../../constants/Constants";
import {uploadFileToServer} from '../../utils/Utils';
import {Button, Icon, Progress, Upload} from "antd";
import React, {Component} from 'react';

class FicheSuivie extends Component {
    constructor(props) {
        super(props);
        this.state = {
            download:
                <Button type="success"
                        icon="download"
                        onClick={() => window.location.href = `${this.state.downloadLink}`}
                >
                    Download
                </Button>
            ,
            upload:
                <Upload multiple={false} listType="application/pdf" onChange={this.handleFicheUpload}
                        showUploadList={false}>
                    <Button type={"primary"}><Icon type="upload"/>Upload Fiche</Button>
                </Upload>
            ,
            downloadLink: "",
            response : "",
            isLoading: true,
        };
        this.getDownload = this.getDownload.bind(this);
        this.handleFicheUpload = this.handleFicheUpload.bind(this);
    }

    getDownload() {
        fetch(API_BASE_URL + `/monitors/ficheSuivie/${this.props.studentId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        }).then((response) => this.setState({response:response.status})
        ).then(this.setState({
            downloadLink: API_BASE_URL + "/monitors/ficheSuivie/" + this.props.studentId,
            isLoading: false
        })).catch(error => {
            console.log("La fiche de suivie n'existe pas");
        });
    }

    componentWillMount() {
        this.setState({isLoading: true});
        this.getDownload();
    }

    handleFicheUpload = (event) => {
        const data = new FormData();
        let file = event.file.originFileObj;
        data.append('file', file);
        data.append('name', 'my_file');
        data.append('description', 'Ce fichier etait uploader par un etudiant');
        uploadFileToServer(data, this.props.email, "FICHESUIVIE");
        this.getDownload();
        this.setState({
            upload:
                <div>
                    <Upload multiple={false} listType="application/pdf" onChange={this.handleFicheUpload}
                            showUploadList={false}>
                        <Button type={"primary"}><Icon type="upload"/>Upload Fiche</Button>
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

export default FicheSuivie;