class Mode {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  getName() {
    return this.name;
  }

  getValue() {
    return this.value;
  }
}

Mode.regular = new Mode('regular', 1);
Mode.ranked = new Mode('ranked', 2);
Mode.league = new Mode('league', 3);
Mode.private = new Mode('private', 4);
Mode.splatfest = new Mode('splatfest', 5);

Object.freeze(Mode);

export { Mode };
