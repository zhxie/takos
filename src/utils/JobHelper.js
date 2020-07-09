import BattleHelper from './BattleHelper';
import FileFolderUrl from './FileFolderUrl';
import StorageHelper from './StorageHelper';
import './StringHelper';
import { Job } from '../models/Job';

class JobHelper {
  static getTheLatestJobNumber = () => {
    const init = {
      method: 'GET',
      headers: new Headers({
        Cookie: 'iksm_session={0}'.format(StorageHelper.cookie()),
        'X-Cookie': 'iksm_session={0}'.format(StorageHelper.cookie())
      })
    };
    return fetch(FileFolderUrl.SPLATNET_COOP_RESULTS, init)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.results[0].job_id !== undefined && res.results[0].job_id !== null) {
          return parseInt(res.results[0].job_id);
        } else {
          throw new RangeError();
        }
      })
      .catch((e) => {
        console.error(e);
        return 0;
      });
  };

  static getTheLatestJob = () => {
    const init = {
      method: 'GET',
      headers: new Headers({
        Cookie: 'iksm_session={0}'.format(StorageHelper.cookie()),
        'X-Cookie': 'iksm_session={0}'.format(StorageHelper.cookie())
      })
    };
    return fetch(FileFolderUrl.SPLATNET_COOP_RESULTS, init)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.results[0].job_id !== undefined && res.results[0].job_id !== null) {
          return parseInt(res.results[0].job_id);
        } else {
          throw new RangeError();
        }
      })
      .then((res) => {
        return JobHelper.getJob(res);
      })
      .catch((e) => {
        console.error(e);
        return new Job('can_not_get_the_latest_battle');
      });
  };

  static getJob = (number) => {
    const init = {
      method: 'GET',
      headers: new Headers({
        Cookie: 'iksm_session={0}'.format(StorageHelper.cookie()),
        'X-Cookie': 'iksm_session={0}'.format(StorageHelper.cookie())
      })
    };
    return fetch(FileFolderUrl.SPLATNET_COOP_RESULT.format(number), init)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        // Parse response
        return Job.parse(res);
      })
      .catch((e) => {
        console.error(e);
        return new Job('can_not_get_job_{0}'.format(number));
      });
  };

  static getPlayerIcon = (id) => {
    return BattleHelper.getPlayerIcon(id);
  };
}

export default JobHelper;
