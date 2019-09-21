import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';
import * as serviceWorker from './serviceWorker';

import './index.css';
import en_US from './assets/locales/en_US';
import ja_JP from './assets/locales/ja_JP';
import App from './App';

ReactDOM.render(
  <ConfigProvider autoInsertSpaceInButton={false}>
    <IntlProvider
      locale={navigator.language}
      messages={(() => {
        if (window.localStorage.language === undefined) {
          window.localStorage.language = 'en_US';
        }
        switch (window.localStorage.language) {
          case 'en_US':
            return en_US;
          case 'ja_JP':
            return ja_JP;
          default:
            return en_US;
        }
      })()}
    >
      <App />
    </IntlProvider>
  </ConfigProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
