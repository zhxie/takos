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
              style={{
                width: '2em',
                fill: '#ffeae6',
                stroke: 'red',
                strokeWidth: '0.5px'
              }}
            />
          }
          title={<FormattedMessage id="app.result.error" defaultMessage="Ouch!" />}
          subTitle={this.props.error.toUpperCase()}
          extra={this.props.extra}
        >
          <div>
            <Paragraph>
              <Text strong style={{ fontSize: 16 }}>
                {(() => {
                  if (this.props.checklist.length > 0) {
                    return (
                      <FormattedMessage
                        id="app.problem.troubleshoot"
                        defaultMessage="Takos has encountered a problem, please check the following to troubleshoot the issue:"
                      />
                    );
                  } else {
                    return <FormattedMessage id="app.problem" defaultMessage="Takos has encountered a problem." />;
                  }
                })()}
              </Text>
            </Paragraph>
            {this.props.checklist.map(element => {
              return (
                <Paragraph key={element.key}>
                  <Icon style={{ color: 'red' }} type="info-circle" /> {element}
                </Paragraph>
              );
            })}
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

ErrorResult.defaultProps = {
  error: 'UNKNOWN_ERROR',
  checklist: [],
  extra: []
};

export default ErrorResult;
