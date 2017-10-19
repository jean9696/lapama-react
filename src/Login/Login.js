import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import styles from './login.css';
import { connectUser } from './login.act';
/* eslint-disable react/no-unescaped-entities */

class Login extends Component {
  static propTypes = {
    connectUser: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      mail: '',
      password: '',
      error: false,
    };
  }

  handleMailChange = (_, mail) => this.setState({ mail, error: false });

  handlePasswordChange = (_, password) => this.setState({ password, error: false });

  login = () =>
    this.props.connectUser(this.state.mail, this.state.password, () => this.setState({ error: true })); //eslint-disable-line

  render() {
    return (
      <div className={styles.container}>
        <Paper className={styles.card}>
          <h2>Connexion</h2>
          <TextField className={styles.input} hintText="Mail" value={this.state.mail} onChange={this.handleMailChange} />
          <TextField className={styles.input} type="password" hintText="Mot de passe" value={this.state.password} onChange={this.handlePasswordChange} />
          {this.state.error && (
            <p className={styles.error}>Le mot de passe est invalide ou le compte n'existe pas</p>
          )}
          <RaisedButton label="Se connecter" primary onClick={this.login} />
          <Link className={styles.link} to="/reset-password">Mot de passe oublié ?</Link>
          <Link className={styles.link} to="/register">Pas encore de compte ?</Link>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({
  connectUser,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Login);
