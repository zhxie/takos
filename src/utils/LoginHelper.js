import { randomBytes, createHash } from 'crypto';
import uuid from 'uuid';

import './StringHelper';
import {
  USER_AGENT,
  NINTENDO_ACCOUNTS,
  NINTENDO_ACCOUNTS_SESSION_TOKEN,
  NINTENDO_ACCOUNTS_TOKEN,
  NINTENDO_ACCOUNTS_API,
  NINTENDO_ACCOUNTS_API_USER_INFO,
  ELI_FESSLER,
  ELI_FESSLER_GEN2,
  FLAPG,
  FLAPG_LOGIN,
  NINTENDO_SERVICE,
  NINTENDO_SERVICE_LOGIN,
  NINTENDO_SERVICE_WEB_SERVICE_TOKEN,
  SPLATNET
} from './FileFolderUrl';

class LoginHelper {
  static random = size => {
    return this.safeBase64(randomBytes(size).toString('base64'));
  };

  static safeBase64 = s => {
    return s
      .replace(/=/g, '')
      .replace(/\//g, '_')
      .replace(/\+/g, '-');
  };

  static generateParameters = () => {
    // Generate state and code verifier
    const state = this.random(36);
    const codeVerifier = this.random(32);
    // Generate code challenge
    let hash = createHash('sha256');
    hash.update(codeVerifier);
    const codeChallenge = this.safeBase64(hash.digest('base64'));
    console.log({ state, codeVerifier, codeChallenge });
    return { state, codeVerifier, codeChallenge };
  };

  static getSessionToken = (sessionTokenCode, codeVerifier) => {
    console.log({ sessionTokenCode, codeVerifier });
    const body = {
      client_id: '71b963c1b7b6d119',
      session_token_code: sessionTokenCode,
      session_token_code_verifier: codeVerifier
    };
    const init = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8'
      })
    };
    return fetch(NINTENDO_ACCOUNTS + NINTENDO_ACCOUNTS_SESSION_TOKEN, init)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.session_token !== undefined) {
          return res.session_token;
        } else {
          throw new RangeError();
        }
      })
      .catch(e => {
        console.error(e);
        return '';
      });
  };

  static updateCookie = sessionToken => {
    console.log(sessionToken);
    const body1 = {
      client_id: '71b963c1b7b6d119',
      session_token: sessionToken,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer-session-token'
    };
    const init1 = {
      method: 'POST',
      body: JSON.stringify(body1),
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8'
      })
    };
    return fetch(NINTENDO_ACCOUNTS + NINTENDO_ACCOUNTS_TOKEN, init1)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        return { accessToken: res.access_token, idToken: res.id_token };
      })
      .then(data => {
        let init = {
          method: 'GET',
          headers: new Headers({
            Authorization: 'Bearer {0}'.format(data.accessToken)
          })
        };
        return fetch(NINTENDO_ACCOUNTS_API + NINTENDO_ACCOUNTS_API_USER_INFO, init)
          .then(res => res.json())
          .then(res => {
            console.log(res);
            return { idToken: data.idToken, country: res.country, birthday: res.birthday, language: res.language };
          });
      })
      .then(data => {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        let body = {
          naIdToken: data.idToken,
          timestamp: timestamp
        };
        let formBody = Object.keys(body)
          .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(body[key]))
          .join('&');
        let init = {
          method: 'POST',
          body: formBody,
          headers: new Headers({
            'User-Agent': USER_AGENT,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          })
        };
        return fetch(ELI_FESSLER + ELI_FESSLER_GEN2, init)
          .then(res => res.json())
          .then(res => {
            console.log(res);
            return {
              idToken: data.idToken,
              country: data.country,
              birthday: data.birthday,
              language: data.language,
              timestamp,
              hash: res.hash
            };
          });
      })
      .then(data => {
        let init = {
          method: 'GET',
          headers: new Headers({
            'x-token': data.idToken,
            'x-time': data.timestamp,
            'x-guid': uuid.v4(),
            'x-hash': data.hash,
            'x-ver': '2',
            'x-iid': randomBytes(4).toString('hex')
          })
        };
        return fetch(FLAPG + FLAPG_LOGIN, init)
          .then(res => res.json())
          .then(res => {
            console.log(res);
            return {
              country: data.country,
              birthday: data.birthday,
              language: data.language,
              loginNso: {
                f: res.login_nso.f,
                p1: res.login_nso.p1,
                p2: res.login_nso.p2,
                p3: res.login_nso.p3
              },
              loginApp: {
                f: res.login_app.f,
                p1: res.login_app.p1,
                p2: res.login_app.p2,
                p3: res.login_app.p3
              }
            };
          });
      })
      .then(data => {
        let body = {
          parameter: {
            f: data.loginNso.f,
            naIdToken: data.loginNso.p1,
            timestamp: data.loginNso.p2,
            requestId: data.loginNso.p3,
            naCountry: data.country,
            naBirthday: data.birthday,
            language: data.language
          }
        };
        let init = {
          method: 'POST',
          body: JSON.stringify(body),
          headers: new Headers({
            Authorization: 'Bearer',
            'Content-Type': 'application/json; charset=UTF-8',
            'X-ProductVersion': '1.5.2',
            'X-Platform': 'Android'
          })
        };
        return fetch(NINTENDO_SERVICE + NINTENDO_SERVICE_LOGIN, init)
          .then(res => res.json())
          .then(res => {
            console.log(res);
            return { loginApp: data.loginApp, accessToken: res.result.webApiServerCredential.accessToken };
          });
      })
      .then(data => {
        let body = {
          parameter: {
            id: '5741031244955648',
            f: data.loginApp.f,
            registrationToken: data.loginApp.p1,
            timestamp: data.loginApp.p2,
            requestId: data.loginApp.p3
          }
        };
        let init = {
          method: 'POST',
          body: JSON.stringify(body),
          headers: new Headers({
            Authorization: 'Bearer {0}'.format(data.accessToken),
            'Content-Type': 'application/json; charset=UTF-8'
          })
        };
        return fetch(NINTENDO_SERVICE + NINTENDO_SERVICE_WEB_SERVICE_TOKEN, init)
          .then(res => res.json())
          .then(res => {
            console.log(res);
            return { accessToken: res.result.accessToken };
          });
      })
      .then(data => {
        let init = {
          method: 'GET',
          headers: new Headers({
            'X-GameWebToken': data.accessToken
          })
        };
        return fetch(SPLATNET + '/Cookie', init).then(res => {
          console.log(res);
          const re = /iksm_session=([a-f0-9]+);/;
          return re.exec(res.headers.get('X-Cookie'))[1];
        });
        /*
        let init = {
          method: 'GET',
          headers: new Headers({
            'X-GameWebToken': data.accessToken
          }),
          credentials: 'include'
        };
        return fetch(SPLATNET, init)
          .then(res => {
            console.log(res);
            console.log(res.headers.get('Set-Cookie'));
            console.log(document.cookie);
          })
          .then(res => res.json())
          .then(res => {
            return '';
          });
        */
      })
      .catch(e => {
        console.error(e);
        return '';
      });
  };
}

export default LoginHelper;
