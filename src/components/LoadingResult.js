import React from 'react';
import { FormattedMessage } from 'react-intl';
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
          title={<FormattedMessage id="app.result.loading" defaultMessage="Charging" />}
          subTitle={this.props.description}
        />
      </div>
    );
  }
}

LoadingResult.defaultProps = {
  description: <FormattedMessage id="app.result.loading.description" defaultMessage="This page is in loading..." />
};

export default LoadingResult;
