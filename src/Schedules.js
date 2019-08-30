import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

class Schedules extends React.Component {
  render() {
    return (
      <Layout>
        <Content
          style={{
            background: '#fff',
            height: '2000px',
            margin: '16px',
            padding: '16px'
          }}
        >
          These are schedules in {this.props.mode.name} battle mode.
        </Content>
      </Layout>
    );
  }
}

export default Schedules;
