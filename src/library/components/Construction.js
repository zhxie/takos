import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

class Construction extends React.Component {
  render() {
    return (
      <Content
        id="Construction-content"
        className="Construction-content"
        style={{
          background: '#fff',
          height: 'calc(100vh - 32px)',
          margin: '16px'
        }}
      />
    );
  }
}

export default Construction;
