import { ArgumentOutOfRangeError } from 'rxjs';

class Rule {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse(data) {
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
        throw new ArgumentOutOfRangeError();
    }
  }
}

Rule.turfWar = new Rule('turf_war', 0);
Rule.splatZones = new Rule('spalt_zones', 1);
Rule.towerControl = new Rule('tower_control', 2);
Rule.rainmaker = new Rule('rainmaker', 3);
Rule.clamBlitz = new Rule('clam_blitz', 4);

Object.freeze(Rule);

export default Rule;
