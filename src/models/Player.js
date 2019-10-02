import Base from './Base';
import { Gear } from './Gear';
import { Weapon } from './Weapon';
import BattleHelper from '../utils/BattleHelper';

class Species {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse = name => {
    switch (name) {
      case 'inklings':
        return Species.inklings;
      case 'octolings':
        return Species.octolings;
      default:
        throw new RangeError();
    }
  };

  static deserialize = data => {
    switch (parseInt(data.value)) {
      case 0:
        return Species.inklings;
      case 1:
        return Species.octolings;
      default:
        throw new RangeError();
    }
  };
}

Species.inklings = new Species('species.inklings', 0);
Species.octolings = new Species('species.octolings', 1);

Object.freeze(Species);

class Style {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse = name => {
    switch (name) {
      case 'girl':
        return Style.girl;
      case 'boy':
        return Style.boy;
      default:
        throw new RangeError();
    }
  };

  static deserialize = data => {
    switch (parseInt(data.value)) {
      case 0:
        return Style.girl;
      case 1:
        return Style.boy;
      default:
        throw new RangeError();
    }
  };
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

  static parse = data => {
    if (data.name === null) {
      return Rank.cMinus;
    }
    switch (data.name) {
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
        if (data.s_plus_number === null) {
          return Rank.sPlus;
        }
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
  };

  static deserialize = data => {
    switch (data.value) {
      case 0:
        return Rank.cMinus;
      case 1:
        return Rank.c;
      case 2:
        return Rank.cPlus;
      case 3:
        return Rank.bMinus;
      case 4:
        return Rank.b;
      case 5:
        return Rank.bPlus;
      case 6:
        return Rank.aMinus;
      case 7:
        return Rank.a;
      case 8:
        return Rank.aPlus;
      case 9:
        return Rank.s;
      case 10:
        return Rank.sPlus;
      case 11:
        return Rank.sPlus0;
      case 12:
        return Rank.sPlus1;
      case 13:
        return Rank.sPlus2;
      case 14:
        return Rank.sPlus3;
      case 15:
        return Rank.sPlus4;
      case 16:
        return Rank.sPlus5;
      case 17:
        return Rank.sPlus6;
      case 18:
        return Rank.sPlus7;
      case 19:
        return Rank.sPlus8;
      case 20:
        return Rank.sPlus9;
      case 21:
        return Rank.x;
      default:
        throw new RangeError();
    }
  };
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
Rank.sPlus = new Rank('rank.s+', 'rank.s+', 10);
Rank.sPlus0 = new Rank('rank.s+0', 'rank.s+', 11);
Rank.sPlus1 = new Rank('rank.s+1', 'rank.s+', 12);
Rank.sPlus2 = new Rank('rank.s+2', 'rank.s+', 13);
Rank.sPlus3 = new Rank('rank.s+3', 'rank.s+', 14);
Rank.sPlus4 = new Rank('rank.s+4', 'rank.s+', 15);
Rank.sPlus5 = new Rank('rank.s+5', 'rank.s+', 16);
Rank.sPlus6 = new Rank('rank.s+6', 'rank.s+', 17);
Rank.sPlus7 = new Rank('rank.s+7', 'rank.s+', 18);
Rank.sPlus8 = new Rank('rank.s+8', 'rank.s+', 19);
Rank.sPlus9 = new Rank('rank.s+9', 'rank.s+', 20);
Rank.x = new Rank('rank.x', 'rank.x', 21);

Object.freeze(Rank);

class PlayerType {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

PlayerType.regularBattle = new PlayerType('player.regular_battle', 0);
PlayerType.rankedBattle = new PlayerType('player.ranked_battle', 1);
PlayerType.salmonRun = new PlayerType('player.salmon_run', 2);

class Player extends Base {
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

class BattlePlayer extends Player {
  constructor(
    e,
    type,
    id,
    nickname,
    species,
    style,
    isSelf,
    url,
    level,
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
    super(e, type, id, nickname, species, style, isSelf, url);
    this.level = level;
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

  killAndAssist = () => {
    return this.kill + this.assist;
  };

  isLevelWithStar = () => {
    return this.level > 99;
  };

  levelWithStar = () => {
    return this.level - this.star() * 100;
  };

  star = () => {
    return parseInt(this.level / 100);
  };

  static parse = (data, url, isSelf) => {
    try {
      const species = Species.parse(data.player.player_type.species);
      const style = Style.parse(data.player.player_type.style);
      const level = parseInt(data.player.player_rank) + 100 * parseInt(data.player.star_rank);
      const headgearGear = Gear.parseHeadgear(data.player.head, data.player.head_skills);
      if (headgearGear.error !== null) {
        // Handle previous error
        return new RegularBattlePlayer(headgearGear.error);
      }
      const clothesGear = Gear.parseClothes(data.player.clothes, data.player.clothes_skills);
      if (clothesGear.error !== null) {
        // Handle previous error
        return new RegularBattlePlayer(clothesGear.error);
      }
      const shoesGear = Gear.parseShoes(data.player.shoes, data.player.shoes_skills);
      if (shoesGear.error !== null) {
        // Handle previous error
        return new RegularBattlePlayer(shoesGear.error);
      }
      const weapon = Weapon.parse(data.player.weapon);
      if (weapon.error !== null) {
        // Handle previous error
        return new RegularBattlePlayer(weapon.error);
      }
      const paint = parseInt(data.game_paint_point);
      const kill = parseInt(data.kill_count);
      const assist = parseInt(data.assist_count);
      const death = parseInt(data.death_count);
      const special = parseInt(data.special_count);
      const sort = parseInt(data.sort_score);
      if (data.player.udemae === undefined || data.player.udemae === null) {
        // Regular battle
        return new RegularBattlePlayer(
          null,
          data.player.principal_id,
          data.player.nickname,
          species,
          style,
          url,
          isSelf,
          level,
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
        );
      } else {
        // Ranked battle
        const rank = Rank.parse(data.player.udemae);
        return new RankedBattlePlayer(
          null,
          data.player.principal_id,
          data.player.nickname,
          species,
          style,
          url,
          isSelf,
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
        );
      }
    } catch (e) {
      console.error(e);
      return new BattlePlayer('can_not_parse_player');
    }
  };

  static parsePromise = (data, isSelf) => {
    return BattleHelper.getPlayerIcon(data.player.principal_id)
      .then(res => {
        if (res === null) {
          throw new RangeError();
        } else {
          return this.parse(data, res, isSelf);
        }
      })
      .catch(() => {
        return new BattlePlayer('can_not_get_player_icon');
      });
  };

  static deserialize = data => {
    const species = Species.deserialize(data.species);
    const style = Style.deserialize(data.style);
    const level = parseInt(data.level);
    const headgearGear = Gear.deserializeHeadgear(data.headgearGear);
    if (headgearGear.error !== null) {
      // Handle previous error
      return new RegularBattlePlayer(headgearGear.error);
    }
    const clothesGear = Gear.deserializeClothes(data.clothesGear);
    if (clothesGear.error !== null) {
      // Handle previous error
      return new RegularBattlePlayer(clothesGear.error);
    }
    const shoesGear = Gear.deserializeShoes(data.shoesGear);
    if (shoesGear.error !== null) {
      // Handle previous error
      return new RegularBattlePlayer(shoesGear.error);
    }
    const weapon = Weapon.deserialize(data.weapon);
    if (weapon.error !== null) {
      // Handle previous error
      return new RegularBattlePlayer(weapon.error);
    }
    const paint = parseInt(data.paint);
    const kill = parseInt(data.kill);
    const assist = parseInt(data.assist);
    const death = parseInt(data.death);
    const special = parseInt(data.special);
    const sort = parseInt(data.sort);
    if (data.rank === undefined || data.rank === null) {
      // Regular battle
      return new RegularBattlePlayer(
        null,
        data.id,
        data.nickname,
        species,
        style,
        data.url,
        data.isSelf,
        level,
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
      );
    } else {
      const rank = Rank.deserialize(data.rank);
      return new RankedBattlePlayer(
        null,
        data.id,
        data.nickname,
        species,
        style,
        data.url,
        data.isSelf,
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
      );
    }
  };
}

class RegularBattlePlayer extends BattlePlayer {
  constructor(
    e,
    id,
    nickname,
    species,
    style,
    isSelf,
    url,
    level,
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
    super(
      e,
      PlayerType.regularBattle,
      id,
      nickname,
      species,
      style,
      isSelf,
      url,
      level,
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
    );
  }
}

class RankedBattlePlayer extends BattlePlayer {
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
    super(
      e,
      PlayerType.rankedBattle,
      id,
      nickname,
      species,
      style,
      isSelf,
      url,
      level,
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
    );
    this.rank = rank;
  }
}

export { Species, Style, Rank, PlayerType, Player, BattlePlayer, RegularBattlePlayer, RankedBattlePlayer };
