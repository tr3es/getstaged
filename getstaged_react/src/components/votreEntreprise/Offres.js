import React, { Component } from 'react';
import './votreEntreprise.css';
import { Link } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import {Layout, notification} from 'antd';
import 'antd/dist/antd.css';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import EntrepriseToolbar from './VotreEntreprise';

const  liste={
"name":"John",
"age":30,
"cars":[ "Ford", "BMW", "Fiat" ],
"name":"John",
"age":30,
"cars":[ "Ford", "BMW", "Fiat" ]
}

class AfficherListe extends Component{


  render(){
    return (
        <h1>Testliste</h1>
      )
    };
}

class Offres extends Component {
  constructor(props) {
    super(props);
  }



  render(){
    return(
      <div className="root">
        <h1> TEST3 </h1>
      <EntrepriseToolbar/>
      <AfficherListe/>
      </div>
    );
  }
}
export default Offres;
