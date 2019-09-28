import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Layout, Steps, Typography, Select, Button, Alert, Form, Row, Col, Input, Icon, Modal } from 'antd';

import './LoginWindow.css';
import logo from './assets/images/logo.svg';
import DoneResult from './components/DoneResult';
import { NINTENDO_ACCOUNTS_AUTHORIZE } from './utils/FileFolderUrl';
import LoginHelper from './utils/LoginHelper';
import StorageHelper from './utils/StorageHelper';
import './utils/StringHelper';

const { Content } = Layout;
const { Step } = Steps;
const { Paragraph, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

class LoginWindow extends React.Component {
  state = {
    step: 0,
    isUrl: false,
    isCookie: false,
    isValid: true,
    cookie: '',
    language: 'en_US'
  };

  constructor(props) {
    super(props);
    StorageHelper.initializeStorage();
    this.loginParameters = LoginHelper.generateParameters();
  }

  changeLanguage = value => {
    if (this.state.language !== value) {
      this.setState({ language: value });
    }
    switch (value) {
      case 'en_US':
        window.localStorage.language = 'en_US';
        break;
      case 'ja_JP':
        window.localStorage.language = 'ja_JP';
        break;
      case 'zh_CN':
        window.localStorage.language = 'zh_CN';
        break;
      default:
        throw RangeError();
    }
    window.location.reload();
  };

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
    return LoginHelper.getSessionToken(this.loginParameters.sessionTokenCode, this.loginParameters.codeVerifier)
      .then(result => {
        if (result === null) {
          throw new RangeError();
        } else {
          window.localStorage.sessionToken = result;
          return this.updateCookie();
        }
      })
      .catch(() => {
        Modal.error({
          title: this.props.intl.formatMessage({
            id: 'app.modal.error.get_session_token',
            defaultMessage: 'Can not update cookie'
          }),
          content: this.props.intl.formatMessage({
            id: 'app.modal.error.get_session_token.content',
            defaultMessage:
              'Your network can not be reached, or the link is expired. Please refresh the page and try again.'
          })
        });
      });
  };

  updateCookie = () => {
    return LoginHelper.getCookie(window.localStorage.sessionToken)
      .then(result => {
        if (result === null) {
          throw new RangeError();
        } else {
          this.cookieOnChange(result);
        }
      })
      .catch(() => {
        Modal.error({
          title: this.props.intl.formatMessage({
            id: 'app.modal.error.update_cookie',
            defaultMessage: 'Can not update cookie'
          }),
          content: (
            <div>
              <p style={{ margin: 0 }}>
                {this.props.intl.formatMessage({
                  id: 'app.modal.error.update_cookie.content.1',
                  defaultMessage:
                    'Your network can not be reached, or your login is expired. Please re-login or try again.'
                })}
              </p>
              <p style={{ margin: 0 }}>
                {this.props.intl.formatMessage(
                  {
                    id: 'app.modal.error.update_cookie.content.2',
                    defaultMessage:
                      'And you can try using third-party apps like <a1>Ikas</a1>, <a2>splatnet2statink</a2>, <a3>Salmonia</a3> to get your cookie.'
                  },
                  {
                    a1: msg => <a href="https://github.com/zhxie/Ikas">{msg}</a>,
                    a2: msg => <a href="https://github.com/frozenpandaman/splatnet2statink">{msg}</a>,
                    a3: msg => <a href="https://github.com/tkgstrator/Salmonia">{msg}</a>
                  }
                )}
              </p>
            </div>
          )
        });
      });
  };

  showConfirm = () => {
    const getSessionToken = this.getSessionToken;
    const updateCookie = this.updateCookie;
    if (this.state.isUrl) {
      this.loginParameters.sessionTokenCode = this.state.cookie.match(/de=(.*)&/i)[1];
      confirm({
        title: this.props.intl.formatMessage({
          id: 'app.modal.confirm.update_cookie',
          defaultMessage: 'Do you want to update cookie?'
        }),
        content: this.props.intl.formatMessage(
          {
            id: 'app.modal.confirm.update_cookie.content',
            defaultMessage:
              'Automatic cookie generation involves making a secure request to two non-Nintendo servers with minimal, non-identifying information. Please read "Security and Privacy" section in <a>README</a> carefully before you start.'
          },
          {
            a: msg => <a href="https://github.com/zhxie/takos/blob/master/README.md#security-and-privacy">{msg}</a>
          }
        ),
        onOk() {
          return getSessionToken();
        },
        onCancel() {}
      });
    } else {
      if (!window.localStorage.sessionToken) {
        Modal.error({
          title: this.props.intl.formatMessage({
            id: 'app.modal.error.update_cookie_no_session_token',
            defaultMessage: 'Can not update cookie'
          }),
          content: this.props.intl.format({
            id: 'app.modal.error.update_cookie_no_session_token.content',
            defaultMessage: 'Takos can not update cookie unless you use automatic cookie generation.'
          })
        });
      } else {
        confirm({
          title: this.props.intl.formatMessage({
            id: 'app.modal.confirm.update_cookie',
            defaultMessage: 'Do you want to update cookie?'
          }),
          content: this.props.intl.formatMessage(
            {
              id: 'app.modal.confirm.update_cookie.content',
              defaultMessage:
                'Automatic cookie generation involves making a secure request to two non-Nintendo servers with minimal, non-identifying information. Please read "Security and Privacy" section in <a>README</a> carefully before you start.'
            },
            {
              a: msg => <a href="https://github.com/zhxie/takos/blob/master/README.md#security-and-privacy">{msg}</a>
            }
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
            <Text style={{ fontSize: 32 }}>
              <FormattedMessage id="app.welcome.title" defaultMessage="Welcome to Takos" />
            </Text>
            <Text type="secondary" style={{ fontSize: 16 }}>
              <FormattedMessage
                id="app.description"
                defaultMessage="A cross-platform schedule and battle statistic client of Splatoon 2."
              />
            </Text>
          </div>
        </div>
        <div className="LoginWindow-content-button">
          <Select
            value={this.state.language}
            onChange={this.changeLanguage}
            defaultValue="en_US"
            style={{ width: 120, margin: '0 0 24px 0' }}
          >
            <Option value="en_US">English</Option>
            <Option value="ja_JP">日本語</Option>
            <Option value="zh_CN">中文</Option>
          </Select>
          <Button className="LoginWindow-content-button-start" onClick={this.toNext} type="primary">
            <FormattedMessage id="app.next" defaultMessage="Next" />
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
                <FormattedMessage
                  id="app.welcome.cookie.1"
                  defaultMessage="In order to get the battle, salmon run, statistics and gear shop data, you have to log into the SplatNet."
                />
              </Text>
            </Paragraph>
            <Paragraph>
              <Text type="secondary" style={{ fontSize: 16 }}>
                <FormattedMessage
                  id="app.welcome.cookie.2"
                  defaultMessage="Takos uses cookies to access the SplatNet. This cookie may be obtained automatically by automatic cookie generation introducted in <a1>splatnet2statink</a1>, or be retrieved by other methods manually, like intercepting into the device's traffice with SplatNet, which is also called <a2>the MitM</a2>."
                  values={{
                    a1: msg => <a href="https://github.com/frozenpandaman/splatnet2statink#cookie-generation">{msg}</a>,
                    a2: msg => (
                      <a href="https://github.com/frozenpandaman/splatnet2statink/wiki/mitmproxy-instructions">{msg}</a>
                    )
                  }}
                />
              </Text>
            </Paragraph>
          </div>
        </div>
        <div className="LoginWindow-content-input-wrapper">
          <div className="LoginWindow-content-input">
            <Alert
              message={<FormattedMessage id="app.alert.warning" defaultMessage="Warning" />}
              description={
                <p style={{ margin: 0 }}>
                  <FormattedMessage
                    id="app.alert.warning.automatic_cookie_generation"
                    defaultMessage='Automatic cookie generation involves making a secure request to two non-Nintendo servers with minimal, non-identifying information. Please read "Security and Privacy" section in <a>README</a> carefully before you start.'
                    values={{
                      a: msg => (
                        <a href="https://github.com/zhxie/takos/blob/master/README.md#security-and-privacy">{msg}</a>
                      )
                    }}
                  />
                </p>
              }
              type="warning"
              showIcon
              style={{ width: '100%' }}
            />
            <Alert
              message={<FormattedMessage id="app.alert.info" defaultMessage="Info" />}
              description={
                <p style={{ margin: 0 }}>
                  <FormattedMessage
                    id="app.alert.info.use_automatic_cookie_generation_first_time"
                    defaultMessage='If you have not used automatic cookie generation and want to use, please open <a>Nintendo Account</a> in browser, log in, right click on "Select this person", copy the link address, paste it into the text box below, and press "Update cookie".'
                    values={{
                      a: msg => (
                        <a
                          href={NINTENDO_ACCOUNTS_AUTHORIZE.format(
                            this.loginParameters.state,
                            this.loginParameters.codeChallenge
                          )}
                        >
                          {msg}
                        </a>
                      )
                    }}
                  />
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
                    <Button onClick={this.showConfirm}>
                      <FormattedMessage id="app.cookie.update" defaultMessage="Update cookie" />
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
            <Button className="LoginWindow-content-button-start" onClick={this.toNext} type="primary">
              <FormattedMessage id="app.next" defaultMessage="Next" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  renderDone() {
    return (
      <DoneResult
        extra={[
          <Link to="/" key="done">
            <Button type="primary">
              <FormattedMessage id="app.done" defaultMessage="Done" />
            </Button>
          </Link>
        ]}
      />
    );
  }

  render() {
    return (
      <Layout>
        <Content className="LoginWindow-main">
          <Steps className="LoginWindow-steps" current={this.state.step}>
            <Step title={<FormattedMessage id="app.welcome" defaultMessage="Welcome" />} />
            <Step title={<FormattedMessage id="app.log_in" defaultMessage="Log In" />} />
            <Step title={<FormattedMessage id="app.done" defaultMessage="Done" />} />
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
    if (window.localStorage.language !== undefined) {
      switch (window.localStorage.language) {
        case 'en_US':
          this.setState({ language: 'en_US' });
          break;
        case 'ja_JP':
          this.setState({ language: 'ja_JP' });
          break;
        case 'zh_CN':
          this.setState({ language: 'zh_CN' });
          break;
        default:
          this.setState({ language: 'en_US' });
          break;
      }
    }
  }
}

export default injectIntl(LoginWindow);
