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
        let shifts = [];
        res.details.forEach(element => {
          shifts.push(Shift.parse(element));
        });
        res.schedules.slice(shifts.length).forEach(element => {
          shifts.push(Shift.parse(element));
        });
        return shifts;
      })
      .catch(e => {
        console.error(e);
        return null;
      });
  };
}

export default ShiftHelper;
