import React from 'react';
import { connect } from 'react-redux';

import { signIn, signOut } from '../actions';

class GoogleAuth extends React.Component {
  componentDidMount() {
    window.gapi.load('client:auth2', () => {  // callbackruns if auth2 successfully loaded
      window.gapi.client.init({               // returns a promise
        clientId: '198188072174-v2955tbcp8d0dp4oo0subogg7fhirccc.apps.googleusercontent.com',
        scope: 'email',
      }).then(() => {
        this.auth = window.gapi.auth2.getAuthInstance();

        this.onAuthChange(this.auth.isSignedIn.get());
        this.auth.isSignedIn.listen(this.onAuthChange);
      });
    });
  }

  onAuthChange = (isSignedIn) => {
    if (isSignedIn) {
      this.props.signIn(this.auth.currentUser.get().getId());
    } else {
      this.props.signOut();
    }
  }

  onSignInClick = () => {
    this.auth.signIn();
  }

  onSignOutClick = () => {
    this.auth.signOut();
  }

  renderAuthButton() {
    const { isSignedIn } = this.props;

    if (isSignedIn === null) {
      return;
    } else if (isSignedIn) {
      return (
        <button className="ui red google button" onClick={this.onSignOutClick}>
          <i className="google icon"/>
          Sign Out
        </button>
      );
    } else {
      return (
        <button className="ui red google button" onClick={this.onSignInClick}>
          <i className="google icon"/>
          Sign In with Google
        </button>
      );
    }
  }

  render() {
    return (
      <div>{this.renderAuthButton()}</div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn
  }
}

export default connect(
  mapStateToProps,
  { signIn, signOut }
)(GoogleAuth);
