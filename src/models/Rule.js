class Rule {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse = (data) => {
    switch (data.key) {
      case 'turf_war':
        return Rule.turfWar;
      case 'splat_zones':
        return Rule.splatZones;
      case 'tower_control':
        return Rule.towerControl;
      case 'rainmaker':
        return Rule.rainmaker;
      case 'clam_blitz':
        return Rule.clamBlitz;
      default:
        throw new RangeError();
    }
  };

  static deserialize = (data) => {
    switch (data.value) {
      case 0:
        return Rule.turfWar;
      case 1:
        return Rule.splatZones;
      case 2:
        return Rule.towerControl;
      case 3:
        return Rule.rainmaker;
      case 4:
        return Rule.clamBlitz;
      default:
        throw new RangeError();
    }
  };
}

Rule.turfWar = new Rule('rule.turf_war', 0);
Rule.splatZones = new Rule('rule.splat_zones', 1);
Rule.towerControl = new Rule('rule.tower_control', 2);
Rule.rainmaker = new Rule('rule.rainmaker', 3);
Rule.clamBlitz = new Rule('rule.clam_blitz', 4);

Object.freeze(Rule);

export default Rule;
