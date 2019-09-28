class StorageHelper {
  static initializeStorage = () => {
    window.localStorage.removeItem('sessionToken');
    window.localStorage.removeItem('cookie');
    window.localStorage.removeItem('nickname');
    window.localStorage.removeItem('url');
    window.localStorage.removeItem('rank');
    window.localStorage.removeItem('battles');
  };

  static language = () => {
    return window.localStorage.getItem('language');
  };

  static setLanguage = value => {
    window.localStorage.setItem('language', value);
  };

  static sessionToken = () => {
    return window.localStorage.getItem('sessionToken');
  };

  static setSessionToken = value => {
    window.localStorage.setItem('sessionToken', value);
  };

  static cookie = () => {
    return window.localStorage.getItem('cookie');
  };

  static setCookie = value => {
    window.localStorage.setItem('cookie', value);
  };

  static nickname = () => {
    return window.localStorage.getItem('nickname');
  };

  static setNickname = value => {
    window.localStorage.setItem('nickname', value);
  };

  static url = () => {
    return window.localStorage.getItem('url');
  };

  static setUrl = value => {
    window.localStorage.setItem('url', value);
  };

  static rank = () => {
    try {
      return JSON.parse(window.localStorage.getItem('rank'));
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  static setRank = value => {
    try {
      window.localStorage.setItem('rank', JSON.stringify(value));
    } catch (e) {
      console.error(e);
      window.localStorage.setItem('rank', '');
    }
  };

  static battles = () => {
    try {
      return JSON.parse(window.localStorage.getItem('battles'));
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  static setBattles = value => {
    try {
      window.localStorage.setItem('battles', JSON.stringify(value));
    } catch (e) {
      console.error(e);
      window.localStorage.setItem('battles', '');
    }
  };
}

export default StorageHelper;
