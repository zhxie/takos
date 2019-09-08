import React from 'react';
import { Layout, PageHeader, Alert, Form, Row, Col, Input, Icon, Button, Modal } from 'antd';

import './SettingsWindow.css';
import { NINTENDO_ACCOUNTS_AUTHORIZE } from './utils/FileFolderUrl';
import './utils/StringHelper';
import LoginHelper from './utils/LoginHelper';

const { Header, Content } = Layout;
const { confirm } = Modal;

class SettingsWindow extends React.Component {
  state = {
    isUrl: false,
    isCookie: false,
    isValid: true,
    cookie: ''
  };

  constructor(props) {
    super(props);
    this.loginParameters = LoginHelper.generateParameters();
  }

  cookieOnChange = value => {
    if (this.state.cookie !== value) {
      this.setState({ cookie: value });
    }
    const re = /^[0-9A-Fa-f]{40}$/g;
    if (value.includes('session_token_code=')) {
      this.setState({ isUrl: true, isCookie: false, isValid: true });
    } else if (re.test(value)) {
      this.setState({ isUrl: false, isCookie: true, isValid: true });
      window.localStorage.cookie = value;
    } else {
      this.setState({ isUrl: false, isCookie: false });
    }
  };

  getSessionToken = () => {
    return LoginHelper.getSessionToken(this.loginParameters.sessionTokenCode, this.loginParameters.codeVerifier).then(
      result => {
        if (!result) {
          Modal.error({
            title: 'Can not update cookie',
            content: 'Your network can not be reached, or the link is expired, please refresh the page and try again.'
          });
          return;
        } else {
          window.localStorage.sessionToken = result;
          return this.updateCookie();
        }
      }
    );
  };

  updateCookie = () => {
    return LoginHelper.updateCookie(window.localStorage.sessionToken).then(result => {
      if (!result) {
        Modal.error({
          title: 'Can not update cookie',
          content: 'Your network can not be reached, or your login is expired, please re-login or try again.'
        });
      } else {
        this.cookieOnChange(result);
      }
    });
  };

  showConfirm = () => {
    const getSessionToken = this.getSessionToken;
    const updateCookie = this.updateCookie;
    if (this.state.isUrl) {
      this.loginParameters.sessionTokenCode = this.state.cookie.match(/de=(.*)&/i)[1];
      confirm({
        title: 'Do you want to update cookie?',
        content: (
          <p style={{ margin: 0 }}>
            Automatic cookie generation involves making a secure request to two non-Nintendo servers with minimal,
            non-identifying information. Please read "Security and Privacy" section in{' '}
            <a href="https://github.com/zhxie/takos/blob/master/README.md#security-and-privacy">README</a> carefully
            before you start.
          </p>
        ),
        onOk() {
          return getSessionToken();
        },
        onCancel() {}
      });
    } else {
      if (!window.localStorage.sessionToken) {
        Modal.error({
          title: 'Can not update cookie',
          content: 'Takos can not update cookie unless you use automatic cookie generation.'
        });
      } else {
        confirm({
          title: 'Do you want to update cookie?',
          content: (
            <p style={{ margin: 0 }}>
              Automatic cookie generation involves making a secure request to two non-Nintendo servers with minimal,
              non-identifying information. Please read "Security and Privacy" section in{' '}
              <a href="https://github.com/zhxie/takos/blob/master/README.md#security-and-privacy">README</a> carefully
              before you start.
            </p>
          ),
          onOk() {
            return updateCookie();
          },
          onCancel() {}
        });
      }
    }
  };

  render() {
    console.log(this.loginParameters);
    return (
      <Layout>
        <Header className="SettingsWindow-header" style={{ zIndex: 1 }}>
          <img className="SettingsWindow-header-icon" alt="settings" />
          <p className="SettingsWindow-header-title">Schedules</p>
        </Header>
        <Content className="SettingsWindow-content">
          <PageHeader title="User" />
          <Alert
            message="Warning"
            description={
              <p style={{ margin: 0 }}>
                Automatic cookie generation involves making a secure request to two non-Nintendo servers with minimal,
                non-identifying information. Please read "Security and Privacy" section in{' '}
                <a href="https://github.com/zhxie/takos/blob/master/README.md#security-and-privacy">README</a> carefully
                before you start.
              </p>
            }
            type="warning"
            showIcon
            style={{ margin: '12px 24px 0 24px', width: 'calc(100% - 48px)' }}
          />
          <Alert
            message="Info"
            description={
              <p style={{ margin: 0 }}>
                If you want to re-login, switch account and use automatic cookie generation, please open{' '}
                <a
                  href={NINTENDO_ACCOUNTS_AUTHORIZE.format(
                    this.loginParameters.state,
                    this.loginParameters.codeChallenge
                  )}
                >
                  Nintendo Account
                </a>{' '}
                in browser, log in, right click on "Select this person", copy the link address, paste it into the text
                box below, and press "Update cookie".
              </p>
            }
            type="info"
            showIcon
            style={{ margin: '12px 24px 0 24px', width: 'calc(100% - 48px)' }}
          />
          <Form className="SettingsWindow-content-user" labelCol={{ span: 24 }}>
            <Form.Item label="Cookie">
              <Row gutter={8}>
                <Col sm={18} md={12}>
                  <Input
                    value={this.state.cookie}
                    onChange={e => {
                      this.cookieOnChange(e.target.value);
                    }}
                    allowClear
                    prefix={(() => {
                      if (this.state.isUrl) {
                        return <Icon type="link" style={{ color: 'rgba(0,0,0,.25)' }} />;
                      } else if (this.state.isCookie) {
                        return <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />;
                      } else {
                        return <Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />;
                      }
                    })()}
                  />
                </Col>
                <Col span={6}>
                  <Button onClick={this.showConfirm}>Update cookie</Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    );
  }

  componentDidMount() {
    this.cookieOnChange(window.localStorage.cookie);
  }

  componentDidUpdate(prevProps) {
    if (this.state.cookie !== window.localStorage.cookie) {
      this.setState({ cookie: window.localStorage.cookie });
    }
  }
}

export default SettingsWindow;
