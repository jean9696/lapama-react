import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'firebase/container';
import { select } from 'redux/reducers';
import { bindActionCreators } from 'redux';
import { announcements as announcementsRef } from 'collectionRefs';
import { List, ListItem } from 'material-ui/List';
import moment from 'moment';
import { Dialog } from 'material-ui';
import { darkBlack } from 'material-ui/styles/colors';
import Subheader from 'material-ui/Subheader';
import Attachment from 'material-ui/svg-icons/file/attachment';
import styles from './announcements.css';


class Announcements extends Component { //eslint-disable-line
  static propTypes = {
    announcements: PropTypes.array.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      openDialog: false,
      dialogData: {},
    };
  }

  openInNewTab = url => window.open(url, '_blank').focus();

  render() {
    const { username, time, files = {}, content } = this.state.dialogData;
    return this.props.announcements.length > 0 ? (
      <div>
        <List className={styles.list}>
          {this.props.announcements.map(a => (
            <ListItem
              key={a.id}
              primaryText={a.title}
              onClick={() => this.setState({ openDialog: true, dialogData: a })}
              secondaryText={
                <p>
                  <span style={{ color: darkBlack }}>{a.username} le {moment(a.time).format('DD/MM/YYYY')}</span> --
                  {a.content}
                </p>
              }
              secondaryTextLines={2}
              rightIcon={Object.values((a.files || {})).length > 0 ? <Attachment /> : null}
            />
          ))}
        </List>
        <Dialog
          open={this.state.openDialog} style={{ display: 'flex', flexDirection: 'column' }}
          onRequestClose={() => this.setState({ openDialog: false })}
        >
          <h3 style={{ color: darkBlack }}>{username} le {moment(time).format('DD/MM/YYYY')}</h3>
          <p className={styles.contentText}>{content}</p>
          <List>
            {Object.values(files).length > 0 && <Subheader>Fichiers</Subheader>}
            {Object.values(files).map(f => (
              <ListItem
                key={f.id} primaryText={f.name}
                onClick={f.url ? () => this.openInNewTab(f.url) : () => {}}
              />
            ))}
          </List>
        </Dialog>
      </div>
    ) : <div style={{ textAlign: 'center', marginTop: '10px' }}>Aucune annonce pour le moment</div>;
  }
}

const mapStateToProps = state => ({
  announcements: Object.values(select.firebaseCollectionByRef(state, announcementsRef())),
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(announcementsRef)(Announcements);
