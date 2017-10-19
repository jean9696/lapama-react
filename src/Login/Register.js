import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ColorPicker from 'material-ui-color-picker';
import Recaptcha from 'react-recaptcha';
import styles from './login.css';
import { createUserWithEmailAndPassword } from './login.act';

class Register extends Component {
  static propTypes = {
    createUserWithEmailAndPassword: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      mail: '',
      username: '',
      color: '#271390',
      password: '',
      confirmPassword: '',
    };
  }

  validateEmail = () => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
    return re.test(this.state.mail);
  }

  handleMailChange = (_, mail) => this.setState({ mail });

  handleUsernameChange = (_, username) => this.setState({ username });

  handlePasswordChange = (_, password) => this.setState({ password });

  handleConfirmPasswordChange = (_, confirmPassword) => this.setState({ confirmPassword });

  handleColorChange = color => this.setState({ color });


  confirm = () => this.props.createUserWithEmailAndPassword(
    this.state.mail,
    this.state.password,
    {
      mail: this.state.mail,
      username: this.state.username,
      color: this.state.color,
      isNotARobot: false,
    },
  );

  canConfirm = () =>
    this.state.isNotARobot &&
    this.state.mail && this.state.username &&
    this.validateEmail() &&
    this.state.password && this.state.password === this.state.confirmPassword;

  render() {
    return (
      <div className={styles.container}>
        <Paper className={styles.card}>
          <h2>Inscription</h2>
          <TextField
            errorText={this.state.mail && !this.validateEmail() && 'Email invalide'}
            className={styles.input} hintText="Mail"
            value={this.state.mail} onChange={this.handleMailChange}
          />
          <TextField className={styles.input} hintText="Username" value={this.state.username} onChange={this.handleUsernameChange} />
          <TextField className={styles.input} type="password" hintText="Mot de passe" value={this.state.password} onChange={this.handlePasswordChange} />
          <TextField
            className={styles.input}
            type="password"
            hintText="Confirmer mot de passe"
            value={this.state.confirmPassword}
            onChange={this.handleConfirmPasswordChange}
            errorText={this.state.password && this.state.confirmPassword && this.state.password !== this.state.confirmPassword && 'Les mots de passe ne correspondent pas'}
          />
          <ColorPicker
            className={styles.input}
            hintText="Couleur"
            onChange={this.handleColorChange}
          />
          <Recaptcha
            sitekey="6LePbDQUAAAAAK5gW1lrBF6yhwUdwvxJ8ddJwHrm"
            verifyCallback={() => this.setState({ isNotARobot: true })}
          />
          <RaisedButton
            label="S'inscrire"
            primary onClick={this.confirm}
            disabled={!this.canConfirm()}
          />
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => bindActionCreators({
  createUserWithEmailAndPassword,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Register);
