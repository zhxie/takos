import { Ability } from './Ability';
import Base from './Base';

class BaseBrand {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse = id => {
    switch (id) {
      case 0:
        return BaseBrand.squidforce;
      case 1:
        return BaseBrand.zink;
      case 2:
        return BaseBrand.krakOn;
      case 3:
        return BaseBrand.rockenberg;
      case 4:
        return BaseBrand.zekko;
      case 5:
        return BaseBrand.forge;
      case 6:
        return BaseBrand.firefin;
      case 7:
        return BaseBrand.skalop;
      case 8:
        return BaseBrand.splashMob;
      case 9:
        return BaseBrand.inkline;
      case 10:
        return BaseBrand.tentatek;
      case 11:
        return BaseBrand.takoroka;
      case 15:
        return BaseBrand.annaki;
      case 16:
        return BaseBrand.enperry;
      case 17:
        return BaseBrand.toniKensa;
      case 97:
        return BaseBrand.grizzco;
      case 98:
        return BaseBrand.cuttlegear;
      case 99:
        return BaseBrand.amiibo;
      default:
        throw new RangeError();
    }
  };
}

BaseBrand.squidforce = new BaseBrand('brand.squidforce', 0);
BaseBrand.zink = new BaseBrand('brand.zink', 1);
BaseBrand.krakOn = new BaseBrand('brand.krak_on', 2);
BaseBrand.rockenberg = new BaseBrand('brand.rockenberg', 3);
BaseBrand.zekko = new BaseBrand('brand.zekko', 4);
BaseBrand.forge = new BaseBrand('brand.forge', 5);
BaseBrand.firefin = new BaseBrand('brand.firefin', 6);
BaseBrand.skalop = new BaseBrand('brand.skalop', 7);
BaseBrand.splashMob = new BaseBrand('brand.splash_mob', 8);
BaseBrand.inkline = new BaseBrand('brand.inkline', 9);
BaseBrand.tentatek = new BaseBrand('brand.tentatek', 10);
BaseBrand.takoroka = new BaseBrand('brand.takoroka', 11);
BaseBrand.annaki = new BaseBrand('brand.annaki', 15);
BaseBrand.enperry = new BaseBrand('brand.enperry', 16);
BaseBrand.toniKensa = new BaseBrand('brand.toni_kensa', 17);
BaseBrand.grizzco = new BaseBrand('brand.grizzco', 97);
BaseBrand.cuttlegear = new BaseBrand('brand.cuttlegear', 98);
BaseBrand.amiibo = new BaseBrand('brand.amiibo', 99);

Object.freeze(BaseBrand);

class Brand extends Base {
  constructor(e, brand, url, favoredAbility) {
    super(e);
    this.brand = brand;
    this.url = url;
    this.favoredAbility = favoredAbility;
  }

  static parse = data => {
    try {
      const brand = BaseBrand.parse(parseInt(data.id));
      let favoredAbility = null;
      if (data.frequent_skill !== undefined) {
        favoredAbility = Ability.parseSecondary(data.frequent_skill);
      }
      return new Brand(null, brand, data.image, favoredAbility);
    } catch (e) {
      console.error(e);
      return new Brand('can_not_parse_brand');
    }
  };
}

export { BaseBrand, Brand };
