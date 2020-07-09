import { randomBytes, createHash } from 'crypto';
import uuid from 'uuid';

import FileFolderUrl from './FileFolderUrl';
import './StringHelper';

class LoginHelper {
  static random = (size) => {
    return this.safeBase64(randomBytes(size).toString('base64'));
  };

  static safeBase64 = (s) => {
    return s.replace(/=/g, '').replace(/\//g, '_').replace(/\+/g, '-');
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
    return fetch(FileFolderUrl.NINTENDO_ACCOUNTS_SESSION_TOKEN, init)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.session_token !== undefined && res.session_token !== null) {
          return res.session_token;
        } else {
          throw new RangeError();
        }
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  };

  static getCookie = (sessionToken) => {
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
    return fetch(FileFolderUrl.NINTENDO_ACCOUNTS_TOKEN, init1)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (
          res.access_token !== undefined &&
          res.access_token !== null &&
          res.access_token !== undefined &&
          res.access_token !== null
        ) {
          return { accessToken: res.access_token, idToken: res.access_token };
        } else {
          throw new RangeError();
        }
      })
      .then((data) => {
        let init = {
          method: 'GET',
          headers: new Headers({
            Authorization: 'Bearer {0}'.format(data.accessToken)
          })
        };
        return fetch(FileFolderUrl.NINTENDO_ACCOUNTS_API_USER_INFO, init)
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (
              res.country !== undefined &&
              res.country !== null &&
              res.birthday !== undefined &&
              res.birthday !== null &&
              res.language !== undefined &&
              res.language !== null
            ) {
              return { idToken: data.idToken, country: res.country, birthday: res.birthday, language: res.language };
            } else {
              throw new RangeError();
            }
          });
      })
      .then((data) => {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        let body = {
          naIdToken: data.idToken,
          timestamp: timestamp
        };
        let formBody = Object.keys(body)
          .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(body[key]))
          .join('&');
        let init = {
          method: 'POST',
          body: formBody,
          headers: new Headers({
            'User-Agent': FileFolderUrl.USER_AGENT,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          })
        };
        return fetch(FileFolderUrl.ELI_FESSLER_GEN2, init)
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (res.hash !== undefined && res.hash !== null) {
              return {
                idToken: data.idToken,
                country: data.country,
                birthday: data.birthday,
                language: data.language,
                timestamp,
                hash: res.hash
              };
            } else {
              throw new RangeError();
            }
          });
      })
      .then((data) => {
        let init = {
          method: 'GET',
          headers: new Headers({
            'x-token': data.idToken,
            'x-time': data.timestamp,
            'x-guid': uuid.v4(),
            'x-hash': data.hash,
            'x-ver': '3',
            'x-iid': 'nso'
          })
        };
        return fetch(FileFolderUrl.FLAPG_LOGIN, init)
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (
              res.result.f !== undefined &&
              res.result.f !== null &&
              res.result.p1 !== undefined &&
              res.result.p1 !== null &&
              res.result.p2 !== undefined &&
              res.result.p2 !== null &&
              res.result.p3 !== undefined &&
              res.result.p3 !== null
            ) {
              return {
                country: data.country,
                birthday: data.birthday,
                language: data.language,
                loginNso: {
                  f: res.result.f,
                  p1: res.result.p1,
                  p2: res.result.p2,
                  p3: res.result.p3
                }
              };
            } else {
              throw new RangeError();
            }
          });
      })
      .then((data) => {
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
            'X-ProductVersion': '1.6.1.2',
            'X-Platform': 'Android'
          })
        };
        return fetch(FileFolderUrl.NINTENDO_SERVICE_LOGIN, init)
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (
              res.result.webApiServerCredential.accessToken !== undefined &&
              res.result.webApiServerCredential.accessToken !== null
            ) {
              return { loginApp: data.loginApp, accessToken: res.result.webApiServerCredential.accessToken };
            } else {
              throw new RangeError();
            }
          });
      })
      .then((data) => {
        let init = {
          method: 'GET',
          headers: new Headers({
            'x-token': data.accessToken,
            'x-time': data.timestamp,
            'x-guid': uuid.v4(),
            'x-hash': data.hash,
            'x-ver': '3',
            'x-iid': 'app'
          })
        };
        return fetch(FileFolderUrl.FLAPG_LOGIN, init)
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (
              res.result.f !== undefined &&
              res.result.f !== null &&
              res.result.p1 !== undefined &&
              res.result.p1 !== null &&
              res.result.p2 !== undefined &&
              res.result.p2 !== null &&
              res.result.p3 !== undefined &&
              res.result.p3 !== null
            ) {
              return {
                country: data.country,
                birthday: data.birthday,
                language: data.language,
                loginNso: data.loginNso,
                loginApp: {
                  f: res.result.f,
                  p1: res.result.p1,
                  p2: res.result.p2,
                  p3: res.result.p3
                }
              };
            } else {
              throw new RangeError();
            }
          });
      })
      .then((data) => {
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
        return fetch(FileFolderUrl.NINTENDO_SERVICE_WEB_SERVICE_TOKEN, init)
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (res.result.accessToken !== undefined && res.result.accessToken !== null) {
              return { accessToken: res.result.accessToken };
            } else {
              throw new RangeError();
            }
          });
      })
      .then((data) => {
        return LoginHelper.getCookieFinal(data.accessToken).then((data) => {
          if (data === null) {
            throw new RangeError();
          } else {
            return data;
          }
        });
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  };

  static getCookieFinal = (accessToken) => {
    console.log(accessToken);
    const init = {
      method: 'GET',
      headers: new Headers({
        'X-GameWebToken': accessToken
      })
    };
    return fetch(FileFolderUrl.SPLATNET + '/Cookie', init)
      .then((res) => {
        console.log(res);
        const re = /iksm_session=([a-f0-9]+);/;
        if (res.headers.get('Cookie') !== undefined && res.headers.get('Cookie') !== null) {
          return re.exec(res.headers.get('Cookie'))[1];
        } else if (res.headers.get('Set-Cookie') !== undefined && res.headers.get('Set-Cookie') !== null) {
          return re.exec(res.headers.get('Set-Cookie'))[1];
        } else if (res.headers.get('X-Cookie') !== undefined && res.headers.get('X-Cookie') !== null) {
          return re.exec(res.headers.get('X-Cookie'))[1];
        } else {
          return accessToken;
        }
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  };
}

export default LoginHelper;
