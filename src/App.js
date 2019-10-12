import React from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { ConfigProvider, Layout } from 'antd';
import antd_en_US from 'antd/es/locale/en_US';
import antd_ja_JP from 'antd/es/locale/ja_JP';
import antd_zh_CN from 'antd/es/locale/zh_CN';

import './App.css';
import LoginWindow from './LoginWindow';
import MainWindow from './MainWindow';
import en_US from './assets/locales/en_US';
import ja_JP from './assets/locales/ja_JP';
import zh_CN from './assets/locales/zh_CN';
import NotFoundResult from './components/NotFoundResult';
import StorageHelper from './utils/StorageHelper';

const { Content } = Layout;
const PrivateRoute = ({ isLoggedIn, ...props }) => (isLoggedIn ? <Route {...props} /> : <Redirect to="/login" />);

class App extends React.Component {
  state = {
    language: 'en_US',
    isLogin: false
  };

  constructor(props) {
    super(props);
    // Values
    let language = 'en_US';
    if (StorageHelper.language() === null) {
      StorageHelper.setLanguage('en_US');
    }
    switch (StorageHelper.language()) {
      case 'en_US':
        language = 'en_US';
        break;
      case 'ja_JP':
        language = 'ja_JP';
        break;
      case 'zh_CN':
        language = 'zh_CN';
        break;
      default:
        language = 'en_US';
        break;
    }
    let isLogin = false;
    if (StorageHelper.cookie() !== null) {
      isLogin = true;
    }
    this.state = { language: language, isLogin: isLogin };
    // Pass setLanguage to global
    window.setLanguage = this.setLanguage;
  }

  onLoginDone = () => {
    this.setState({ isLogin: true });
  };

  setLanguage = language => {
    switch (language) {
      case 'en_US':
        StorageHelper.setLanguage('en_US');
        break;
      case 'ja_JP':
        StorageHelper.setLanguage('ja_JP');
        break;
      case 'zh_CN':
        StorageHelper.setLanguage('zh_CN');
        break;
      default:
        throw RangeError();
    }
    this.setState({ language: language });
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
      <ConfigProvider
        autoInsertSpaceInButton={false}
        locale={(() => {
          switch (this.state.language) {
            case 'en_US':
              return antd_en_US;
            case 'ja_JP':
              return antd_ja_JP;
            case 'zh_CN':
              return antd_zh_CN;
            default:
              return antd_en_US;
          }
        })()}
      >
        <IntlProvider
          locale={(() => {
            switch (this.state.language) {
              case 'en_US':
                return 'en';
              case 'ja_JP':
                return 'ja';
              case 'zh_CN':
                return 'zh';
              default:
                return 'en';
            }
          })()}
          messages={(() => {
            switch (this.state.language) {
              case 'en_US':
                return en_US;
              case 'ja_JP':
                return ja_JP;
              case 'zh_CN':
                return zh_CN;
              default:
                return en_US;
            }
          })()}
          formats={{
            time: {
              hour24: { hour12: false }
            }
          }}
        >
          <HashRouter>
            <Switch>
              <Route exact path="/login" render={props => <LoginWindow {...props} onDone={this.onLoginDone} />} />
              <Route exact path="/404" component={this.renderNotFound} />
              <PrivateRoute isLoggedIn={this.state.isLogin} path="/" component={MainWindow} />
            </Switch>
          </HashRouter>
        </IntlProvider>
      </ConfigProvider>
    );
  }
}

export default App;
