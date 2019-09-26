import { SPLATNET, SPLATNET_NICKNAME_AND_ICON } from './FileFolderUrl';
import './StringHelper';

class BattleHelper {
  static getPlayerIcon = id => {
    const init = {
      method: 'GET',
      headers: new Headers({
        Cookie: 'iksm_session={0}'.format(window.localStorage.Cookie)
      })
    };
    return fetch(SPLATNET + SPLATNET_NICKNAME_AND_ICON.format(id), init)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        return res.nickname_and_icons[0].thumbnail_url;
      })
      .catch(e => {
        console.error(e);
        return '';
      });
  };
}

export default BattleHelper;
