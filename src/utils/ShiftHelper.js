import FileFolderUrl from './FileFolderUrl';
import Shift from '../models/Shift';

class ShiftHelper {
  static getShifts = () => {
    const init = {
      method: 'GET',
      headers: new Headers({
        'User-Agent': FileFolderUrl.USER_AGENT
      })
    };
    return fetch(FileFolderUrl.SPLATOON2_INK_SHIFTS, init)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        // Parse response
        let details = [];
        let schedules = [];
        res.details.forEach(element => {
          details.push(Shift.parse(element));
        });
        res.schedules.forEach(element => {
          schedules.push({ startTime: element.start_time, endTime: element.end_time });
        });
        return { details, schedules };
      })
      .catch(e => {
        console.error(e);
        return null;
      });
  };
}

export default ShiftHelper;
