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
      .then(res => res.json())
      .then(res => {
        console.log(res);
        // Parse response
        let regularSchedules = [];
        let rankedSchedules = [];
        let leagueSchedules = [];
        res.regular.forEach(element => {
          regularSchedules.push(Schedule.parse(element));
        });
        res.gachi.forEach(element => {
          rankedSchedules.push(Schedule.parse(element));
        });
        res.league.forEach(element => {
          leagueSchedules.push(Schedule.parse(element));
        });
        return { regularSchedules, rankedSchedules, leagueSchedules };
      })
      .catch(e => {
        console.error(e);
        return null;
      });
  };
}

export default ScheduleHelper;
