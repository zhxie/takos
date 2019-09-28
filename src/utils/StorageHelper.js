class StorageHelper {
  static initializeStorage = () => {
    window.localStorage.removeItem('sessionToken');
    window.localStorage.removeItem('cookie');
    window.localStorage.removeItem('nickname');
    window.localStorage.removeItem('url');
    window.localStorage.rank = {};
    window.localStorage.battles = [];
  };
}

export default StorageHelper;
