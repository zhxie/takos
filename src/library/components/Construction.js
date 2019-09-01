import React from 'react';
import { Layout, Result } from 'antd';

import './Construction.css';
import OctolingsKillIcon from './CustomIcons';

const { Content } = Layout;

class Construction extends React.Component {
  render() {
    return (
      <Layout>
        <Content
          id="Construction-content"
          className="Construction-content"
          style={{
            background: '#fff',
            height: 'calc(100vh - 32px)',
            margin: '16px'
          }}
        >
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
        </Content>
      </Layout>
    );
  }
}

export default Construction;
