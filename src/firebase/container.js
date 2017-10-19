import React from 'react';
import PropTypes from 'prop-types';
import { connect as reduxConnect } from 'react-redux';
import { select } from 'redux/reducers';
import LinearProgress from 'material-ui/LinearProgress';
import { firebaseSubscribe, firebaseUnsubscribe } from './firebaseCollections.act';

function mapStateToPropsWithRef(state, collectionRef) {
  return {
    isLoading: !select.firebaseCollectionByRefIsInitilized(state, collectionRef(state)),
    collectionRef: collectionRef(state),
  };
}

export const connect = (...reduxArgs) => (collectionRef, query) =>
  (Component) => {
    const WiredComponent = reduxConnect(...reduxArgs)(Component);
    return reduxConnect(state => mapStateToPropsWithRef(state, collectionRef))(
      class FirebaseContainer extends React.Component {
        static propTypes = {
          dispatch: PropTypes.func.isRequired,
          isLoading: PropTypes.bool.isRequired,
          collectionRef: PropTypes.string.isRequired,
        };

        constructor(props, context) {
          super(props, context);
          this.state = {
            collectionRef: () => this.props.collectionRef,
          };
        }

        componentDidMount = () => {
          this.props.dispatch(firebaseSubscribe(this.state.collectionRef), query);
        };

        componentWillUnmount = () => {
          this.props.dispatch(firebaseUnsubscribe(this.state.collectionRef), query);
        };

        render() {
          return this.props.isLoading ?
            <LinearProgress mode="indeterminate" />
            : <WiredComponent {...this.props} />;
        }
      },
    );
  };


export default connect;
