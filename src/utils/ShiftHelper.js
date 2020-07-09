import TakosError from './ErrorHelper';
import FileFolderUrl from './FileFolderUrl';
import { Gear } from '../models/Gear';
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
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        // Parse response
        let shifts = [];
        res.details.forEach((element) => {
          shifts.push(Shift.parse(element));
        });
        res.schedules.slice(shifts.length).forEach((element) => {
          shifts.push(Shift.parse(element));
        });
        return shifts;
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  };

  static updateShifts = (onSuccess) => {
    return ShiftHelper.getShifts()
      .then((res) => {
        if (res === null) {
          throw new TakosError('can_not_get_shifts');
        } else {
          res.forEach((element) => {
            if (element.error !== null) {
              throw new TakosError(element.error);
            }
          });
          if (res.length > 0) {
            onSuccess(res);
          } else {
            throw new TakosError('can_not_parse_shifts');
          }
        }
      })
      .catch((e) => {
        if (e instanceof TakosError) {
          return e;
        } else {
          console.error(e);
          return new TakosError('can_not_update_shifts');
        }
      });
  };

  static getRewardGear = () => {
    const init = {
      method: 'GET',
      headers: new Headers({
        'User-Agent': FileFolderUrl.USER_AGENT
      })
    };
    return fetch(FileFolderUrl.SPLATOON2_INK_SHIFT_REWARD_GEAR, init)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        // Parse response
        const gear = Gear.parseReward(res.coop.reward_gear.gear);
        return gear;
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  };

  static updateRewardGear = (onSuccess) => {
    return ShiftHelper.getRewardGear()
      .then((res) => {
        if (res === null) {
          throw new TakosError('can_not_get_reward_gear');
        } else {
          if (res.error !== null) {
            throw new TakosError(res.error);
          } else {
            onSuccess(res);
          }
        }
      })
      .catch((e) => {
        if (e instanceof TakosError) {
          return e;
        } else {
          console.error(e);
          return new TakosError('can_not_update_reward_gear');
        }
      });
  };
}

export default ShiftHelper;
