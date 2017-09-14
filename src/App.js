import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from 'App.css';

class App extends Component { //eslint-disable-line
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    return (
      <div>
        <div className={styles.background} />
        {this.props.children}
      </div>
    );
  }
}

export default App;
