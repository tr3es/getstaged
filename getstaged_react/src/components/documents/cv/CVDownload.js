import {API_BASE_URL, API_BASE_URL_DOWNLOAD} from "../../constants/Constants";
import {Button} from 'antd';
import React, {Component} from 'react';

class CVDownload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            download: "",
            isLoading: true
        };

        this.download = this.download.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});

        fetch(API_BASE_URL + `/cv/${this.props.student.id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json()
        ).then((data) => this.setState({
            download: data.download_uri,
            isLoading: false
        })).catch(error => {
            console.log("Le cv n'existe pas");
        });
    }

    download() {
        if (this.state.download !== "") {
            return (
                <Button type="success" icon="download" onClick={() =>
                    window.location.href = `${API_BASE_URL_DOWNLOAD}${this.props.student.id}`} block/>
            );
        }
        return(<p>Pas de Cv</p>)
    }

    render() {
        return this.download();
    }
}

export default CVDownload;