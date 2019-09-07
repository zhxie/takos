import React from 'react';
import { Layout, Steps, Typography, Button, Alert, Form, Row, Col, Input, Icon, Modal, Result } from 'antd';

import logo from './assets/images/logo.svg';
import './Login.css';
import './utils/StringHelper';
import { OctolingsKillIcon } from './components/CustomIcons';
import { NINTENDO_ACCOUNTS_AUTHORIZE } from './utils/FileFolderUrl';
import LoginHelper from './utils/LoginHelper';

const { Content } = Layout;
const { Step } = Steps;
const { Paragraph, Text } = Typography;
const { confirm } = Modal;

class Login extends React.Component {
  state = {
    step: 0,
    isUrl: false,
    isCookie: false,
    isValid: true,
    input: ''
  };

  toNext = () => {
    if (this.state.step === 2) {
      window.cookie = this.state.input;
    }
    this.setState({ step: this.state.step + 1 });
  };

  inputOnChange = value => {
    if (this.state.input !== value) {
      this.setState({ input: value });
    }
    const re = /^[0-9A-Fa-f]{40}$/g;
    if (value.includes('session_token_code=')) {
      this.setState({ isUrl: true, isCookie: false, isValid: true });
    } else if (re.test(value)) {
      this.setState({ isUrl: false, isCookie: true, isValid: true });
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
          window.sessionToken = result;
          return this.updateCookie();
        }
      }
    );
  };

  updateCookie = (sessionToken = window.sessionToken) => {
    return LoginHelper.updateCookie(sessionToken).then(result => {
      if (!result) {
        Modal.error({
          title: 'Can not update cookie',
          content: 'Your network can not be reached, or your login is expired, please re-login or try again.'
        });
      } else {
        this.inputOnChange(result);
      }
    });
  };

  showConfirm = () => {
    const getSessionToken = this.getSessionToken;
    const updateCookie = this.updateCookie;
    if (this.state.isUrl) {
      this.loginParameters.sessionTokenCode = this.state.input.match(/de=(.*)&/i)[1];
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
    } else if (this.state.isCookie) {
      if (!window.sessionToken) {
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
    } else {
      this.setState({ isValid: false });
    }
  };

  renderWelcome = () => {
    return (
      <div>
        <div className="Login-content-welcome">
          <img src={logo} className="Login-content-welcome-logo" alt="logo" />
          <Text style={{ fontSize: 32 }}>Welcome to Takos</Text>
          <Text type="secondary" style={{ fontSize: 16 }}>
            A cross-platform schedule and battle statistic client of Splatoon 2.
          </Text>
        </div>
        <div className="Login-content-button">
          <Button className="Login-content-button-start" onClick={this.toNext} type="primary">
            Next
          </Button>
        </div>
      </div>
    );
  };

  renderLogin = () => {
    return (
      <div>
        <div className="Login-content-login">
          <Paragraph>
            <Text style={{ fontSize: 18 }}>
              In order to get the battle, salmon run, statistics and gear shop data, you have to log into the SplatNet.
            </Text>
          </Paragraph>
          <Paragraph>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Takos uses cookies to access the SplatNet. This cookie may be obtained automatically by automatic cookie
              generation introducted in{' '}
              <a href="https://github.com/frozenpandaman/splatnet2statink#cookie-generation">splatnet2statink</a>, or be
              retrieved by other methods manually, like intercepting into the device's traffice with SplatNet, which is
              also called{' '}
              <a href="https://github.com/frozenpandaman/splatnet2statink/wiki/mitmproxy-instructions">the MitM</a>.
            </Text>
          </Paragraph>
        </div>
        <div className="Login-content-input">
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
            style={{ width: '100%' }}
          />
          <Alert
            message="Info"
            description={
              <p style={{ margin: 0 }}>
                If you have not used automatic cookie generation and want to use, please open{' '}
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
            style={{ margin: '12px 0 0 0', width: '100%' }}
          />
          <Form className="Login-content-input-form">
            <Form.Item
              validateStatus={(() => {
                if (this.state.isValid) {
                  return '';
                } else {
                  return 'error';
                }
              })()}
            >
              <Row gutter={8}>
                <Col span={14}>
                  <Input
                    value={this.state.input}
                    onChange={e => {
                      this.inputOnChange(e.target.value);
                    }}
                    allowClear
                    placeholder="URL / Cookie"
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
                <Col span={8}>
                  <Button onClick={this.showConfirm}>Update cookie</Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
          <Button className="Login-content-button-start" onClick={this.toNext} type="primary">
            Next
          </Button>
        </div>
      </div>
    );
  };

  renderDone() {
    return (
      <div>
        <Result
          icon={
            <OctolingsKillIcon
              className="Login-content-done-icon"
              style={{
                width: '2em',
                fill: '#f6ffed',
                stroke: '#52c41a'
              }}
            />
          }
          title="Booyah!"
          subTitle="It is all done. Enjoy it!"
        />
        <div className="Login-content-button2">
          <Button className="Login-content-button-start" onClick={this.props.onDone} type="primary">
            Done
          </Button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Layout>
        <Content className="Login-main">
          <Steps className="Login-steps" current={this.state.step}>
            <Step title="Welcome" />
            <Step title="Log In" />
            <Step title="Done" />
          </Steps>
          <div className="Login-content">
            {(() => {
              switch (this.state.step) {
                case 0:
                  return this.renderWelcome();
                case 1:
                  return this.renderLogin();
                case 2:
                  return this.renderDone();
                default:
                  throw new RangeError();
              }
            })()}
          </div>
        </Content>
      </Layout>
    );
  }

  componentDidMount() {
    this.loginParameters = LoginHelper.generateParameters();
  }
}

export default Login;
