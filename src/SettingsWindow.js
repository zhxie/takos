import React from 'react';
import { Redirect } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Layout, PageHeader, Alert, Form, Row, Col, Input, Icon, Button, Modal, Select, Tooltip, Switch } from 'antd';

import './SettingsWindow.css';
import icon from './assets/images/character-c-q-cumber.png';
import ErrorResult from './components/ErrorResult';
import LoadingResult from './components/LoadingResult';
import { Battle } from './models/Battle';
import TakosError from './utils/ErrorHelper';
import FileFolderUrl from './utils/FileFolderUrl';
import LoginHelper from './utils/LoginHelper';
import StorageHelper from './utils/StorageHelper';
import './utils/StringHelper';

const { Header, Content } = Layout;
const { confirm } = Modal;
const { Option } = Select;

class SettingsWindow extends React.Component {
  state = {
    // Render
    error: false,
    errorLog: 'unknown_error',
    errorChecklist: [],
    toLogin: false,
    exporting: false,
    importing: false,
    // Automatic
    isUrl: false,
    isCookie: false,
    isValid: true,
    // Value
    cookie: '',
    language: 'en_US',
    useSimpleLists: false
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
    if (value === undefined) {
      this.setState({ isUrl: false, isCookie: false });
    } else if (value.includes('session_token_code=')) {
      this.setState({ isUrl: true, isCookie: false, isValid: true });
    } else if (re.test(value)) {
      this.setState({ isUrl: false, isCookie: true, isValid: true });
      StorageHelper.setCookie(value);
    } else {
      this.setState({ isUrl: false, isCookie: false });
    }
  };

  changeLanguage = value => {
    if (this.state.language !== value) {
      this.setState({ language: value });
    }
    window.setLanguage(value);
  };

  changeUseSimpleLists = value => {
    if (this.state.useSimpleLists !== value) {
      this.setState({ useSimpleLists: value });
    }
    StorageHelper.setUseSimpleLists(value);
  };

  getSessionToken = () => {
    return LoginHelper.getSessionToken(this.loginParameters.sessionTokenCode, this.loginParameters.codeVerifier)
      .then(result => {
        if (result === null) {
          throw new RangeError();
        } else {
          StorageHelper.setSessionToken(result);
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
    return LoginHelper.getCookie(StorageHelper.sessionToken())
      .then(result => {
        if (result === null) {
          throw new RangeError();
        } else if (result.length !== 40) {
          return this.updateCookieFinal(result);
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
                    'Your network can not be reached, or your login is expired. Please re-log in or try again.'
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

  updateCookieFinal = accessToken => {
    // Cookie can not get by javascript because it is HttpOnly
    const thisHandler = this;
    Modal.confirm({
      title: this.props.intl.formatMessage({
        id: 'app.modal.confirm.update_cookie.octoling_operation_required',
        defaultMessage: 'Octoling operation required'
      }),
      content: (
        <div>
          <p style={{ margin: 0 }}>
            {this.props.intl.formatMessage({
              id: 'app.modal.confirm.update_cookie.octoling_operation_required.content',
              defaultMessage:
                'Takos has successfully get cookie, but for security reasons, your help is required to complete the login. Please follow the steps below:'
            })}
          </p>
          <p style={{ margin: '6px 0 0 0' }}>
            {this.props.intl.formatMessage({
              id: 'app.modal.confirm.update_cookie.octoling_operation_required.content.steps.1',
              defaultMessage: '1. Press Ctrl+Shift+I(Option+Command+I) to open the DevTools'
            })}
          </p>
          <p style={{ margin: 0 }}>
            {this.props.intl.formatMessage({
              id: 'app.modal.confirm.update_cookie.octoling_operation_required.content.steps.2',
              defaultMessage: '2. Click "Application" in the tab bar'
            })}
          </p>
          <p style={{ margin: 0 }}>
            {this.props.intl.formatMessage({
              id: 'app.modal.confirm.update_cookie.octoling_operation_required.content.steps.3',
              defaultMessage: '3. Expand "Cookies" and click the corresponding page in the sidebar, and click OK'
            })}
          </p>
        </div>
      ),
      icon: <Icon type="info-circle" />,
      onOk() {
        return LoginHelper.getCookieFinal(accessToken)
          .then(result => {
            if (result === null) {
              throw new RangeError();
            } else {
              Modal.info({
                title: thisHandler.props.intl.formatMessage({
                  id: 'app.modal.confirm.update_cookie.octoling_operation_required',
                  defaultMessage: 'Require octoling operation'
                }),
                content: (
                  <div>
                    <p style={{ margin: 0 }}>
                      {thisHandler.props.intl.formatMessage({
                        id: 'app.modal.confirm.update_cookie.octoling_operation_required.content',
                        defaultMessage:
                          'Takos has successfully get cookie, but for security reasons, your help is required to complete the login. Please follow the steps below:'
                      })}
                    </p>
                    <p style={{ margin: '6px 0 0 0' }}>
                      {thisHandler.props.intl.formatMessage({
                        id: 'app.modal.confirm.update_cookie.octoling_operation_required.content.steps.4',
                        defaultMessage:
                          'Finally, refresh the list, double click on value with the corresponding name "iksm_session", copy it, and paste into the text box below.'
                      })}
                    </p>
                  </div>
                )
              });
            }
          })
          .catch(() => {
            Modal.error({
              title: thisHandler.props.intl.formatMessage({
                id: 'app.modal.error.update_cookie',
                defaultMessage: 'Can not update cookie'
              }),
              content: (
                <div>
                  <p style={{ margin: 0 }}>
                    {thisHandler.props.intl.formatMessage({
                      id: 'app.modal.error.update_cookie.content.1',
                      defaultMessage:
                        'Your network can not be reached, or your login is expired. Please re-log in or try again.'
                    })}
                  </p>
                  <p style={{ margin: 0 }}>
                    {thisHandler.props.intl.formatMessage(
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
      },
      onCancel() {}
    });
  };

  triggerImportData = () => {
    document.getElementById('import').click();
  };

  importData = event => {
    console.log(event);
    this.setState({ importing: true });
    let reader = new FileReader();
    reader.onload = e => {
      const addBattleRecursively = (battles, i) => {
        return StorageHelper.addBattle(battles[i])
          .then(res => {
            if (res instanceof TakosError) {
              throw new TakosError(res.message);
            } else {
              if (i + 1 < battles.length) {
                return addBattleRecursively(battles, i + 1);
              }
            }
          })
          .catch(e => {
            if (e instanceof TakosError) {
              return new TakosError(e.message);
            } else {
              console.error(e);
              return new TakosError('can_not_import_data');
            }
          });
      };

      let battles = [];
      try {
        const data = JSON.parse(e.target.result);
        for (let i = 0; i < data.battles.length; ++i) {
          const battle = Battle.deserialize(data.battles[i]);
          if (battle.error !== null) {
            this.setState({
              error: true,
              errorLog: battle.error,
              errorChecklist: [
                <FormattedMessage
                  key="file"
                  id="app.problem.troubleshoot.importing_file"
                  defaultMessage="Your importing file"
                />
              ],
              importing: false
            });
            return;
          } else {
            battles.push(battle);
          }
        }
      } catch (e) {
        console.error(e);
        this.setState({
          error: true,
          errorLog: 'file_not_valid',
          errorChecklist: [
            <FormattedMessage
              key="file"
              id="app.problem.troubleshoot.importing_file"
              defaultMessage="Your importing file"
            />
          ],
          importing: false
        });
        return;
      }
      if (battles.length > 0) {
        addBattleRecursively(battles, 0)
          .then(res => {
            if (res instanceof TakosError) {
              throw new TakosError(res.message);
            } else {
              this.setState({ importing: false });
            }
          })
          .catch(e => {
            if (e instanceof TakosError) {
              this.setState({
                error: true,
                errorLog: e.message,
                errorChecklist: [
                  <FormattedMessage
                    key="file"
                    id="app.problem.troubleshoot.importing_file"
                    defaultMessage="Your importing file"
                  />
                ],
                importing: false
              });
            } else {
              console.error(e);
              this.setState({
                error: true,
                errorLog: 'can_not_import_data',
                errorChecklist: [
                  <FormattedMessage
                    key="file"
                    id="app.problem.troubleshoot.importing_file"
                    defaultMessage="Your importing file"
                  />
                ],
                importing: false
              });
            }
          });
      } else {
        this.setState({
          error: true,
          errorLog: 'file_empty',
          errorChecklist: [
            <FormattedMessage
              key="file"
              id="app.problem.troubleshoot.importing_file"
              defaultMessage="Your importing file"
            />
          ],
          importing: false
        });
      }
    };
    reader.readAsText(event.target.files[0]);
  };

  exportData = () => {
    this.setState({ exporting: true });
    StorageHelper.battles().then(res => {
      const date = new Date();
      const year = date.getFullYear();
      const month = '0' + (date.getMonth() + 1);
      const day = '0' + date.getDate();
      // Construct data
      let data = {};
      // Battles
      let battles = [];
      res.forEach(element => {
        battles.push(element);
      });
      data.battles = battles;
      // Export file
      const a = document.createElement('a');
      a.download = 'TakosBackup_{0}{1}{2}.json'.format(year, month.substr(-2), day.substr(-2));
      a.rel = 'noopener';
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }));
      a.dispatchEvent(new MouseEvent('click'));
      this.setState({ exporting: false });
    });
  };

  showUpdateCookieConfirm = () => {
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
      if (!StorageHelper.sessionToken()) {
        Modal.error({
          title: this.props.intl.formatMessage({
            id: 'app.modal.error.update_cookie_no_session_token',
            defaultMessage: 'Can not update cookie'
          }),
          content: this.props.intl.formatMessage({
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

  showLogOutConfirm = () => {
    const thisHandler = this;
    confirm({
      title: this.props.intl.formatMessage({
        id: 'app.modal.confirm.log_out',
        defaultMessage: 'Do you want to log out?'
      }),
      content: this.props.intl.formatMessage({
        id: 'app.modal.confirm.log_out.content',
        defaultMessage: 'Note that when you log out, all saved data, including battles and salmon run, will be cleared.'
      }),
      okType: 'danger',
      autoFocusButton: 'cancel',
      icon: <Icon type="exclamation-circle" />,
      onOk() {
        // Will first initialize storage and then go to login while the login will initialize storage again
        StorageHelper.initializeStorage()
          .then(res => {
            if (res instanceof TakosError) {
              throw new TakosError(res.message);
            } else {
              thisHandler.setState({ toLogin: true });
            }
          })
          .catch(e => {
            if (e instanceof TakosError) {
              thisHandler.setState({ error: true, errorLog: e.message, errorChecklist: [] });
            } else {
              console.error(e);
              thisHandler.setState({ error: true, errorLog: 'unknown_error', errorChecklist: [] });
            }
          });
      },
      onCancel() {}
    });
  };

  showClearDataConfirm = () => {
    const thisHandler = this;
    confirm({
      title: this.props.intl.formatMessage({
        id: 'app.modal.confirm.clear_data',
        defaultMessage: 'Do you want to clear data?'
      }),
      content: this.props.intl.formatMessage({
        id: 'app.modal.confirm.clear_data.content',
        defaultMessage:
          'Once the data is cleared, you will not be able to undo. It is recommended that you first export the data.'
      }),
      okType: 'danger',
      autoFocusButton: 'cancel',
      icon: <Icon type="exclamation-circle" />,
      onOk() {
        StorageHelper.clearData()
          .then(res => {
            if (res instanceof TakosError) {
              throw new TakosError(res.message);
            }
          })
          .catch(e => {
            if (e instanceof TakosError) {
              thisHandler.setState({ error: true, errorLog: e.message, errorChecklist: [] });
            } else {
              console.error(e);
              thisHandler.setState({ error: true, errorLog: 'unknown_error', errorChecklist: [] });
            }
          });
      },
      onCancel() {}
    });
  };

  render() {
    if (this.state.toLogin) {
      return <Redirect to="/login" />;
    } else if (this.state.error) {
      return (
        <ErrorResult
          error={this.state.errorLog}
          checklist={this.state.errorChecklist}
          extra={[
            <Button
              key="continue"
              onClick={() => {
                this.setState({ error: false });
              }}
              type="primary"
            >
              <FormattedMessage id="app.continue" defaultMessage="Continue" />
            </Button>
          ]}
        />
      );
    } else if (this.state.importing) {
      return (
        <LoadingResult
          description={
            <FormattedMessage
              id="app.result.loading.description.importing_data"
              defaultMessage="Takos is importing data, which will last for a few seconds to a few minutes..."
            />
          }
        />
      );
    } else {
      return (
        <Layout>
          <Header className="SettingsWindow-header" style={{ zIndex: 1 }}>
            <img className="SettingsWindow-header-icon" src={icon} alt="settings" />
            <p className="SettingsWindow-header-title">
              <FormattedMessage id="app.settings" defaultMessage="Settings" />
            </p>
          </Header>
          <Content className="SettingsWindow-content">
            <PageHeader title={<FormattedMessage id="app.settings.user" defaultMessage="User" />} />
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
              style={{ margin: '12px 24px 0 24px', width: 'calc(100% - 48px)' }}
            />
            <Alert
              message={<FormattedMessage id="app.alert.info" defaultMessage="Info" />}
              description={
                <p style={{ margin: 0 }}>
                  <FormattedMessage
                    id="app.alert.info.use_automatic_cookie_generation"
                    defaultMessage='If you want to re-log in and use automatic cookie generation, please open <a>Nintendo Account</a> in browser, log in, right click on "Select this person", copy the link address, paste it into the text box below, and press "Update cookie".'
                    values={{
                      a: msg => (
                        <a
                          href={FileFolderUrl.NINTENDO_ACCOUNTS_AUTHORIZE.format(
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
              style={{ margin: '12px 24px 0 24px', width: 'calc(100% - 48px)' }}
            />
            <Alert
              message={<FormattedMessage id="app.alert.info" defaultMessage="Info" />}
              description={
                <p style={{ margin: 0 }}>
                  <FormattedMessage
                    id="app.alert.info.switch_account"
                    defaultMessage="If you want to switch account, please log out first. Note that when you log out, all saved data, including battles and salmon run, will be cleared."
                  />
                </p>
              }
              type="info"
              showIcon
              style={{ margin: '12px 24px 0 24px', width: 'calc(100% - 48px)' }}
            />
            <Form className="SettingsWindow-content-form" labelCol={{ span: 24 }}>
              <Form.Item label={<FormattedMessage id="app.settings.user.cookie" defaultMessage="Cookie" />}>
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
                    <Button onClick={this.showUpdateCookieConfirm}>
                      <FormattedMessage id="app.settings.user.cookie.update" defaultMessage="Update cookie" />
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item label={<FormattedMessage id="app.settings.user.log_out" defaultMessage="Log Out" />}>
                <Row gutter={8}>
                  <Col>
                    <Button type="danger" onClick={this.showLogOutConfirm}>
                      <FormattedMessage id="app.settings.user.log_out" defaultMessage="Log Out" />
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
            <PageHeader title={<FormattedMessage id="app.settings.appearance" defaultMessage="Appearance" />} />
            <Form className="SettingsWindow-content-form" labelCol={{ span: 24 }}>
              <Form.Item
                label={
                  <FormattedMessage id="app.settings.appearance.use_simple_lists" defaultMessage="Use Simple Lists" />
                }
              >
                <Row gutter={8}>
                  <Col>
                    <Tooltip
                      placement="right"
                      title={
                        <FormattedMessage
                          id="app.settings.appearance.use_simple_lists.description"
                          defaultMessage="Use simple lists in battles and Salmon Run"
                        />
                      }
                    >
                      <Switch checked={this.state.useSimpleLists} onChange={this.changeUseSimpleLists} />
                    </Tooltip>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item label={<FormattedMessage id="app.settings.appearance.language" defaultMessage="Language" />}>
                <Row gutter={8}>
                  <Col span={6}>
                    <Select
                      value={this.state.language}
                      onChange={this.changeLanguage}
                      defaultValue="en_US"
                      style={{ width: 120, margin: '0' }}
                    >
                      <Option value="en_US">English</Option>
                      <Option value="ja_JP">日本語</Option>
                      <Option value="zh_CN">中文</Option>
                    </Select>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
            <PageHeader title={<FormattedMessage id="app.settings.system" defaultMessage="System" />} />
            <Form className="SettingsWindow-content-form" labelCol={{ span: 24 }}>
              <Form.Item label={<FormattedMessage id="app.settings.system.data" defaultMessage="Data" />}>
                <Row gutter={8}>
                  <Col>
                    <Button onClick={this.exportData} loading={this.state.exporting} type="default">
                      <FormattedMessage id="app.settings.system.data.export" defaultMessage="Export Data" />
                    </Button>
                    <Button type="default" onClick={this.triggerImportData} style={{ marginLeft: '8px' }}>
                      <FormattedMessage id="app.settings.system.data.import" defaultMessage="Import Data" />
                      <input id="import" type="file" onChange={this.importData} style={{ display: 'none' }} />
                    </Button>
                    <Button type="danger" onClick={this.showClearDataConfirm} style={{ marginLeft: '8px' }}>
                      <FormattedMessage id="app.settings.system.data.clear" defaultMessage="Clear Data" />
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Content>
        </Layout>
      );
    }
  }

  componentDidMount() {
    if (StorageHelper.cookie() !== null) {
      this.cookieOnChange(StorageHelper.cookie());
    }
    switch (StorageHelper.language()) {
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
    this.setState({ useSimpleLists: StorageHelper.useSimpleLists() });
  }
}

export default injectIntl(SettingsWindow);
