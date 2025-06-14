import {API_BASE_URL} from "../../constants/Constants";
import {uploadFileToServer, uploadFileToServerEntreprise, ententeSigneeEmail, ententeSigneeEmailEntreprise} from '../../utils/Utils';
import {Button, Icon, Progress, Upload} from "antd";
import React, {Component} from 'react';

class EntenteStageUploadDownload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ententeStatus: "Pas Trouvé",
            download: "",
            fileList: [{
                url: '',
            }],
            isLoading: true,
            confirme: false,
            postUpload: true
        };

        this.progress = this.progress.bind(this);
        this.handleEntenteUpload = this.handleEntenteUpload.bind(this);
        this.download = this.download.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.confirmerEntente = this.confirmerEntente.bind(this);
    }

    handleChange = ({fileList}) => this.setState({fileList})

    componentDidMount() {
        this.setState({isLoading: true});
        if(this.props.currentUser.typeRole === "entreprise"){
          fetch(API_BASE_URL + `/entreprise/ententeStage/get/${this.props.stagiaire.id}`, {
              method: 'GET',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
              },
          }).then((response) => response.json()
        ).then((data) => {
            let signature = false;
            let messageStatus = "";
            if(!data.confirmed_entreprise) {
              this.setState({
                ententeStatus: "En attente pour signature",
                signeEntreprise: false,
                postUpload: false
              })
            }else if(data.confirmed_entreprise === true){
              this.setState({
                ententeStatus:"Trouvé",
                signeEntreprise: true,
                postUpload: false
              })
            }else{
              this.setState({
                ententeStatus:"Pas Trouvé",
                signeEntreprise: false,
                postUpload: false
              })
            }

            this.setState({
              download: data.download_uri,
              confirme: true,
              isLoading: false
          })}).catch(error => {
              console.log("L'entente n'existe pas");
              this.setState({
                ententeStatus: "Pas Trouvé",
              })
          });
        }else if(this.props.currentUser.typeRole === "student"){
          fetch(API_BASE_URL + `/students/ententeStage/get/${this.props.currentUser.id}`, {
              method: 'GET',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
              },
          }).then((response) => response.json()
        ).then((data) => {
          let signature = false;
          let messageStatus = "";
          if(!data.confirmed_student) {
            console.log("attente");
            this.setState({
              ententeStatus: "En attente pour signature",
              signeEtudiant: false,
              postUpload: false,
            })
          }else if(data.confirmed_student === true){
            this.setState({
              ententeStatus:"Trouvé",
              signeEtudiant: true,
              postUpload: false,
            })
          }else{
            this.setState({
              ententeStatus:"Pas Trouvé",
              signeEtudiant: false,
              postUpload: false,
            })
          }
          this.setState({
              download: data.download_uri,
              confirme: true,
              isLoading: false
          })
        }).catch(error => {
              console.log("L'entente n'existe pas");
          });
        }
    }

    confirmerEntente() {
        if(this.props.currentUser.typeRole === "entreprise"){
            ententeSigneeEmailEntreprise(this.props.stagiaire.id)
            window.location.reload();
        }else if(this.props.currentUser.typeRole === "student"){
            ententeSigneeEmail(this.props.currentUser.id)
            window.location.reload();
        }
    }

    handleEntenteUpload = (event) => {
      if(this.props.currentUser.typeRole === "entreprise"){
        const data = new FormData();
        let file = event.file.originFileObj;
        data.append('file', file);
        data.append('name', 'my_file');
        data.append('description', 'Ce fichier a été téléversé par un etudiant');
        uploadFileToServerEntreprise(data, this.props.stagiaire.id, "ENTENTE").then(response => {
        }).then(this.setState({
            confirme: true,
            ententeStatus: "En attente pour confirmation",
            postUpload: true,
        })).catch(error => {
            if (error.response) {
                console.log("Upload error. HTTP error/status code=", error.response.status);
            } else {
                console.log("Upload error. HTTP error/status code=", error.message);
            }
        });
      }else if(this.props.currentUser.typeRole === "student"){
        const data = new FormData();
        let file = event.file.originFileObj;
        data.append('file', file);
        data.append('name', 'my_file');
        data.append('description', 'Ce fichier a été téléversé par un etudiant');
        uploadFileToServer(data, this.props.email, "ENTENTE").then(response => {
        }).then(this.setState({
            confirme: true,
            ententeStatus: "En attente pour signature",
            postUpload: true,
        })).catch(error => {
            if (error.response) {
                console.log("Upload error. HTTP error/status code=", error.response.status);
            } else {
                console.log("Upload error. HTTP error/status code=", error.message);
            }
        });
        //on ne veut pas reload mais attendte sur le bouton confirmer
        //setInterval("window.location.reload()", 2000);
      }
    };

    progress() {
        if (this.state.ententeStatus === "Pas Trouvé") {
            return "exception";
        }
        return "success";
    }

    download() {
        if (this.state.download !== "") {
            return (
                <div>

                    <Button style={{marginRight: "10px"}} size={"large"} type="primary" shape="circle" icon="download"
                            ghost
                            onClick={() => window.location.href = this.state.download}>
                    </Button><br/>
                </div>
            );
        }
        return "";
    }

    render() {
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">
                    Upload
                </div>
            </div>
        );
        return (
            <div className="container-fluid">
                <h3 style={{paddingTop: "10px"}}>{"Statut de l'Entente: "}{this.state.ententeStatus}
                    <Progress style={{marginLeft: "10px"}} type="circle" percent={100} width={40}
                              status={this.progress()}/>
                </h3>
                <div>
                </div>
                <div className="clearfix">
                    {this.download()}
                    <Upload
                        action="https://jsonplaceholder.typicode.com/posts/"
                        multiple={false}
                        listType="application/pdf"
                        onChange={this.handleEntenteUpload}
                    >
                        {uploadButton}
                    </Upload>
                    {this.state.confirme && this.state.postUpload && <Button disabled={!this.state.postUpload} style={{marginTop: "10px"}} size={"small"} type="submit"
                                                  onClick={() => this.confirmerEntente()}> {"Confirmer ma signature"}</Button>}
                </div>
            </div>
        )
    };
}

export default EntenteStageUploadDownload;
