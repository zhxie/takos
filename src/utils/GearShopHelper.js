import FileFolderUrl from './FileFolderUrl';
import StorageHelper from './StorageHelper';
import { ShopGear, OrderedGear } from '../models/Gear';

class GearShopHelper {
  static getShopGears = () => {
    const init = {
      method: 'GET',
      headers: new Headers({
        'User-Agent': FileFolderUrl.USER_AGENT
      })
    };
    return fetch(FileFolderUrl.SPLATOON2_INK_GEAR_SHOP, init)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        // Parse response
        let gears = [];
        res.merchandises.forEach(element => {
          gears.push(ShopGear.parse(element));
        });
        return gears;
      })
      .catch(e => {
        console.error(e);
        return null;
      });
  };

  static getOrderedGear = () => {
    const init = {
      method: 'GET',
      headers: new Headers({
        Cookie: 'iksm_session={0}'.format(StorageHelper.cookie()),
        'X-Cookie': 'iksm_session={0}'.format(StorageHelper.cookie())
      })
    };
    return fetch(FileFolderUrl.SPLATNET_GEAR_SHOP, init)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        // Parse response
        if (res.ordered_info === null) {
          return null;
        } else {
          const gear = OrderedGear.parse(res.ordered_info);
          return gear;
        }
      })
      .catch(e => {
        console.error(e);
        return new OrderedGear('can_not_get_ordered_gear');
      });
  };

  static orderGear = id => {
    const init = {
      method: 'GET',
      headers: new Headers({
        Cookie: 'iksm_session={0}'.format(StorageHelper.cookie()),
        'X-Cookie': 'iksm_session={0}'.format(StorageHelper.cookie())
      })
    };
    return fetch(FileFolderUrl.SPLATNET_TIMELINE, init)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        // Parse response
        return res.unique_id;
      })
      .then(res => {
        let formData = new FormData();
        formData.append('override', 1);
        const init2 = {
          method: 'POST',
          headers: new Headers({
            'X-Requested-With': 'XMLHttpRequest',
            'X-Unique-Id': res,
            Cookie: 'iksm_session={0}'.format(StorageHelper.cookie()),
            'X-Cookie': 'iksm_session={0}'.format(StorageHelper.cookie())
          }),
          body: formData
        };
        return fetch(FileFolderUrl.SPLATNET_GEAR_SHOP_ORDER.format(id), init2);
      })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res.ordered_info !== undefined) {
          return true;
        } else {
          return false;
        }
      })
      .catch(e => {
        console.error(e);
        return false;
      });
  };
}

export default GearShopHelper;
