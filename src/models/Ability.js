import Base from './Base';

class AbilityType {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

AbilityType.primary = new AbilityType('ability.primary', 0);
AbilityType.secondary = new AbilityType('ability.secondary', 1);

Object.freeze(AbilityType);

class BaseAbility {
  constructor(name, type, value) {
    this.name = name;
    this.type = type;
    this.value = value;
  }
}

class PrimaryAbility extends BaseAbility {
  constructor(name, value) {
    super(name, AbilityType.primary, value);
  }

  static parse = id => {
    switch (id) {
      case 0:
        return PrimaryAbility.inkSaverMain;
      case 1:
        return PrimaryAbility.inkSaverSub;
      case 2:
        return PrimaryAbility.inkRecoveryUp;
      case 3:
        return PrimaryAbility.runSpeedUp;
      case 4:
        return PrimaryAbility.swimSpeedUp;
      case 5:
        return PrimaryAbility.specialChargeUp;
      case 6:
        return PrimaryAbility.specialSaver;
      case 7:
        return PrimaryAbility.specialPowerUp;
      case 8:
        return PrimaryAbility.quickRespawn;
      case 9:
        return PrimaryAbility.quickSuperJump;
      case 10:
        return PrimaryAbility.subPowerUp;
      case 11:
        return PrimaryAbility.inkResistanceUp;
      case 12:
        return PrimaryAbility.bombDefenseUp;
      case 13:
        return PrimaryAbility.coldBlooded;
      case 100:
        return PrimaryAbility.openingGambit;
      case 101:
        return PrimaryAbility.lastDitchEffort;
      case 102:
        return PrimaryAbility.tenacity;
      case 103:
        return PrimaryAbility.comeback;
      case 104:
        return PrimaryAbility.ninjaSquid;
      case 105:
        return PrimaryAbility.haunt;
      case 106:
        return PrimaryAbility.thermalInk;
      case 107:
        return PrimaryAbility.respawnPunisher;
      case 108:
        return PrimaryAbility.abilityDoubler;
      case 109:
        return PrimaryAbility.stealthJump;
      case 110:
        return PrimaryAbility.objectShredder;
      case 111:
        return PrimaryAbility.dropRoller;
      case 200:
        return PrimaryAbility.bombDefenseUpDx;
      case 201:
        return PrimaryAbility.mainPowerUp;
      default:
        throw new RangeError();
    }
  };
}

PrimaryAbility.inkSaverMain = new PrimaryAbility('ability.ink_saver_main', 0);
PrimaryAbility.inkSaverSub = new PrimaryAbility('ability.ink_saver_sub', 1);
PrimaryAbility.inkRecoveryUp = new PrimaryAbility('ability.ink_recovery_up', 2);
PrimaryAbility.runSpeedUp = new PrimaryAbility('ability.run_speed_up', 3);
PrimaryAbility.swimSpeedUp = new PrimaryAbility('ability.swim_speed_up', 4);
PrimaryAbility.specialChargeUp = new PrimaryAbility('ability.special_charge_up', 5);
PrimaryAbility.specialSaver = new PrimaryAbility('ability.special_saver', 6);
PrimaryAbility.specialPowerUp = new PrimaryAbility('ability.special_power_up', 7);
PrimaryAbility.quickRespawn = new PrimaryAbility('ability.quick_respawn', 8);
PrimaryAbility.quickSuperJump = new PrimaryAbility('ability.quick_super_jump', 9);
PrimaryAbility.subPowerUp = new PrimaryAbility('ability.sub_power_up', 10);
PrimaryAbility.inkResistanceUp = new PrimaryAbility('ability.ink_resistance_up', 11);
PrimaryAbility.bombDefenseUp = new PrimaryAbility('ability.bomb_defense_up', 12);
PrimaryAbility.coldBlooded = new PrimaryAbility('ability.cold_blooded', 13);
PrimaryAbility.openingGambit = new PrimaryAbility('ability.opening_gambit', 100);
PrimaryAbility.lastDitchEffort = new PrimaryAbility('ability.last_ditch_effort', 101);
PrimaryAbility.tenacity = new PrimaryAbility('ability.tenacity', 102);
PrimaryAbility.comeback = new PrimaryAbility('ability.comeback', 103);
PrimaryAbility.ninjaSquid = new PrimaryAbility('ability.ninja_squid', 104);
PrimaryAbility.haunt = new PrimaryAbility('ability.haunt', 105);
PrimaryAbility.thermalInk = new PrimaryAbility('ability.thermal_ink', 106);
PrimaryAbility.respawnPunisher = new PrimaryAbility('ability.respawn_punisher', 107);
PrimaryAbility.abilityDoubler = new PrimaryAbility('ability.ability_doubler', 108);
PrimaryAbility.stealthJump = new PrimaryAbility('ability.stealth_jump', 109);
PrimaryAbility.objectShredder = new PrimaryAbility('ability.object_shredder', 110);
PrimaryAbility.dropRoller = new PrimaryAbility('ability.drop_roller', 111);
PrimaryAbility.bombDefenseUpDx = new PrimaryAbility('ability.bomb_defense_up_dx', 200);
PrimaryAbility.mainPowerUp = new PrimaryAbility('ability.main_power_up', 201);

Object.freeze(PrimaryAbility);

class SecondaryAbility extends BaseAbility {
  constructor(name, value) {
    super(name, AbilityType.secondary, value);
  }

  static parse = id => {
    switch (id) {
      case 0:
        return SecondaryAbility.inkSaverMain;
      case 1:
        return SecondaryAbility.inkSaverSub;
      case 2:
        return SecondaryAbility.inkRecoveryUp;
      case 3:
        return SecondaryAbility.runSpeedUp;
      case 4:
        return SecondaryAbility.swimSpeedUp;
      case 5:
        return SecondaryAbility.specialChargeUp;
      case 6:
        return SecondaryAbility.specialSaver;
      case 7:
        return SecondaryAbility.specialPowerUp;
      case 8:
        return SecondaryAbility.quickRespawn;
      case 9:
        return SecondaryAbility.quickSuperJump;
      case 10:
        return SecondaryAbility.subPowerUp;
      case 11:
        return SecondaryAbility.inkResistanceUp;
      case 12:
        return SecondaryAbility.bombDefenseUp;
      case 13:
        return SecondaryAbility.coldBlooded;
      case 200:
        return SecondaryAbility.bombDefenseUpDx;
      case 201:
        return SecondaryAbility.mainPowerUp;
      case 255:
        return SecondaryAbility.empty;
      default:
        throw new RangeError();
    }
  };
}

SecondaryAbility.inkSaverMain = new SecondaryAbility('ability.ink_saver_main', 0);
SecondaryAbility.inkSaverSub = new SecondaryAbility('ability.ink_saver_sub', 1);
SecondaryAbility.inkRecoveryUp = new SecondaryAbility('ability.ink_recovery_up', 2);
SecondaryAbility.runSpeedUp = new SecondaryAbility('ability.run_speed_up', 3);
SecondaryAbility.swimSpeedUp = new SecondaryAbility('ability.swim_speed_up', 4);
SecondaryAbility.specialChargeUp = new SecondaryAbility('ability.special_charge_up', 5);
SecondaryAbility.specialSaver = new SecondaryAbility('ability.special_saver', 6);
SecondaryAbility.specialPowerUp = new SecondaryAbility('ability.special_power_up', 7);
SecondaryAbility.quickRespawn = new SecondaryAbility('ability.quick_respawn', 8);
SecondaryAbility.quickSuperJump = new SecondaryAbility('ability.quick_super_jump', 9);
SecondaryAbility.subPowerUp = new SecondaryAbility('ability.sub_power_up', 10);
SecondaryAbility.inkResistanceUp = new SecondaryAbility('ability.ink_resistance_up', 11);
SecondaryAbility.bombDefenseUp = new SecondaryAbility('ability.bomb_defense_up', 12);
SecondaryAbility.coldBlooded = new SecondaryAbility('ability.cold_blooded', 13);
SecondaryAbility.bombDefenseUpDx = new SecondaryAbility('ability.bomb_defense_up_dx', 200);
SecondaryAbility.mainPowerUp = new SecondaryAbility('ability.main_power_up', 201);
SecondaryAbility.empty = new SecondaryAbility('ability.empty', 255);

Object.freeze(SecondaryAbility);

class Ability extends Base {
  constructor(e, ability, url) {
    super(e);
    this.ability = ability;
    this.url = url;
  }

  static parsePrimary = data => {
    try {
      const ability = PrimaryAbility.parse(parseInt(data.id));
      return new Ability(null, ability, data.image);
    } catch (e) {
      console.error(e);
      return new Ability('can_not_parse_primary_ability');
    }
  };

  static parseSecondary = data => {
    try {
      const ability = SecondaryAbility.parse(parseInt(data.id));
      return new Ability(null, ability, data.image);
    } catch (e) {
      console.error(e);
      return new Ability('can_not_parse_secondary_ability');
    }
  };
}

export { AbilityType, BaseAbility, PrimaryAbility, SecondaryAbility, Ability };
