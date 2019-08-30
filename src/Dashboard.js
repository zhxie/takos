import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

class Dashboard extends React.Component {
  render() {
    return (
      <Layout>
        <Content
          style={{
            background: '#fff',
            height: '600px',
            margin: '16px',
            padding: '16px'
          }}
        >
          This is the Dashboard of Takos.
        </Content>
      </Layout>
    );
  }
}

export default Dashboard;
