import React, { Component } from 'react';
import logo from 'logo.svg';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import Login from 'Login/Login';
import styles from './App.css';

const Home = () => (
  <div className={styles.App}>
    <div className={styles['App-header']}>
      <img src={logo} className={styles['App-logo']} alt="logo" />
      <h2>Welcome to React</h2>
    </div>
    <p className={styles['App-intro']}>
      To get started, edit <code>src/App.js</code> and save to reload.
    </p>
  </div>
);


class App extends Component { //eslint-disable-line
  render() {
    return (
      <Router>
        <div className={styles.mainContainer}>
          <div className={styles.background} />
          <div>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
