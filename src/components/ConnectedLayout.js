import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import icon from 'img/pornichet.png';
import { select } from 'redux/reducers';
import { logOut } from 'Login/login.act';
import { push } from 'react-router-redux';
import styles from './connectedLayout.scss';

class ConnectedLayout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    firebaseAuth: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.props.firebaseAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.props.push('/login');
      }
    });
  }

  handleDisconnect = () => {
    this.props.logOut();
  }

  render() {
    return (
      <div className={styles.container}>
        <Toolbar className={styles.header}>
          <div className={styles.headerTitleContainer}>
            <img src={icon} alt="Logo" height="100%" width="60px" />
            <h3 className={styles.headerTitle}>LAPAMA - Réservations</h3>
          </div>
          <ToolbarGroup>
            <RaisedButton label="Réserver" primary />
            <IconMenu
              iconButtonElement={
                <IconButton touch iconStyle={styles}>
                  <NavigationExpandMoreIcon />
                </IconButton>
              }
            >
              <MenuItem primaryText="Se déconnecter" onClick={this.handleDisconnect} />
            </IconMenu>
          </ToolbarGroup>
        </Toolbar>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  firebaseAuth: select.firebaseAuth(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  push,
  logOut,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(ConnectedLayout);
