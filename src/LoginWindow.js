import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Steps, Typography, Button, Alert, Form, Row, Col, Input, Icon, Modal, Result } from 'antd';

import './LoginWindow.css';
import logo from './assets/images/logo.svg';
import { OctolingsKillIcon } from './components/CustomIcons';
import { NINTENDO_ACCOUNTS_AUTHORIZE } from './utils/FileFolderUrl';
import './utils/StringHelper';
import LoginHelper from './utils/LoginHelper';

const { Content } = Layout;
const { Step } = Steps;
const { Paragraph, Text } = Typography;
const { confirm } = Modal;

class LoginWindow extends React.Component {
  state = {
    step: 0,
    isUrl: false,
    isCookie: false,
    isValid: true,
    cookie: ''
  };

  constructor(props) {
    super(props);
    this.loginParameters = LoginHelper.generateParameters();
  }

  toNext = () => {
    if (this.state.step === 1) {
      window.localStorage.cookie = this.state.cookie;
      this.props.onDone();
    }
    this.setState({ step: this.state.step + 1 });
  };

  cookieOnChange = value => {
    if (this.state.cookie !== value) {
      this.setState({ cookie: value });
    }
    const re = /^[0-9A-Fa-f]{40}$/g;
    if (value === undefined) {
      this.setState({ isUrl: false, isCookie: false });
    } else if (value.includes('session_token_code=')) {
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
          content: (
            <div>
              <p style={{ margin: 0 }}>
                Your network can not be reached, or your login is expired, please re-login or try again.
              </p>
              <p style={{ margin: 0 }}>
                And you can try using third-party apps like <a href="https://github.com/zhxie/Ikas">Ikas</a>,{' '}
                <a href="https://github.com/frozenpandaman/splatnet2statink">splatnet2statink</a>,{' '}
                <a href="https://github.com/tkgstrator/Salmonia">Salmonia</a> to get your cookie.
              </p>
            </div>
          )
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

  renderWelcome = () => {
    return (
      <div>
        <div className="LoginWindow-content-welcome-wrapper">
          <div className="LoginWindow-content-welcome">
            <img src={logo} className="LoginWindow-content-welcome-logo" alt="logo" />
            <Text style={{ fontSize: 32 }}>Welcome to Takos</Text>
            <Text type="secondary" style={{ fontSize: 16 }}>
              A cross-platform schedule and battle statistic client of Splatoon 2.
            </Text>
          </div>
        </div>
        <div className="LoginWindow-content-button">
          <Button className="LoginWindow-content-button-start" onClick={this.toNext} type="primary">
            Next
          </Button>
        </div>
      </div>
    );
  };

  renderLogin = () => {
    return (
      <div>
        <div className="LoginWindow-content-login-wrapper">
          <div className="LoginWindow-content-login">
            <Paragraph>
              <Text style={{ fontSize: 18 }}>
                In order to get the battle, salmon run, statistics and gear shop data, you have to log into the
                SplatNet.
              </Text>
            </Paragraph>
            <Paragraph>
              <Text type="secondary" style={{ fontSize: 16 }}>
                Takos uses cookies to access the SplatNet. This cookie may be obtained automatically by automatic cookie
                generation introducted in{' '}
                <a href="https://github.com/frozenpandaman/splatnet2statink#cookie-generation">splatnet2statink</a>, or
                be retrieved by other methods manually, like intercepting into the device's traffice with SplatNet,
                which is also called{' '}
                <a href="https://github.com/frozenpandaman/splatnet2statink/wiki/mitmproxy-instructions">the MitM</a>.
              </Text>
            </Paragraph>
          </div>
        </div>
        <div className="LoginWindow-content-input-wrapper">
          <div className="LoginWindow-content-input">
            <Alert
              message="Warning"
              description={
                <p style={{ margin: 0 }}>
                  Automatic cookie generation involves making a secure request to two non-Nintendo servers with minimal,
                  non-identifying information. Please read "Security and Privacy" section in{' '}
                  <a href="https://github.com/zhxie/takos/blob/master/README.md#security-and-privacy">README</a>{' '}
                  carefully before you start.
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
            <Form className="LoginWindow-content-input-form">
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
                  <Col span={16}>
                    <Input
                      value={this.state.cookie}
                      onChange={e => {
                        this.cookieOnChange(e.target.value);
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
            <Button className="LoginWindow-content-button-start" onClick={this.toNext} type="primary">
              Next
            </Button>
          </div>
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
              className="LoginWindow-content-done-icon"
              style={{
                width: '2em',
                fill: '#f6ffed',
                stroke: '#52c41a'
              }}
            />
          }
          title="Booyah!"
          subTitle="It is all done. Enjoy it!"
          extra={[
            <Link to="/" key="done">
              <Button type="primary">Done</Button>
            </Link>
          ]}
        />
      </div>
    );
  }

  render() {
    return (
      <Layout>
        <Content className="LoginWindow-main">
          <Steps className="LoginWindow-steps" current={this.state.step}>
            <Step title="Welcome" />
            <Step title="Log In" />
            <Step title="Done" />
          </Steps>
          <div className="LoginWindow-content">
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
    if (window.localStorage.cookie !== undefined) {
      this.cookieOnChange(window.localStorage.cookie);
    }
  }
}

export default LoginWindow;
