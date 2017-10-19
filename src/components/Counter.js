import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';

class Counter extends Component { //eslint-disable-line
  static propTypes = {
    value: PropTypes.number,
    min: PropTypes.number,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    value: 0,
    min: 0,
    onChange: () => {},
  }

  handleAdd = () => this.props.onChange(this.props.value + 1);

  handleRemove = () => this.props.onChange(this.props.value - 1);


  render() {
    const { min, value } = this.props;
    return (
      <div>
        <IconButton
          iconClassName="material-icons"
          onClick={this.handleRemove}
          disabled={value <= min}
        >
          remove
        </IconButton>
        <span style={{ fontSize: '24px', verticalAlign: 'text-bottom' }}>{value}</span>
        <IconButton iconClassName="material-icons" onClick={this.handleAdd}>add</IconButton>
      </div>
    );
  }
}

export default Counter;
