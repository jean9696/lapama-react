import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import fSum from 'lodash/fp/sum';
import moment from 'moment';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import startCase from 'lodash/startCase';
import { select } from 'redux/reducers';
import fFilter from 'lodash/fp/filter';
import CircularProgress from 'material-ui/CircularProgress';
import FontIcon from 'material-ui/FontIcon';
import DatePicker from 'material-ui/DatePicker';
import areIntlLocalesSupported from 'intl-locales-supported';
import RaisedButton from 'material-ui/RaisedButton';
import Counter from 'components/Counter';
import { firebaseCreate } from 'firebase/firebaseCollections.act';
import { events as eventsRef } from 'collectionRefs';
import FlatButton from 'material-ui/FlatButton';import '!style-loader!css-loader!react-big-calendar/lib/css/react-big-calendar.css'; //eslint-disable-line
import styles from './booking.css';


let DateTimeFormat;
if (areIntlLocalesSupported(['fr'])) {
  DateTimeFormat = global.Intl.DateTimeFormat; //eslint-disable-line
} else {
  const IntlPolyfill = require('intl'); //eslint-disable-line
  DateTimeFormat = IntlPolyfill.DateTimeFormat; //eslint-disable-line
  require('intl/locale-data/jsonp/fr'); //eslint-disable-line
}

class Booking extends Component { //eslint-disable-line
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    userInfos: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    events: PropTypes.array,
  }

  static defaultProps = {
    events: [],
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      stepIndex: 0,
      start: null,
      end: null,
      people: {
        adults: 1,
        children: 0,
        babies: 0,
        guests: 0,
      },
      place: {
        chambreDuBas: 0,
        chambreDuHaut: 0,
        chalet: 0,
        perroquet: 0,
        campingDansLeJardin: 0,
      },
    };
  }

  getTotalPeople = people => fSum(Object.values(people || this.state.people));

  getTotalPeopleInPlace = place => fSum(Object.values(place || this.state.place));

  getStepContent = () => {
    const { people, start, end } = this.state;
    const { adults, children, babies, guests } = people;
    switch (this.state.stepIndex) {
      case 0:
        return (
          <div className={styles.dates}>
            <DatePicker value={start} maxDate={end} onChange={this.handleSetStart} DateTimeFormat={DateTimeFormat} locale="fr" hintText="Date d'arrivée" />
            <DatePicker value={end} disabled={!start} minDate={start} onChange={this.handleSetEnd} DateTimeFormat={DateTimeFormat} locale="fr" hintText="Date de départ" />
          </div>
        );
      case 1:
        return (
          <div className={styles.people}>
            <div>
              <FontIcon className="material-icons" style={{ fontSize: '54px' }}>face</FontIcon>
              <Counter value={adults} onChange={this.handleAddPeople('adults')} />
              <p>Adultes</p>
            </div>
            <div>
              <FontIcon className="material-icons" style={{ fontSize: '54px' }}>child_care</FontIcon>
              <Counter value={children} onChange={this.handleAddPeople('children')} />
              <p>Enfants de plus de 4 ans</p>
            </div>
            <div>
              <FontIcon className="material-icons" style={{ fontSize: '54px' }}>child_friendly</FontIcon>
              <Counter value={babies} onChange={this.handleAddPeople('babies')} />
              <p>Enfants de moins de 4 ans</p>
            </div>
            <div>
              <FontIcon className="material-icons" style={{ fontSize: '54px' }}>people</FontIcon>
              <Counter value={guests} onChange={this.handleAddPeople('guests')} />
              <p>Invités</p>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            {Object.keys(this.state.place).map(place => (
              <div className={styles.placeBlock} key={place}>
                {(this.placeAtSameTime()[place] || 0) > 0 ? (
                  <span className={styles.warningPlace}>{startCase(place)}</span>
                ) : startCase(place)}
                <Counter value={this.state.place[place]} onChange={this.handleAddToPlace(place)} />
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div>
            <p>Arrivée: {this.state.start && this.state.start.toLocaleDateString()}</p>
            <p>Départ: {this.state.end && this.state.end.toLocaleDateString()}</p>
            <p>Nombre de personnes: {this.getTotalPeople()}</p>
          </div>
        );
      default:
        return (<CircularProgress size={80} thickness={5} />);
    }
  }


  eventAtSameTime = () =>
    fFilter(e => e.end >= this.state.start && e.start <= this.state.end)(this.props.events);

  placeAtSameTime = () => this.eventAtSameTime().reduce((context, e) => (e.place ? ({
    chambreDuBas: (context.chambreDuBas || 0) + e.place.chambreDuBas,
    chambreDuHaut: (context.chambreDuHaut || 0) + e.place.chambreDuHaut,
    chalet: (context.chalet || 0) + e.place.chalet,
    perroquet: (context.perroquet || 0) + e.place.perroquet,
    campingDansLeJardin: (context.campingDansLeJardin || 0) + e.place.campingDansLeJardin,
  }) : context), {});

  checkValid = () => {
    switch (this.state.stepIndex) {
      case 0:
        return !!this.state.end && !!this.state.start;
      case 1:
        return this.getTotalPeople() > 0;
      case 2:
        return this.getTotalPeople() === this.getTotalPeopleInPlace();
      case 3:
        return !!this.state.end && !!this.state.start && this.getTotalPeople() > 0 &&
          this.getTotalPeople() === this.getTotalPeopleInPlace();
      default:
        return false;
    }
  }

  handleAddPeople = type => value => this.setState({ people: {
    ...this.state.people,
    [type]: value,
  } });

  handleAddToPlace = type => (value) => {
    if (this.getTotalPeople() > this.getTotalPeopleInPlace() || this.state.place[type] > value) {
      this.setState({ place: {
        ...this.state.place,
        [type]: value,
      } });
    }
  };

  handleSetStart = (_, start) => this.setState({ start });

  handleSetEnd = (_, end) => this.setState({ end: new Date(end.setHours(12)) });

  handleNext = () => {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
    });
    if (stepIndex + 1 >= 4) {
      this.props.onSave({
        start: this.state.start.toString(),
        end: this.state.end.toString(),
        people: this.state.people,
        color: this.props.userInfos.color || '#3174ad',
        userId: this.props.user.uid,
        title: `${this.props.userInfos.username || 'Anonyme'} - ${this.getTotalPeople()} personne(s)`,
        username: this.props.userInfos.username || 'Anonyme',
        place: this.state.place,
      });
    }
  };

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };

  render() {
    const { stepIndex } = this.state;
    const eventAtSameTime = this.eventAtSameTime();
    return (
      <div className={styles.container}>
        <h5>Tarifs 2017: 5€ la nuité et 50€ par jour pour les invités</h5>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Quelles sont vos dates</StepLabel>
          </Step>
          <Step>
            <StepLabel>Combien serez vous ?</StepLabel>
          </Step>
          <Step>
            <StepLabel>Où allez vous dormir ?</StepLabel>
          </Step>
          <Step>
            <StepLabel>{"Votre récap'"}</StepLabel>
          </Step>
        </Stepper>
        <div className={styles.content}>{this.getStepContent()}</div>
        {eventAtSameTime.length > 0 && (
          <div className={styles.warning}>
            {eventAtSameTime.map((e) => {
              const eventPeople = this.getTotalPeople(e.people) - 1;
              return (
                <p key={e.id}>
                  {e.username} sera également là {eventPeople > 0 && `avec ${eventPeople} personne(s) `} du {moment(e.start).format('DD/MM/YYYY')} au {moment(e.end).format('DD/MM/YYYY')}
                </p>
              );
            })}
          </div>
        )}
        {stepIndex < 4 && <div className={styles.stepButtons}>
          <FlatButton
            label="Retour"
            disabled={stepIndex === 0}
            onClick={this.handlePrev}
            style={{ marginRight: 12 }}
          />
          <RaisedButton
            label={stepIndex === 3 ? 'Valider' : 'Suivant'}
            primary
            disabled={!this.checkValid()}
            onClick={this.handleNext}
          />
        </div>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userInfos: select.userInfos(state),
  user: select.currentUser(state),
  events: Object.values(select.firebaseCollectionByRef(state, eventsRef())).map(event => ({
    ...event,
    start: event ? new Date(event.start) : null,
    end: event ? new Date(event.end) : null,
  })),
});

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({
  onSave: entity => firebaseCreate(eventsRef, entity, ownProps.onClose),
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Booking);
