import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import { select } from 'redux/reducers';
import styles from './login.css';

class ResetPassword extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      mail: '',
      error: null,
      isReset: false,
    };
  }

  handleMailChange = (_, mail) => this.setState({ mail, error: null });


  resetPassword = () => this.props.auth.sendPasswordResetEmail(this.state.mail).then(() => {
    this.setState({ isReset: true });
  }).catch((error) => {
    this.setState({ error });
  });

  render() {
    return (
      <div className={styles.container}>
        {this.state.isReset ?
          <Paper className={styles.card}>
            <p>Un email vous a été envoyé à {this.state.mail}</p>
          </Paper> :
          <Paper className={styles.card}>
            <h2>Réinitialiser le mot de passe</h2>
            <TextField
              className={styles.input}
              hintText="Mail"
              value={this.state.mail}
              onChange={this.handleMailChange}
              errorText={this.state.error && 'Impossible de trouver un compte associé à cet email'}
            />
            <RaisedButton style={{ marginTop: '30px' }} label="Réinitialiser le mot de passe" primary onClick={this.resetPassword} />
          </Paper>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: select.firebaseAuth(state),
});


export default connect(mapStateToProps)(ResetPassword);
