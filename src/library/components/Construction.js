import React from 'react';
import { Result } from 'antd';

import './Construction.css';
import OctolingsKillIcon from './CustomIcons';

class Construction extends React.Component {
  render() {
    return (
      <div className="Construction-content">
        <Result
          icon={
            <OctolingsKillIcon
              className="Construction-content-result-icon"
              style={{
                width: '2em',
                fill: '#e6f7ff',
                stroke: '#1890ff'
              }}
            />
          }
          title="In Painting"
          subTitle="This page is under construction."
        />
      </div>
    );
  }
}

export default Construction;
