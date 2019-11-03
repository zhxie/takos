import Base from './Base';
import { Gear } from './Gear';
import Salmoniod from './Salmoniod';
import { Weapon } from './Weapon';

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
  constructor(e, type, id, nickname, species, style, isSelf) {
    super(e, null);
    this.type = type;
    this.id = id;
    this.nickname = nickname;
    this.species = species;
    this.style = style;
    this.isSelf = isSelf;
  }
}

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

class BattlePlayer extends Player {
  constructor(
    e,
    type,
    id,
    nickname,
    species,
    style,
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
  ) {
    super(e, type, id, nickname, species, style, isSelf);
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

  get killAndAssist() {
    return this.kill + this.assist;
  }

  get islevelWithStar() {
    return this.level > 99;
  }

  get levelWithStar() {
    return this.level - this.star * 100;
  }

  get star() {
    return parseInt(this.level / 100);
  }

  get isDisconnect() {
    return this.paint === 0;
  }

  static parse = (data, isSelf) => {
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

  static deserialize = data => {
    try {
      const species = Species.deserialize(data.species);
      const style = Style.deserialize(data.style);
      const level = parseInt(data.level);
      const headgearGear = Gear.deserializeHeadgear(data.headgearGear);
      if (headgearGear.error !== null) {
        // Handle previous error
        return new BattlePlayer(headgearGear.error);
      }
      const clothesGear = Gear.deserializeClothes(data.clothesGear);
      if (clothesGear.error !== null) {
        // Handle previous error
        return new BattlePlayer(clothesGear.error);
      }
      const shoesGear = Gear.deserializeShoes(data.shoesGear);
      if (shoesGear.error !== null) {
        // Handle previous error
        return new BattlePlayer(shoesGear.error);
      }
      const weapon = Weapon.deserialize(data.weapon);
      if (weapon.error !== null) {
        // Handle previous error
        return new BattlePlayer(weapon.error);
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
    } catch (e) {
      console.error(e);
      return new BattlePlayer('can_not_deserialize_player');
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

class Grade {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse = id => {
    switch (id) {
      case 0:
        return Grade.intern;
      case 1:
        return Grade.apprentice;
      case 2:
        return Grade.partTimer;
      case 3:
        return Grade.goGetter;
      case 4:
        return Grade.overachiever;
      case 5:
        return Grade.professional;
      default:
        throw new RangeError();
    }
  };
}

Grade.intern = new Grade('grade.intern', 0);
Grade.apprentice = new Grade('grade.apprentice', 1);
Grade.partTimer = new Grade('grade.part_timer', 2);
Grade.goGetter = new Grade('grade.go_getter', 3);
Grade.overachiever = new Grade('grade.overachiever', 4);
Grade.professional = new Grade('grade.professional', 5);

class JobPlayer extends Player {
  constructor(
    e,
    id,
    nickname,
    species,
    style,
    isSelf,
    weapons,
    specialWeapon,
    specialCounts,
    bossSalmoniodKills,
    goldenEgg,
    powerEgg,
    help,
    death
  ) {
    super(e, PlayerType.salmonRun, id, nickname, species, style, isSelf);
    this.weapons = weapons;
    this.specialWeapon = specialWeapon;
    this.specialCounts = specialCounts;
    this.bossSalmoniodKills = bossSalmoniodKills;
    this.goldenEgg = goldenEgg;
    this.powerEgg = powerEgg;
    this.help = help;
    this.death = death;
  }

  get specialRemained() {
    let used = 0;
    this.specialCounts.forEach(element => {
      used = used + element;
    });
    return 2 - used;
  }

  get kill() {
    let kill = 0;
    this.bossSalmoniodKills.forEach(element => {
      kill = kill + element.kill;
    });
    return kill;
  }

  static parse = (data, isSelf) => {
    try {
      let weapons = [];
      data.weapon_list.forEach(element => {
        weapons.push(Weapon.parseSalmonRunMain(element));
      });
      weapons.forEach(element => {
        if (element.error !== null) {
          // Handle previous error
          return new JobPlayer(element.error);
        }
      });
      const specialWeapon = Weapon.parseSalmonRunSpecial(data.special);
      if (specialWeapon.error !== null) {
        // Handle previous error
        return new JobPlayer(specialWeapon.error);
      }
      let specialCounts = [];
      data.special_counts.forEach(element => {
        specialCounts.push(parseInt(element));
      });
      let bossSalmoniodKills = [];
      Object.keys(data.boss_kill_counts).forEach(element => {
        let bossSalmoniodKill = {};
        try {
          bossSalmoniodKill.salmoniod = Salmoniod.parse(parseInt(element));
          bossSalmoniodKill.kill = parseInt(data.boss_kill_counts[element].count);
          bossSalmoniodKills.push(bossSalmoniodKill);
        } catch (e) {
          console.error(e);
          return new JobPlayer('can_not_parse_player');
        }
      });
      return new JobPlayer(
        null,
        data.pid,
        data.name,
        Species.parse(data.player_type.species),
        Style.parse(data.player_type.style),
        isSelf,
        weapons,
        specialWeapon,
        specialCounts,
        bossSalmoniodKills,
        parseInt(data.golden_ikura_num),
        parseInt(data.ikura_num),
        parseInt(data.help_count),
        parseInt(data.dead_count)
      );
    } catch (e) {
      console.error(e);
      return new JobPlayer('can_not_parse_player');
    }
  };

  static deserialize = data => {
    try {
      let weapons = [];
      data.weapons.forEach(element => {
        weapons.push(Weapon.deserializeSalmonRunMain(element));
      });
      weapons.forEach(element => {
        if (element.error !== null) {
          // Handle previous error
          return new JobPlayer(element.error);
        }
      });
      const specialWeapon = Weapon.deserializeSalmonRunSpecial(data.specialWeapon);
      if (specialWeapon.error !== null) {
        // Handle previous error
        return new JobPlayer(specialWeapon.error);
      }
      let specialCounts = [];
      data.specialCounts.forEach(element => {
        specialCounts.push(parseInt(element));
      });
      let bossSalmoniodKills = [];
      data.bossSalmoniodKills.forEach(element => {
        let bossSalmoniodKill = {};
        try {
          bossSalmoniodKill.salmoniod = Salmoniod.parse(parseInt(element.salmoniod.value));
          bossSalmoniodKill.kill = parseInt(element.kill);
          bossSalmoniodKills.push(bossSalmoniodKill);
        } catch (e) {
          console.error(e);
          return new JobPlayer('can_not_deserialize_player');
        }
      });
      return new JobPlayer(
        null,
        data.id,
        data.nickname,
        Species.deserialize(data.species),
        Style.deserialize(data.style),
        data.isSelf,
        weapons,
        specialWeapon,
        specialCounts,
        bossSalmoniodKills,
        parseInt(data.goldenEgg),
        parseInt(data.powerEgg),
        parseInt(data.help),
        parseInt(data.death)
      );
    } catch (e) {
      console.error(e);
      return new JobPlayer('can_not_deserialize_player');
    }
  };
}

export {
  Species,
  Style,
  PlayerType,
  Player,
  Rank,
  BattlePlayer,
  RegularBattlePlayer,
  RankedBattlePlayer,
  Grade,
  JobPlayer
};
