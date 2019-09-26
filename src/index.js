import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';
import * as serviceWorker from './serviceWorker';

import antd_en_US from 'antd/es/locale/en_US';
import antd_ja_JP from 'antd/es/locale/ja_JP';
import antd_zh_CN from 'antd/es/locale/zh_CN';
import './index.css';
import App from './App';
import en_US from './assets/locales/en_US';
import ja_JP from './assets/locales/ja_JP';
import zh_CN from './assets/locales/zh_CN';

ReactDOM.render(
  <ConfigProvider
    autoInsertSpaceInButton={false}
    locale={(() => {
      if (window.localStorage.language === undefined) {
        window.localStorage.language = 'en_US';
      }
      switch (window.localStorage.language) {
        case 'en_US':
          return antd_en_US;
        case 'ja_JP':
          return antd_ja_JP;
        case 'zh_CN':
          return antd_zh_CN;
        default:
          return antd_en_US;
      }
    })()}
  >
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
          case 'zh_CN':
            return zh_CN;
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
