class ElectronHelper {
  static isElectron = () => {
    return window.navigator.userAgent.indexOf('Electron') !== -1;
  };
}
