import localForage from 'localforage';

import TakosError from './ErrorHelper';
import './StringHelper';
import { Battle, RankedBattle } from '../models/Battle';
import { Job } from '../models/Job';
import Rule from '../models/Rule';

class StorageHelper {
  static battlesConnection = null;
  static jobsConnection = null;

  static dbConnected = () => {
    return StorageHelper.battlesConnection !== null && StorageHelper.jobsConnection !== null;
  };

  static initializeStorage = () => {
    // IndexedDB
    if (!StorageHelper.dbConnected()) {
      StorageHelper.connectDb();
    }
    return StorageHelper.clearBattles()
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
    return StorageHelper.clearBattles()
      .then(res => {
        if (res instanceof TakosError) {
          throw new TakosError(res.message);
        } else {
          return StorageHelper.clearJobs();
        }
      })
      .then(res => {
        if (res instanceof TakosError) {
          throw new TakosError(res.message);
        }
      })
      .catch(e => {
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
    StorageHelper.jobsConnection = localForage.createInstance({
      name: 'takos',
      storeName: 'jobs'
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
          throw new TakosError('battle_{0}_exists'.format(battle.number));
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
    return StorageHelper.battlesConnection.removeItem(number.toString()).catch(e => {
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

  static rank = () => {
    let rank = {};
    return StorageHelper.battles()
      .then(res => {
        res.sort((a, b) => {
          return b.number - a.number;
        });
        res.every(element => {
          if (element instanceof RankedBattle) {
            switch (element.rule) {
              case Rule.splatZones:
                if (rank.splatZones === undefined) {
                  rank.splatZones = element.rankAfter;
                }
                break;
              case Rule.towerControl:
                if (rank.towerControl === undefined) {
                  rank.towerControl = element.rankAfter;
                }
                break;
              case Rule.rainmaker:
                if (rank.rainmaker === undefined) {
                  rank.rainmaker = element.rankAfter;
                }
                break;
              case Rule.clamBlitz:
                if (rank.clamBlitz === undefined) {
                  rank.clamBlitz = element.rankAfter;
                }
                break;
              default:
                throw new RangeError();
            }
          }
          if (
            rank.splatZones !== undefined &&
            rank.towerControl !== undefined &&
            rank.rainmaker !== undefined &&
            rank.clamBlitz !== undefined
          ) {
            return false;
          } else {
            return true;
          }
        });
        if (
          rank.splatZones === undefined &&
          rank.towerControl === undefined &&
          rank.rainmaker === undefined &&
          rank.clamBlitz === undefined
        ) {
          return null;
        } else {
          return rank;
        }
      })
      .catch(e => {
        console.error(e);
        if (
          rank.splatZones === undefined &&
          rank.towerControl === undefined &&
          rank.rainmaker === undefined &&
          rank.clamBlitz === undefined
        ) {
          return null;
        } else {
          return rank;
        }
      });
  };

  static job = number => {
    if (!StorageHelper.dbConnected()) {
      StorageHelper.connectDb();
    }
    return StorageHelper.jobsConnection
      .getItem(number.toString())
      .then(res => {
        if (res === null) {
          throw new RangeError();
        } else {
          return Job.deserialize(JSON.parse(res));
        }
      })
      .catch(e => {
        console.error(e);
        return new Job('can_not_handle_database');
      });
  };
  static jobs = () => {
    let jobs = [];
    if (!StorageHelper.dbConnected()) {
      StorageHelper.connectDb();
    }
    return StorageHelper.jobsConnection
      .iterate(value => {
        const job = Job.deserialize(JSON.parse(value));
        if (job.error === null) {
          jobs.push(job);
        } else {
          console.error(job.error);
        }
      })
      .then(() => {
        return jobs;
      })
      .catch(e => {
        console.error(e);
        return jobs;
      });
  };
  static latestJob = () => {
    if (!StorageHelper.dbConnected()) {
      StorageHelper.connectDb();
    }
    return StorageHelper.jobsConnection
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
  static addJob = job => {
    if (!StorageHelper.dbConnected()) {
      StorageHelper.connectDb();
    }
    return StorageHelper.jobsConnection
      .getItem(job.number.toString())
      .then(res => {
        if (res !== null) {
          throw new TakosError('job_{0}_exists'.format(job.number));
        } else {
          // Same number job not exists
          return StorageHelper.jobsConnection.setItem(job.number.toString(), JSON.stringify(job));
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
  static removeJob = number => {
    if (!StorageHelper.dbConnected()) {
      StorageHelper.connectDb();
    }
    return StorageHelper.jobsConnection.removeItem(number.toString()).catch(e => {
      console.error(e);
      return new TakosError('can_not_handle_database');
    });
  };
  static clearJobs = () => {
    if (!StorageHelper.dbConnected()) {
      StorageHelper.connectDb();
    }
    return StorageHelper.jobsConnection.clear().catch(e => {
      console.error(e);
      return new TakosError('can_not_clear_jobs');
    });
  };
}

export default StorageHelper;
