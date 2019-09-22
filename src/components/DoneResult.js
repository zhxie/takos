import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Result } from 'antd';

import './DoneResult.css';
import { OctolingsKillIcon } from './CustomIcons';

class DoneResult extends React.Component {
  render() {
    return (
      <div className="DoneResult-content">
        <Result
          icon={
            <OctolingsKillIcon
              className="DoneResult-content-result-icon"
              style={{
                width: '2em',
                fill: '#f6ffed',
                stroke: '#52c41a'
              }}
            />
          }
          title={<FormattedMessage id="app.result.done" defaultMessage="Booyah!" />}
          subTitle={<FormattedMessage id="app.result.done.description" defaultMessage="It is all done. Enjoy it!" />}
          extra={this.props.extra}
        />
      </div>
    );
  }
}

DoneResult.defaultProps = {
  extra: []
};

export default DoneResult;
