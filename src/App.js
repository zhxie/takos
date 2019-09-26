import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Layout } from 'antd';

import './App.css';
import LoginWindow from './LoginWindow';
import MainWindow from './MainWindow';
import NotFoundResult from './components/NotFoundResult';

const { Content } = Layout;
const PrivateRoute = ({ isLoggedIn, ...props }) => (isLoggedIn ? <Route {...props} /> : <Redirect to="/login" />);

class App extends React.Component {
  state = {
    isLogin: false
  };

  constructor(props) {
    super(props);
    if (window.localStorage.cookie !== undefined) {
      this.state = { isLogin: true };
    }
  }

  onLoginDone = () => {
    this.setState({ isLogin: true });
  };

  renderNotFound() {
    return (
      <Layout>
        <Content class="App-content">
          <NotFoundResult />
        </Content>
      </Layout>
    );
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" render={props => <LoginWindow {...props} onDone={this.onLoginDone} />} />
          <Route exact path="/404" component={this.renderNotFound} />
          <PrivateRoute isLoggedIn={this.state.isLogin} path="/" component={MainWindow} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
