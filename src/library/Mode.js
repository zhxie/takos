class Mode {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

Mode.regularBattle = new Mode('regular_battle', 1);
Mode.rankedBattle = new Mode('ranked_battle', 2);
Mode.leagueBattle = new Mode('league_battle', 3);
Mode.privateBattle = new Mode('private_battle', 4);
Mode.splatfest = new Mode('splatfest', 5);

Object.freeze(Mode);

export default Mode;
