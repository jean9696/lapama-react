import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import icon from 'img/pornichet.png';
import { select } from 'redux/reducers';
import { logOut, connectUserByCookie } from 'Login/login.act';
import { push } from 'react-router-redux';
import CreateAnnouncement from 'Announcements/CreateAnnouncement';
import Booking from 'Booking/Booking';
import { FlatButton } from 'material-ui';
import styles from './connectedLayout.css';

class ConnectedLayout extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    firebaseAuth: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired,
    userInfos: PropTypes.object.isRequired,
    connectUserByCookie: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      openDialog: false,
      openAnnoucementDialog: false,
    };
  }

  componentWillMount() {
    this.props.firebaseAuth.onAuthStateChanged((user) => {
      if (!user) {
        this.props.push('/login');
      } else {
        this.props.connectUserByCookie(user);
      }
    });
  }

  handleOpenDialog = () => this.setState({ openDialog: true });

  createAnnoncement = () => this.setState({ openAnnoucementDialog: true });

  handleCloseAnnoncement = () => this.setState({ openAnnoucementDialog: false });

  handleCloseDialog = () => this.setState({ openDialog: false });

  handleDisconnect = () => {
    this.props.logOut();
  }

  render() {
    const { username } = this.props.userInfos;
    return (
      <div className={styles.container}>
        <Toolbar className={styles.header}>
          <div className={styles.headerTitleContainer}>
            <img src={icon} alt="Logo" height="100%" width="60px" />
            <h3 className={styles.headerTitle}>LAPAMA - Réservations</h3>
          </div>
          <ToolbarGroup>
            <h4 className={styles.headerTitle}>Bonjour {username}</h4>
            <ToolbarSeparator />
            <a className={styles.headerTitle} rel="noopener noreferrer" target="_blank" href="http://familledessane.free.fr/Forum/">Le forum familial</a>
            <ToolbarSeparator />
            <FlatButton className={styles.headerButton} hoverColor="#efefef" rippleColor="#017db5" label="Annonce" onClick={this.createAnnoncement} />
            <RaisedButton label="Réserver" primary onClick={this.handleOpenDialog} />
            <ToolbarSeparator />
            <FlatButton className={styles.headerButton} hoverColor="#efefef" rippleColor="#017db5" label="Se déconnecter" onClick={this.handleDisconnect} />
          </ToolbarGroup>
        </Toolbar>
        {this.props.children}
        <Dialog open={this.state.openDialog} onRequestClose={this.handleCloseDialog}>
          <Booking onClose={this.handleCloseDialog} />
        </Dialog>
        <Dialog
          open={this.state.openAnnoucementDialog}
          onRequestClose={this.handleCloseAnnoncement}
        >
          <CreateAnnouncement onClose={this.handleCloseAnnoncement} />
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  firebaseAuth: select.firebaseAuth(state),
  userInfos: select.userInfos(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  push,
  logOut,
  connectUserByCookie,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(ConnectedLayout);
