import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './login.scss';
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
      password: '',
      confirmPassword: '',
    };
  }

  handleMailChange = (_, mail) => this.setState({ mail });

  handleUsernameChange = (_, username) => this.setState({ username });

  handlePasswordChange = (_, password) => this.setState({ password });

  handleConfirmPasswordChange = (_, confirmPassword) => this.setState({ confirmPassword });


  confirm = () => this.props.createUserWithEmailAndPassword(
    this.state.mail,
    this.state.password,
    {
      username: this.state.username,
    },
  );

  render() {
    return (
      <div className={styles.container}>
        <Paper className={styles.card}>
          <TextField hintText="Mail" value={this.state.mail} onChange={this.handleMailChange} />
          <TextField hintText="Mail" value={this.state.username} onChange={this.handleUsernameChange} />
          <TextField type="password" hintText="Mot de passe" value={this.state.password} onChange={this.handlePasswordChange} />
          <TextField
            type="password"
            hintText="Confirmer mot de passe"
            value={this.state.confirmPassword}
            onChange={this.handleConfirmPasswordChange}
          />
          <RaisedButton label="Se connecter" primary onClick={this.confirm} />
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
