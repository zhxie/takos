class Mode {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse(data) {
    switch (data.key) {
      case 'regular':
        return Mode.regularBattle;
      case 'gachi':
        return Mode.rankedBattle;
      case 'league':
        return Mode.leagueBattle;
      default:
        throw new RangeError();
    }
  }
}

Mode.regularBattle = new Mode('regular_battle', 0);
Mode.rankedBattle = new Mode('ranked_battle', 1);
Mode.leagueBattle = new Mode('league_battle', 2);
Mode.privateBattle = new Mode('private_battle', 3);
Mode.splatfest = new Mode('splatfest', 4);

Object.freeze(Mode);

export default Mode;
