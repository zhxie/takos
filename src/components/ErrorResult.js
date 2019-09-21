import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Result, Icon, Typography } from 'antd';

import './ErrorResult.css';
import { OctolingsDeathIcon } from './CustomIcons';

const { Paragraph, Text } = Typography;

class ErrorResult extends React.Component {
  render() {
    return (
      <div className="ErrorResult-content">
        <Result
          icon={
            <OctolingsDeathIcon
              className="ErrorResult-content-result-icon"
              style={{
                width: '2em',
                fill: '#ffeae6',
                stroke: 'red'
              }}
            />
          }
          title={<FormattedMessage id="app.result.error" defaultMessage="Ouch!" />}
          subTitle={this.props.error.toUpperCase()}
        >
          <div>
            <Paragraph>
              <Text strong style={{ fontSize: 16 }}>
                <FormattedMessage
                  id="app.problem.troubleshoot"
                  defaultMessage="Takos has encountered a problem, please check the following to troubleshoot the issue:"
                />
              </Text>
            </Paragraph>
            <Paragraph>
              <Icon style={{ color: 'red' }} type="info-circle" />{' '}
              <FormattedMessage
                id="app.problem.troubleshoot.network"
                defaultMessage="Your network connection and proxy settings"
              />
            </Paragraph>
            <Paragraph>
              <Icon style={{ color: 'red' }} type="info-circle" />{' '}
              <FormattedMessage id="app.problem.troubleshoot.cookie" defaultMessage="Your SplatNet cookie" />
            </Paragraph>
            <Paragraph>
              <Text style={{ fontSize: 14 }}>
                <FormattedMessage
                  id="app.problem.report"
                  defaultMessage="If the problem persists, you can <a>Report the issue on Github &gt;</a>"
                  values={{
                    a: msg => <a href="https://github.com/zhxie/takos/issues">{msg}</a>
                  }}
                />
              </Text>
            </Paragraph>
          </div>
        </Result>
      </div>
    );
  }
}

export default ErrorResult;
