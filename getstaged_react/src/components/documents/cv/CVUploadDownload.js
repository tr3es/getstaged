import {API_BASE_URL} from "../../constants/Constants";
import {uploadFileToServer} from '../../utils/Utils';
import {Upload, Icon, Button} from 'antd';
import React, {Component} from 'react';

class CVUploadDownload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cvStatus: "Pas Trouvé",
            download: "",
            flag: false,
            render: [],
            isLoading: true
        };

        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.progress = this.progress.bind(this);
        this.download = this.download.bind(this);
    }

    componentDidMount() {
        fetch(API_BASE_URL + `/cv/${this.props.currentUser.id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json()
        ).then((data) => this.setState({
            cvStatus: data.approved,
            download: data.download_uri,
            flag: true,
            isLoading: false
        })).then(this.download).catch(error => {
            console.log("Le cv n'existe pas");
        });
        if (!this.state.flag) {
            this.setState({
                render:
                    <div className="container-fluid">
                        <h3 style={{paddingTop: "10px"}}>Statut du CV: {this.state.cvStatus}</h3>
                        <div className="progress" style={{width: "200px"}}>
                            <div className="progress-bar progress-bar-success progress-bar-striped active"
                                 role="progressbar"
                                 aria-valuenow={this.progress}
                                 aria-valuemin="0" aria-valuemax="100" style={{width: this.progress() + '%'}}>
                            </div>
                        </div>
                        <div className="clearfix">
                            <Upload
                                action="//jsonplaceholder.typicode.com/posts/"
                                multiple={false}
                                listType="application/pdf"
                                onChange={this.handleFileUpload}
                            >
                                <div>
                                    <Icon type="plus"/>
                                    <div className="ant-upload-text">
                                        Upload
                                    </div>
                                </div>
                            </Upload>
                        </div>
                    </div>
            })
        }
    }

    handleFileUpload = (event) => {
        const data = new FormData();
        let file = event.file.originFileObj;
        data.append('file', file);
        data.append('name', 'my_file');
        data.append('description', 'Ce fichier etait uploader par un etudiant');
        uploadFileToServer(data, this.props.email, "CV").then(response => {
        }).catch(error => {
            if (error.response) {
                console.log("Upload error. HTTP error/status code=", error.response.status);
            } else {
                console.log("Upload error. HTTP error/status code=", error.message);
            }
        });
        this.setState({
            render:
                <div className="container-fluid">
                    <h3 style={{paddingTop: "10px"}}>Statut de CV: En approbation</h3>
                    <div className="progress" style={{width: "200px"}}>
                        <div className="progress-bar progress-bar-success progress-bar-striped active"
                             role="progressbar"
                             aria-valuenow="50"
                             aria-valuemin="0" aria-valuemax="100" style={{width: 50 + '%'}}>
                        </div>
                    </div>
                    <div className="clearfix">
                        <Upload
                            action="//jsonplaceholder.typicode.com/posts/"
                            multiple={false}
                            listType="application/pdf"
                            onChange={this.handleFileUpload}
                        >
                            <div>
                                <Icon type="plus"/>
                                <div className="ant-upload-text">
                                    Upload
                                </div>
                            </div>
                        </Upload>
                    </div>
                    <Button style={{marginTop: "10px", marginRight: "10px"}} size={"large"} type="primary"
                            shape="circle"
                            icon="download" ghost
                            onClick={() => window.location.href = this.state.download}>
                    </Button>
                </div>
        })
    };

    download() {
        if (this.state.download !== "") {
            this.setState({
                render:
                    <div className="container-fluid">
                        <h3 style={{paddingTop: "10px"}}>Statut de CV: {this.state.cvStatus}</h3>
                        <div className="progress" style={{width: "200px"}}>
                            <div className="progress-bar progress-bar-success progress-bar-striped active"
                                 role="progressbar"
                                 aria-valuenow={this.progress}
                                 aria-valuemin="0" aria-valuemax="100" style={{width: this.progress() + '%'}}>
                            </div>
                        </div>
                        <div className="clearfix">
                            <Upload
                                action="//jsonplaceholder.typicode.com/posts/"
                                multiple={false}
                                listType="application/pdf"
                                onChange={this.handleFileUpload}
                            >
                                <div>
                                    <Icon type="plus"/>
                                    <div className="ant-upload-text">
                                        Upload
                                    </div>
                                </div>
                            </Upload>
                        </div>
                        <Button style={{marginTop: "10px", marginRight: "10px"}} size={"large"} type="primary"
                                shape="circle"
                                icon="download" ghost
                                onClick={() => window.location.href = this.state.download}>
                        </Button>
                    </div>
            })
        }
        return this.state.render;
    }

    progress() {
        if (this.state.cvStatus !== "Pas Trouvé") {
            if (this.state.cvStatus === "Approuvé" || this.state.cvStatus === "Non approuvé") return "100";
            else if (this.state.cvStatus === "En approbation") return "50";
        }
        return "0";
    }

    render() {
        return this.state.render;
    }
}

export default CVUploadDownload;