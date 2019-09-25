import Base from './Base';
import { Gear } from './Gear';
import { Weapon } from './Weapon';

class Species {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse(name) {
    switch (name) {
      case 'inklings':
        return Species.inklings;
      case 'octolings':
        return Species.octolings;
      default:
        throw new RangeError();
    }
  }
}

Species.inklings = new Species('species.inklings', 0);
Species.octolings = new Species('species.octolings', 1);

Object.freeze(Species);

class Style {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse(name) {
    switch (name) {
      case 'girl':
        return Style.girl;
      case 'boy':
        return Style.boy;
      default:
        throw new RangeError();
    }
  }
}

Style.girl = new Style('style.girl', 0);
Style.boy = new Style('style.boy', 1);

Object.freeze(Style);

class Rank {
  constructor(name, shortName, value) {
    this.name = name;
    this.shortName = shortName;
    this.value = value;
  }

  static parse(data) {
    switch (data.name) {
      case '':
      case 'C-':
        return Rank.cMinus;
      case 'C':
        return Rank.c;
      case 'C+':
        return Rank.cPlus;
      case 'B-':
        return Rank.bMinus;
      case 'B':
        return Rank.b;
      case 'B+':
        return Rank.bPlus;
      case 'A-':
        return Rank.aMinus;
      case 'A':
        return Rank.a;
      case 'A+':
        return Rank.aPlus;
      case 'S':
        return Rank.s;
      case 'S+':
        switch (parseInt(data.s_plus_number)) {
          case 0:
            return Rank.sPlus0;
          case 1:
            return Rank.sPlus1;
          case 2:
            return Rank.sPlus2;
          case 3:
            return Rank.sPlus3;
          case 4:
            return Rank.sPlus4;
          case 5:
            return Rank.sPlus5;
          case 6:
            return Rank.sPlus6;
          case 7:
            return Rank.sPlus7;
          case 8:
            return Rank.sPlus8;
          case 9:
            return Rank.sPlus9;
          default:
            throw new RangeError();
        }
      case 'X':
        return Rank.x;
      default:
        throw new RangeError();
    }
  }
}

Rank.cMinus = new Rank('rank.c-', 'rank.c-', 0);
Rank.c = new Rank('rank.c', 'rank.c', 1);
Rank.cPlus = new Rank('rank.c+', 'rank.c+', 2);
Rank.bMinus = new Rank('rank.b-', 'rank.b-', 3);
Rank.b = new Rank('rank.b', 'rank.b', 4);
Rank.bPlus = new Rank('rank.b+', 'rank.b+', 5);
Rank.aMinus = new Rank('rank.a-', 'rank.a-', 6);
Rank.a = new Rank('rank.a', 'rank.a', 7);
Rank.aPlus = new Rank('rank.a+', 'rank.a+', 8);
Rank.s = new Rank('rank.s', 'rank.s', 9);
Rank.sPlus0 = new Rank('rank.s+0', 'rank.s+', 10);
Rank.sPlus1 = new Rank('rank.s+1', 'rank.s+', 11);
Rank.sPlus2 = new Rank('rank.s+2', 'rank.s+', 12);
Rank.sPlus3 = new Rank('rank.s+3', 'rank.s+', 13);
Rank.sPlus4 = new Rank('rank.s+4', 'rank.s+', 14);
Rank.sPlus5 = new Rank('rank.s+5', 'rank.s+', 15);
Rank.sPlus6 = new Rank('rank.s+6', 'rank.s+', 16);
Rank.sPlus7 = new Rank('rank.s+7', 'rank.s+', 17);
Rank.sPlus8 = new Rank('rank.s+8', 'rank.s+', 18);
Rank.sPlus9 = new Rank('rank.s+9', 'rank.s+', 19);
Rank.x = new Rank('rank.x', 'rank.x', 20);

Object.freeze(Rank);

class PlayerType {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

PlayerType.battle = new PlayerType('player.battle', 0);
PlayerType.salmonRun = new PlayerType('player.salmon_run', 1);

class BasePlayer extends Base {
  constructor(e, type, id, nickname, species, style, url, isSelf) {
    super(e);
    this.type = type;
    this.id = id;
    this.nickname = nickname;
    this.species = species;
    this.style = style;
    this.url = url;
    this.isSelf = isSelf;
  }
}

class Player extends BasePlayer {
  constructor(
    e,
    id,
    nickname,
    species,
    style,
    isSelf,
    url,
    level,
    rank,
    headgearGear,
    clothesGear,
    shoesGear,
    weapon,
    paint,
    kill,
    assist,
    death,
    special,
    sort
  ) {
    super(e, PlayerType.battle, id, nickname, species, style, isSelf, url);
    this.level = level;
    this.rank = rank;
    this.headgearGear = headgearGear;
    this.clothesGear = clothesGear;
    this.shoesGear = shoesGear;
    this.weapon = weapon;
    this.paint = paint;
    this.kill = kill;
    this.assist = assist;
    this.death = death;
    this.special = special;
    this.sort = sort;
  }

  isRanked = () => {
    return this.rank !== null && this.rank !== undefined;
  };

  static parseRegular(data, url, isSelf) {
    try {
      const species = Species.parse(data.player.player_type.species);
      const style = Style.parse(data.player.player_type.style);
      const headgearGear = Gear.parseHeadgear(data.head, data.head_skills);
      if (headgearGear.e !== null) {
        // Handle previous error
        return new Player(headgearGear.e);
      }
      const clothesGear = Gear.parseClothes(data.clothes, data.clothes_skills);
      if (clothesGear.e !== null) {
        // Handle previous error
        return new Player(clothesGear.e);
      }
      const shoesGear = Gear.parseShoes(data.shoes, data.shoes_skills);
      if (shoesGear.e !== null) {
        // Handle previous error
        return new Player(shoesGear.e);
      }
      const weapon = Weapon.parse(data.weapon);
      if (weapon.e !== null) {
        // Handle previous error
        return new Player(weapon.e);
      }
      return new Player(
        null,
        data.player_result.principal_id,
        data.player_result.nickname,
        species,
        style,
        url,
        isSelf,
        parseInt(data.player_result.player_rank) + 100 * parseInt(data.player_result.star_rank),
        headgearGear,
        clothesGear,
        shoesGear,
        weapon,
        parseInt(data.game_paint_point),
        parseInt(data.kill_count),
        parseInt(data.assist_count),
        parseInt(data.death_count),
        parseInt(data.special_count),
        parseInt(data.sort_score)
      );
    } catch (e) {
      console.error(e);
      return new Player('can_not_parse_regular_player');
    }
  }

  static parseRanked(data, url, isSelf) {
    try {
      const species = Species.parse(data.player.player_type.species);
      const style = Style.parse(data.player.player_type.style);
      const headgearGear = Gear.parseHeadgear(data.head, data.head_skills);
      if (headgearGear.e !== null) {
        // Handle previous error
        return new Player(headgearGear.e);
      }
      const clothesGear = Gear.parseClothes(data.clothes, data.clothes_skills);
      if (clothesGear.e !== null) {
        // Handle previous error
        return new Player(clothesGear.e);
      }
      const shoesGear = Gear.parseShoes(data.shoes, data.shoes_skills);
      if (shoesGear.e !== null) {
        // Handle previous error
        return new Player(shoesGear.e);
      }
      const weapon = Weapon.parse(data.weapon);
      if (weapon.e !== null) {
        // Handle previous error
        return new Player(weapon.e);
      }
      return new Player(
        null,
        data.player_result.principal_id,
        data.player_result.nickname,
        species,
        style,
        url,
        isSelf,
        parseInt(data.player_result.player_rank) + 100 * parseInt(data.player_result.star_rank),
        Rank.parse(data.udemae),
        headgearGear,
        clothesGear,
        shoesGear,
        weapon,
        parseInt(data.game_paint_point),
        parseInt(data.kill_count),
        parseInt(data.assist_count),
        parseInt(data.death_count),
        parseInt(data.special_count),
        parseInt(data.sort_score)
      );
    } catch (e) {
      console.error(e);
      return new Player('can_not_parse_ranked_player');
    }
  }
}

export { Species, Style, PlayerType, BasePlayer, Player };
