import localForage from 'localforage';

import TakosError from './ErrorHelper';
import { Battle } from '../models/Battle';

class StorageHelper {
  static battlesConnection = null;

  static dbConnected = () => {
    return StorageHelper.battlesConnection !== null;
  };

  static initializeStorage = () => {
    // IndexedDB
    if (!StorageHelper.dbConnected()) {
      StorageHelper.connectDb();
    }
    return StorageHelper.clearBattles
      .then(res => {
        if (res instanceof TakosError) {
          throw new TakosError(res.message);
        } else {
          // localStorage
          window.localStorage.removeItem('sessionToken');
          window.localStorage.removeItem('cookie');
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          return new TakosError(e.message);
        } else {
          console.error(e);
          return new TakosError('can_not_initialize_storage');
        }
      });
  };

  static clearData = () => {
    return StorageHelper.clearBattles().catch(e => {
      if (e instanceof TakosError) {
        return new TakosError(e.message);
      } else {
        console.error(e);
        return new TakosError('can_not_clear_data');
      }
    });
  };

  static connectDb = () => {
    localForage.config({
      name: 'takos'
    });
    StorageHelper.battlesConnection = localForage.createInstance({
      name: 'takos',
      storeName: 'battles'
    });
  };

  static language = () => {
    return window.localStorage.getItem('language');
  };

  static setLanguage = value => {
    window.localStorage.setItem('language', value);
  };

  static useSimpleLists = () => {
    return window.localStorage.getItem('useSimpleLists') === 'true';
  };

  static setUseSimpleLists = value => {
    window.localStorage.setItem('useSimpleLists', value);
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

  static battle = number => {
    if (!StorageHelper.dbConnected()) {
      StorageHelper.connectDb();
    }
    return StorageHelper.battlesConnection
      .getItem(number.toString())
      .then(res => {
        if (res === null) {
          throw new RangeError();
        } else {
          return Battle.deserialize(JSON.parse(res));
        }
      })
      .catch(e => {
        console.error(e);
        return new Battle('can_not_handle_database');
      });
  };

  static battles = () => {
    let battles = [];
    if (!StorageHelper.dbConnected()) {
      StorageHelper.connectDb();
    }
    return StorageHelper.battlesConnection
      .iterate(value => {
        const battle = Battle.deserialize(JSON.parse(value));
        if (battle.error === null) {
          battles.push(battle);
        } else {
          console.error(battle.error);
        }
      })
      .then(() => {
        return battles;
      })
      .catch(e => {
        console.error(e);
        return battles;
      });
  };

  static latestBattle = () => {
    if (!StorageHelper.dbConnected()) {
      StorageHelper.connectDb();
    }
    return StorageHelper.battlesConnection
      .keys()
      .catch(e => {
        console.error(e);
        throw new TakosError('can_not_handle_database');
      })
      .then(res => {
        if (res.length === 0) {
          return 0;
        } else {
          return Math.max.apply(Math, res);
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          return -1;
        } else {
          console.error(e);
          return -1;
        }
      });
  };

  static addBattle = battle => {
    if (!StorageHelper.dbConnected()) {
      StorageHelper.connectDb();
    }
    return StorageHelper.battlesConnection
      .getItem(battle.number.toString())
      .then(res => {
        if (res !== null) {
          throw new RangeError();
        } else {
          // Same number battle not exists
          return StorageHelper.battlesConnection.setItem(battle.number.toString(), JSON.stringify(battle));
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          return new TakosError(e.message);
        } else {
          console.error(e);
          return new TakosError('can_not_handle_database');
        }
      });
  };

  static removeBattle = number => {
    if (!StorageHelper.dbConnected()) {
      StorageHelper.connectDb();
    }
    return StorageHelper.battlesConnection.removeItem(number).catch(e => {
      console.error(e);
      return new TakosError('can_not_handle_database');
    });
  };

  static clearBattles = () => {
    if (!StorageHelper.dbConnected()) {
      StorageHelper.connectDb();
    }
    return StorageHelper.battlesConnection.clear().catch(e => {
      console.error(e);
      return new TakosError('can_not_clear_battles');
    });
  };
}

export default StorageHelper;
