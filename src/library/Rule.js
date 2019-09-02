class Rule {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

Rule.turfWar = new Rule('turf_war', 1);
Rule.splatZones = new Rule('spalt_zones', 2);
Rule.towerControl = new Rule('tower_control', 3);
Rule.rainmaker = new Rule('rainmaker', 4);
Rule.clamBlitz = new Rule('clamBlitz', 5);

Object.freeze(Rule);

export default Rule;
