import React from 'react';
import { ViewPropTypes, ActivityIndicator } from 'react-native';
import { connect as reduxConnect } from 'react-redux';
import { select } from 'redux/reducers';
import { firebaseSubscribe, firebaseUnsubscribe } from './firebaseCollections.act';

function mapStateToPropsWithRef(state, collectionRef) {
  return {
    isLoading: !select.firebaseCollectionByRefIsInitilized(state, collectionRef(state)),
    collectionRef: collectionRef(state),
  };
}

export const connect = (...reduxArgs) => (collectionRef) =>
  Component => {
    const WiredComponent = reduxConnect(...reduxArgs)(Component);
    return reduxConnect(state => mapStateToPropsWithRef(state, collectionRef))(
      class FirebaseContainer extends React.Component {
        static viewPropTypes = {
          dispatch: ViewPropTypes.func,
          isLoading: ViewPropTypes.bool,
          collectionRef: ViewPropTypes.string,
        };

        constructor(props, context) {
          super(props, context);
          this.state = {
            collectionRef: () => this.props.collectionRef,
          };
        }

        componentDidMount = () => {
          this.props.dispatch(firebaseSubscribe(this.state.collectionRef));
        };

        componentWillUnmount = () => {
          this.props.dispatch(firebaseUnsubscribe(this.state.collectionRef));
        };

        render() {
          return this.props.isLoading ?
            <ActivityIndicator style={{ marginTop: 20 }} />
            : <WiredComponent {...this.props} />;
        }
      }
    );
  };


export default connect;
