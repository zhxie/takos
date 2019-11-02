import TakosError from './ErrorHelper';
import FileFolderUrl from './FileFolderUrl';
import StorageHelper from './StorageHelper';
import { RankedBattle, LeagueBattle } from '../models/Battle';
import { JobResult } from '../models/Job';
import Rule from '../models/Rule';
import { ScheduledStage } from '../models/Stage';
import { Weapon } from '../models/Weapon';

class StatisticsHelper {
  static getStagesRecords = () => {
    const init = {
      method: 'GET',
      headers: new Headers({
        Cookie: 'iksm_session={0}'.format(StorageHelper.cookie()),
        'X-Cookie': 'iksm_session={0}'.format(StorageHelper.cookie())
      })
    };
    return fetch(FileFolderUrl.SPLATNET_RECORDS, init)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        // Parse response
        let stages = [];
        Object.keys(res.records.stage_stats).forEach(element => {
          const stage = ScheduledStage.parse(res.records.stage_stats[element].stage);
          stages.push({
            stage: stage,
            result: [
              {
                rule: Rule.splatZones,
                win: parseInt(res.records.stage_stats[element].area_win),
                lose: parseInt(res.records.stage_stats[element].area_lose)
              },
              {
                rule: Rule.towerControl,
                win: parseInt(res.records.stage_stats[element].yagura_win),
                lose: parseInt(res.records.stage_stats[element].yagura_lose)
              },
              {
                rule: Rule.rainmaker,
                win: parseInt(res.records.stage_stats[element].hoko_win),
                lose: parseInt(res.records.stage_stats[element].hoko_lose)
              },
              {
                rule: Rule.clamBlitz,
                win: parseInt(res.records.stage_stats[element].asari_win),
                lose: parseInt(res.records.stage_stats[element].asari_lose)
              }
            ]
          });
        });
        return stages;
      })
      .catch(e => {
        console.error(e);
        return null;
      });
  };

  static updateStagesRecords = onSuccess => {
    return StatisticsHelper.getStagesRecords()
      .then(res => {
        if (res === null) {
          throw new TakosError('can_not_parse_stages_records');
        } else {
          onSuccess(res);
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          return e;
        } else {
          console.error(e);
          return new TakosError('can_not_update_stages_records');
        }
      });
  };

  static getStagesStatistics = () => {
    let stages = [];
    return StorageHelper.battles()
      .then(res => {
        res.forEach(element => {
          let stage = stages.find(ele => {
            return ele.stage.stage === element.stage.stage;
          });
          if (stage === undefined) {
            stages.push({
              stage: element.stage,
              isSalmonRun: false,
              result: [
                {
                  rule: Rule.turfWar,
                  win: 0,
                  lose: 0,
                  knockOut: 0,
                  knockedOut: 0
                },
                {
                  rule: Rule.splatZones,
                  win: 0,
                  lose: 0,
                  knockOut: 0,
                  knockedOut: 0
                },
                {
                  rule: Rule.towerControl,
                  win: 0,
                  lose: 0,
                  knockOut: 0,
                  knockedOut: 0
                },
                {
                  rule: Rule.rainmaker,
                  win: 0,
                  lose: 0,
                  knockOut: 0,
                  knockedOut: 0
                },
                {
                  rule: Rule.clamBlitz,
                  win: 0,
                  lose: 0,
                  knockOut: 0,
                  knockedOut: 0
                }
              ]
            });
            // Find stage again
            stage = stages.find(ele => {
              return ele.stage.stage === element.stage.stage;
            });
          }
          if (element.isWin) {
            stage.result.find(el => {
              return el.rule === element.rule;
            }).win++;
            if (element instanceof RankedBattle || element instanceof LeagueBattle) {
              if (element.isKnockOut) {
                stage.result.find(el => {
                  return el.rule === element.rule;
                }).knockOut++;
              }
            }
          } else {
            stage.result.find(el => {
              return el.rule === element.rule;
            }).lose++;
            if (element instanceof RankedBattle || element instanceof LeagueBattle) {
              if (element.isKnockedOut) {
                stage.result.find(el => {
                  return el.rule === element.rule;
                }).knockedOut++;
              }
            }
          }
        });
      })
      .then(() => {
        return StorageHelper.jobs();
      })
      .then(res => {
        res.forEach(element => {
          let stage = stages.find(ele => {
            return ele.stage.stage === element.shift.stage.stage;
          });
          if (stage === undefined) {
            stages.push({
              stage: element.shift.stage,
              isSalmonRun: true,
              result: [
                {
                  clear: 0,
                  timeLimit: 0,
                  wipeOut: 0
                },
                {
                  clear: 0,
                  timeLimit: 0,
                  wipeOut: 0
                },
                {
                  clear: 0,
                  timeLimit: 0,
                  wipeOut: 0
                }
              ]
            });
            // Find stage again
            stage = stages.find(ele => {
              return ele.stage.stage === element.shift.stage.stage;
            });
          }
          // Precious waves
          for (let i = 0; i < element.waves.length - 1; ++i) {
            stage.result[i].clear++;
          }
          switch (element.result) {
            case JobResult.clear:
              stage.result[element.waves.length - 1].clear++;
              break;
            case JobResult.timeLimit:
              stage.result[element.waves.length - 1].timeLimit++;
              break;
            case JobResult.wipeOut:
              stage.result[element.waves.length - 1].wipeOut++;
              break;
            default:
              throw new RangeError();
          }
        });
      })
      .then(() => {
        return stages;
      })
      .catch(e => {
        console.error(e);
        return null;
      });
  };

  static updateStagesStatistics = onSuccess => {
    return StatisticsHelper.getStagesStatistics()
      .then(res => {
        if (res === null) {
          throw new TakosError('can_not_parse_stages_statistics');
        } else {
          onSuccess(res);
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          return e;
        } else {
          console.error(e);
          return new TakosError('can_not_update_stages_statistics');
        }
      });
  };

  static getWeaponsRecords = () => {
    const init = {
      method: 'GET',
      headers: new Headers({
        Cookie: 'iksm_session={0}'.format(StorageHelper.cookie()),
        'X-Cookie': 'iksm_session={0}'.format(StorageHelper.cookie())
      })
    };
    return fetch(FileFolderUrl.SPLATNET_RECORDS, init)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        // Parse response
        let weapons = [];
        Object.keys(res.records.weapon_stats).forEach(element => {
          const weapon = Weapon.parse(res.records.weapon_stats[element].weapon);
          let winMeter;
          if (res.records.weapon_stats[element].win_meter % 1 === 0) {
            winMeter = parseInt(res.records.weapon_stats[element].win_meter);
          } else {
            winMeter = parseFloat(res.records.weapon_stats[element].win_meter).toFixed(1);
          }
          let maxWinMeter;
          if (res.records.weapon_stats[element].max_win_meter % 1 === 0) {
            maxWinMeter = parseInt(res.records.weapon_stats[element].max_win_meter);
          } else {
            maxWinMeter = parseFloat(res.records.weapon_stats[element].max_win_meter).toFixed(1);
          }
          weapons.push({
            weapon: weapon,
            win: parseInt(res.records.weapon_stats[element].win_count),
            lose: parseInt(res.records.weapon_stats[element].lose_count),
            winMeter: winMeter,
            maxWinMeter: maxWinMeter,
            totalPaint: parseInt(res.records.weapon_stats[element].total_paint_point)
          });
        });
        return weapons;
      })
      .catch(e => {
        console.error(e);
        return null;
      });
  };

  static updateWeaponsRecords = onSuccess => {
    return StatisticsHelper.getWeaponsRecords()
      .then(res => {
        if (res === null) {
          throw new TakosError('can_not_parse_weapons_records');
        } else {
          onSuccess(res);
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          return e;
        } else {
          console.error(e);
          return new TakosError('can_not_update_weapons_records');
        }
      });
  };

  static getWeaponsStatistics = () => {
    let weapons = [];
    return StorageHelper.battles()
      .then(res =>
        res.sort((a, b) => {
          return b.number - a.number;
        })
      )
      .then(res => {
        res.forEach(element => {
          let weapon = weapons.find(ele => {
            return !ele.isSalmonRun && ele.weapon.mainWeapon === element.selfPlayer.weapon.mainWeapon;
          });
          if (weapon === undefined) {
            weapons.push({
              weapon: element.selfPlayer.weapon,
              isSalmonRun: false,
              win: 0,
              lose: 0,
              winMeter: null,
              maxWinMeter: 0,
              totalPaint: 0
            });
            // Find weapon again
            weapon = weapons.find(ele => {
              return !ele.isSalmonRun && ele.weapon.mainWeapon === element.selfPlayer.weapon.mainWeapon;
            });
          }
          if (element.isWin) {
            weapon.win++;
          } else {
            weapon.lose++;
          }
          if (weapon.winMeter === null && element.winMeter !== undefined) {
            weapon.winMeter = element.winMeter;
          }
          if (element.winMeter !== undefined) {
            const maxWinMeter = Math.max(parseFloat(weapon.maxWinMeter), parseFloat(element.winMeter));
            if (maxWinMeter % 1 === 0) {
              weapon.maxWinMeter = parseInt(maxWinMeter);
            } else {
              weapon.maxWinMeter = maxWinMeter.toFixed(1);
            }
          }
          weapon.totalPaint = weapon.totalPaint + element.selfPlayer.paint;
        });
      })
      .then(() => {
        return StorageHelper.jobs();
      })
      .then(res => {
        res.forEach(element => {
          // Weapons
          element.selfPlayer.weapons.forEach(ele => {
            let weapon = weapons.find(e => {
              return e.isSalmonRun && e.weapon.mainWeapon === ele.mainWeapon;
            });
            if (weapon === undefined) {
              weapons.push({
                weapon: ele,
                isSalmonRun: true,
                clear: 0,
                timeLimit: 0,
                wipeOut: 0
              });
              // Find weapon again
              weapon = weapons.find(e => {
                return e.isSalmonRun && e.weapon.mainWeapon === ele.mainWeapon;
              });
            }
            switch (element.result) {
              case JobResult.clear:
                weapon.clear++;
                break;
              case JobResult.timeLimit:
                weapon.timeLimit++;
                break;
              case JobResult.wipeOut:
                weapon.wipeOut++;
                break;
              default:
                throw new RangeError();
            }
          });
        });
      })
      .then(() => {
        return weapons;
      })
      .catch(e => {
        console.error(e);
        return null;
      });
  };

  static updateWeaponsStatistics = onSuccess => {
    return StatisticsHelper.getWeaponsStatistics()
      .then(res => {
        if (res === null) {
          throw new TakosError('can_not_parse_weapons_statistics');
        } else {
          onSuccess(res);
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          return e;
        } else {
          console.error(e);
          return new TakosError('can_not_update_weapons_statistics');
        }
      });
  };
}

export default StatisticsHelper;
