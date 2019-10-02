import Base from './Base';

class MainWeaponType {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

MainWeaponType.shooter = new MainWeaponType('weapon.main.shooter', 0);
MainWeaponType.blaster = new MainWeaponType('weapon.main.blaster', 1);
MainWeaponType.reelgun = new MainWeaponType('weapon.main.reelgun', 2);
MainWeaponType.roller = new MainWeaponType('weapon.main.roller', 3);
MainWeaponType.brush = new MainWeaponType('weapon.main.brush', 4);
MainWeaponType.charger = new MainWeaponType('weapon.main.charger', 5);
MainWeaponType.slosher = new MainWeaponType('weapon.main.slosher', 6);
MainWeaponType.splatling = new MainWeaponType('weapon.main.splatling', 7);
MainWeaponType.maneuver = new MainWeaponType('weapon.main.maneuver', 8);
MainWeaponType.brella = new MainWeaponType('weapon.main.brella', 9);

Object.freeze(MainWeaponType);

class MainWeapon {
  constructor(name, type, value) {
    this.name = name;
    this.type = type;
    this.value = value;
  }

  static parse = id => {
    switch (id) {
      case 0:
        return MainWeapon.bold;
      case 1:
        return MainWeapon.boldNeo;
      case 2:
        return MainWeapon.bold7;
      case 10:
        return MainWeapon.wakaba;
      case 11:
        return MainWeapon.momiji;
      case 12:
        return MainWeapon.ochiba;
      case 20:
        return MainWeapon.sharp;
      case 21:
        return MainWeapon.sharpNeo;
      case 30:
        return MainWeapon.promodelerMg;
      case 31:
        return MainWeapon.promodelerRg;
      case 32:
        return MainWeapon.promodelerPg;
      case 40:
        return MainWeapon.sshooter;
      case 41:
        return MainWeapon.sshooterCollabo;
      case 42:
        return MainWeapon.sshooterBecchu;
      case 45:
        return MainWeapon.heroshooterReplica;
      case 46:
        return MainWeapon.octoshooterReplica;
      case 50:
        return MainWeapon._52Gal;
      case 51:
        return MainWeapon._52GalDeco;
      case 52:
        return MainWeapon._52GalBecchu;
      case 60:
        return MainWeapon.nzap85;
      case 61:
        return MainWeapon.nzap89;
      case 62:
        return MainWeapon.nzap83;
      case 70:
        return MainWeapon.prime;
      case 71:
        return MainWeapon.primeCollabo;
      case 72:
        return MainWeapon.primeBecchu;
      case 80:
        return MainWeapon._96Gal;
      case 81:
        return MainWeapon._96GalDeco;
      case 90:
        return MainWeapon.jetsweeper;
      case 91:
        return MainWeapon.jetsweeperCustom;
      case 400:
        return MainWeapon.bottlegeyser;
      case 401:
        return MainWeapon.bottlegeyserFoil;
      case 200:
        return MainWeapon.nova;
      case 201:
        return MainWeapon.novaNeo;
      case 202:
        return MainWeapon.novaBecchu;
      case 210:
        return MainWeapon.hotblaster;
      case 211:
        return MainWeapon.hotblasterCustom;
      case 215:
        return MainWeapon.heroblasterReplica;
      case 220:
        return MainWeapon.longblaster;
      case 221:
        return MainWeapon.longblasterCustom;
      case 222:
        return MainWeapon.longblasterNecro;
      case 230:
        return MainWeapon.clashblaster;
      case 231:
        return MainWeapon.clashblasterNeo;
      case 240:
        return MainWeapon.rapid;
      case 241:
        return MainWeapon.rapidDeco;
      case 242:
        return MainWeapon.rapidBecchu;
      case 250:
        return MainWeapon.rapidElite;
      case 251:
        return MainWeapon.rapidEliteDeco;
      case 300:
        return MainWeapon.l3Reelgun;
      case 301:
        return MainWeapon.l3ReelgunD;
      case 302:
        return MainWeapon.l3ReelgunBecchu;
      case 310:
        return MainWeapon.h3Reelgun;
      case 311:
        return MainWeapon.h3ReelgunD;
      case 312:
        return MainWeapon.h3ReelgunCherry;
      case 1000:
        return MainWeapon.carbon;
      case 1001:
        return MainWeapon.carbonDeco;
      case 1010:
        return MainWeapon.splatroller;
      case 1011:
        return MainWeapon.splatrollerCollabo;
      case 1012:
        return MainWeapon.splatrollerBecchu;
      case 1015:
        return MainWeapon.herorollerReplica;
      case 1020:
        return MainWeapon.dynamo;
      case 1021:
        return MainWeapon.dynamoTesla;
      case 1022:
        return MainWeapon.dynamoBecchu;
      case 1030:
        return MainWeapon.variableroller;
      case 1031:
        return MainWeapon.variablerollerFoil;
      case 1100:
        return MainWeapon.pablo;
      case 1101:
        return MainWeapon.pabloHue;
      case 1102:
        return MainWeapon.pabloPermanent;
      case 1110:
        return MainWeapon.hokusai;
      case 1111:
        return MainWeapon.hokusaiHue;
      case 1112:
        return MainWeapon.hokusaiBecchu;
      case 1115:
        return MainWeapon.herobrushReplica;
      case 2000:
        return MainWeapon.squicleanA;
      case 2001:
        return MainWeapon.squicleanB;
      case 2002:
        return MainWeapon.squicleanG;
      case 2010:
        return MainWeapon.splatcharger;
      case 2011:
        return MainWeapon.splatchargerCollabo;
      case 2012:
        return MainWeapon.splatchargerBecchu;
      case 2015:
        return MainWeapon.herochargerReplica;
      case 2020:
        return MainWeapon.splatscope;
      case 2021:
        return MainWeapon.splatscopeCollabo;
      case 2022:
        return MainWeapon.splatscopeBecchu;
      case 2030:
        return MainWeapon.liter4K;
      case 2031:
        return MainWeapon.liter4KCustom;
      case 2040:
        return MainWeapon.liter4KScope;
      case 2041:
        return MainWeapon.liter4KScopeCustom;
      case 2050:
        return MainWeapon.bamboo14Mk1;
      case 2051:
        return MainWeapon.bamboo14Mk2;
      case 2052:
        return MainWeapon.bamboo14Mk3;
      case 2060:
        return MainWeapon.soytuber;
      case 2061:
        return MainWeapon.soytuberCustom;
      case 3000:
        return MainWeapon.bucketslosher;
      case 3001:
        return MainWeapon.bucketslosherDeco;
      case 3002:
        return MainWeapon.bucketslosherSoda;
      case 3005:
        return MainWeapon.heroslosherReplica;
      case 3010:
        return MainWeapon.hissen;
      case 3011:
        return MainWeapon.hissenHue;
      case 3020:
        return MainWeapon.screwslosher;
      case 3021:
        return MainWeapon.screwslosherNeo;
      case 3022:
        return MainWeapon.screwslosherBecchu;
      case 3030:
        return MainWeapon.furo;
      case 3031:
        return MainWeapon.furoDeco;
      case 3040:
        return MainWeapon.explosher;
      case 3041:
        return MainWeapon.explosherCustom;
      case 4000:
        return MainWeapon.splatspinner;
      case 4001:
        return MainWeapon.splatspinnerCollabo;
      case 4002:
        return MainWeapon.splatspinnerBecchu;
      case 4010:
        return MainWeapon.barrelspinner;
      case 4011:
        return MainWeapon.barrelspinnerDeco;
      case 4012:
        return MainWeapon.barrelspinnerRemix;
      case 4015:
        return MainWeapon.herospinnerReplica;
      case 4020:
        return MainWeapon.hydra;
      case 4021:
        return MainWeapon.hydraCustom;
      case 4030:
        return MainWeapon.kugelschreiber;
      case 4031:
        return MainWeapon.kugelschreiberHue;
      case 4040:
        return MainWeapon.nautilus47;
      case 4041:
        return MainWeapon.nautilus79;
      case 5000:
        return MainWeapon.sputtery;
      case 5001:
        return MainWeapon.sputteryHue;
      case 5002:
        return MainWeapon.sputteryClear;
      case 5010:
        return MainWeapon.maneuver;
      case 5011:
        return MainWeapon.maneuverCollabo;
      case 5012:
        return MainWeapon.maneuverBecchu;
      case 5015:
        return MainWeapon.heromaneuverReplica;
      case 5020:
        return MainWeapon.kelvin525;
      case 5021:
        return MainWeapon.kelvin525Deco;
      case 5022:
        return MainWeapon.kelvin525Becchu;
      case 5030:
        return MainWeapon.dualsweeper;
      case 5031:
        return MainWeapon.dualsweeperCustom;
      case 5040:
        return MainWeapon.quadhopperBlack;
      case 5041:
        return MainWeapon.quadhopperWhite;
      case 6000:
        return MainWeapon.parashelter;
      case 6001:
        return MainWeapon.parashelterSorella;
      case 6005:
        return MainWeapon.heroshelterReplica;
      case 6010:
        return MainWeapon.campingshelter;
      case 6011:
        return MainWeapon.campingshelterSorella;
      case 6012:
        return MainWeapon.campingshelterCamo;
      case 6020:
        return MainWeapon.spygadget;
      case 6021:
        return MainWeapon.spygadgetSorella;
      case 6022:
        return MainWeapon.spygadgetBecchu;
      default:
        throw new RangeError();
    }
  };
}

MainWeapon.bold = new MainWeapon('weapon.main.shooter.bold', MainWeaponType.shooter, 0);
MainWeapon.boldNeo = new MainWeapon('weapon.main.shooter.bold_neo', MainWeaponType.shooter, 1);
MainWeapon.bold7 = new MainWeapon('weapon.main.shooter.bold_7', MainWeaponType.shooter, 2);
MainWeapon.wakaba = new MainWeapon('weapon.main.shooter.wakaba', MainWeaponType.shooter, 10);
MainWeapon.momiji = new MainWeapon('weapon.main.shooter.momiji', MainWeaponType.shooter, 11);
MainWeapon.ochiba = new MainWeapon('weapon.main.shooter.ochiba', MainWeaponType.shooter, 12);
MainWeapon.sharp = new MainWeapon('weapon.main.shooter.sharp', MainWeaponType.shooter, 20);
MainWeapon.sharpNeo = new MainWeapon('weapon.main.shooter.sharp_neo', MainWeaponType.shooter, 21);
MainWeapon.promodelerMg = new MainWeapon('weapon.main.shooter.promodeler_mg', MainWeaponType.shooter, 30);
MainWeapon.promodelerRg = new MainWeapon('weapon.main.shooter.promodeler_rg', MainWeaponType.shooter, 31);
MainWeapon.promodelerPg = new MainWeapon('weapon.main.shooter.promodeler_pg', MainWeaponType.shooter, 32);
MainWeapon.sshooter = new MainWeapon('weapon.main.shooter.sshooter', MainWeaponType.shooter, 40);
MainWeapon.sshooterCollabo = new MainWeapon('weapon.main.shooter.sshooter_collabo', MainWeaponType.shooter, 41);
MainWeapon.sshooterBecchu = new MainWeapon('weapon.main.shooter.sshooter_becchu', MainWeaponType.shooter, 42);
MainWeapon.heroshooterReplica = new MainWeapon('weapon.main.shooter.heroshooter_replica', MainWeaponType.shooter, 45);
MainWeapon.octoshooterReplica = new MainWeapon('weapon.main.shooter.octoshooter_replica', MainWeaponType.shooter, 46);
MainWeapon._52Gal = new MainWeapon('weapon.main.shooter.52gal', MainWeaponType.shooter, 50);
MainWeapon._52GalDeco = new MainWeapon('weapon.main.shooter.52gal_deco', MainWeaponType.shooter, 51);
MainWeapon._52GalBecchu = new MainWeapon('weapon.main.shooter.52gal_becchu', MainWeaponType.shooter, 52);
MainWeapon.nzap85 = new MainWeapon('weapon.main.shooter.nzap85', MainWeaponType.shooter, 60);
MainWeapon.nzap89 = new MainWeapon('weapon.main.shooter.nzap89', MainWeaponType.shooter, 61);
MainWeapon.nzap83 = new MainWeapon('weapon.main.shooter.nzap83', MainWeaponType.shooter, 62);
MainWeapon.prime = new MainWeapon('weapon.main.shooter.prime', MainWeaponType.shooter, 70);
MainWeapon.primeCollabo = new MainWeapon('weapon.main.shooter.prime_collabo', MainWeaponType.shooter, 71);
MainWeapon.primeBecchu = new MainWeapon('weapon.main.shooter.prime_becchu', MainWeaponType.shooter, 72);
MainWeapon._96Gal = new MainWeapon('weapon.main.shooter.96gal', MainWeaponType.shooter, 80);
MainWeapon._96GalDeco = new MainWeapon('weapon.main.shooter.96gal_deco', MainWeaponType.shooter, 81);
MainWeapon.jetsweeper = new MainWeapon('weapon.main.shooter.jetsweeper', MainWeaponType.shooter, 90);
MainWeapon.jetsweeperCustom = new MainWeapon('weapon.main.shooter.jetsweeper_custom', MainWeaponType.shooter, 91);
MainWeapon.bottlegeyser = new MainWeapon('weapon.main.shooter.bottlegeyser', MainWeaponType.shooter, 400);
MainWeapon.bottlegeyserFoil = new MainWeapon('weapon.main.shooter.bottlegeyser_foil', MainWeaponType.shooter, 401);
MainWeapon.nova = new MainWeapon('weapon.main.blaster.nova', MainWeaponType.blaster, 200);
MainWeapon.novaNeo = new MainWeapon('weapon.main.blaster.nova_neo', MainWeaponType.blaster, 201);
MainWeapon.novaBecchu = new MainWeapon('weapon.main.blaster.nova_becchu', MainWeaponType.blaster, 202);
MainWeapon.hotblaster = new MainWeapon('weapon.main.blaster.hotblaster', MainWeaponType.blaster, 210);
MainWeapon.hotblasterCustom = new MainWeapon('weapon.main.blaster.hotblaster_custom', MainWeaponType.blaster, 211);
MainWeapon.heroblasterReplica = new MainWeapon('weapon.main.blaster.heroblaster_replica', MainWeaponType.blaster, 215);
MainWeapon.longblaster = new MainWeapon('weapon.main.blaster.longblaster', MainWeaponType.blaster, 220);
MainWeapon.longblasterCustom = new MainWeapon('weapon.main.blaster.longblaster_custom', MainWeaponType.blaster, 221);
MainWeapon.longblasterNecro = new MainWeapon('weapon.main.blaster.longblaster_necro', MainWeaponType.blaster, 222);
MainWeapon.clashblaster = new MainWeapon('weapon.main.blaster.clashblaster', MainWeaponType.blaster, 230);
MainWeapon.clashblasterNeo = new MainWeapon('weapon.main.blaster.clashblaster_neo', MainWeaponType.blaster, 231);
MainWeapon.rapid = new MainWeapon('weapon.main.blaster.rapid', MainWeaponType.blaster, 240);
MainWeapon.rapidDeco = new MainWeapon('weapon.main.blaster.rapid_deco', MainWeaponType.blaster, 241);
MainWeapon.rapidBecchu = new MainWeapon('weapon.main.blaster.rapid_becchu', MainWeaponType.blaster, 242);
MainWeapon.rapidElite = new MainWeapon('weapon.main.blaster.rapid_elite', MainWeaponType.blaster, 250);
MainWeapon.rapidEliteDeco = new MainWeapon('weapon.main.blaster.rapid_elite_deco', MainWeaponType.blaster, 251);
MainWeapon.l3Reelgun = new MainWeapon('weapon.main.reelgun.l3reelgun', MainWeaponType.reelgun, 300);
MainWeapon.l3ReelgunD = new MainWeapon('weapon.main.reelgun.l3reelgun_d', MainWeaponType.reelgun, 301);
MainWeapon.l3ReelgunBecchu = new MainWeapon('weapon.main.reelgun.l3reelgun_becchu', MainWeaponType.reelgun, 302);
MainWeapon.h3Reelgun = new MainWeapon('weapon.main.reelgun.h3reelgun', MainWeaponType.reelgun, 310);
MainWeapon.h3ReelgunD = new MainWeapon('weapon.main.reelgun.h3reelgun_d', MainWeaponType.reelgun, 311);
MainWeapon.h3ReelgunCherry = new MainWeapon('weapon.main.reelgun.h3reelgun_cherry', MainWeaponType.reelgun, 312);
MainWeapon.carbon = new MainWeapon('weapon.main.roller.carbon', MainWeaponType.roller, 1000);
MainWeapon.carbonDeco = new MainWeapon('weapon.main.roller.carbon_deco', MainWeaponType.roller, 1001);
MainWeapon.splatroller = new MainWeapon('weapon.main.roller.splatroller', MainWeaponType.roller, 1010);
MainWeapon.splatrollerCollabo = new MainWeapon('weapon.main.roller.splatroller_collabo', MainWeaponType.roller, 1011);
MainWeapon.splatrollerBecchu = new MainWeapon('weapon.main.roller.splatroller_becchu', MainWeaponType.roller, 1012);
MainWeapon.herorollerReplica = new MainWeapon('weapon.main.roller.heroroller_replica', MainWeaponType.roller, 1015);
MainWeapon.dynamo = new MainWeapon('weapon.main.roller.dynamo', MainWeaponType.roller, 1020);
MainWeapon.dynamoTesla = new MainWeapon('weapon.main.roller.dynamo_tesla', MainWeaponType.roller, 1021);
MainWeapon.dynamoBecchu = new MainWeapon('weapon.main.roller.dynamo_becchu', MainWeaponType.roller, 1022);
MainWeapon.variableroller = new MainWeapon('weapon.main.roller.variableroller', MainWeaponType.roller, 1030);
MainWeapon.variablerollerFoil = new MainWeapon('weapon.main.roller.variableroller_foil', MainWeaponType.roller, 1031);
MainWeapon.pablo = new MainWeapon('weapon.main.brush.pablo', MainWeaponType.brush, 1100);
MainWeapon.pabloHue = new MainWeapon('weapon.main.brush.pablo_hue', MainWeaponType.brush, 1101);
MainWeapon.pabloPermanent = new MainWeapon('weapon.main.brush.pablo_permanent', MainWeaponType.brush, 1102);
MainWeapon.hokusai = new MainWeapon('weapon.main.brush.hokusai', MainWeaponType.brush, 1110);
MainWeapon.hokusaiHue = new MainWeapon('weapon.main.brush.hokusai_hue', MainWeaponType.brush, 1111);
MainWeapon.hokusaiBecchu = new MainWeapon('weapon.main.brush.hokusai_becchu', MainWeaponType.brush, 1112);
MainWeapon.herobrushReplica = new MainWeapon('weapon.main.brush.herobrush_replica', MainWeaponType.brush, 1115);
MainWeapon.squicleanA = new MainWeapon('weapon.main.charger.squiclean_a', MainWeaponType.charger, 2000);
MainWeapon.squicleanB = new MainWeapon('weapon.main.charger.squiclean_b', MainWeaponType.charger, 2001);
MainWeapon.squicleanG = new MainWeapon('weapon.main.charger.squiclean_g', MainWeaponType.charger, 2002);
MainWeapon.splatcharger = new MainWeapon('weapon.main.charger.splatcharger', MainWeaponType.charger, 2010);
MainWeapon.splatchargerCollabo = new MainWeapon(
  'weapon.main.charger.splatcharger_collabo',
  MainWeaponType.charger,
  2011
);
MainWeapon.splatchargerBecchu = new MainWeapon('weapon.main.charger.splatcharger_becchu', MainWeaponType.charger, 2012);
MainWeapon.herochargerReplica = new MainWeapon('weapon.main.charger.herocharger_replica', MainWeaponType.charger, 2015);
MainWeapon.splatscope = new MainWeapon('weapon.main.charger.splatscope', MainWeaponType.charger, 2020);
MainWeapon.splatscopeCollabo = new MainWeapon('weapon.main.charger.splatscope_collabo', MainWeaponType.charger, 2021);
MainWeapon.splatscopeBecchu = new MainWeapon('weapon.main.charger.splatscope_becchu', MainWeaponType.charger, 2022);
MainWeapon.liter4K = new MainWeapon('weapon.main.charger.liter4k', MainWeaponType.charger, 2030);
MainWeapon.liter4KCustom = new MainWeapon('weapon.main.charger.liter4k_custom', MainWeaponType.charger, 2031);
MainWeapon.liter4KScope = new MainWeapon('weapon.main.charger.liter4k_scope', MainWeaponType.charger, 2040);
MainWeapon.liter4KScopeCustom = new MainWeapon(
  'weapon.main.charger.liter4k_scope_custom',
  MainWeaponType.charger,
  2041
);
MainWeapon.bamboo14Mk1 = new MainWeapon('weapon.main.charger.bamboo14mk1', MainWeaponType.charger, 2050);
MainWeapon.bamboo14Mk2 = new MainWeapon('weapon.main.charger.bamboo14mk2', MainWeaponType.charger, 2051);
MainWeapon.bamboo14Mk3 = new MainWeapon('weapon.main.charger.bamboo14mk3', MainWeaponType.charger, 2052);
MainWeapon.soytuber = new MainWeapon('weapon.main.charger.soytuber', MainWeaponType.charger, 2060);
MainWeapon.soytuberCustom = new MainWeapon('weapon.main.charger.soytuber_custom', MainWeaponType.charger, 2061);
MainWeapon.bucketslosher = new MainWeapon('weapon.main.slosher.bucketslosher', MainWeaponType.slosher, 3000);
MainWeapon.bucketslosherDeco = new MainWeapon('weapon.main.slosher.bucketslosher_deco', MainWeaponType.slosher, 3001);
MainWeapon.bucketslosherSoda = new MainWeapon('weapon.main.slosher.bucketslosher_soda', MainWeaponType.slosher, 3002);
MainWeapon.heroslosherReplica = new MainWeapon('weapon.main.slosher.heroslosher_replica', MainWeaponType.slosher, 3005);
MainWeapon.hissen = new MainWeapon('weapon.main.slosher.hissen', MainWeaponType.slosher, 3010);
MainWeapon.hissenHue = new MainWeapon('weapon.main.slosher.hissen_hue', MainWeaponType.slosher, 3011);
MainWeapon.screwslosher = new MainWeapon('weapon.main.slosher.screwslosher', MainWeaponType.slosher, 3020);
MainWeapon.screwslosherNeo = new MainWeapon('weapon.main.slosher.screwslosher_neo', MainWeaponType.slosher, 3021);
MainWeapon.screwslosherBecchu = new MainWeapon('weapon.main.slosher.screwslosher_becchu', MainWeaponType.slosher, 3022);
MainWeapon.furo = new MainWeapon('weapon.main.slosher.furo', MainWeaponType.slosher, 3030);
MainWeapon.furoDeco = new MainWeapon('weapon.main.slosher.furo_deco', MainWeaponType.slosher, 3031);
MainWeapon.explosher = new MainWeapon('weapon.main.slosher.explosher', MainWeaponType.slosher, 3040);
MainWeapon.explosherCustom = new MainWeapon('weapon.main.slosher.explosher_custom', MainWeaponType.slosher, 3041);
MainWeapon.splatspinner = new MainWeapon('weapon.main.splatling.splatspinner', MainWeaponType.splatling, 4000);
MainWeapon.splatspinnerCollabo = new MainWeapon(
  'weapon.main.splatling.splatspinner_collabo',
  MainWeaponType.splatling,
  4001
);
MainWeapon.splatspinnerBecchu = new MainWeapon(
  'weapon.main.splatling.splatspinner_becchu',
  MainWeaponType.splatling,
  4002
);
MainWeapon.barrelspinner = new MainWeapon('weapon.main.splatling.barrelspinner', MainWeaponType.splatling, 4010);
MainWeapon.barrelspinnerDeco = new MainWeapon(
  'weapon.main.splatling.barrelspinner_deco',
  MainWeaponType.splatling,
  4011
);
MainWeapon.barrelspinnerRemix = new MainWeapon(
  'weapon.main.splatling.barrelspinner_remix',
  MainWeaponType.splatling,
  4012
);
MainWeapon.herospinnerReplica = new MainWeapon(
  'weapon.main.splatling.herospinner_replica',
  MainWeaponType.splatling,
  4015
);
MainWeapon.hydra = new MainWeapon('weapon.main.splatling.hydra', MainWeaponType.splatling, 4020);
MainWeapon.hydraCustom = new MainWeapon('weapon.main.splatling.hydra_custom', MainWeaponType.splatling, 4021);
MainWeapon.kugelschreiber = new MainWeapon('weapon.main.splatling.kugelschreiber', MainWeaponType.splatling, 4030);
MainWeapon.kugelschreiberHue = new MainWeapon(
  'weapon.main.splatling.kugelschreiber_hue',
  MainWeaponType.splatling,
  4031
);
MainWeapon.nautilus47 = new MainWeapon('weapon.main.splatling.nautilus47', MainWeaponType.splatling, 4040);
MainWeapon.nautilus79 = new MainWeapon('weapon.main.splatling.nautilus79', MainWeaponType.splatling, 4041);
MainWeapon.sputtery = new MainWeapon('weapon.main.maneuver.sputtery', MainWeaponType.maneuver, 5000);
MainWeapon.sputteryHue = new MainWeapon('weapon.main.maneuver.sputtery_hue', MainWeaponType.maneuver, 5001);
MainWeapon.sputteryClear = new MainWeapon('weapon.main.maneuver.sputtery_clear', MainWeaponType.maneuver, 5002);
MainWeapon.maneuver = new MainWeapon('weapon.main.maneuver.maneuver', MainWeaponType.maneuver, 5010);
MainWeapon.maneuverCollabo = new MainWeapon('weapon.main.maneuver.maneuver_collabo', MainWeaponType.maneuver, 5011);
MainWeapon.maneuverBecchu = new MainWeapon('weapon.main.maneuver.maneuver_becchu', MainWeaponType.maneuver, 5012);
MainWeapon.heromaneuverReplica = new MainWeapon(
  'weapon.main.maneuver.heromaneuver_replica',
  MainWeaponType.maneuver,
  5015
);
MainWeapon.kelvin525 = new MainWeapon('weapon.main.maneuver.kelvin525', MainWeaponType.maneuver, 5020);
MainWeapon.kelvin525Deco = new MainWeapon('weapon.main.maneuver.kelvin525_deco', MainWeaponType.maneuver, 5021);
MainWeapon.kelvin525Becchu = new MainWeapon('weapon.main.maneuver.kelvin525_becchu', MainWeaponType.maneuver, 5022);
MainWeapon.dualsweeper = new MainWeapon('weapon.main.maneuver.dualsweeper', MainWeaponType.maneuver, 5030);
MainWeapon.dualsweeperCustom = new MainWeapon('weapon.main.maneuver.dualsweeper_custom', MainWeaponType.maneuver, 5031);
MainWeapon.quadhopperBlack = new MainWeapon('weapon.main.maneuver.quadhopper_black', MainWeaponType.maneuver, 5040);
MainWeapon.quadhopperWhite = new MainWeapon('weapon.main.maneuver.quadhopper_white', MainWeaponType.maneuver, 5041);
MainWeapon.parashelter = new MainWeapon('weapon.main.brella.parashelter', MainWeaponType.brella, 6000);
MainWeapon.parashelterSorella = new MainWeapon('weapon.main.brella.parashelter_sorella', MainWeaponType.brella, 6001);
MainWeapon.heroshelterReplica = new MainWeapon('weapon.main.brella.heroshelter_replica', MainWeaponType.brella, 6005);
MainWeapon.campingshelter = new MainWeapon('weapon.main.brella.campingshelter', MainWeaponType.brella, 6010);
MainWeapon.campingshelterSorella = new MainWeapon(
  'weapon.main.brella.campingshelter_sorella',
  MainWeaponType.brella,
  6011
);
MainWeapon.campingshelterCamo = new MainWeapon('weapon.main.brella.campingshelter_camo', MainWeaponType.brella, 6012);
MainWeapon.spygadget = new MainWeapon('weapon.main.brella.spygadget', MainWeaponType.brella, 6020);
MainWeapon.spygadgetSorella = new MainWeapon('weapon.main.brella.spygadget_sorella', MainWeaponType.brella, 6021);
MainWeapon.spygadgetBecchu = new MainWeapon('weapon.main.brella.spygadget_becchu', MainWeaponType.brella, 6022);

Object.freeze(MainWeapon);

class SubWeapon {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse = id => {
    switch (id) {
      case 0:
        return SubWeapon.splatBomb;
      case 1:
        return SubWeapon.suctionBomb;
      case 2:
        return SubWeapon.burstBomb;
      case 3:
        return SubWeapon.curlingBomb;
      case 4:
        return SubWeapon.autobomb;
      case 5:
        return SubWeapon.inkMine;
      case 6:
        return SubWeapon.sprinkler;
      case 7:
        return SubWeapon.toxicMist;
      case 8:
        return SubWeapon.pointSensor;
      case 9:
        return SubWeapon.splashWall;
      case 10:
        return SubWeapon.squidBeakon;
      case 11:
        return SubWeapon.fizzyBomb;
      case 12:
        return SubWeapon.torpedo;
      default:
        throw new RangeError();
    }
  };
}

SubWeapon.splatBomb = new SubWeapon('weapon.sub.splat_bomb', 0);
SubWeapon.suctionBomb = new SubWeapon('weapon.sub.suction_bomb', 1);
SubWeapon.burstBomb = new SubWeapon('weapon.sub.burst_bomb', 2);
SubWeapon.curlingBomb = new SubWeapon('weapon.sub.curling_bomb', 3);
SubWeapon.autobomb = new SubWeapon('weapon.sub.autobomb', 4);
SubWeapon.inkMine = new SubWeapon('weapon.sub.ink_mine', 5);
SubWeapon.sprinkler = new SubWeapon('weapon.sub.sprinkler', 6);
SubWeapon.toxicMist = new SubWeapon('weapon.sub.toxic_mist', 7);
SubWeapon.pointSensor = new SubWeapon('weapon.sub.point_sensor', 8);
SubWeapon.splashWall = new SubWeapon('weapon.sub.splash_wall', 9);
SubWeapon.squidBeakon = new SubWeapon('weapon.sub.squid_beakon', 10);
SubWeapon.fizzyBomb = new SubWeapon('weapon.sub.fizzy_bomb', 11);
SubWeapon.torpedo = new SubWeapon('weapon.sub.torpedo', 12);

Object.freeze(SubWeapon);

class SpecialWeapon {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse = id => {
    switch (id) {
      case 0:
        return SpecialWeapon.tentaMissiles;
      case 1:
        return SpecialWeapon.inkArmor;
      case 2:
        return SpecialWeapon.splatBombLauncher;
      case 3:
        return SpecialWeapon.suctionBombLauncher;
      case 4:
        return SpecialWeapon.burstBombLauncher;
      case 5:
        return SpecialWeapon.curlingBombLauncher;
      case 6:
        return SpecialWeapon.autobombLauncher;
      case 7:
        return SpecialWeapon.stingRay;
      case 8:
        return SpecialWeapon.inkjet;
      case 9:
        return SpecialWeapon.splashdown;
      case 10:
        return SpecialWeapon.inkStorm;
      case 11:
        return SpecialWeapon.baller;
      case 12:
        return SpecialWeapon.bubbleBlower;
      case 17:
        return SpecialWeapon.booyahBomb;
      case 18:
        return SpecialWeapon.ultraStamp;
      default:
        throw new RangeError();
    }
  };
}

SpecialWeapon.tentaMissiles = new SpecialWeapon('weapon.special.tenta_missiles', 0);
SpecialWeapon.inkArmor = new SpecialWeapon('weapon.special.ink_armor', 1);
SpecialWeapon.splatBombLauncher = new SpecialWeapon('weapon.special.splat_bomb_launcher', 2);
SpecialWeapon.suctionBombLauncher = new SpecialWeapon('weapon.special.suction_bomb_launcher', 3);
SpecialWeapon.burstBombLauncher = new SpecialWeapon('weapon.special.burst_bomb_launcher', 4);
SpecialWeapon.curlingBombLauncher = new SpecialWeapon('weapon.special.curling_bomb_launcher', 5);
SpecialWeapon.autobombLauncher = new SpecialWeapon('weapon.special.autobomb_launcher', 6);
SpecialWeapon.stingRay = new SpecialWeapon('weapon.special.sting_ray', 7);
SpecialWeapon.inkjet = new SpecialWeapon('weapon.special.inkjet', 8);
SpecialWeapon.splashdown = new SpecialWeapon('weapon.special.splashdown', 9);
SpecialWeapon.inkStorm = new SpecialWeapon('weapon.special.ink_storm', 10);
SpecialWeapon.baller = new SpecialWeapon('weapon.special.baller', 11);
SpecialWeapon.bubbleBlower = new SpecialWeapon('weapon.special.bubble_blower', 12);
SpecialWeapon.booyahBomb = new SpecialWeapon('weapon.special.booyah_bomb', 17);
SpecialWeapon.ultraStamp = new SpecialWeapon('weapon.special.ultra_stamp', 18);

class Weapon extends Base {
  constructor(
    e,
    mainWeapon,
    mainWeaponUrl,
    subWeapon,
    subWeaponUrlA,
    subWeaponUrlB,
    specialWeapon,
    specialWeaponUrlA,
    specialWeaponUrlB
  ) {
    super(e);
    this.mainWeapon = mainWeapon;
    this.mainWeaponUrl = mainWeaponUrl;
    this.subWeapon = subWeapon;
    this.subWeaponUrlA = subWeaponUrlA;
    this.subWeaponUrlB = subWeaponUrlB;
    this.specialWeapon = specialWeapon;
    this.specialWeaponUrlA = specialWeaponUrlA;
    this.specialWeaponUrlB = specialWeaponUrlB;
  }

  static parse = data => {
    try {
      const mainWeapon = MainWeapon.parse(parseInt(data.id));
      const subWeapon = SubWeapon.parse(parseInt(data.sub.id));
      const specialWeapon = SpecialWeapon.parse(parseInt(data.special.id));
      return new Weapon(
        null,
        mainWeapon,
        data.image,
        subWeapon,
        data.sub.image_a,
        data.sub.image_b,
        specialWeapon,
        data.special.image_a,
        data.special.image_b
      );
    } catch (e) {
      console.error(e);
      return new Weapon('can_not_parse_weapon');
    }
  };

  static deserialize = data => {
    try {
      const mainWeapon = MainWeapon.parse(parseInt(data.mainWeapon.value));
      const subWeapon = SubWeapon.parse(parseInt(data.subWeapon.value));
      const specialWeapon = SpecialWeapon.parse(parseInt(data.specialWeapon.value));
      return new Weapon(
        null,
        mainWeapon,
        data.mainWeaponUrl,
        subWeapon,
        data.subWeaponUrlA,
        data.subWeaponUrlB,
        specialWeapon,
        data.specialWeaponUrlA,
        data.specialWeaponUrlB
      );
    } catch (e) {
      console.error(e);
      return new Weapon('can_not_deserialize_weapon');
    }
  };
}

class Freshness {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse = value => {
    if (value < 5) {
      return Freshness.dry;
    } else if (value < 10) {
      return Freshness.raw;
    } else if (value < 15) {
      return Freshness.fresh;
    } else if (value < 20) {
      return Freshness.superfresh;
    } else if (value < 50) {
      return Freshness.superfresh2;
    } else {
      return Freshness.superfresh3;
    }
  };
}

Freshness.dry = new Freshness('freshness.dry', 0);
Freshness.raw = new Freshness('freshness.raw', 1);
Freshness.fresh = new Freshness('freshness.fresh', 2);
Freshness.superfresh = new Freshness('freshness.superfresh', 3);
Freshness.superfresh2 = new Freshness('freshness.superfresh', 4);
Freshness.superfresh3 = new Freshness('freshness.superfresh', 5);

export { MainWeaponType, MainWeapon, SubWeapon, SpecialWeapon, Weapon, Freshness };
