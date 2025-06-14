import {API_BASE_URL, API_BASE_URL_DOWNLOAD_ENTENTE} from "../../constants/Constants";
import {Button} from "antd";
import React, {Component} from 'react';

class EntenteDownload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            download: "",
        };

        this.download = this.download.bind(this);
    }

    componentDidMount() {
        fetch(API_BASE_URL + `/students/ententeStage/get/${this.props.student.id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => response.json()
        ).then((data) => {
            this.setState({
                download: data.download_uri,
                isLoading: false
            })
        })
    }
    download() {
        if (this.state.download !== "") {
            return (
                <Button type="success" icon="download" onClick={() =>
                    window.location.href = `${API_BASE_URL_DOWNLOAD_ENTENTE}${this.props.student.id}`} block/>
            );
        }
        return (<p>Pas d'Entente</p>);
    }
    render() {
        return this.download();
    }
}

export default EntenteDownload;