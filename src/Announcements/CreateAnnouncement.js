import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RaisedButton from 'material-ui/RaisedButton';
import { firebaseCreate } from 'firebase/firebaseCollections.act';
import { announcements as announcementsRef } from 'collectionRefs';
import { select } from 'redux/reducers';
import { IconButton, List, ListItem, TextField } from 'material-ui';
import moment from 'moment';
import Dropzone from 'react-dropzone';
import { generateUUID } from 'firebase/firebaseHelpers';
import { firebaseUploadFile } from 'firebase/firebaseFiles.act';
import fOmit from 'lodash/fp/omit';
import styles from './announcements.css';

class CreateAnnouncement extends Component { //eslint-disable-line
  static propTypes = {
    userInfos: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onUpload: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      title: '',
      content: '',
      files: {},
    };
  }

  onDrop = files => files.map((f) => { //eslint-disable-line
    const uuid = generateUUID();
    this.props.onUpload(f, uuid, this.finishUpload);
    this.setState({ files: {
      ...this.state.files,
      [uuid]: {
        id: uuid,
        name: f.name,
        status: 'upload',
      },
    } });
  });


  onSave = () => this.props.onSave({
    username: this.props.userInfos.username || 'Anonyme',
    time: moment().format(),
    title: this.state.title,
    content: this.state.content,
    files: this.state.files,
  });

  handleTitleChange = (_, title) => this.setState({ title });

  handleContentChange = (_, content) => this.setState({ content });

  handleRemoveFile = id => this.setState({ files: fOmit([id])(this.state.files) });

  finishUpload = (res) => {
    console.log(res)//eslint-disable-line
    this.setState({
      files: {
        ...this.state.files,
        [res.ref.name]: {
          ...(this.state.files[res.ref.name] || {}),
          status: res.state,
          url: res.downloadURL,
        },
      },
    });
  };

  render() {
    return (
      <Dropzone
        disableClick
        onDrop={this.onDrop} activeClassName={styles.dropzoneActive}
        className={styles.dropzone} ref={(node) => { this.dropzoneRef = node; }}
      >
        {!this.state.drag ? <div className={styles.container}>
          <h2>Faire une annonce</h2>
          <TextField className={styles.input} hintText="Titre" value={this.state.title} onChange={this.handleTitleChange} />
          <TextField className={styles.input} hintText="Contenu" value={this.state.content} onChange={this.handleContentChange} multiLine />
          <List>
            {Object.values(this.state.files).map(f => (
              <ListItem
                key={f.id} primaryText={f.name}
                secondaryText={f.status !== 'success' && 'Uploading...'}
                rightIconButton={<IconButton
                  iconStyle={{ color: '#9E9E9E' }}
                  iconClassName="material-icons"
                  onClick={() => this.handleRemoveFile(f.id)}
                >delete</IconButton>}
              />
            ))}
          </List>
          <RaisedButton
            label="Ajouter des fichiers"
            onClick={() => this.dropzoneRef.open()}
          />
          <RaisedButton
            label="Valider"
            primary
            onClick={this.onSave}
            disabled={this.state.title.length < 5 || this.state.content.length < 10}
          />
        </div> : <div>
          Glissez vos fichiers ici
        </div>}
      </Dropzone>
    );
  }
}

const mapStateToProps = state => ({
  userInfos: select.userInfos(state),
});

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({
  onSave: entity => firebaseCreate(announcementsRef, entity, ownProps.onClose),
  onUpload: firebaseUploadFile,
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(CreateAnnouncement);
