import React from 'react';

import Main from './Main';
import Login from './Login';

class App extends React.Component {
  state = {
    isLogin: false
  };

  onLoginDone = () => {
    this.setState({ isLogin: true });
  };

  render() {
    if (!this.state.isLogin) {
      return <Login onDone={this.onLoginDone} />;
    } else {
      return <Main />;
    }
  }
}

export default App;
