import React from 'react';
import { Layout } from 'antd';

import './WindowLayout.css';

const { Header, Content } = Layout;

class WindowLayout extends React.Component {
  render() {
    return (
      <Layout>
        <Header className="WindowLayout-header" style={{ zIndex: this.props.zIndex }}>
          <img className="WindowLayout-header-icon" src={this.props.icon} alt="icon" />
          <p className="WindowLayout-header-title">{this.props.title}</p>
          <p className="WindowLayout-header-subtitle">{this.props.subtitle}</p>
        </Header>
        <Content className="WindowLayout-content">{this.props.children}</Content>
      </Layout>
    );
  }
}

WindowLayout.defaultProps = {
  icon: null,
  title: '',
  subtitle: '',
  zIndex: 1
};

export default WindowLayout;
