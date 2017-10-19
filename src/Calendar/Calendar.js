import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'firebase/container';
import { select } from 'redux/reducers';
import { bindActionCreators } from 'redux';
import BigCalendar from 'react-big-calendar';
import Paper from 'material-ui/Paper';
import moment from 'moment';
import localization from 'moment/locale/fr';
import { events as eventsRef, event as eventRef } from 'collectionRefs';
import fRemove from 'lodash/fp/remove';
import startCase from 'lodash/startCase';
import EventList from 'components/EventList';
import { Dialog } from 'material-ui';
import Announcements from 'Announcements/Announcements';
import { firebaseDelete } from 'firebase/firebaseCollections.act';
import '!style-loader!css-loader!react-big-calendar/lib/css/react-big-calendar.css'; //eslint-disable-line
import styles from './calendar.css';

moment.updateLocale('fr', localization);
BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment),
);

const messages = {
  allDay: 'journée',
  previous: 'précédent',
  next: 'suivant',
  today: 'aujourd\'hui',
  month: 'mois',
  week: 'semaine',
  day: 'jour',
  agenda: 'Agenda',
  date: 'date',
  time: 'heure',
  event: 'réservation', // Or anything you want
  showMore: total => `+ ${total} réservation(s) supplémentaire(s)`,
};


class Calendar extends Component { //eslint-disable-line
  static propTypes = {
    events: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      openDialog: false,
      dialogData: {},
    };
  }

  translatePeople = (p) => {
    switch (p) {
      case 'adults': return 'Adultes';
      case 'children': return 'Enfant de plus de 4 ans';
      case 'babies': return 'Enfant de moins de 4 ans';
      case 'guests': return 'Invités';
      default: return 'Inconnu';
    }
  }

  eventStyleGetter = event => ({
    style: {
      backgroundColor: event.color,
    },
  });

  showEvent = event => this.setState({ openDialog: true, dialogData: event });

  render() {
    const { user, events, onDelete } = this.props;
    const { start, end, title, people = {}, place = {} } = this.state.dialogData;

    const userFutureEvents = fRemove(event =>
      event.userId !== user.uid || moment().isAfter(event.end),
    )(events);

    return (
      <div className={styles.bodyContainer}>
        <Paper zDepth={2} className={styles.myEvents}>
          <h2 className={styles.myEventsTitle}>Annonces</h2>
          <Announcements />
          <h2 className={styles.myEventsTitle}>Mes réservations</h2>
          <EventList
            onRemove={onDelete}
            events={userFutureEvents}
          />
        </Paper>
        <div className={styles.calendarContainer}>
          <Paper className={styles.paper}>
            <BigCalendar
              culture="fr"
              events={events}
              eventPropGetter={this.eventStyleGetter}
              messages={messages}
              onSelectEvent={this.showEvent}
            />
          </Paper>
        </div>
        <Dialog
          open={this.state.openDialog} style={{ display: 'flex', flexDirection: 'column' }}
          onRequestClose={() => this.setState({ openDialog: false })}
        >
          <h2>{title}</h2>
          <p>Arrivée: {start && start.toLocaleDateString()}</p>
          <p>Départ: {end && end.toLocaleDateString()}</p>
          <p>
            {Object.keys(people).map(k =>
              (<span key={k}>{this.translatePeople(k)}: {people[k]}, </span>),
            )}
          </p>
          <p>
            {Object.keys(place).map(k => (<span key={k}>{startCase(k)}: {place[k]}, </span>))}
          </p>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  events: Object.values(select.firebaseCollectionByRef(state, eventsRef())).map(event => ({
    ...event,
    start: event ? new Date(event.start) : null,
    end: event ? new Date(event.end) : null,
    allDay: true,
  })),
  user: select.currentUser(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onDelete: eventId => firebaseDelete(eventRef(eventId), eventId),
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(eventsRef)(Calendar);
