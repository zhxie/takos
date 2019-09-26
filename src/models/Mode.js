class Mode {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse(key) {
    switch (key) {
      case 'regular':
        return Mode.regularBattle;
      case 'gachi':
        return Mode.rankedBattle;
      case 'league':
      case 'league_pair':
      case 'league_team':
        return Mode.leagueBattle;
      case 'fes':
      case 'fes_solo':
      case 'fes_team':
        return Mode.splatfest;
      case 'private':
        return Mode.privateBattle;
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

class SplatfestMode {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse(key) {
    if (key.includes('challenge')) {
      return SplatfestMode.challenge;
    } else if (key.includes('regular')) {
      return SplatfestMode.regular;
    } else {
      throw new RangeError();
    }
  }
}

SplatfestMode.challenge = new SplatfestMode('mode.splatfest.challenge', 0);
SplatfestMode.regular = new SplatfestMode('mode.splatfest.regular', 1);

Object.freeze(SplatfestMode);

export { Mode, SplatfestMode };
