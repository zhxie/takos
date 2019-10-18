import Base from './Base';
import { Grade, JobPlayer } from './Player';
import Salmoniod from './Salmoniod';
import Shift from './Shift';

class WaterLevel {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse = data => {
    switch (data.key) {
      case 'normal':
        return WaterLevel.normal;
      case 'low':
        return WaterLevel.low;
      case 'high':
        return WaterLevel.high;
      default:
        throw new RangeError();
    }
  };

  static deserialize = data => {
    switch (data.value) {
      case 0:
        return WaterLevel.normal;
      case 1:
        return WaterLevel.low;
      case 2:
        return WaterLevel.high;
      default:
        throw new RangeError();
    }
  };
}

WaterLevel.normal = new WaterLevel('water_level.normal', 0);
WaterLevel.low = new WaterLevel('water_level.low', 1);
WaterLevel.high = new WaterLevel('water_level.high', 2);

Object.freeze(WaterLevel);

class EventType {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse = data => {
    switch (data.key) {
      case 'water-levels':
        return EventType.waterLevels;
      case 'rush':
        return EventType.rush;
      case 'fog':
        return EventType.fog;
      case 'goldie-seeking':
        return EventType.goldieSeeking;
      case 'griller':
        return EventType.griller;
      case 'cohock-charge':
        return EventType.cohockCharge;
      case 'the-mothership':
        return EventType.theMothership;
      default:
        throw new RangeError();
    }
  };

  static deserialize = data => {
    switch (data.value) {
      case 0:
        return EventType.waterLevels;
      case 1:
        return EventType.rush;
      case 2:
        return EventType.fog;
      case 3:
        return EventType.goldieSeeking;
      case 4:
        return EventType.griller;
      case 5:
        return EventType.cohockCharge;
      case 6:
        return EventType.theMothership;
      default:
        throw new RangeError();
    }
  };
}

EventType.waterLevels = new EventType('event_type.water_levels', 0);
EventType.rush = new EventType('event_type.rush', 1);
EventType.fog = new EventType('event_type.fog', 2);
EventType.goldieSeeking = new EventType('event_type.goldie_seeking', 3);
EventType.griller = new EventType('event_type.griller', 4);
EventType.cohockCharge = new EventType('event_type.cohock_charge', 5);
EventType.theMothership = new EventType('event_type.the_mothership', 6);

Object.freeze(EventType);

class Wave extends Base {
  constructor(e, waterLevel, eventType, quota, goldenEgg, goldenEggPop, powerEgg) {
    super(e, null);
    this.waterLevel = waterLevel;
    this.eventType = eventType;
    this.quota = quota;
    this.goldenEgg = goldenEgg;
    this.goldenEggPop = goldenEggPop;
    this.powerEgg = powerEgg;
  }

  static parse = data => {
    try {
      return new Wave(
        null,
        WaterLevel.parse(data.water_level),
        EventType.parse(data.event_type),
        parseInt(data.quota_num),
        parseInt(data.golden_ikura_num),
        parseInt(data.golden_ikura_pop_num),
        parseInt(data.ikura_num)
      );
    } catch (e) {
      console.error(e);
      return new Wave('can_not_parse_wave');
    }
  };

  static deserialize = data => {
    try {
      return new Wave(
        null,
        WaterLevel.deserialize(data.waterLevel),
        EventType.deserialize(data.eventType),
        parseInt(data.quota),
        parseInt(data.goldenEgg),
        parseInt(data.goldenEggPop),
        parseInt(data.powerEgg)
      );
    } catch (e) {
      return new Wave('can_not_deserialize_wave');
    }
  };
}

class JobResult {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse = data => {
    switch (data.failure_reason) {
      case null:
        return JobResult.clear;
      case 'time_limit':
        return JobPlayer.timeLimit;
      case 'wipe_out':
        return JobPlayer.wipeOut;
      default:
        throw new RangeError();
    }
  };

  static deserialize = data => {
    switch (data.value) {
      case 0:
        return JobResult.clear;
      case 1:
        return JobPlayer.timeLimit;
      case 2:
        return JobPlayer.wipeOut;
      default:
        throw new RangeError();
    }
  };
}

JobResult.clear = new JobResult('job.result.clear', 0);
JobResult.timeLimit = new JobResult('job.result.time_limit', 1);
JobResult.wipeOut = new JobResult('job.result.wipe_out', 2);

Object.freeze(JobResult);

class Job extends Base {
  constructor(
    e,
    raw,
    number,
    startTime,
    shift,
    hazardLevel,
    waves,
    players,
    bossSalmoniodAppearances,
    grade,
    gradePoint,
    gradePointDelta,
    score,
    result
  ) {
    super(e, raw);
    this.number = number;
    this.startTime = startTime;
    this.shift = shift;
    this.hazardLevel = hazardLevel;
    this.waves = waves;
    this.players = players;
    this.bossSalmoniodAppearances = bossSalmoniodAppearances;
    this.grade = grade;
    this.gradePoint = gradePoint;
    this.gradePointDelta = gradePointDelta;
    this.score = score;
    this.result = result;
  }

  get isClear() {
    return this.result === JobResult.clear;
  }
  get failureWave() {
    if (this.isClear) {
      return 0;
    } else {
      return this.waves.count;
    }
  }

  get quota() {
    let quota = 0;
    this.waves.forEach(element => {
      quota = quota + element.quota;
    });
    return quota;
  }
  get goldenEgg() {
    let goldenEgg = 0;
    this.waves.forEach(element => {
      goldenEgg = goldenEgg + element.goldenEgg;
    });
    return goldenEgg;
  }
  get goldenEggPop() {
    let goldenEggPop = 0;
    this.waves.forEach(element => {
      goldenEggPop = goldenEggPop + element.goldenEggPop;
    });
    return goldenEggPop;
  }

  get rate() {
    if (this.grade === Grade.intern) {
      return 90;
    } else {
      return 65 + 25 * this.grade.value + 5 * parseInt(this.gradePoint / 20);
    }
  }

  get grizzcoPoint() {
    return parseInt((this.rate / 100) * this.score);
  }

  get appearances() {
    let appearances = 0;
    this.bossSalmoniodAppearances.forEach(element => {
      appearances = appearances + element.appearance;
    });
    return appearances;
  }

  get kill() {
    let kill = 0;
    this.players.forEach(element => {
      kill = kill + element.kill;
    });
    return kill;
  }

  getBossSalmoniodKill = salmoniod => {
    let kill = 0;
    this.players.forEach(element => {
      const bossSalmoniodKill = element.bossSalmoniodKills.find(ele => {
        return ele.salmoniod === salmoniod;
      });
      if (bossSalmoniodKill !== undefined) {
        kill = kill + bossSalmoniodKill.kill;
      }
    });
    return kill;
  };

  static parse = data => {
    try {
      const shift = Shift.parse(data.schedule);
      if (shift.error !== null) {
        // Handle previous error
        return new Job(shift.error);
      }
      let hazardLevel;
      if (data.danger_rate % 1 === 0) {
        hazardLevel = parseInt(data.danger_rate);
      } else {
        hazardLevel = parseFloat(data.danger_rate).toFixed(1);
      }
      let waves = [];
      data.wave_details.forEach(element => {
        const wave = Wave.parse(element);
        if (wave.error !== null) {
          // Handle previous error
          return new Job(wave.error);
        } else {
          waves.push(wave);
        }
      });
      let players = [];
      players.push(JobPlayer.parse(data.my_result));
      data.other_results.forEach(element => {
        players.push(JobPlayer.parse(element));
      });
      players.forEach(element => {
        if (element.error !== null) {
          // Handle previous error
          return new Job(element.error);
        }
      });
      let bossSalmoniodAppearances = [];
      data.boss_counts.keys.forEach(element => {
        let bossSalmoniodAppearance = {};
        try {
          bossSalmoniodAppearance.salmoniod = Salmoniod.parse(parseInt(element));
          bossSalmoniodAppearance.appearance = parseInt(data.boss_counts[element].count);
          bossSalmoniodAppearances.push(bossSalmoniodAppearance);
        } catch (e) {
          console.error(e);
          return new Job('can_not_parse_job');
        }
      });
      return new Job(
        null,
        JSON.stringify(data),
        parseInt(data.job_id),
        parseInt(data.play_time),
        shift,
        hazardLevel,
        waves,
        players,
        bossSalmoniodAppearances,
        Grade.parse(parseInt(data.grade.id)),
        parseInt(data.grade_point),
        parseInt(data.grade_point_delta),
        parseInt(data.job_score),
        JobResult.parse(data.job_result)
      );
    } catch (e) {
      console.error(e);
      return new Job('can_not_parse_job');
    }
  };

  static deserialize = data => {
    try {
      const shift = Shift.deserialize(data.schedule);
      if (shift.error !== null) {
        // Handle previous error
        return new Job(shift.error);
      }
      let hazardLevel;
      if (data.hazardLevel % 1 === 0) {
        hazardLevel = parseInt(data.hazardLevel);
      } else {
        hazardLevel = parseFloat(data.hazardLevel).toFixed(1);
      }
      let waves = [];
      data.waves.forEach(element => {
        const wave = Wave.deserialize(element);
        if (wave.error !== null) {
          // Handle previous error
          return new Job(wave.error);
        } else {
          waves.push(wave);
        }
      });
      let players = [];
      data.players.forEach(element => {
        players.push(JobPlayer.deserialize(element));
      });
      players.forEach(element => {
        if (element.error !== null) {
          // Handle previous error
          return new Job(element.error);
        }
      });
      let bossSalmoniodAppearances = [];
      data.bossSalmoniodAppearances.forEach(element => {
        let bossSalmoniodAppearance = {};
        try {
          bossSalmoniodAppearance.salmoniod = Salmoniod.parse(parseInt(element.salmoniod.value));
          bossSalmoniodAppearance.appearance = parseInt(element.appearance);
          bossSalmoniodAppearances.push(bossSalmoniodAppearance);
        } catch (e) {
          console.error(e);
          return new Job('can_not_deserialize_job');
        }
      });
      return new Job(
        null,
        data.raw,
        parseInt(data.number),
        parseInt(data.startTime),
        shift,
        hazardLevel,
        waves,
        players,
        bossSalmoniodAppearances,
        Grade.parse(parseInt(data.grade.value)),
        parseInt(data.gradePoint),
        parseInt(data.gradePointDelta),
        parseInt(data.score),
        JobResult.deserialize(data.result)
      );
    } catch (e) {
      console.error(e);
      return new JobPlayer('can_not_deserialize_job');
    }
  };
}

export default { WaterLevel, EventType, Wave, JobResult, Job };
