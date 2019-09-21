import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Result, Typography, Button } from 'antd';

import './NotFoundResult.css';
import { OctolingsDeathIcon } from './CustomIcons';

const { Paragraph, Text } = Typography;

class NotFoundResult extends React.Component {
  render() {
    return (
      <div className="NotFoundResult-content">
        <Result
          icon={
            <OctolingsDeathIcon
              className="NotFoundResult-content-result-icon"
              style={{
                width: '2em',
                fill: '#e6f7ff',
                stroke: '#1890ff'
              }}
            />
          }
          title={<FormattedMessage id="app.result.404" defaultMessage="404" />}
          subTitle={<FormattedMessage id="app.result.404.description" defaultMessage="Are you lost, small octoling?" />}
          extra={[
            <Link to="/" key="home">
              <Button type="primary">
                <FormattedMessage id="app.result.404.back_home" defaultMessage="Back Home" />
              </Button>
            </Link>
          ]}
        >
          <div>
            <Paragraph>
              <Text strong style={{ fontSize: 16 }}>
                <FormattedMessage id="app.problem" defaultMessage="Takos has encountered a problem." />
              </Text>
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

export default NotFoundResult;
