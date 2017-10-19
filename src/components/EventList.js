import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';
import fSum from 'lodash/fp/sum';
import IconButton from 'material-ui/IconButton';
import moment from 'moment';

class EventList extends Component { //eslint-disable-line
  static propTypes = {
    events: PropTypes.array.isRequired,
    onRemove: PropTypes.func,
  }

  static defaultProps = {
    onRemove: id => console.log(id)//eslint-disable-line
  }

  getTotalPeople = event => fSum(Object.values(event.people));

  render() {
    return this.props.events.length > 0 ? (
      <div style={{ overflowY: 'auto' }}>
        <List>
          {this.props.events.map(event => (
            <ListItem
              key={event.id}
              rightIconButton={<IconButton
                iconStyle={{ color: '#9E9E9E' }}
                iconClassName="material-icons"
                onClick={() => this.props.onRemove(event.id)}
              >delete</IconButton>}
              primaryText={`Du ${event.start.toLocaleDateString()} au ${event.end.toLocaleDateString()}`}
              secondaryText={`${this.getTotalPeople(event)} personne(s) - ${moment(event.end).diff(event.start, 'days') + 1} jour(s)`}
            />
          ))}
        </List>
      </div>
    ) : (<div style={{ textAlign: 'center', marginTop: '10px' }}>Aucune réservation active pour le moment</div>);
  }
}

export default EventList;
