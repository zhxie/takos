import TakosError from './ErrorHelper';
import { SPLATNET, SPLATNET_RESULTS, SPLATNET_RESULT, SPLATNET_NICKNAME_AND_ICON } from './FileFolderUrl';
import StorageHelper from './StorageHelper';
import './StringHelper';
import { Battle } from '../models/Battle';
import { Mode } from '../models/Mode';

class BattleHelper {
  static getTheLatestBattleNumber = () => {
    const init = {
      method: 'GET',
      headers: new Headers({
        'X-Cookie': 'iksm_session={0}'.format(StorageHelper.cookie())
      })
    };
    return fetch(SPLATNET + SPLATNET_RESULTS, init)
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
        'X-Cookie': 'iksm_session={0}'.format(StorageHelper.cookie())
      })
    };
    return fetch(SPLATNET + SPLATNET_RESULTS, init)
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
        'X-Cookie': 'iksm_session={0}'.format(StorageHelper.cookie())
      })
    };
    return fetch(SPLATNET + SPLATNET_RESULT.format(number), init)
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

  static saveBattle = battle => {
    if (battle !== undefined && battle !== null && battle.error === null) {
      return StorageHelper.addBattle(battle)
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
            return new TakosError('can_not_save_battle');
          }
        });
    }
  };

  static updateRank = battle => {
    if (battle !== undefined && battle !== null && battle.error === null && battle.gameMode === Mode.rankedBattle) {
      let rank = StorageHelper.rank();
      if (rank === null) {
        rank = {};
      }
      if (rank[battle.rule.value] === undefined || rank[battle.rule.value] === null) {
        rank[battle.rule.value] = {};
      }
      if (
        rank[battle.rule.value].number === undefined ||
        rank[battle.rule.value].number === null ||
        battle.number > rank[battle.rule.value].number
      ) {
        rank[battle.rule.value].number = battle.number;
        rank[battle.rule.value].rank = battle.rank;
        StorageHelper.setRank(rank);
      }
    }
  };

  static getPlayerIcon = id => {
    const init = {
      method: 'GET',
      headers: new Headers({
        'X-Cookie': 'iksm_session={0}'.format(StorageHelper.cookie())
      })
    };
    return fetch(SPLATNET + SPLATNET_NICKNAME_AND_ICON.format(id), init)
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
