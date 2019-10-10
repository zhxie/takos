import TakosError from './ErrorHelper';
import FileFolderUrl from './FileFolderUrl';
import StorageHelper from './StorageHelper';
import './StringHelper';
import { Battle } from '../models/Battle';

class BattleHelper {
  static getTheLatestBattleNumber = () => {
    const init = {
      method: 'GET',
      headers: new Headers({
        Cookie: 'iksm_session={0}'.format(StorageHelper.cookie()),
        'X-Cookie': 'iksm_session={0}'.format(StorageHelper.cookie())
      })
    };
    return fetch(FileFolderUrl.SPLATNET_RESULTS, init)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.results[0].battle_number !== undefined && res.results[0].battle_number !== null) {
          return parseInt(res.results[0].battle_number);
        } else {
          throw new RangeError();
        }
      })
      .catch(e => {
        console.error(e);
        return 0;
      });
  };

  static getTheLatestBattle = () => {
    const init = {
      method: 'GET',
      headers: new Headers({
        Cookie: 'iksm_session={0}'.format(StorageHelper.cookie()),
        'X-Cookie': 'iksm_session={0}'.format(StorageHelper.cookie())
      })
    };
    return fetch(FileFolderUrl.SPLATNET_RESULTS, init)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.results[0].battle_number !== undefined && res.results[0].battle_number !== null) {
          return parseInt(res.results[0].battle_number);
        } else {
          throw new RangeError();
        }
      })
      .then(res => {
        return BattleHelper.getBattle(res);
      })
      .catch(e => {
        console.error(e);
        return new Battle('can_not_get_the_latest_battle');
      });
  };

  static getBattle = number => {
    const init = {
      method: 'GET',
      headers: new Headers({
        Cookie: 'iksm_session={0}'.format(StorageHelper.cookie()),
        'X-Cookie': 'iksm_session={0}'.format(StorageHelper.cookie())
      })
    };
    return fetch(FileFolderUrl.SPLATNET_RESULT.format(number), init)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        // Parse response
        return Battle.parse(res);
      })
      .catch(e => {
        console.error(e);
        return new Battle('can_not_get_battle_{0}'.format(number));
      });
  };

  static getBattleImage = number => {
    const init = {
      method: 'POST',
      headers: new Headers({
        Cookie: 'iksm_session={0}'.format(StorageHelper.cookie()),
        'X-Cookie': 'iksm_session={0}'.format(StorageHelper.cookie()),
        'X-Requested-With': 'XMLHttpRequest'
      })
    };
    return fetch(FileFolderUrl.SPLATNET_SHARE_RESULT.format(number), init)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        // Parse response
        return res.url;
      })
      .catch(e => {
        console.error(e);
        return new TakosError('can_not_get_battle_image_{0}'.format(number));
      });
  };

  static getPlayerIcon = id => {
    const init = {
      method: 'GET',
      headers: new Headers({
        Cookie: 'iksm_session={0}'.format(StorageHelper.cookie()),
        'X-Cookie': 'iksm_session={0}'.format(StorageHelper.cookie())
      })
    };
    return fetch(FileFolderUrl.SPLATNET_NICKNAME_AND_ICON.format(id), init)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.nickname_and_icons[0].thumbnail_url !== undefined && res.nickname_and_icons[0].thumbnail_url !== null) {
          return res.nickname_and_icons[0].thumbnail_url;
        } else {
          throw new RangeError();
        }
      })
      .catch(e => {
        console.error(e);
        return null;
      });
  };
}

export default BattleHelper;
