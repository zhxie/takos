import React from 'react';
import { Layout } from 'antd';

import './BattlesWindow.css';
import { SPLATNET, SPLATNET_RESULTS } from './utils/FileFolderUrl';

class BattlesWindow extends React.Component {
  state = {
    loaded: false,
    error: false
  };

  updateBattles() {
    const init = {
      method: 'GET'
    };
    fetch(SPLATNET + SPLATNET_RESULTS, init)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        // TODO: Parse response
      })
      .catch(e => {
        console.error(e);
        this.setState({ errorLog: 'can_not_fetch_battles', error: true });
      });
  }

  render() {
    return <Layout />;
  }
}

export default BattlesWindow;
