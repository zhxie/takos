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

Mode.regularBattle = new Mode('mode.regular_battle', 0);
Mode.rankedBattle = new Mode('mode.ranked_battle', 1);
Mode.leagueBattle = new Mode('mode.league_battle', 2);
Mode.privateBattle = new Mode('mode.private_battle', 3);
Mode.splatfest = new Mode('mode.splatfest', 4);

Object.freeze(Mode);

export default Mode;
