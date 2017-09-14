import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './login.scss';
import { connectUser } from './login.act';

class Login extends Component {
  static propTypes = {
    connectUser: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      mail: '',
      password: '',
    };
  }

  handleMailChange = (_, mail) => this.setState({ mail });

  handlePasswordChange = (_, password) => this.setState({ password });

  login = () => this.props.connectUser(this.state.mail, this.state.password)

  render() {
    return (
      <div className={styles.container}>
        <Paper className={styles.card}>
          <TextField hintText="Mail" value={this.state.mail} onChange={this.handleMailChange} />
          <TextField type="password" hintText="Mot de passe" value={this.state.password} onChange={this.handlePasswordChange} />
          <RaisedButton label="Se connecter" primary onClick={this.login} />
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
