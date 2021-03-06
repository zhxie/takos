import Base from './Base';
import { Mode } from './Mode';
import Rule from './Rule';
import { ScheduledStage } from './Stage';

class Schedule extends Base {
  constructor(e, mode, rule, startTime, endTime, stage1, stage2) {
    super(e, null);
    this.mode = mode;
    this.rule = rule;
    this.startTime = startTime;
    this.endTime = endTime;
    this.stage1 = stage1;
    this.stage2 = stage2;
  }

  static parse = (data) => {
    try {
      const mode = Mode.parse(data.game_mode.key);
      const rule = Rule.parse(data.rule);
      const startTime = parseInt(data.start_time);
      const endTime = parseInt(data.end_time);
      const stage1 = ScheduledStage.parse(data.stage_a);
      if (stage1.error != null) {
        // Handle previous error
        return new Schedule(stage1.error);
      }
      const stage2 = ScheduledStage.parse(data.stage_b);
      if (stage2.error != null) {
        // Handle previous error
        return new Schedule(stage2.error);
      }
      return new Schedule(null, mode, rule, startTime, endTime, stage1, stage2);
    } catch (e) {
      console.error(e);
      return new Schedule('can_not_parse_schedule');
    }
  };
}

export default Schedule;
