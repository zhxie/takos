class Salmoniod {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse = id => {
    switch (id) {
      case 3:
        return Salmoniod.goldie;
      case 6:
        return Salmoniod.steelhead;
      case 9:
        return Salmoniod.flyfish;
      case 12:
        return Salmoniod.scrapper;
      case 13:
        return Salmoniod.steelEel;
      case 14:
        return Salmoniod.stinger;
      case 15:
        return Salmoniod.maws;
      case 16:
        return Salmoniod.griller;
      case 21:
        return Salmoniod.drizzler;
      default:
        throw new RangeError();
    }
  };
}

Salmoniod.goldie = new Salmoniod('salmoniod.goldie', 3);
Salmoniod.steelhead = new Salmoniod('salmoniod.steelhead', 6);
Salmoniod.flyfish = new Salmoniod('salmoniod.flyfish', 9);
Salmoniod.scrapper = new Salmoniod('salmoniod.scrapper', 12);
Salmoniod.steelEel = new Salmoniod('salmoniod.steel_eel', 13);
Salmoniod.stinger = new Salmoniod('salmoniod.stinger', 14);
Salmoniod.maws = new Salmoniod('salmoniod.maws', 15);
Salmoniod.griller = new Salmoniod('salmoniod.griller', 16);
Salmoniod.drizzler = new Salmoniod('salmoniod.drizzler', 21);

Object.freeze(Salmoniod);

export default Salmoniod;
