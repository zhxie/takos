import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Result } from 'antd';

import './ConstructionResult.css';
import { OctolingsKillIcon } from './CustomIcons';

class ConstructionResult extends React.Component {
  render() {
    return (
      <div className="ConstructionResult-content">
        <Result
          icon={
            <OctolingsKillIcon
              className="ConstructionResult-content-result-icon"
              style={{
                width: '2em',
                fill: '#fffae6',
                stroke: '#ffa500'
              }}
            />
          }
          title={<FormattedMessage id="app.result.construction" defaultMessage="In Painting" />}
          subTitle={
            <FormattedMessage
              id="app.result.construction.description"
              defaultMessage="This page is under construction."
            />
          }
        />
      </div>
    );
  }
}

export default ConstructionResult;
