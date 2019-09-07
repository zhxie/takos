import Base from './Base';
import Stage from './Stage';

class ScheduledStage extends Base {
  constructor(e, stage, url) {
    super(e);
    this.stage = stage;
    this.url = url;
  }

  static parse(data) {
    try {
      const stage = Stage.parse(parseInt(data.id));
      return new ScheduledStage(null, stage, data.image);
    } catch (e) {
      console.error(e);
      return new ScheduledStage('can_not_parse_scheduled_stage');
    }
  }
}

export default ScheduledStage;
