import Base from './Base';
import { ScheduledStage } from './Stage';
import { Weapon } from './Weapon';

class Shift extends Base {
  constructor(e, startTime, endTime, stage, weapon1, weapon2, weapon3, weapon4) {
    super(e, null);
    this.startTime = startTime;
    this.endTime = endTime;
    this.stage = stage;
    this.weapon1 = weapon1;
    this.weapon2 = weapon2;
    this.weapon3 = weapon3;
    this.weapon4 = weapon4;
  }

  get hasDetail() {
    return this.stage !== null;
  }

  static parse = (data) => {
    try {
      let stage = null;
      let weapon1 = null;
      let weapon2 = null;
      let weapon3 = null;
      let weapon4 = null;
      if (data.stage !== undefined) {
        stage = ScheduledStage.parseShift(data.stage);
        if (stage.error !== null) {
          // Handle previous error
          return new Shift(stage.error);
        }
        weapon1 = Weapon.parseSalmonRunMain(data.weapons[0]);
        if (weapon1.error !== null) {
          // Handle previous error
          return new Shift(weapon1.error);
        }
        weapon2 = Weapon.parseSalmonRunMain(data.weapons[1]);
        if (weapon2.error !== null) {
          // Handle previous error
          return new Shift(weapon2.error);
        }
        weapon3 = Weapon.parseSalmonRunMain(data.weapons[2]);
        if (weapon3.error !== null) {
          // Handle previous error
          return new Shift(weapon3.error);
        }
        weapon4 = Weapon.parseSalmonRunMain(data.weapons[3]);
        if (weapon4.error !== null) {
          // Handle previous error
          return new Shift(weapon4.error);
        }
      }
      return new Shift(
        null,
        parseInt(data.start_time),
        parseInt(data.end_time),
        stage,
        weapon1,
        weapon2,
        weapon3,
        weapon4
      );
    } catch (e) {
      console.error(e);
      return new Shift('can_not_parse_shift');
    }
  };

  static deserialize = (data) => {
    try {
      let stage = null;
      let weapon1 = null;
      let weapon2 = null;
      let weapon3 = null;
      let weapon4 = null;
      if (data.stage !== null) {
        stage = ScheduledStage.deserialize(data.stage);
        if (stage.error !== null) {
          // Handle previous error
          return new Shift(stage.error);
        }
        weapon1 = Weapon.deserializeSalmonRunMain(data.weapon1);
        if (weapon1.error !== null) {
          // Handle previous error
          return new Shift(weapon1.error);
        }
        weapon2 = Weapon.deserializeSalmonRunMain(data.weapon2);
        if (weapon2.error !== null) {
          // Handle previous error
          return new Shift(weapon2.error);
        }
        weapon3 = Weapon.deserializeSalmonRunMain(data.weapon3);
        if (weapon3.error !== null) {
          // Handle previous error
          return new Shift(weapon3.error);
        }
        weapon4 = Weapon.deserializeSalmonRunMain(data.weapon4);
        if (weapon4.error !== null) {
          // Handle previous error
          return new Shift(weapon4.error);
        }
      }
      return new Shift(
        null,
        parseInt(data.startTime),
        parseInt(data.endTime),
        stage,
        weapon1,
        weapon2,
        weapon3,
        weapon4
      );
    } catch (e) {
      console.error(e);
      return new Shift('can_not_deserialize_shift');
    }
  };
}

export default Shift;
