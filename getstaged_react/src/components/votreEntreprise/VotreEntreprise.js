import React, { Component } from 'react';
import './votreEntreprise.css';
import { Link } from 'react-router-dom';
import Toolbar from '@material-ui/core/Toolbar';
import { Layout, Menu, Dropdown, Icon } from 'antd';
import 'antd/dist/antd.css';
import { withStyles } from '@material-ui/core/styles';
import EvaluationStagiaire from './EvaluationStagiaire';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import NouvelleOffre from './NouvelleOffre'
import {getSampleStage} from './StageSample';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class EntrepriseToolbar extends Component{
  render() {
    const menuItems = [
        <Menu.Item key="/votreEntreprise">
            <Link to="/votreEntreprise/VotreEntreprise" color="inherit">
                <Button>Profil</Button>
            </Link>
        </Menu.Item>,
        <Menu.Item key="/votreEntreprise/NouvelleOffre">
            <Link to="/votreEntreprise/NouvelleOffre" color="inherit">
                <Button>Nouvelle Offre</Button>
            </Link>
        </Menu.Item>,
        <Menu.Item key="/votreEntreprise/Offres">
            <Link to="/votreEntreprise/Offres" color="inherit">
                <Button>Vos Offres</Button>
            </Link>
        </Menu.Item>,
        <Menu.Item key="/votreEntreprise/EvaluationStagiaire">
          <Link to={'/votreEntreprise/EvaluationStagiaire'} color="inherit">
            <Button> Evaluation stagiaire </Button>
          </Link>
        </Menu.Item>
      ];
    return (
      <div>
        <Menu
            className="app-menu"
            mode="horizontal"

            style={{ lineHeight: '64px' }} >
            {menuItems}
        </Menu>
        <br/>
        <br/>
        </div>

    );
  }
}

class VotreEntreprise extends Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="root">
      <EntrepriseToolbar/>

      </div>
    );
  }
}

export default VotreEntreprise;
