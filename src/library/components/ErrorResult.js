import React from 'react';
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
          title="Ouch!"
          subTitle={this.props.error.toUpperCase()}
        >
          <div className="desc">
            <Paragraph>
              <Text strong style={{ fontSize: 16 }}>
                Takos met a problem, please check the following:
              </Text>
            </Paragraph>
            <Paragraph>
              <Icon style={{ color: 'red' }} type="info-circle" /> Your network
              connection and proxy settings
            </Paragraph>
            <Paragraph>
              <Icon style={{ color: 'red' }} type="info-circle" /> Your SplatNet
              cookie
            </Paragraph>
            <Paragraph>
              <Text style={{ fontSize: 14 }}>
                If the problem persists, please consider{' '}
                <a href="https://github.com/zhxie/takos/issues">
                  Reporting it in Github &gt;
                </a>
              </Text>
            </Paragraph>
          </div>
        </Result>
      </div>
    );
  }
}

export default ErrorResult;
