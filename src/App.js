import React from 'react';

import './App.css';
import MainWindow from './MainWindow';
import LoginWindow from './LoginWindow';

class App extends React.Component {
  state = {
    isLogin: false
  };

  onLoginDone = () => {
    this.setState({ isLogin: true });
  };

  render() {
    if (!this.state.isLogin) {
      return <LoginWindow onDone={this.onLoginDone} />;
    } else {
      return <MainWindow />;
    }
  }
}

export default App;
