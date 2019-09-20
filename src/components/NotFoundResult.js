import React from 'react';
import { Link } from 'react-router-dom';
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
          title="404"
          subTitle="Are you lost, small octoling?"
          extra={[
            <Link to="/" key="home">
              <Button type="primary">Back Home</Button>
            </Link>
          ]}
        >
          <div>
            <Paragraph>
              <Text strong style={{ fontSize: 16 }}>
                Takos has encountered a problem.
              </Text>
            </Paragraph>
            <Paragraph>
              <Text style={{ fontSize: 14 }}>
                If the problem persists, you can{' '}
                <a href="https://github.com/zhxie/takos/issues">Report the issue on Github &gt;</a>
              </Text>
            </Paragraph>
          </div>
        </Result>
      </div>
    );
  }
}

export default NotFoundResult;
