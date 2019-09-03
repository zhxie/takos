import React from 'react';
import { Result } from 'antd';

import './LoadingResult.css';
import { SpinIcon } from './CustomIcons';

class LoadingResult extends React.Component {
  render() {
    return (
      <div className="LoadingResult-content">
        <Result
          icon={
            <SpinIcon
              className="LoadingResult-content-result-icon"
              style={{
                width: '1.5em',
                fill: '#e6f7ff',
                stroke: '#1890ff'
              }}
            />
          }
          title="Charging"
          subTitle="This page is in loading..."
        />
      </div>
    );
  }
}

export default LoadingResult;
