import TakosError from './ErrorHelper';
import FileFolderUrl from './FileFolderUrl';
import Schedule from '../models/Schedule';

class ScheduleHelper {
  static getSchedules = () => {
    const init = {
      method: 'GET',
      headers: new Headers({
        'User-Agent': FileFolderUrl.USER_AGENT
      })
    };
    return fetch(FileFolderUrl.SPLATOON2_INK_SCHEDULES, init)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        // Parse response
        let regularSchedules = [];
        let rankedSchedules = [];
        let leagueSchedules = [];
        res.regular.forEach((element) => {
          regularSchedules.push(Schedule.parse(element));
        });
        res.gachi.forEach((element) => {
          rankedSchedules.push(Schedule.parse(element));
        });
        res.league.forEach((element) => {
          leagueSchedules.push(Schedule.parse(element));
        });
        return { regularSchedules, rankedSchedules, leagueSchedules };
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  };

  static updateSchedules = (onSuccess) => {
    return ScheduleHelper.getSchedules()
      .then((res) => {
        if (res === null) {
          throw new TakosError('can_not_get_schedules');
        } else {
          res.regularSchedules.forEach((element) => {
            if (element.error !== null) {
              throw new TakosError(element.error);
            }
          });
          res.rankedSchedules.forEach((element) => {
            if (element.error !== null) {
              throw new TakosError(element.error);
            }
          });
          res.leagueSchedules.forEach((element) => {
            if (element.error !== null) {
              throw new TakosError(element.error);
            }
          });
          if (res.regularSchedules.length > 0 && res.rankedSchedules.length > 0 && res.leagueSchedules.length > 0) {
            onSuccess(res);
          } else {
            throw new TakosError('can_not_parse_schedules');
          }
        }
      })
      .catch((e) => {
        if (e instanceof TakosError) {
          return e;
        } else {
          console.error(e);
          return new TakosError('can_not_update_schedules');
        }
      });
  };
}

export default ScheduleHelper;
