import {API_BASE_URL} from "../../constants/Constants";
import {uploadFileToServer} from '../../utils/Utils';
import {Upload, Icon, Button, Progress} from 'antd';
import React, {Component} from 'react';

class RapportUploadDownload extends Component{
  constructor(props){
    super(props);
    this.state = {
        rapportStatus: "Pas Trouvé",
        download: "",
        fileList: [{
            url: '',
        }],
        isLoading: true
    };

    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.download = this.download.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.progress = this.progress.bind(this);
  }

  handleChange = ({fileList}) => this.setState({fileList})

  componentDidMount() {
      this.setState({isLoading: true});
      fetch(API_BASE_URL + `/students/rapport/${this.props.currentUser.id}`, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
      }).then((response) => response.json()
    ).then((data) => this.setState({
          rapportStatus: "Trouvé",
          download: data.download_uri,
          isLoading: false
      })).catch(error => {
          console.log("Le rapport n'existe pas");
      });

  }

  handleFileUpload = (event) => {
      const data = new FormData();
      let file = event.file.originFileObj;
      data.append('file', file);
      data.append('name', 'my_file');
      data.append('description', 'Ce fichier etait uploader par un etudiant');
      uploadFileToServer(data, this.props.email, "RAPPORT").then(response => {
        }).catch(error => {
          if (error.response) {
              console.log("Upload error. HTTP error/status code=", error.response.status);
          } else {
              console.log("Upload error. HTTP error/status code=", error.message);
          }
        });
      setInterval("window.location.reload()",2000);
  };

  download() {
      if (this.state.download !== "") {
          return (
              <Button style={{marginTop: "10px", marginRight: "10px"}} size={"large"} type="primary" shape="circle"
                      icon="download" ghost
                      onClick={() => window.location.href = this.state.download}>
              </Button>
          );
      }
      return "";
  }

    progress() {
        if (this.state.ententeStatus === "Pas Trouvé") {
            return "exception";
        }
        return "success";
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
              <h3 style={{paddingTop: "10px"}}>Statut du rapport:
                  <Progress style={{marginLeft: "20px"}} type="circle" percent={100} width={40}
                            status={this.progress()}/>
              </h3>
              <div className="clearfix">
                  {this.download()}
                  <Upload
                      action="//jsonplaceholder.typicode.com/posts/"
                      multiple={false}
                      listType="application/pdf"
                      onChange={this.handleFileUpload}
                  >
                      {uploadButton}
                  </Upload>
              </div>
          </div>
      )
  };

}
export default RapportUploadDownload;
