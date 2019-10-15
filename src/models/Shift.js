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

  static parse = data => {
    try {
      const startTime = parseInt(data.start_time);
      const endTime = parseInt(data.end_time);
      const stage = ScheduledStage.parseShift(data.stage);
      if (stage.error !== null) {
        // Handle previous error
        return new Shift(stage.error);
      }
      const weapon1 = Weapon.parseShift(data.weapons[0]);
      if (weapon1.error !== null) {
        // Handle previous error
        return new Shift(weapon1.error);
      }
      const weapon2 = Weapon.parseShift(data.weapons[1]);
      if (weapon2.error !== null) {
        // Handle previous error
        return new Shift(weapon2.error);
      }
      const weapon3 = Weapon.parseShift(data.weapons[2]);
      if (weapon3.error !== null) {
        // Handle previous error
        return new Shift(weapon3.error);
      }
      const weapon4 = Weapon.parseShift(data.weapons[3]);
      if (weapon4.error !== null) {
        // Handle previous error
        return new Shift(weapon4.error);
      }
      return new Shift(null, startTime, endTime, stage, weapon1, weapon2, weapon3, weapon4);
    } catch (e) {
      console.error(e);
      return new Shift('can_not_parse_shift');
    }
  };
}

export default Shift;
