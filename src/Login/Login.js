import React, { Component } from 'react';
import Input from 'react-toolbox/lib/input';
import { Card } from 'react-toolbox/lib/card';
import styles from './login.css';

class Login extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      mail: '',
      password: '',
    };
  }

  handleMailChange = mail => this.setState({ mail });

  render() {
    return (
      <div className={styles.container}>
        <Card className={styles.card}>
          <Input label="Name" value={this.state.mail} onChange={this.handleMailChange} />
        </Card>
      </div>
    );
  }
}

export default Login;
