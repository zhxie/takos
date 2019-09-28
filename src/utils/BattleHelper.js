import { SPLATNET, SPLATNET_RESULTS, SPLATNET_RESULT, SPLATNET_NICKNAME_AND_ICON } from './FileFolderUrl';
import './StringHelper';
import Battle from '../models/Battle';
import { Mode } from '../models/Mode';

class BattleHelper {
  static getTheLatestBattle = () => {
    const init = {
      method: 'GET',
      headers: new Headers({
        'X-Cookie': 'iksm_session={0}'.format(window.localStorage.cookie)
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
        'X-Cookie': 'iksm_session={0}'.format(window.localStorage.cookie)
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

  static updateRank = battle => {
    try {
      if (battle.error === null && battle.gameMode === Mode.rankedBattle) {
        if (!(window.localStorage.rank instanceof Object)) {
          window.localStorage.rank = {};
        }
        if (!(window.localStorage.rank[battle.rule.value] instanceof Object)) {
          window.localStorage.rank[battle.rule.value] = {};
        }
        if (
          window.localStorage.rank[battle.rule.value].number === undefined ||
          battle.number > window.localStorage.rank[battle.rule.value].number
        ) {
          window.localStorage.rank[battle.rule.value].number = battle.number;
          window.localStorage.rank[battle.rule.value].rank = battle.rank;
        }
      }
    } catch {}
  };

  static getPlayerIcon = id => {
    const init = {
      method: 'GET',
      headers: new Headers({
        'X-Cookie': 'iksm_session={0}'.format(window.localStorage.cookie)
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
