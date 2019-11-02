import TakosError from './ErrorHelper';
import FileFolderUrl from './FileFolderUrl';
import StorageHelper from './StorageHelper';
import { RankedBattle, LeagueBattle } from '../models/Battle';
import Rule from '../models/Rule';
import { ScheduledStage } from '../models/Stage';
import { JobResult } from '../models/Job';

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
          throw new TakosError('can_not_parse_stages_record');
        } else {
          onSuccess(res);
        }
      })
      .catch(e => {
        if (e instanceof TakosError) {
          return e;
        } else {
          console.error(e);
          return new TakosError('can_not_update_stages_record');
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
}

export default StatisticsHelper;
