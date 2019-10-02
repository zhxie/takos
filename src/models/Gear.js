import { Ability } from './Ability';
import Base from './Base';
import { Brand } from './Brand';

class GearType {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

GearType.headgear = new GearType('gear.headgear', 0);
GearType.clothes = new GearType('gear.clothes', 1);
GearType.shoes = new GearType('gear.shoes', 2);

Object.freeze(GearType);

class BaseGear {
  constructor(name, type, value) {
    this.name = name;
    this.type = type;
    this.value = value;
  }
}

class HeadgearGear extends BaseGear {
  constructor(name, value) {
    super(name, GearType.headgear, value);
  }

  static parse = id => {
    switch (id) {
      case 1:
        return HeadgearGear.whiteHeadband;
      case 1000:
        return HeadgearGear.urchinsCap;
      case 1001:
        return HeadgearGear.lightweightCap;
      case 1002:
        return HeadgearGear.takorokaMesh;
      case 1003:
        return HeadgearGear.streetstyleCap;
      case 1004:
        return HeadgearGear.squidStitchCap;
      case 1005:
        return HeadgearGear.squidvaderCap;
      case 1006:
        return HeadgearGear.camoMesh;
      case 1007:
        return HeadgearGear.fivePanelCap;
      case 1008:
        return HeadgearGear.zekkoMesh;
      case 1009:
        return HeadgearGear.backwardsCap;
      case 1010:
        return HeadgearGear.twoStripeMesh;
      case 1011:
        return HeadgearGear.jetCap;
      case 1012:
        return HeadgearGear.cyclingCap;
      case 1014:
        return HeadgearGear.cycleKingCap;
      case 1018:
        return HeadgearGear.longBilledCap;
      case 1019:
        return HeadgearGear.kingFlipMesh;
      case 1020:
        return HeadgearGear.hickoryWorkCap;
      case 1021:
        return HeadgearGear.woollyUrchinsClassic;
      case 1023:
        return HeadgearGear.jellyvaderCap;
      case 1024:
        return HeadgearGear.houseTagDenimCap;
      case 1025:
        return HeadgearGear.blowfishNewsie;
      case 1026:
        return HeadgearGear.doRagCapAndGlasses;
      case 1027:
        return HeadgearGear.pilotHat;
      case 2000:
        return HeadgearGear.bobbleHat;
      case 2001:
        return HeadgearGear.shortBeanie;
      case 2002:
        return HeadgearGear.stripedBeanie;
      case 2003:
        return HeadgearGear.sportyBobbleHat;
      case 2004:
        return HeadgearGear.specialForcesBeret;
      case 2005:
        return HeadgearGear.squidNordic;
      case 2006:
        return HeadgearGear.sennyuBonBonBeanie;
      case 2008:
        return HeadgearGear.knittedHat;
      case 2009:
        return HeadgearGear.annakiBeret;
      case 2010:
        return HeadgearGear.yamagiriBeanie;
      case 2011:
        return HeadgearGear.sneakyBeanie;
      case 3000:
        return HeadgearGear.retroSpecs;
      case 3001:
        return HeadgearGear.splashGoggles;
      case 3002:
        return HeadgearGear.pilotGoggles;
      case 3003:
        return HeadgearGear.tintedShades;
      case 3004:
        return HeadgearGear.blackArrowbands;
      case 3005:
        return HeadgearGear.snorkelMask;
      case 3006:
        return HeadgearGear.whiteArrowbands;
      case 3007:
        return HeadgearGear.fakeContacts;
      case 3008:
        return HeadgearGear._18KAviators;
      case 3009:
        return HeadgearGear.fullMoonGlasses;
      case 3010:
        return HeadgearGear.octoglasses;
      case 3011:
        return HeadgearGear.halfRimGlasses;
      case 3012:
        return HeadgearGear.doubleEggShades;
      case 3013:
        return HeadgearGear.zekkoCap;
      case 3014:
        return HeadgearGear.sv925CircleShades;
      case 3015:
        return HeadgearGear.annakiBeretAndGlasses;
      case 3016:
        return HeadgearGear.swimGoggles;
      case 3017:
        return HeadgearGear.inkGuardGoggles;
      case 3018:
        return HeadgearGear.toniKensaGoggles;
      case 3019:
        return HeadgearGear.sennyuGoggles;
      case 3020:
        return HeadgearGear.sennyuSpecs;
      case 4000:
        return HeadgearGear.safariHat;
      case 4001:
        return HeadgearGear.jungleHat;
      case 4002:
        return HeadgearGear.campingHat;
      case 4003:
        return HeadgearGear.blowfishBellHat;
      case 4004:
        return HeadgearGear.bambooHat;
      case 4005:
        return HeadgearGear.strawBoater;
      case 4006:
        return HeadgearGear.classicStrawBoater;
      case 4007:
        return HeadgearGear.treasureHunter;
      case 4008:
        return HeadgearGear.bucketHat;
      case 4009:
        return HeadgearGear.patchedHat;
      case 4010:
        return HeadgearGear.tulipParasol;
      case 4011:
        return HeadgearGear.fuguBellHat;
      case 4012:
        return HeadgearGear.seashellBambooHat;
      case 4013:
        return HeadgearGear.hothouseHat;
      case 4014:
        return HeadgearGear.mountieHat;
      case 5000:
        return HeadgearGear.studioHeadphones;
      case 5001:
        return HeadgearGear.designerHeadphones;
      case 5002:
        return HeadgearGear.noiseCancelers;
      case 5003:
        return HeadgearGear.squidfinHookCans;
      case 5004:
        return HeadgearGear.squidlifeHeadphones;
      case 5005:
        return HeadgearGear.studioOctophones;
      case 5006:
        return HeadgearGear.sennyuHeadphones;
      case 6000:
        return HeadgearGear.golfVisor;
      case 6001:
        return HeadgearGear.fishfryVisor;
      case 6002:
        return HeadgearGear.sunVisor;
      case 6003:
        return HeadgearGear.takorokaVisor;
      case 6004:
        return HeadgearGear.faceVisor;
      case 7000:
        return HeadgearGear.bikeHelmet;
      case 7002:
        return HeadgearGear.stealthGoggles;
      case 7004:
        return HeadgearGear.skateHelmet;
      case 7005:
        return HeadgearGear.visorSkateHelmet;
      case 7006:
        return HeadgearGear.mtbHelmet;
      case 7007:
        return HeadgearGear.hockeyHelmet;
      case 7008:
        return HeadgearGear.matteBikeHelmet;
      case 7009:
        return HeadgearGear.octoTackleHelmetDeco;
      case 7010:
        return HeadgearGear.moistGhillieHelmet;
      case 7011:
        return HeadgearGear.decaTackleVisorHelmet;
      case 8000:
        return HeadgearGear.gasMask;
      case 8001:
        return HeadgearGear.paintballMask;
      case 8002:
        return HeadgearGear.paisleyBandana;
      case 8003:
        return HeadgearGear.skullBandana;
      case 8004:
        return HeadgearGear.paintersMask;
      case 8005:
        return HeadgearGear.annakiMask;
      case 8006:
        return HeadgearGear.octokingFacemask;
      case 8007:
        return HeadgearGear.squidFacemask;
      case 8008:
        return HeadgearGear.firefinFacemask;
      case 8009:
        return HeadgearGear.kingFacemask;
      case 8010:
        return HeadgearGear.motocrossNoseGuard;
      case 8011:
        return HeadgearGear.forgeMask;
      case 8012:
        return HeadgearGear.digiCamoForgeMask;
      case 8013:
        return HeadgearGear.koshienBandana;
      case 9001:
        return HeadgearGear.bBallHeadband;
      case 9002:
        return HeadgearGear.squashHeadband;
      case 9003:
        return HeadgearGear.tennisHeadband;
      case 9004:
        return HeadgearGear.joggingHeadband;
      case 9005:
        return HeadgearGear.soccerHeadband;
      case 9007:
        return HeadgearGear.fishfryBiscuitBandana;
      case 9008:
        return HeadgearGear.blackFishfryBandana;
      case 10000:
        return HeadgearGear.kaiserCuff;
      case 21000:
        return HeadgearGear.headlampHelmet;
      case 21001:
        return HeadgearGear.dustBlocker2000;
      case 21002:
        return HeadgearGear.weldingMask;
      case 21003:
        return HeadgearGear.beekeeperHat;
      case 21004:
        return HeadgearGear.octoleetGoggles;
      case 21005:
        return HeadgearGear.capOfLegend;
      case 21006:
        return HeadgearGear.oceanicHardHat;
      case 21007:
        return HeadgearGear.workersHeadTowel;
      case 21008:
        return HeadgearGear.workersCap;
      case 21009:
        return HeadgearGear.sailorCap;
      case 22000:
        return HeadgearGear.mechaHeadHtr;
      case 24000:
        return HeadgearGear.kyonshiHat;
      case 24001:
        return HeadgearGear.lilDevilHorns;
      case 24002:
        return HeadgearGear.hockeyMask;
      case 24003:
        return HeadgearGear.anglerfishMask;
      case 24004:
        return HeadgearGear.festivePartyCone;
      case 24005:
        return HeadgearGear.newYearsGlassesDx;
      case 24006:
        return HeadgearGear.twistyHeadband;
      case 24007:
        return HeadgearGear.eelCakeHat;
      case 24008:
        return HeadgearGear.purpleNoveltyVisor;
      case 24009:
        return HeadgearGear.greenNoveltyVisor;
      case 24010:
        return HeadgearGear.orangeNoveltyVisor;
      case 24011:
        return HeadgearGear.pinkNoveltyVisor;
      case 24012:
        return HeadgearGear.jetflameCrest;
      case 24013:
        return HeadgearGear.fierceFishskull;
      case 24014:
        return HeadgearGear.hivemindAntenna;
      case 24015:
        return HeadgearGear.eyeOfJustice;
      case 25000:
        return HeadgearGear.squidHairclip;
      case 25001:
        return HeadgearGear.samuraiHelmet;
      case 25002:
        return HeadgearGear.powerMask;
      case 25003:
        return HeadgearGear.squidClipOns;
      case 25004:
        return HeadgearGear.squinjaMask;
      case 25005:
        return HeadgearGear.powerMaskMkI;
      case 25006:
        return HeadgearGear.pearlescentCrown;
      case 25007:
        return HeadgearGear.marinatedHeadphones;
      case 25008:
        return HeadgearGear.enchantedHat;
      case 25009:
        return HeadgearGear.steelHelm;
      case 25010:
        return HeadgearGear.freshFishHead;
      case 27000:
        return HeadgearGear.heroHeadsetReplica;
      case 27004:
        return HeadgearGear.armorHelmetReplica;
      case 27101:
        return HeadgearGear.heroHeadphonesReplica;
      case 27104:
        return HeadgearGear.octolingShades;
      case 27105:
        return HeadgearGear.nullVisorReplica;
      case 27106:
        return HeadgearGear.oldTimeyHat;
      case 27107:
        return HeadgearGear.conductorCap;
      case 27108:
        return HeadgearGear.goldenToothpick;
      default:
        throw new RangeError();
    }
  };
}

HeadgearGear.whiteHeadband = new HeadgearGear('gear.headgear.white_headband', 1);
HeadgearGear.urchinsCap = new HeadgearGear('gear.headgear.urchins_cap', 1000);
HeadgearGear.lightweightCap = new HeadgearGear('gear.headgear.lightweight_cap', 1001);
HeadgearGear.takorokaMesh = new HeadgearGear('gear.headgear.takoroka_mesh', 1002);
HeadgearGear.streetstyleCap = new HeadgearGear('gear.headgear.streetstyle_cap', 1003);
HeadgearGear.squidStitchCap = new HeadgearGear('gear.headgear.squid_stitch_cap', 1004);
HeadgearGear.squidvaderCap = new HeadgearGear('gear.headgear.squidvader_cap', 1005);
HeadgearGear.camoMesh = new HeadgearGear('gear.headgear.camo_mesh', 1006);
HeadgearGear.fivePanelCap = new HeadgearGear('gear.headgear.five_panel_cap', 1007);
HeadgearGear.zekkoMesh = new HeadgearGear('gear.headgear.zekko_mesh', 1008);
HeadgearGear.backwardsCap = new HeadgearGear('gear.headgear.backwards_cap', 1009);
HeadgearGear.twoStripeMesh = new HeadgearGear('gear.headgear.two_stripe_mesh', 1010);
HeadgearGear.jetCap = new HeadgearGear('gear.headgear.jet_cap', 1011);
HeadgearGear.cyclingCap = new HeadgearGear('gear.headgear.cycling_cap', 1012);
HeadgearGear.cycleKingCap = new HeadgearGear('gear.headgear.cycle_king_cap', 1014);
HeadgearGear.longBilledCap = new HeadgearGear('gear.headgear.long_billed_cap', 1018);
HeadgearGear.kingFlipMesh = new HeadgearGear('gear.headgear.king_flip_mesh', 1019);
HeadgearGear.hickoryWorkCap = new HeadgearGear('gear.headgear.hickory_work_cap', 1020);
HeadgearGear.woollyUrchinsClassic = new HeadgearGear('gear.headgear.woolly_urchins_classic', 1021);
HeadgearGear.jellyvaderCap = new HeadgearGear('gear.headgear.jellyvader_cap', 1023);
HeadgearGear.houseTagDenimCap = new HeadgearGear('gear.headgear.house_tag_denim_cap', 1024);
HeadgearGear.blowfishNewsie = new HeadgearGear('gear.headgear.blowfish_newsie', 1025);
HeadgearGear.doRagCapAndGlasses = new HeadgearGear('gear.headgear.do_rag_cap_and_glasses', 1026);
HeadgearGear.pilotHat = new HeadgearGear('gear.headgear.pilot_hat', 1027);
HeadgearGear.bobbleHat = new HeadgearGear('gear.headgear.bobble_hat', 2000);
HeadgearGear.shortBeanie = new HeadgearGear('gear.headgear.short_beanie', 2001);
HeadgearGear.stripedBeanie = new HeadgearGear('gear.headgear.striped_beanie', 2002);
HeadgearGear.sportyBobbleHat = new HeadgearGear('gear.headgear.sporty_bobble_hat', 2003);
HeadgearGear.specialForcesBeret = new HeadgearGear('gear.headgear.special_forces_beret', 2004);
HeadgearGear.squidNordic = new HeadgearGear('gear.headgear.squid_nordic', 2005);
HeadgearGear.sennyuBonBonBeanie = new HeadgearGear('gear.headgear.sennyu_bon_bon_beanie', 2006);
HeadgearGear.knittedHat = new HeadgearGear('gear.headgear.knitted_hat', 2008);
HeadgearGear.annakiBeret = new HeadgearGear('gear.headgear.annaki_beret', 2009);
HeadgearGear.yamagiriBeanie = new HeadgearGear('gear.headgear.yamagiri_beanie', 2010);
HeadgearGear.sneakyBeanie = new HeadgearGear('gear.headgear.sneaky_beanie', 2011);
HeadgearGear.retroSpecs = new HeadgearGear('gear.headgear.retro_specs', 3000);
HeadgearGear.splashGoggles = new HeadgearGear('gear.headgear.splash_goggles', 3001);
HeadgearGear.pilotGoggles = new HeadgearGear('gear.headgear.pilot_goggles', 3002);
HeadgearGear.tintedShades = new HeadgearGear('gear.headgear.tinted_shades', 3003);
HeadgearGear.blackArrowbands = new HeadgearGear('gear.headgear.black_arrowbands', 3004);
HeadgearGear.snorkelMask = new HeadgearGear('gear.headgear.snorkel_mask', 3005);
HeadgearGear.whiteArrowbands = new HeadgearGear('gear.headgear.white_arrowbands', 3006);
HeadgearGear.fakeContacts = new HeadgearGear('gear.headgear.fake_contacts', 3007);
HeadgearGear._18KAviators = new HeadgearGear('gear.headgear.18k_aviators', 3008);
HeadgearGear.fullMoonGlasses = new HeadgearGear('gear.headgear.full_moon_glasses', 3009);
HeadgearGear.octoglasses = new HeadgearGear('gear.headgear.octoglasses', 3010);
HeadgearGear.halfRimGlasses = new HeadgearGear('gear.headgear.half_rim_glasses', 3011);
HeadgearGear.doubleEggShades = new HeadgearGear('gear.headgear.double_egg_shades', 3012);
HeadgearGear.zekkoCap = new HeadgearGear('gear.headgear.zekko_cap', 3013);
HeadgearGear.sv925CircleShades = new HeadgearGear('gear.headgear.sv925_circle_shades', 3014);
HeadgearGear.annakiBeretAndGlasses = new HeadgearGear('gear.headgear.annaki_beret_and_glasses', 3015);
HeadgearGear.swimGoggles = new HeadgearGear('gear.headgear.swim_goggles', 3016);
HeadgearGear.inkGuardGoggles = new HeadgearGear('gear.headgear.ink_guard_goggles', 3017);
HeadgearGear.toniKensaGoggles = new HeadgearGear('gear.headgear.toni_kensa_goggles', 3018);
HeadgearGear.sennyuGoggles = new HeadgearGear('gear.headgear.sennyu_goggles', 3019);
HeadgearGear.sennyuSpecs = new HeadgearGear('gear.headgear.sennyu_specs', 3020);
HeadgearGear.safariHat = new HeadgearGear('gear.headgear.safari_hat', 4000);
HeadgearGear.jungleHat = new HeadgearGear('gear.headgear.jungle_hat', 4001);
HeadgearGear.campingHat = new HeadgearGear('gear.headgear.camping_hat', 4002);
HeadgearGear.blowfishBellHat = new HeadgearGear('gear.headgear.blowfish_bell_hat', 4003);
HeadgearGear.bambooHat = new HeadgearGear('gear.headgear.bamboo_hat', 4004);
HeadgearGear.strawBoater = new HeadgearGear('gear.headgear.straw_boater', 4005);
HeadgearGear.classicStrawBoater = new HeadgearGear('gear.headgear.classic_straw_boater', 4006);
HeadgearGear.treasureHunter = new HeadgearGear('gear.headgear.treasure_hunter', 4007);
HeadgearGear.bucketHat = new HeadgearGear('gear.headgear.bucket_hat', 4008);
HeadgearGear.patchedHat = new HeadgearGear('gear.headgear.patched_hat', 4009);
HeadgearGear.tulipParasol = new HeadgearGear('gear.headgear.tulip_parasol', 4010);
HeadgearGear.fuguBellHat = new HeadgearGear('gear.headgear.fugu_bell_hat', 4011);
HeadgearGear.seashellBambooHat = new HeadgearGear('gear.headgear.seashell_bamboo_hat', 4012);
HeadgearGear.hothouseHat = new HeadgearGear('gear.headgear.hothouse_hat', 4013);
HeadgearGear.mountieHat = new HeadgearGear('gear.headgear.mountie_hat', 4014);
HeadgearGear.studioHeadphones = new HeadgearGear('gear.headgear.studio_headphones', 5000);
HeadgearGear.designerHeadphones = new HeadgearGear('gear.headgear.designer_headphones', 5001);
HeadgearGear.noiseCancelers = new HeadgearGear('gear.headgear.noise_cancelers', 5002);
HeadgearGear.squidfinHookCans = new HeadgearGear('gear.headgear.squidfin_hook_cans', 5003);
HeadgearGear.squidlifeHeadphones = new HeadgearGear('gear.headgear.squidlife_headphones', 5004);
HeadgearGear.studioOctophones = new HeadgearGear('gear.headgear.studio_octophones', 5005);
HeadgearGear.sennyuHeadphones = new HeadgearGear('gear.headgear.sennyu_headphones', 5006);
HeadgearGear.golfVisor = new HeadgearGear('gear.headgear.golf_visor', 6000);
HeadgearGear.fishfryVisor = new HeadgearGear('gear.headgear.fishfry_visor', 6001);
HeadgearGear.sunVisor = new HeadgearGear('gear.headgear.sun_visor', 6002);
HeadgearGear.takorokaVisor = new HeadgearGear('gear.headgear.takoroka_visor', 6003);
HeadgearGear.faceVisor = new HeadgearGear('gear.headgear.face_visor', 6004);
HeadgearGear.bikeHelmet = new HeadgearGear('gear.headgear.bike_helmet', 7000);
HeadgearGear.stealthGoggles = new HeadgearGear('gear.headgear.stealth_goggles', 7002);
HeadgearGear.skateHelmet = new HeadgearGear('gear.headgear.skate_helmet', 7004);
HeadgearGear.visorSkateHelmet = new HeadgearGear('gear.headgear.visor_skate_helmet', 7005);
HeadgearGear.mtbHelmet = new HeadgearGear('gear.headgear.mtb_helmet', 7006);
HeadgearGear.hockeyHelmet = new HeadgearGear('gear.headgear.hockey_helmet', 7007);
HeadgearGear.matteBikeHelmet = new HeadgearGear('gear.headgear.matte_bike_helmet', 7008);
HeadgearGear.octoTackleHelmetDeco = new HeadgearGear('gear.headgear.octo_tackle_helmet_deco', 7009);
HeadgearGear.moistGhillieHelmet = new HeadgearGear('gear.headgear.moist_ghillie_helmet', 7010);
HeadgearGear.decaTackleVisorHelmet = new HeadgearGear('gear.headgear.deca_tackle_visor_helmet', 7011);
HeadgearGear.gasMask = new HeadgearGear('gear.headgear.gas_mask', 8000);
HeadgearGear.paintballMask = new HeadgearGear('gear.headgear.paintball_mask', 8001);
HeadgearGear.paisleyBandana = new HeadgearGear('gear.headgear.paisley_bandana', 8002);
HeadgearGear.skullBandana = new HeadgearGear('gear.headgear.skull_bandana', 8003);
HeadgearGear.paintersMask = new HeadgearGear('gear.headgear.painters_mask', 8004);
HeadgearGear.annakiMask = new HeadgearGear('gear.headgear.annaki_mask', 8005);
HeadgearGear.octokingFacemask = new HeadgearGear('gear.headgear.octoking_facemask', 8006);
HeadgearGear.squidFacemask = new HeadgearGear('gear.headgear.squid_facemask', 8007);
HeadgearGear.firefinFacemask = new HeadgearGear('gear.headgear.firefin_facemask', 8008);
HeadgearGear.kingFacemask = new HeadgearGear('gear.headgear.king_facemask', 8009);
HeadgearGear.motocrossNoseGuard = new HeadgearGear('gear.headgear.motocross_nose_guard', 8010);
HeadgearGear.forgeMask = new HeadgearGear('gear.headgear.forge_mask', 8011);
HeadgearGear.digiCamoForgeMask = new HeadgearGear('gear.headgear.digi_camo_forge_mask', 8012);
HeadgearGear.koshienBandana = new HeadgearGear('gear.headgear.koshien_bandana', 8013);
HeadgearGear.bBallHeadband = new HeadgearGear('gear.headgear.b_ball_headband', 9001);
HeadgearGear.squashHeadband = new HeadgearGear('gear.headgear.squash_headband', 9002);
HeadgearGear.tennisHeadband = new HeadgearGear('gear.headgear.tennis_headband', 9003);
HeadgearGear.joggingHeadband = new HeadgearGear('gear.headgear.jogging_headband', 9004);
HeadgearGear.soccerHeadband = new HeadgearGear('gear.headgear.soccer_headband', 9005);
HeadgearGear.fishfryBiscuitBandana = new HeadgearGear('gear.headgear.fishfry_biscuit_bandana', 9007);
HeadgearGear.blackFishfryBandana = new HeadgearGear('gear.headgear.black_fishfry_bandana', 9008);
HeadgearGear.kaiserCuff = new HeadgearGear('gear.headgear.kaiser_cuff', 10000);
HeadgearGear.headlampHelmet = new HeadgearGear('gear.headgear.headlamp_helmet', 21000);
HeadgearGear.dustBlocker2000 = new HeadgearGear('gear.headgear.dust_blocker_2000', 21001);
HeadgearGear.weldingMask = new HeadgearGear('gear.headgear.welding_mask', 21002);
HeadgearGear.beekeeperHat = new HeadgearGear('gear.headgear.beekeeper_hat', 21003);
HeadgearGear.octoleetGoggles = new HeadgearGear('gear.headgear.octoleet_goggles', 21004);
HeadgearGear.capOfLegend = new HeadgearGear('gear.headgear.cap_of_legend', 21005);
HeadgearGear.oceanicHardHat = new HeadgearGear('gear.headgear.oceanic_hard_hat', 21006);
HeadgearGear.workersHeadTowel = new HeadgearGear('gear.headgear.workers_head_towel', 21007);
HeadgearGear.workersCap = new HeadgearGear('gear.headgear.workers_cap', 21008);
HeadgearGear.sailorCap = new HeadgearGear('gear.headgear.sailor_cap', 21009);
HeadgearGear.mechaHeadHtr = new HeadgearGear('gear.headgear.mecha_head_htr', 22000);
HeadgearGear.kyonshiHat = new HeadgearGear('gear.headgear.kyonshi_hat', 24000);
HeadgearGear.lilDevilHorns = new HeadgearGear('gear.headgear.lil_devil_horns', 24001);
HeadgearGear.hockeyMask = new HeadgearGear('gear.headgear.hockey_mask', 24002);
HeadgearGear.anglerfishMask = new HeadgearGear('gear.headgear.anglerfish_mask', 24003);
HeadgearGear.festivePartyCone = new HeadgearGear('gear.headgear.festive_party_cone', 24004);
HeadgearGear.newYearsGlassesDx = new HeadgearGear('gear.headgear.new_years_glasses_dx', 24005);
HeadgearGear.twistyHeadband = new HeadgearGear('gear.headgear.twisty_headband', 24006);
HeadgearGear.eelCakeHat = new HeadgearGear('gear.headgear.eel_cake_hat', 24007);
HeadgearGear.purpleNoveltyVisor = new HeadgearGear('gear.headgear.purple_novelty_visor', 24008);
HeadgearGear.greenNoveltyVisor = new HeadgearGear('gear.headgear.green_novelty_visor', 24009);
HeadgearGear.orangeNoveltyVisor = new HeadgearGear('gear.headgear.orange_novelty_visor', 24010);
HeadgearGear.pinkNoveltyVisor = new HeadgearGear('gear.headgear.pink_novelty_visor', 24011);
HeadgearGear.jetflameCrest = new HeadgearGear('gear.headgear.jetflame_crest', 24012);
HeadgearGear.fierceFishskull = new HeadgearGear('gear.headgear.fierce_fishskull', 24013);
HeadgearGear.hivemindAntenna = new HeadgearGear('gear.headgear.hivemind_antenna', 24014);
HeadgearGear.eyeOfJustice = new HeadgearGear('gear.headgear.eye_of_justice', 24015);
HeadgearGear.squidHairclip = new HeadgearGear('gear.headgear.squid_hairclip', 25000);
HeadgearGear.samuraiHelmet = new HeadgearGear('gear.headgear.samurai_helmet', 25001);
HeadgearGear.powerMask = new HeadgearGear('gear.headgear.power_mask', 25002);
HeadgearGear.squidClipOns = new HeadgearGear('gear.headgear.squid_clip_ons', 25003);
HeadgearGear.squinjaMask = new HeadgearGear('gear.headgear.squinja_mask', 25004);
HeadgearGear.powerMaskMkI = new HeadgearGear('gear.headgear.power_mask_mk_i', 25005);
HeadgearGear.pearlescentCrown = new HeadgearGear('gear.headgear.pearlescent_crown', 25006);
HeadgearGear.marinatedHeadphones = new HeadgearGear('gear.headgear.marinated_headphones', 25007);
HeadgearGear.enchantedHat = new HeadgearGear('gear.headgear.enchanted_hat', 25008);
HeadgearGear.steelHelm = new HeadgearGear('gear.headgear.steel_helm', 25009);
HeadgearGear.freshFishHead = new HeadgearGear('gear.headgear.fresh_fish_head', 25010);
HeadgearGear.heroHeadsetReplica = new HeadgearGear('gear.headgear.hero_headset_replica', 27000);
HeadgearGear.armorHelmetReplica = new HeadgearGear('gear.headgear.armor_helmet_replica', 27004);
HeadgearGear.heroHeadphonesReplica = new HeadgearGear('gear.headgear.hero_headphones_replica', 27101);
HeadgearGear.octolingShades = new HeadgearGear('gear.headgear.octoling_shades', 27104);
HeadgearGear.nullVisorReplica = new HeadgearGear('gear.headgear.null_visor_replica', 27105);
HeadgearGear.oldTimeyHat = new HeadgearGear('gear.headgear.old_timey_hat', 27106);
HeadgearGear.conductorCap = new HeadgearGear('gear.headgear.conductor_cap', 27107);
HeadgearGear.goldenToothpick = new HeadgearGear('gear.headgear.golden_toothpick', 27108);

Object.freeze(HeadgearGear);

class ClothesGear extends BaseGear {
  constructor(name, value) {
    super(name, GearType.clothes, value);
  }

  static parse = id => {
    switch (id) {
      case 2:
        return ClothesGear.basicTee;
      case 3:
        return ClothesGear.freshOctoTee;
      case 1000:
        return ClothesGear.whiteTee;
      case 1001:
        return ClothesGear.blackSquideye;
      case 1003:
        return ClothesGear.skyBlueSquideye;
      case 1004:
        return ClothesGear.rockenbergWhite;
      case 1005:
        return ClothesGear.rockenbergBlack;
      case 1006:
        return ClothesGear.blackTee;
      case 1007:
        return ClothesGear.sunnyDayTee;
      case 1008:
        return ClothesGear.rainyDayTee;
      case 1009:
        return ClothesGear.reggaeTee;
      case 1010:
        return ClothesGear.fuguTee;
      case 1011:
        return ClothesGear.mintTee;
      case 1012:
        return ClothesGear.grapeTee;
      case 1013:
        return ClothesGear.redVectorTee;
      case 1014:
        return ClothesGear.grayVectorTee;
      case 1015:
        return ClothesGear.bluePeaksTee;
      case 1016:
        return ClothesGear.ivoryPeaksTee;
      case 1017:
        return ClothesGear.squidStitchTee;
      case 1018:
        return ClothesGear.pirateStripeTee;
      case 1019:
        return ClothesGear.sailorStripeTee;
      case 1020:
        return ClothesGear.white8BitFishfry;
      case 1021:
        return ClothesGear.black8BitFishfry;
      case 1022:
        return ClothesGear.whiteAnchorTee;
      case 1023:
        return ClothesGear.blackAnchorTee;
      case 1026:
        return ClothesGear.carnivoreTee;
      case 1027:
        return ClothesGear.pearlTee;
      case 1028:
        return ClothesGear.octoTee;
      case 1029:
        return ClothesGear.herbivoreTee;
      case 1030:
        return ClothesGear.blackVNeckTee;
      case 1031:
        return ClothesGear.whiteDecaLogoTee;
      case 1032:
        return ClothesGear.halfSleeveSweater;
      case 1033:
        return ClothesGear.kingJersey;
      case 1034:
        return ClothesGear.gray8BitFishfry;
      case 1035:
        return ClothesGear.whiteVNeckTee;
      case 1036:
        return ClothesGear.whiteUrchinRockTee;
      case 1037:
        return ClothesGear.blackUrchinRockTee;
      case 1038:
        return ClothesGear.wetFloorBandTee;
      case 1039:
        return ClothesGear.squidSquadBandTee;
      case 1040:
        return ClothesGear.navyDecaLogoTee;
      case 1041:
        return ClothesGear.misterShrugTee;
      case 1042:
        return ClothesGear.chirpyChipsBandTee;
      case 1043:
        return ClothesGear.hightideEraBandTee;
      case 1044:
        return ClothesGear.redVNeckLimitedTee;
      case 1045:
        return ClothesGear.greenVNeckLimitedTee;
      case 1046:
        return ClothesGear.omega3Tee;
      case 1047:
        return ClothesGear.annakiPolpoPicTee;
      case 1048:
        return ClothesGear.firewaveTee;
      case 1049:
        return ClothesGear.takorokaGalacticTieDye;
      case 1050:
        return ClothesGear.takorokaRainbowTieDye;
      case 1051:
        return ClothesGear.missusShrugTee;
      case 1052:
        return ClothesGear.leagueTee;
      case 1053:
        return ClothesGear.friendTee;
      case 1054:
        return ClothesGear.tentatekSloganTee;
      case 1055:
        return ClothesGear.icewaveTee;
      case 1056:
        return ClothesGear.octokingHkJersey;
      case 1057:
        return ClothesGear.dakroNanaTee;
      case 1058:
        return ClothesGear.dakroGoldenTee;
      case 1059:
        return ClothesGear.blackVelourOctokingTee;
      case 1061:
        return ClothesGear.swcLogoTee;
      case 1060:
        return ClothesGear.greenVelourOctokingTee;
      case 2000:
        return ClothesGear.whiteStripedLs;
      case 2001:
        return ClothesGear.blackLs;
      case 2002:
        return ClothesGear.purpleCamoLs;
      case 2003:
        return ClothesGear.navyStripedLs;
      case 2004:
        return ClothesGear.zekkoBaseballLs;
      case 2005:
        return ClothesGear.varsityBaseballLs;
      case 2006:
        return ClothesGear.blackBaseballLs;
      case 2007:
        return ClothesGear.whiteBaseballLs;
      case 2008:
        return ClothesGear.whiteLs;
      case 2009:
        return ClothesGear.greenStripedLs;
      case 2010:
        return ClothesGear.squidmarkLs;
      case 2011:
        return ClothesGear.zinkLs;
      case 2012:
        return ClothesGear.stripedPeaksLs;
      case 2013:
        return ClothesGear.pinkEasyStripeShirt;
      case 2014:
        return ClothesGear.inkopolisSquapsJersey;
      case 2015:
        return ClothesGear.annakiDriveTee;
      case 2016:
        return ClothesGear.limeEasyStripeShirt;
      case 2017:
        return ClothesGear.annakiEvolutionTee;
      case 2018:
        return ClothesGear.zekkoLongCarrotTee;
      case 2019:
        return ClothesGear.zekkoLongRadishTee;
      case 2020:
        return ClothesGear.blackCuttlegearLs;
      case 2021:
        return ClothesGear.takorokaCrazyBaseballLs;
      case 2022:
        return ClothesGear.redCuttlegearLs;
      case 2023:
        return ClothesGear.khaki16BitFishfry;
      case 2024:
        return ClothesGear.blue16BitFishfry;
      case 3000:
        return ClothesGear.whiteLayeredLs;
      case 3001:
        return ClothesGear.yellowLayeredLs;
      case 3002:
        return ClothesGear.camoLayeredLs;
      case 3003:
        return ClothesGear.blackLayeredLs;
      case 3004:
        return ClothesGear.zinkLayeredLs;
      case 3005:
        return ClothesGear.layeredAnchorLs;
      case 3006:
        return ClothesGear.chocoLayeredLs;
      case 3007:
        return ClothesGear.partTimePirate;
      case 3008:
        return ClothesGear.layeredVectorLs;
      case 3009:
        return ClothesGear.greenTee;
      case 3010:
        return ClothesGear.redTentatekTee;
      case 3011:
        return ClothesGear.blueTentatekTee;
      case 3012:
        return ClothesGear.octoLayeredLs;
      case 3013:
        return ClothesGear.squidYellowLayeredLs;
      case 4000:
        return ClothesGear.shrimpPinkPolo;
      case 4001:
        return ClothesGear.stripedRugby;
      case 4002:
        return ClothesGear.tricolorRugby;
      case 4003:
        return ClothesGear.sagePolo;
      case 4004:
        return ClothesGear.blackPolo;
      case 4005:
        return ClothesGear.cyclingShirt;
      case 4006:
        return ClothesGear.cycleKingJersey;
      case 4007:
        return ClothesGear.slipstreamUnited;
      case 4008:
        return ClothesGear.fcAlbacore;
      case 5000:
        return ClothesGear.oliveSkiJacket;
      case 5001:
        return ClothesGear.takorokaNylonVintage;
      case 5002:
        return ClothesGear.berrySkiJacket;
      case 5003:
        return ClothesGear.varsityJacket;
      case 5004:
        return ClothesGear.schoolJersey;
      case 5005:
        return ClothesGear.greenCardigan;
      case 5006:
        return ClothesGear.blackInkyRider;
      case 5007:
        return ClothesGear.whiteInkyRider;
      case 5008:
        return ClothesGear.retroGamerJersey;
      case 5009:
        return ClothesGear.orangeCardigan;
      case 5010:
        return ClothesGear.forgeInklingParka;
      case 5011:
        return ClothesGear.forgeOctarianJacket;
      case 5012:
        return ClothesGear.blueSailorSuit;
      case 5013:
        return ClothesGear.whiteSailorSuit;
      case 5014:
        return ClothesGear.squidSatinJacket;
      case 5015:
        return ClothesGear.zapfishSatinJacket;
      case 5016:
        return ClothesGear.krakOn528;
      case 5017:
        return ClothesGear.chillyMountainCoat;
      case 5018:
        return ClothesGear.takorokaWindcrusher;
      case 5019:
        return ClothesGear.matchaDownJacket;
      case 5020:
        return ClothesGear.fa01Jacket;
      case 5021:
        return ClothesGear.fa01Reversed;
      case 5022:
        return ClothesGear.pulloverCoat;
      case 5023:
        return ClothesGear.kensaCoat;
      case 5024:
        return ClothesGear.birdedCorduroyJacket;
      case 5025:
        return ClothesGear.deepOctoSatinJacket;
      case 5026:
        return ClothesGear.zekkoRedleafCoat;
      case 5027:
        return ClothesGear.eggplantMountainCoat;
      case 5028:
        return ClothesGear.zekkoJadeCoat;
      case 5029:
        return ClothesGear.lightBomberJacket;
      case 5030:
        return ClothesGear.brownFa11Bomber;
      case 5031:
        return ClothesGear.grayFa11Bomber;
      case 5032:
        return ClothesGear.kingBenchKaiser;
      case 5033:
        return ClothesGear.navyEminenceJacket;
      case 5034:
        return ClothesGear.tumericZekkoCoat;
      case 5035:
        return ClothesGear.customPaintedF3;
      case 5036:
        return ClothesGear.darkBomberJacket;
      case 5037:
        return ClothesGear.moistGhillieSuit;
      case 5038:
        return ClothesGear.whiteLeatherF3;
      case 5039:
        return ClothesGear.chiliPepperSkiJacket;
      case 5040:
        return ClothesGear.whaleKnitSweater;
      case 5041:
        return ClothesGear.rockinLeatherJacket;
      case 5042:
        return ClothesGear.kungFuZipUp;
      case 5043:
        return ClothesGear.pandaKungFuZipUp;
      case 5044:
        return ClothesGear.sennyuSuit;
      case 6000:
        return ClothesGear.bBallJerseyHome;
      case 6001:
        return ClothesGear.bBallJerseyAway;
      case 6003:
        return ClothesGear.whiteKingTank;
      case 6004:
        return ClothesGear.slashKingTank;
      case 6005:
        return ClothesGear.navyKingTank;
      case 6006:
        return ClothesGear.lobStarsJersey;
      case 7000:
        return ClothesGear.grayCollegeSweat;
      case 7001:
        return ClothesGear.squidmarkSweat;
      case 7002:
        return ClothesGear.retroSweat;
      case 7003:
        return ClothesGear.firefinNavySweat;
      case 7004:
        return ClothesGear.navyCollegeSweat;
      case 7005:
        return ClothesGear.reelSweat;
      case 7006:
        return ClothesGear.anchorSweat;
      case 7007:
        return ClothesGear.negativeLongcuffSweater;
      case 7008:
        return ClothesGear.shortKnitLayers;
      case 7009:
        return ClothesGear.positiveLongcuffSweater;
      case 7010:
        return ClothesGear.annakiBlueCuff;
      case 7011:
        return ClothesGear.annakiYellowCuff;
      case 7012:
        return ClothesGear.annakiRedCuff;
      case 7013:
        return ClothesGear.nPacerSweat;
      case 7014:
        return ClothesGear.octarianRetro;
      case 7015:
        return ClothesGear.takorokaJersey;
      case 8000:
        return ClothesGear.lumberjackShirt;
      case 8001:
        return ClothesGear.rodeoShirt;
      case 8002:
        return ClothesGear.greenCheckShirt;
      case 8003:
        return ClothesGear.whiteShirt;
      case 8004:
        return ClothesGear.urchinsJersey;
      case 8005:
        return ClothesGear.alohaShirt;
      case 8006:
        return ClothesGear.redCheckShirt;
      case 8007:
        return ClothesGear.babyJellyShirt;
      case 8008:
        return ClothesGear.baseballJersey;
      case 8009:
        return ClothesGear.grayMixedShirt;
      case 8010:
        return ClothesGear.vintageCheckShirt;
      case 8011:
        return ClothesGear.roundCollarShirt;
      case 8012:
        return ClothesGear.logoAlohaShirt;
      case 8013:
        return ClothesGear.stripedShirt;
      case 8014:
        return ClothesGear.linenShirt;
      case 8015:
        return ClothesGear.shirtAndTie;
      case 8017:
        return ClothesGear.hulaPunkShirt;
      case 8018:
        return ClothesGear.octobowlerShirt;
      case 8019:
        return ClothesGear.inkfallShirt;
      case 8020:
        return ClothesGear.crimsonParashooter;
      case 8021:
        return ClothesGear.babyJellyShirtAndTie;
      case 8022:
        return ClothesGear.pruneParashooter;
      case 8023:
        return ClothesGear.redHulaPunkWithTie;
      case 8024:
        return ClothesGear.chiliOctoAloha;
      case 8025:
        return ClothesGear.annakiFlannelHoodie;
      case 8026:
        return ClothesGear.inkWashShirt;
      case 8027:
        return ClothesGear.dotsOnDotsShirt;
      case 8028:
        return ClothesGear.toniKBaseballJersey;
      case 8029:
        return ClothesGear.onlineJersey;
      case 9000:
        return ClothesGear.mountainVest;
      case 9001:
        return ClothesGear.forestVest;
      case 9002:
        return ClothesGear.darkUrbanVest;
      case 9003:
        return ClothesGear.yellowUrbanVest;
      case 9004:
        return ClothesGear.squidPatternWaistcoat;
      case 9005:
        return ClothesGear.squidstarWaistcoat;
      case 9007:
        return ClothesGear.fishingVest;
      case 9008:
        return ClothesGear.frontZipVest;
      case 9009:
        return ClothesGear.silverTentatekVest;
      case 10000:
        return ClothesGear.camoZipHoodie;
      case 10001:
        return ClothesGear.greenZipHoodie;
      case 10002:
        return ClothesGear.zekkoHoodie;
      case 10004:
        return ClothesGear.shirtWithBlueHoodie;
      case 10005:
        return ClothesGear.grapeHoodie;
      case 10006:
        return ClothesGear.grayHoodie;
      case 10007:
        return ClothesGear.hothouseHoodie;
      case 10008:
        return ClothesGear.pinkHoodie;
      case 10009:
        return ClothesGear.oliveZekkoParka;
      case 10010:
        return ClothesGear.blackHoodie;
      case 10011:
        return ClothesGear.octoSupportHoodie;
      case 21000:
        return ClothesGear.squiddorPolo;
      case 21001:
        return ClothesGear.anchorLifeVest;
      case 21002:
        return ClothesGear.juiceParka;
      case 21003:
        return ClothesGear.gardenGear;
      case 21004:
        return ClothesGear.crustwearXxl;
      case 21005:
        return ClothesGear.northCountryParka;
      case 21006:
        return ClothesGear.octoleetArmor;
      case 21007:
        return ClothesGear.recordShopLookEp;
      case 21008:
        return ClothesGear.devUniform;
      case 21009:
        return ClothesGear.officeAttire;
      case 21010:
        return ClothesGear.srlCoat;
      case 22000:
        return ClothesGear.mechaBodyAkm;
      case 23000:
        return ClothesGear.splatfestTeeReplica;
      case 25000:
        return ClothesGear.schoolUniform;
      case 25001:
        return ClothesGear.samuraiJacket;
      case 25002:
        return ClothesGear.powerArmor;
      case 25003:
        return ClothesGear.schoolCardigan;
      case 25004:
        return ClothesGear.squinjaSuit;
      case 25005:
        return ClothesGear.powerArmorMkI;
      case 25006:
        return ClothesGear.pearlescentHoodie;
      case 25007:
        return ClothesGear.marinatedTop;
      case 25008:
        return ClothesGear.enchantedRobe;
      case 25009:
        return ClothesGear.steelPlatemail;
      case 25010:
        return ClothesGear.freshFishGloves;
      case 26000:
        return ClothesGear.splatfestTee;
      case 27000:
        return ClothesGear.heroJacketReplica;
      case 27004:
        return ClothesGear.armorJacketReplica;
      case 27101:
        return ClothesGear.heroHoodieReplica;
      case 27104:
        return ClothesGear.neoOctolingArmor;
      case 27105:
        return ClothesGear.nullArmorReplica;
      case 27106:
        return ClothesGear.oldTimeyClothes;
      default:
        throw new RangeError();
    }
  };
}

ClothesGear.basicTee = new ClothesGear('gear.clothes.basic_tee', 2);
ClothesGear.freshOctoTee = new ClothesGear('gear.clothes.fresh_octo_tee', 3);
ClothesGear.whiteTee = new ClothesGear('gear.clothes.white_tee', 1000);
ClothesGear.blackSquideye = new ClothesGear('gear.clothes.black_squideye', 1001);
ClothesGear.skyBlueSquideye = new ClothesGear('gear.clothes.sky_blue_squideye', 1003);
ClothesGear.rockenbergWhite = new ClothesGear('gear.clothes.rockenberg_white', 1004);
ClothesGear.rockenbergBlack = new ClothesGear('gear.clothes.rockenberg_black', 1005);
ClothesGear.blackTee = new ClothesGear('gear.clothes.black_tee', 1006);
ClothesGear.sunnyDayTee = new ClothesGear('gear.clothes.sunny_day_tee', 1007);
ClothesGear.rainyDayTee = new ClothesGear('gear.clothes.rainy_day_tee', 1008);
ClothesGear.reggaeTee = new ClothesGear('gear.clothes.reggae_tee', 1009);
ClothesGear.fuguTee = new ClothesGear('gear.clothes.fugu_tee', 1010);
ClothesGear.mintTee = new ClothesGear('gear.clothes.mint_tee', 1011);
ClothesGear.grapeTee = new ClothesGear('gear.clothes.grape_tee', 1012);
ClothesGear.redVectorTee = new ClothesGear('gear.clothes.red_vector_tee', 1013);
ClothesGear.grayVectorTee = new ClothesGear('gear.clothes.gray_vector_tee', 1014);
ClothesGear.bluePeaksTee = new ClothesGear('gear.clothes.blue_peaks_tee', 1015);
ClothesGear.ivoryPeaksTee = new ClothesGear('gear.clothes.ivory_peaks_tee', 1016);
ClothesGear.squidStitchTee = new ClothesGear('gear.clothes.squid_stitch_tee', 1017);
ClothesGear.pirateStripeTee = new ClothesGear('gear.clothes.pirate_stripe_tee', 1018);
ClothesGear.sailorStripeTee = new ClothesGear('gear.clothes.sailor_stripe_tee', 1019);
ClothesGear.white8BitFishfry = new ClothesGear('gear.clothes.white_8_bit_fishfry', 1020);
ClothesGear.black8BitFishfry = new ClothesGear('gear.clothes.black_8_bit_fishfry', 1021);
ClothesGear.whiteAnchorTee = new ClothesGear('gear.clothes.white_anchor_tee', 1022);
ClothesGear.blackAnchorTee = new ClothesGear('gear.clothes.black_anchor_tee', 1023);
ClothesGear.carnivoreTee = new ClothesGear('gear.clothes.carnivore_tee', 1026);
ClothesGear.pearlTee = new ClothesGear('gear.clothes.pearl_tee', 1027);
ClothesGear.octoTee = new ClothesGear('gear.clothes.octo_tee', 1028);
ClothesGear.herbivoreTee = new ClothesGear('gear.clothes.herbivore_tee', 1029);
ClothesGear.blackVNeckTee = new ClothesGear('gear.clothes.black_v_neck_tee', 1030);
ClothesGear.whiteDecaLogoTee = new ClothesGear('gear.clothes.white_deca_logo_tee', 1031);
ClothesGear.halfSleeveSweater = new ClothesGear('gear.clothes.half_sleeve_sweater', 1032);
ClothesGear.kingJersey = new ClothesGear('gear.clothes.king_jersey', 1033);
ClothesGear.gray8BitFishfry = new ClothesGear('gear.clothes.gray_8_bit_fishfry', 1034);
ClothesGear.whiteVNeckTee = new ClothesGear('gear.clothes.white_v_neck_tee', 1035);
ClothesGear.whiteUrchinRockTee = new ClothesGear('gear.clothes.white_urchin_rock_tee', 1036);
ClothesGear.blackUrchinRockTee = new ClothesGear('gear.clothes.black_urchin_rock_tee', 1037);
ClothesGear.wetFloorBandTee = new ClothesGear('gear.clothes.wet_floor_band_tee', 1038);
ClothesGear.squidSquadBandTee = new ClothesGear('gear.clothes.squid_squad_band_tee', 1039);
ClothesGear.navyDecaLogoTee = new ClothesGear('gear.clothes.navy_deca_logo_tee', 1040);
ClothesGear.misterShrugTee = new ClothesGear('gear.clothes.mister_shrug_tee', 1041);
ClothesGear.chirpyChipsBandTee = new ClothesGear('gear.clothes.chirpy_chips_band_tee', 1042);
ClothesGear.hightideEraBandTee = new ClothesGear('gear.clothes.hightide_era_band_tee', 1043);
ClothesGear.redVNeckLimitedTee = new ClothesGear('gear.clothes.red_v_neck_limited_tee', 1044);
ClothesGear.greenVNeckLimitedTee = new ClothesGear('gear.clothes.green_v_neck_limited_tee', 1045);
ClothesGear.omega3Tee = new ClothesGear('gear.clothes.omega_3_tee', 1046);
ClothesGear.annakiPolpoPicTee = new ClothesGear('gear.clothes.annaki_polpo_pic_tee', 1047);
ClothesGear.firewaveTee = new ClothesGear('gear.clothes.firewave_tee', 1048);
ClothesGear.takorokaGalacticTieDye = new ClothesGear('gear.clothes.takoroka_galactic_tie_dye', 1049);
ClothesGear.takorokaRainbowTieDye = new ClothesGear('gear.clothes.takoroka_rainbow_tie_dye', 1050);
ClothesGear.missusShrugTee = new ClothesGear('gear.clothes.missus_shrug_tee', 1051);
ClothesGear.leagueTee = new ClothesGear('gear.clothes.league_tee', 1052);
ClothesGear.friendTee = new ClothesGear('gear.clothes.friend_tee', 1053);
ClothesGear.tentatekSloganTee = new ClothesGear('gear.clothes.tentatek_slogan_tee', 1054);
ClothesGear.icewaveTee = new ClothesGear('gear.clothes.icewave_tee', 1055);
ClothesGear.octokingHkJersey = new ClothesGear('gear.clothes.octoking_hk_jersey', 1056);
ClothesGear.dakroNanaTee = new ClothesGear('gear.clothes.dakro_nana_tee', 1057);
ClothesGear.dakroGoldenTee = new ClothesGear('gear.clothes.dakro_golden_tee', 1058);
ClothesGear.blackVelourOctokingTee = new ClothesGear('gear.clothes.black_velour_octoking_tee', 1059);
ClothesGear.swcLogoTee = new ClothesGear('gear.clothes.swc_logo_tee', 1061);
ClothesGear.greenVelourOctokingTee = new ClothesGear('gear.clothes.green_velour_octoking_tee', 1060);
ClothesGear.whiteStripedLs = new ClothesGear('gear.clothes.white_striped_ls', 2000);
ClothesGear.blackLs = new ClothesGear('gear.clothes.black_ls', 2001);
ClothesGear.purpleCamoLs = new ClothesGear('gear.clothes.purple_camo_ls', 2002);
ClothesGear.navyStripedLs = new ClothesGear('gear.clothes.navy_striped_ls', 2003);
ClothesGear.zekkoBaseballLs = new ClothesGear('gear.clothes.zekko_baseball_ls', 2004);
ClothesGear.varsityBaseballLs = new ClothesGear('gear.clothes.varsity_baseball_ls', 2005);
ClothesGear.blackBaseballLs = new ClothesGear('gear.clothes.black_baseball_ls', 2006);
ClothesGear.whiteBaseballLs = new ClothesGear('gear.clothes.white_baseball_ls', 2007);
ClothesGear.whiteLs = new ClothesGear('gear.clothes.white_ls', 2008);
ClothesGear.greenStripedLs = new ClothesGear('gear.clothes.green_striped_ls', 2009);
ClothesGear.squidmarkLs = new ClothesGear('gear.clothes.squidmark_ls', 2010);
ClothesGear.zinkLs = new ClothesGear('gear.clothes.zink_ls', 2011);
ClothesGear.stripedPeaksLs = new ClothesGear('gear.clothes.striped_peaks_ls', 2012);
ClothesGear.pinkEasyStripeShirt = new ClothesGear('gear.clothes.pink_easy_stripe_shirt', 2013);
ClothesGear.inkopolisSquapsJersey = new ClothesGear('gear.clothes.inkopolis_squaps_jersey', 2014);
ClothesGear.annakiDriveTee = new ClothesGear('gear.clothes.annaki_drive_tee', 2015);
ClothesGear.limeEasyStripeShirt = new ClothesGear('gear.clothes.lime_easy_stripe_shirt', 2016);
ClothesGear.annakiEvolutionTee = new ClothesGear('gear.clothes.annaki_evolution_tee', 2017);
ClothesGear.zekkoLongCarrotTee = new ClothesGear('gear.clothes.zekko_long_carrot_tee', 2018);
ClothesGear.zekkoLongRadishTee = new ClothesGear('gear.clothes.zekko_long_radish_tee', 2019);
ClothesGear.blackCuttlegearLs = new ClothesGear('gear.clothes.black_cuttlegear_ls', 2020);
ClothesGear.takorokaCrazyBaseballLs = new ClothesGear('gear.clothes.takoroka_crazy_baseball_ls', 2021);
ClothesGear.redCuttlegearLs = new ClothesGear('gear.clothes.red_cuttlegear_ls', 2022);
ClothesGear.khaki16BitFishfry = new ClothesGear('gear.clothes.khaki_16_bit_fishfry', 2023);
ClothesGear.blue16BitFishfry = new ClothesGear('gear.clothes.blue_16_bit_fishfry', 2024);
ClothesGear.whiteLayeredLs = new ClothesGear('gear.clothes.white_layered_ls', 3000);
ClothesGear.yellowLayeredLs = new ClothesGear('gear.clothes.yellow_layered_ls', 3001);
ClothesGear.camoLayeredLs = new ClothesGear('gear.clothes.camo_layered_ls', 3002);
ClothesGear.blackLayeredLs = new ClothesGear('gear.clothes.black_layered_ls', 3003);
ClothesGear.zinkLayeredLs = new ClothesGear('gear.clothes.zink_layered_ls', 3004);
ClothesGear.layeredAnchorLs = new ClothesGear('gear.clothes.layered_anchor_ls', 3005);
ClothesGear.chocoLayeredLs = new ClothesGear('gear.clothes.choco_layered_ls', 3006);
ClothesGear.partTimePirate = new ClothesGear('gear.clothes.part_time_pirate', 3007);
ClothesGear.layeredVectorLs = new ClothesGear('gear.clothes.layered_vector_ls', 3008);
ClothesGear.greenTee = new ClothesGear('gear.clothes.green_tee', 3009);
ClothesGear.redTentatekTee = new ClothesGear('gear.clothes.red_tentatek_tee', 3010);
ClothesGear.blueTentatekTee = new ClothesGear('gear.clothes.blue_tentatek_tee', 3011);
ClothesGear.octoLayeredLs = new ClothesGear('gear.clothes.octo_layered_ls', 3012);
ClothesGear.squidYellowLayeredLs = new ClothesGear('gear.clothes.squid_yellow_layered_ls', 3013);
ClothesGear.shrimpPinkPolo = new ClothesGear('gear.clothes.shrimp_pink_polo', 4000);
ClothesGear.stripedRugby = new ClothesGear('gear.clothes.striped_rugby', 4001);
ClothesGear.tricolorRugby = new ClothesGear('gear.clothes.tricolor_rugby', 4002);
ClothesGear.sagePolo = new ClothesGear('gear.clothes.sage_polo', 4003);
ClothesGear.blackPolo = new ClothesGear('gear.clothes.black_polo', 4004);
ClothesGear.cyclingShirt = new ClothesGear('gear.clothes.cycling_shirt', 4005);
ClothesGear.cycleKingJersey = new ClothesGear('gear.clothes.cycle_king_jersey', 4006);
ClothesGear.slipstreamUnited = new ClothesGear('gear.clothes.slipstream_united', 4007);
ClothesGear.fcAlbacore = new ClothesGear('gear.clothes.fc_albacore', 4008);
ClothesGear.oliveSkiJacket = new ClothesGear('gear.clothes.olive_ski_jacket', 5000);
ClothesGear.takorokaNylonVintage = new ClothesGear('gear.clothes.takoroka_nylon_vintage', 5001);
ClothesGear.berrySkiJacket = new ClothesGear('gear.clothes.berry_ski_jacket', 5002);
ClothesGear.varsityJacket = new ClothesGear('gear.clothes.varsity_jacket', 5003);
ClothesGear.schoolJersey = new ClothesGear('gear.clothes.school_jersey', 5004);
ClothesGear.greenCardigan = new ClothesGear('gear.clothes.green_cardigan', 5005);
ClothesGear.blackInkyRider = new ClothesGear('gear.clothes.black_inky_rider', 5006);
ClothesGear.whiteInkyRider = new ClothesGear('gear.clothes.white_inky_rider', 5007);
ClothesGear.retroGamerJersey = new ClothesGear('gear.clothes.retro_gamer_jersey', 5008);
ClothesGear.orangeCardigan = new ClothesGear('gear.clothes.orange_cardigan', 5009);
ClothesGear.forgeInklingParka = new ClothesGear('gear.clothes.forge_inkling_parka', 5010);
ClothesGear.forgeOctarianJacket = new ClothesGear('gear.clothes.forge_octarian_jacket', 5011);
ClothesGear.blueSailorSuit = new ClothesGear('gear.clothes.blue_sailor_suit', 5012);
ClothesGear.whiteSailorSuit = new ClothesGear('gear.clothes.white_sailor_suit', 5013);
ClothesGear.squidSatinJacket = new ClothesGear('gear.clothes.squid_satin_jacket', 5014);
ClothesGear.zapfishSatinJacket = new ClothesGear('gear.clothes.zapfish_satin_jacket', 5015);
ClothesGear.krakOn528 = new ClothesGear('gear.clothes.krak_on_528', 5016);
ClothesGear.chillyMountainCoat = new ClothesGear('gear.clothes.chilly_mountain_coat', 5017);
ClothesGear.takorokaWindcrusher = new ClothesGear('gear.clothes.takoroka_windcrusher', 5018);
ClothesGear.matchaDownJacket = new ClothesGear('gear.clothes.matcha_down_jacket', 5019);
ClothesGear.fa01Jacket = new ClothesGear('gear.clothes.fa_01_jacket', 5020);
ClothesGear.fa01Reversed = new ClothesGear('gear.clothes.fa_01_reversed', 5021);
ClothesGear.pulloverCoat = new ClothesGear('gear.clothes.pullover_coat', 5022);
ClothesGear.kensaCoat = new ClothesGear('gear.clothes.kensa_coat', 5023);
ClothesGear.birdedCorduroyJacket = new ClothesGear('gear.clothes.birded_corduroy_jacket', 5024);
ClothesGear.deepOctoSatinJacket = new ClothesGear('gear.clothes.deep_octo_satin_jacket', 5025);
ClothesGear.zekkoRedleafCoat = new ClothesGear('gear.clothes.zekko_redleaf_coat', 5026);
ClothesGear.eggplantMountainCoat = new ClothesGear('gear.clothes.eggplant_mountain_coat', 5027);
ClothesGear.zekkoJadeCoat = new ClothesGear('gear.clothes.zekko_jade_coat', 5028);
ClothesGear.lightBomberJacket = new ClothesGear('gear.clothes.light_bomber_jacket', 5029);
ClothesGear.brownFa11Bomber = new ClothesGear('gear.clothes.brown_fa_11_bomber', 5030);
ClothesGear.grayFa11Bomber = new ClothesGear('gear.clothes.gray_fa_11_bomber', 5031);
ClothesGear.kingBenchKaiser = new ClothesGear('gear.clothes.king_bench_kaiser', 5032);
ClothesGear.navyEminenceJacket = new ClothesGear('gear.clothes.navy_eminence_jacket', 5033);
ClothesGear.tumericZekkoCoat = new ClothesGear('gear.clothes.tumeric_zekko_coat', 5034);
ClothesGear.customPaintedF3 = new ClothesGear('gear.clothes.custom_painted_f_3', 5035);
ClothesGear.darkBomberJacket = new ClothesGear('gear.clothes.dark_bomber_jacket', 5036);
ClothesGear.moistGhillieSuit = new ClothesGear('gear.clothes.moist_ghillie_suit', 5037);
ClothesGear.whiteLeatherF3 = new ClothesGear('gear.clothes.white_leather_f_3', 5038);
ClothesGear.chiliPepperSkiJacket = new ClothesGear('gear.clothes.chili_pepper_ski_jacket', 5039);
ClothesGear.whaleKnitSweater = new ClothesGear('gear.clothes.whale_knit_sweater', 5040);
ClothesGear.rockinLeatherJacket = new ClothesGear('gear.clothes.rockin_leather_jacket', 5041);
ClothesGear.kungFuZipUp = new ClothesGear('gear.clothes.kung_fu_zip_up', 5042);
ClothesGear.pandaKungFuZipUp = new ClothesGear('gear.clothes.panda_kung_fu_zip_up', 5043);
ClothesGear.sennyuSuit = new ClothesGear('gear.clothes.sennyu_suit', 5044);
ClothesGear.bBallJerseyHome = new ClothesGear('gear.clothes.b_ball_jersey_home', 6000);
ClothesGear.bBallJerseyAway = new ClothesGear('gear.clothes.b_ball_jersey_away', 6001);
ClothesGear.whiteKingTank = new ClothesGear('gear.clothes.white_king_tank', 6003);
ClothesGear.slashKingTank = new ClothesGear('gear.clothes.slash_king_tank', 6004);
ClothesGear.navyKingTank = new ClothesGear('gear.clothes.navy_king_tank', 6005);
ClothesGear.lobStarsJersey = new ClothesGear('gear.clothes.lob_stars_jersey', 6006);
ClothesGear.grayCollegeSweat = new ClothesGear('gear.clothes.gray_college_sweat', 7000);
ClothesGear.squidmarkSweat = new ClothesGear('gear.clothes.squidmark_sweat', 7001);
ClothesGear.retroSweat = new ClothesGear('gear.clothes.retro_sweat', 7002);
ClothesGear.firefinNavySweat = new ClothesGear('gear.clothes.firefin_navy_sweat', 7003);
ClothesGear.navyCollegeSweat = new ClothesGear('gear.clothes.navy_college_sweat', 7004);
ClothesGear.reelSweat = new ClothesGear('gear.clothes.reel_sweat', 7005);
ClothesGear.anchorSweat = new ClothesGear('gear.clothes.anchor_sweat', 7006);
ClothesGear.negativeLongcuffSweater = new ClothesGear('gear.clothes.negative_longcuff_sweater', 7007);
ClothesGear.shortKnitLayers = new ClothesGear('gear.clothes.short_knit_layers', 7008);
ClothesGear.positiveLongcuffSweater = new ClothesGear('gear.clothes.positive_longcuff_sweater', 7009);
ClothesGear.annakiBlueCuff = new ClothesGear('gear.clothes.annaki_blue_cuff', 7010);
ClothesGear.annakiYellowCuff = new ClothesGear('gear.clothes.annaki_yellow_cuff', 7011);
ClothesGear.annakiRedCuff = new ClothesGear('gear.clothes.annaki_red_cuff', 7012);
ClothesGear.nPacerSweat = new ClothesGear('gear.clothes.n_pacer_sweat', 7013);
ClothesGear.octarianRetro = new ClothesGear('gear.clothes.octarian_retro', 7014);
ClothesGear.takorokaJersey = new ClothesGear('gear.clothes.takoroka_jersey', 7015);
ClothesGear.lumberjackShirt = new ClothesGear('gear.clothes.lumberjack_shirt', 8000);
ClothesGear.rodeoShirt = new ClothesGear('gear.clothes.rodeo_shirt', 8001);
ClothesGear.greenCheckShirt = new ClothesGear('gear.clothes.green_check_shirt', 8002);
ClothesGear.whiteShirt = new ClothesGear('gear.clothes.white_shirt', 8003);
ClothesGear.urchinsJersey = new ClothesGear('gear.clothes.urchins_jersey', 8004);
ClothesGear.alohaShirt = new ClothesGear('gear.clothes.aloha_shirt', 8005);
ClothesGear.redCheckShirt = new ClothesGear('gear.clothes.red_check_shirt', 8006);
ClothesGear.babyJellyShirt = new ClothesGear('gear.clothes.baby_jelly_shirt', 8007);
ClothesGear.baseballJersey = new ClothesGear('gear.clothes.baseball_jersey', 8008);
ClothesGear.grayMixedShirt = new ClothesGear('gear.clothes.gray_mixed_shirt', 8009);
ClothesGear.vintageCheckShirt = new ClothesGear('gear.clothes.vintage_check_shirt', 8010);
ClothesGear.roundCollarShirt = new ClothesGear('gear.clothes.round_collar_shirt', 8011);
ClothesGear.logoAlohaShirt = new ClothesGear('gear.clothes.logo_aloha_shirt', 8012);
ClothesGear.stripedShirt = new ClothesGear('gear.clothes.striped_shirt', 8013);
ClothesGear.linenShirt = new ClothesGear('gear.clothes.linen_shirt', 8014);
ClothesGear.shirtAndTie = new ClothesGear('gear.clothes.shirt_and_tie', 8015);
ClothesGear.hulaPunkShirt = new ClothesGear('gear.clothes.hula_punk_shirt', 8017);
ClothesGear.octobowlerShirt = new ClothesGear('gear.clothes.octobowler_shirt', 8018);
ClothesGear.inkfallShirt = new ClothesGear('gear.clothes.inkfall_shirt', 8019);
ClothesGear.crimsonParashooter = new ClothesGear('gear.clothes.crimson_parashooter', 8020);
ClothesGear.babyJellyShirtAndTie = new ClothesGear('gear.clothes.baby_jelly_shirt_and_tie', 8021);
ClothesGear.pruneParashooter = new ClothesGear('gear.clothes.prune_parashooter', 8022);
ClothesGear.redHulaPunkWithTie = new ClothesGear('gear.clothes.red_hula_punk_with_tie', 8023);
ClothesGear.chiliOctoAloha = new ClothesGear('gear.clothes.chili_octo_aloha', 8024);
ClothesGear.annakiFlannelHoodie = new ClothesGear('gear.clothes.annaki_flannel_hoodie', 8025);
ClothesGear.inkWashShirt = new ClothesGear('gear.clothes.ink_wash_shirt', 8026);
ClothesGear.dotsOnDotsShirt = new ClothesGear('gear.clothes.dots_on_dots_shirt', 8027);
ClothesGear.toniKBaseballJersey = new ClothesGear('gear.clothes.toni_k_baseball_jersey', 8028);
ClothesGear.onlineJersey = new ClothesGear('gear.clothes.online_jersey', 8029);
ClothesGear.mountainVest = new ClothesGear('gear.clothes.mountain_vest', 9000);
ClothesGear.forestVest = new ClothesGear('gear.clothes.forest_vest', 9001);
ClothesGear.darkUrbanVest = new ClothesGear('gear.clothes.dark_urban_vest', 9002);
ClothesGear.yellowUrbanVest = new ClothesGear('gear.clothes.yellow_urban_vest', 9003);
ClothesGear.squidPatternWaistcoat = new ClothesGear('gear.clothes.squid_pattern_waistcoat', 9004);
ClothesGear.squidstarWaistcoat = new ClothesGear('gear.clothes.squidstar_waistcoat', 9005);
ClothesGear.fishingVest = new ClothesGear('gear.clothes.fishing_vest', 9007);
ClothesGear.frontZipVest = new ClothesGear('gear.clothes.front_zip_vest', 9008);
ClothesGear.silverTentatekVest = new ClothesGear('gear.clothes.silver_tentatek_vest', 9009);
ClothesGear.camoZipHoodie = new ClothesGear('gear.clothes.camo_zip_hoodie', 10000);
ClothesGear.greenZipHoodie = new ClothesGear('gear.clothes.green_zip_hoodie', 10001);
ClothesGear.zekkoHoodie = new ClothesGear('gear.clothes.zekko_hoodie', 10002);
ClothesGear.shirtWithBlueHoodie = new ClothesGear('gear.clothes.shirt_with_blue_hoodie', 10004);
ClothesGear.grapeHoodie = new ClothesGear('gear.clothes.grape_hoodie', 10005);
ClothesGear.grayHoodie = new ClothesGear('gear.clothes.gray_hoodie', 10006);
ClothesGear.hothouseHoodie = new ClothesGear('gear.clothes.hothouse_hoodie', 10007);
ClothesGear.pinkHoodie = new ClothesGear('gear.clothes.pink_hoodie', 10008);
ClothesGear.oliveZekkoParka = new ClothesGear('gear.clothes.olive_zekko_parka', 10009);
ClothesGear.blackHoodie = new ClothesGear('gear.clothes.black_hoodie', 10010);
ClothesGear.octoSupportHoodie = new ClothesGear('gear.clothes.octo_support_hoodie', 10011);
ClothesGear.squiddorPolo = new ClothesGear('gear.clothes.squiddor_polo', 21000);
ClothesGear.anchorLifeVest = new ClothesGear('gear.clothes.anchor_life_vest', 21001);
ClothesGear.juiceParka = new ClothesGear('gear.clothes.juice_parka', 21002);
ClothesGear.gardenGear = new ClothesGear('gear.clothes.garden_gear', 21003);
ClothesGear.crustwearXxl = new ClothesGear('gear.clothes.crustwear_xxl', 21004);
ClothesGear.northCountryParka = new ClothesGear('gear.clothes.north_country_parka', 21005);
ClothesGear.octoleetArmor = new ClothesGear('gear.clothes.octoleet_armor', 21006);
ClothesGear.recordShopLookEp = new ClothesGear('gear.clothes.record_shop_look_ep', 21007);
ClothesGear.devUniform = new ClothesGear('gear.clothes.dev_uniform', 21008);
ClothesGear.officeAttire = new ClothesGear('gear.clothes.office_attire', 21009);
ClothesGear.srlCoat = new ClothesGear('gear.clothes.srl_coat', 21010);
ClothesGear.mechaBodyAkm = new ClothesGear('gear.clothes.mecha_body_akm', 22000);
ClothesGear.splatfestTeeReplica = new ClothesGear('gear.clothes.splatfest_tee_replica', 23000);
ClothesGear.schoolUniform = new ClothesGear('gear.clothes.school_uniform', 25000);
ClothesGear.samuraiJacket = new ClothesGear('gear.clothes.samurai_jacket', 25001);
ClothesGear.powerArmor = new ClothesGear('gear.clothes.power_armor', 25002);
ClothesGear.schoolCardigan = new ClothesGear('gear.clothes.school_cardigan', 25003);
ClothesGear.squinjaSuit = new ClothesGear('gear.clothes.squinja_suit', 25004);
ClothesGear.powerArmorMkI = new ClothesGear('gear.clothes.power_armor_mk_i', 25005);
ClothesGear.pearlescentHoodie = new ClothesGear('gear.clothes.pearlescent_hoodie', 25006);
ClothesGear.marinatedTop = new ClothesGear('gear.clothes.marinated_top', 25007);
ClothesGear.enchantedRobe = new ClothesGear('gear.clothes.enchanted_robe', 25008);
ClothesGear.steelPlatemail = new ClothesGear('gear.clothes.steel_platemail', 25009);
ClothesGear.freshFishGloves = new ClothesGear('gear.clothes.fresh_fish_gloves', 25010);
ClothesGear.splatfestTee = new ClothesGear('gear.clothes.splatfest_tee', 26000);
ClothesGear.heroJacketReplica = new ClothesGear('gear.clothes.hero_jacket_replica', 27000);
ClothesGear.armorJacketReplica = new ClothesGear('gear.clothes.armor_jacket_replica', 27004);
ClothesGear.heroHoodieReplica = new ClothesGear('gear.clothes.hero_hoodie_replica', 27101);
ClothesGear.neoOctolingArmor = new ClothesGear('gear.clothes.neo_octoling_armor', 27104);
ClothesGear.nullArmorReplica = new ClothesGear('gear.clothes.null_armor_replica', 27105);
ClothesGear.oldTimeyClothes = new ClothesGear('gear.clothes.old_timey_clothes', 27106);

Object.freeze(ClothesGear);

class ShoesGear extends BaseGear {
  constructor(name, value) {
    super(name, GearType.shoes, value);
  }

  static parse = id => {
    switch (id) {
      case 1:
        return ShoesGear.creamBasics;
      case 1000:
        return ShoesGear.blueLoTops;
      case 1001:
        return ShoesGear.bananaBasics;
      case 1002:
        return ShoesGear.leLoTops;
      case 1003:
        return ShoesGear.whiteSeahorses;
      case 1004:
        return ShoesGear.orangeLoTops;
      case 1005:
        return ShoesGear.blackSeahorses;
      case 1006:
        return ShoesGear.clownfishBasics;
      case 1007:
        return ShoesGear.yellowSeahorses;
      case 1008:
        return ShoesGear.strappingWhites;
      case 1009:
        return ShoesGear.strappingReds;
      case 1010:
        return ShoesGear.soccerShoes;
      case 1011:
        return ShoesGear.leSoccerShoes;
      case 1012:
        return ShoesGear.sunnyClimbingShoes;
      case 1013:
        return ShoesGear.birchClimbingShoes;
      case 1014:
        return ShoesGear.greenLaceups;
      case 1015:
        return ShoesGear.whiteLacelessDakroniks;
      case 1016:
        return ShoesGear.blueLacelessDakroniks;
      case 1017:
        return ShoesGear.suedeGrayLaceUps;
      case 1018:
        return ShoesGear.suedeNationLaceUps;
      case 1019:
        return ShoesGear.suedeMarineLaceUps;
      case 1020:
        return ShoesGear.toniKensaSoccerShoes;
      case 2000:
        return ShoesGear.redHiHorses;
      case 2001:
        return ShoesGear.zombieHiHorses;
      case 2002:
        return ShoesGear.creamHiTops;
      case 2003:
        return ShoesGear.purpleHiHorses;
      case 2004:
        return ShoesGear.hunterHiTops;
      case 2005:
        return ShoesGear.redHiTops;
      case 2006:
        return ShoesGear.goldHiHorses;
      case 2008:
        return ShoesGear.sharkMoccasins;
      case 2009:
        return ShoesGear.mawcasins;
      case 2010:
        return ShoesGear.chocolateDakroniks;
      case 2011:
        return ShoesGear.mintDakroniks;
      case 2012:
        return ShoesGear.blackDakroniks;
      case 2013:
        return ShoesGear.piranhaMoccasins;
      case 2014:
        return ShoesGear.whiteNorimaki750S;
      case 2015:
        return ShoesGear.blackNorimaki750S;
      case 2016:
        return ShoesGear.sunsetOrcaHiTops;
      case 2017:
        return ShoesGear.redAndBlackSquidkidIv;
      case 2018:
        return ShoesGear.blueAndBlackSquidkidIv;
      case 2019:
        return ShoesGear.graySeaSlugHiTops;
      case 2020:
        return ShoesGear.orcaHiTops;
      case 2021:
        return ShoesGear.imperialKaiser;
      case 2022:
        return ShoesGear.navyEnperrials;
      case 2023:
        return ShoesGear.amberSeaSlugHiTops;
      case 2024:
        return ShoesGear.yellowIromaki750S;
      case 2025:
        return ShoesGear.redAndWhiteSquidkidV;
      case 2026:
        return ShoesGear.honeyAndOrangeSquidkidV;
      case 2027:
        return ShoesGear.sunAndShadeSquidkidIv;
      case 2028:
        return ShoesGear.orcaWovenHiTops;
      case 2029:
        return ShoesGear.greenIromaki750S;
      case 2030:
        return ShoesGear.purpleIromaki750S;
      case 2031:
        return ShoesGear.redIromaki750S;
      case 2032:
        return ShoesGear.blueIromaki750S;
      case 2033:
        return ShoesGear.orangeIromaki750S;
      case 2034:
        return ShoesGear.redPowerStripes;
      case 2035:
        return ShoesGear.bluePowerStripes;
      case 2036:
        return ShoesGear.toniKensaBlackHiTops;
      case 2037:
        return ShoesGear.sesameSalt270S;
      case 2038:
        return ShoesGear.blackAndBlueSquidkidV;
      case 2039:
        return ShoesGear.orcaPassionHiTops;
      case 2040:
        return ShoesGear.truffleCanvasHiTops;
      case 2041:
        return ShoesGear.onlineSquidkidV;
      case 3000:
        return ShoesGear.pinkTrainers;
      case 3001:
        return ShoesGear.orangeArrows;
      case 3002:
        return ShoesGear.neonSeaSlugs;
      case 3003:
        return ShoesGear.whiteArrows;
      case 3004:
        return ShoesGear.cyanTrainers;
      case 3005:
        return ShoesGear.blueSeaSlugs;
      case 3006:
        return ShoesGear.redSeaSlugs;
      case 3007:
        return ShoesGear.purpleSeaSlugs;
      case 3008:
        return ShoesGear.crazyArrows;
      case 3009:
        return ShoesGear.blackTrainers;
      case 3010:
        return ShoesGear.violetTrainers;
      case 3011:
        return ShoesGear.canaryTrainers;
      case 3012:
        return ShoesGear.yellowMeshSneakers;
      case 3013:
        return ShoesGear.arrowPullOns;
      case 3014:
        return ShoesGear.redMeshSneakers;
      case 3015:
        return ShoesGear.nPacerCao;
      case 3016:
        return ShoesGear.nPacerAg;
      case 3017:
        return ShoesGear.nPacerAu;
      case 3018:
        return ShoesGear.seaSlugVolt95S;
      case 3019:
        return ShoesGear.athleticArrows;
      case 4000:
        return ShoesGear.oysterClogs;
      case 4001:
        return ShoesGear.chocoClogs;
      case 4002:
        return ShoesGear.blueberryCasuals;
      case 4003:
        return ShoesGear.plumCasuals;
      case 4007:
        return ShoesGear.neonDeltaStraps;
      case 4008:
        return ShoesGear.blackFlipFlops;
      case 4009:
        return ShoesGear.snowDeltaStraps;
      case 4010:
        return ShoesGear.luminousDeltaStraps;
      case 4011:
        return ShoesGear.redFishfrySandals;
      case 4012:
        return ShoesGear.yellowFishfrySandals;
      case 4013:
        return ShoesGear.musselforgeFlipFlops;
      case 5000:
        return ShoesGear.trailBoots;
      case 5001:
        return ShoesGear.customTrailBoots;
      case 5002:
        return ShoesGear.proTrailBoots;
      case 6000:
        return ShoesGear.motoBoots;
      case 6001:
        return ShoesGear.tanWorkBoots;
      case 6002:
        return ShoesGear.redWorkBoots;
      case 6003:
        return ShoesGear.blueMotoBoots;
      case 6004:
        return ShoesGear.greenRainBoots;
      case 6005:
        return ShoesGear.acerolaRainBoots;
      case 6006:
        return ShoesGear.punkWhites;
      case 6007:
        return ShoesGear.punkCherries;
      case 6008:
        return ShoesGear.punkYellows;
      case 6009:
        return ShoesGear.bubbleRainBoots;
      case 6010:
        return ShoesGear.snowyDownBoots;
      case 6011:
        return ShoesGear.icyDownBoots;
      case 6012:
        return ShoesGear.huntingBoots;
      case 6013:
        return ShoesGear.punkBlacks;
      case 6014:
        return ShoesGear.deepseaLeatherBoots;
      case 6015:
        return ShoesGear.moistGhillieBoots;
      case 6016:
        return ShoesGear.annakiArachnoBoots;
      case 6017:
        return ShoesGear.newLeafLeatherBoots;
      case 6018:
        return ShoesGear.teaGreenHuntingBoots;
      case 7000:
        return ShoesGear.blueSlipOns;
      case 7001:
        return ShoesGear.redSlipOns;
      case 7002:
        return ShoesGear.squidStitchSlipOns;
      case 7003:
        return ShoesGear.polkaDotSlipOns;
      case 8000:
        return ShoesGear.whiteKicks;
      case 8001:
        return ShoesGear.cherryKicks;
      case 8002:
        return ShoesGear.turquoiseKicks;
      case 8003:
        return ShoesGear.squinkWingtips;
      case 8004:
        return ShoesGear.roastedBrogues;
      case 8005:
        return ShoesGear.kidClams;
      case 8006:
        return ShoesGear.smokyWingtips;
      case 8007:
        return ShoesGear.navyRedSoledWingtips;
      case 8008:
        return ShoesGear.grayYellowSoledWingtips;
      case 8009:
        return ShoesGear.inkyKidClams;
      case 8010:
        return ShoesGear.annakiHabaneros;
      case 8011:
        return ShoesGear.annakiTigers;
      case 8012:
        return ShoesGear.sennyuInksoles;
      case 21001:
        return ShoesGear.angryRainBoots;
      case 21002:
        return ShoesGear.nonSlipSenseis;
      case 21003:
        return ShoesGear.octoleetBoots;
      case 21004:
        return ShoesGear.friendshipBracelet;
      case 21005:
        return ShoesGear.flipperFloppers;
      case 21006:
        return ShoesGear.woodenSandals;
      case 22000:
        return ShoesGear.mechaLegsLbs;
      case 23000:
        return ShoesGear.pearlScoutLaceUps;
      case 23001:
        return ShoesGear.pearlescentSquidkidIv;
      case 23002:
        return ShoesGear.pearlPunkCrowns;
      case 23003:
        return ShoesGear.newDayArrows;
      case 23004:
        return ShoesGear.marinationLaceUps;
      case 23005:
        return ShoesGear.rinaSquidkidIv;
      case 23006:
        return ShoesGear.trooperPowerStripes;
      case 23007:
        return ShoesGear.midnightSlipOns;
      case 25000:
        return ShoesGear.schoolShoes;
      case 25001:
        return ShoesGear.samuraiShoes;
      case 25002:
        return ShoesGear.powerBoots;
      case 25003:
        return ShoesGear.fringedLoafers;
      case 25004:
        return ShoesGear.squinjaBoots;
      case 25005:
        return ShoesGear.powerBootsMkI;
      case 25006:
        return ShoesGear.pearlescentKicks;
      case 25007:
        return ShoesGear.marinatedSlipOns;
      case 25008:
        return ShoesGear.enchantedBoots;
      case 25009:
        return ShoesGear.steelGreaves;
      case 25010:
        return ShoesGear.freshFishFeet;
      case 27000:
        return ShoesGear.heroRunnerReplicas;
      case 27004:
        return ShoesGear.armorBootReplicas;
      case 27101:
        return ShoesGear.heroSnowbootsReplicas;
      case 27104:
        return ShoesGear.neoOctolingBoots;
      case 27105:
        return ShoesGear.nullBootsReplica;
      case 27106:
        return ShoesGear.oldTimeyShoes;
      default:
        throw new RangeError();
    }
  };
}

ShoesGear.creamBasics = new ShoesGear('gear.shoes.cream_basics', 1);
ShoesGear.blueLoTops = new ShoesGear('gear.shoes.blue_lo_tops', 1000);
ShoesGear.bananaBasics = new ShoesGear('gear.shoes.banana_basics', 1001);
ShoesGear.leLoTops = new ShoesGear('gear.shoes.le_lo_tops', 1002);
ShoesGear.whiteSeahorses = new ShoesGear('gear.shoes.white_seahorses', 1003);
ShoesGear.orangeLoTops = new ShoesGear('gear.shoes.orange_lo_tops', 1004);
ShoesGear.blackSeahorses = new ShoesGear('gear.shoes.black_seahorses', 1005);
ShoesGear.clownfishBasics = new ShoesGear('gear.shoes.clownfish_basics', 1006);
ShoesGear.yellowSeahorses = new ShoesGear('gear.shoes.yellow_seahorses', 1007);
ShoesGear.strappingWhites = new ShoesGear('gear.shoes.strapping_whites', 1008);
ShoesGear.strappingReds = new ShoesGear('gear.shoes.strapping_reds', 1009);
ShoesGear.soccerShoes = new ShoesGear('gear.shoes.soccer_shoes', 1010);
ShoesGear.leSoccerShoes = new ShoesGear('gear.shoes.le_soccer_shoes', 1011);
ShoesGear.sunnyClimbingShoes = new ShoesGear('gear.shoes.sunny_climbing_shoes', 1012);
ShoesGear.birchClimbingShoes = new ShoesGear('gear.shoes.birch_climbing_shoes', 1013);
ShoesGear.greenLaceups = new ShoesGear('gear.shoes.green_laceups', 1014);
ShoesGear.whiteLacelessDakroniks = new ShoesGear('gear.shoes.white_laceless_dakroniks', 1015);
ShoesGear.blueLacelessDakroniks = new ShoesGear('gear.shoes.blue_laceless_dakroniks', 1016);
ShoesGear.suedeGrayLaceUps = new ShoesGear('gear.shoes.suede_gray_lace_ups', 1017);
ShoesGear.suedeNationLaceUps = new ShoesGear('gear.shoes.suede_nation_lace_ups', 1018);
ShoesGear.suedeMarineLaceUps = new ShoesGear('gear.shoes.suede_marine_lace_ups', 1019);
ShoesGear.toniKensaSoccerShoes = new ShoesGear('gear.shoes.toni_kensa_soccer_shoes', 1020);
ShoesGear.redHiHorses = new ShoesGear('gear.shoes.red_hi_horses', 2000);
ShoesGear.zombieHiHorses = new ShoesGear('gear.shoes.zombie_hi_horses', 2001);
ShoesGear.creamHiTops = new ShoesGear('gear.shoes.cream_hi_tops', 2002);
ShoesGear.purpleHiHorses = new ShoesGear('gear.shoes.purple_hi_horses', 2003);
ShoesGear.hunterHiTops = new ShoesGear('gear.shoes.hunter_hi_tops', 2004);
ShoesGear.redHiTops = new ShoesGear('gear.shoes.red_hi_tops', 2005);
ShoesGear.goldHiHorses = new ShoesGear('gear.shoes.gold_hi_horses', 2006);
ShoesGear.sharkMoccasins = new ShoesGear('gear.shoes.shark_moccasins', 2008);
ShoesGear.mawcasins = new ShoesGear('gear.shoes.mawcasins', 2009);
ShoesGear.chocolateDakroniks = new ShoesGear('gear.shoes.chocolate_dakroniks', 2010);
ShoesGear.mintDakroniks = new ShoesGear('gear.shoes.mint_dakroniks', 2011);
ShoesGear.blackDakroniks = new ShoesGear('gear.shoes.black_dakroniks', 2012);
ShoesGear.piranhaMoccasins = new ShoesGear('gear.shoes.piranha_moccasins', 2013);
ShoesGear.whiteNorimaki750S = new ShoesGear('gear.shoes.white_norimaki_750s', 2014);
ShoesGear.blackNorimaki750S = new ShoesGear('gear.shoes.black_norimaki_750s', 2015);
ShoesGear.sunsetOrcaHiTops = new ShoesGear('gear.shoes.sunset_orca_hi_tops', 2016);
ShoesGear.redAndBlackSquidkidIv = new ShoesGear('gear.shoes.red_and_black_squidkid_iv', 2017);
ShoesGear.blueAndBlackSquidkidIv = new ShoesGear('gear.shoes.blue_and_black_squidkid_iv', 2018);
ShoesGear.graySeaSlugHiTops = new ShoesGear('gear.shoes.gray_sea_slug_hi_tops', 2019);
ShoesGear.orcaHiTops = new ShoesGear('gear.shoes.orca_hi_tops', 2020);
ShoesGear.imperialKaiser = new ShoesGear('gear.shoes.imperial_kaiser', 2021);
ShoesGear.navyEnperrials = new ShoesGear('gear.shoes.navy_enperrials', 2022);
ShoesGear.amberSeaSlugHiTops = new ShoesGear('gear.shoes.amber_sea_slug_hi_tops', 2023);
ShoesGear.yellowIromaki750S = new ShoesGear('gear.shoes.yellow_iromaki_750s', 2024);
ShoesGear.redAndWhiteSquidkidV = new ShoesGear('gear.shoes.red_and_white_squidkid_v', 2025);
ShoesGear.honeyAndOrangeSquidkidV = new ShoesGear('gear.shoes.honey_and_orange_squidkid_v', 2026);
ShoesGear.sunAndShadeSquidkidIv = new ShoesGear('gear.shoes.sun_and_shade_squidkid_iv', 2027);
ShoesGear.orcaWovenHiTops = new ShoesGear('gear.shoes.orca_woven_hi_tops', 2028);
ShoesGear.greenIromaki750S = new ShoesGear('gear.shoes.green_iromaki_750s', 2029);
ShoesGear.purpleIromaki750S = new ShoesGear('gear.shoes.purple_iromaki_750s', 2030);
ShoesGear.redIromaki750S = new ShoesGear('gear.shoes.red_iromaki_750s', 2031);
ShoesGear.blueIromaki750S = new ShoesGear('gear.shoes.blue_iromaki_750s', 2032);
ShoesGear.orangeIromaki750S = new ShoesGear('gear.shoes.orange_iromaki_750s', 2033);
ShoesGear.redPowerStripes = new ShoesGear('gear.shoes.red_power_stripes', 2034);
ShoesGear.bluePowerStripes = new ShoesGear('gear.shoes.blue_power_stripes', 2035);
ShoesGear.toniKensaBlackHiTops = new ShoesGear('gear.shoes.toni_kensa_black_hi_tops', 2036);
ShoesGear.sesameSalt270S = new ShoesGear('gear.shoes.sesame_salt_270s', 2037);
ShoesGear.blackAndBlueSquidkidV = new ShoesGear('gear.shoes.black_and_blue_squidkid_v', 2038);
ShoesGear.orcaPassionHiTops = new ShoesGear('gear.shoes.orca_passion_hi_tops', 2039);
ShoesGear.truffleCanvasHiTops = new ShoesGear('gear.shoes.truffle_canvas_hi_tops', 2040);
ShoesGear.onlineSquidkidV = new ShoesGear('gear.shoes.online_squidkid_v', 2041);
ShoesGear.pinkTrainers = new ShoesGear('gear.shoes.pink_trainers', 3000);
ShoesGear.orangeArrows = new ShoesGear('gear.shoes.orange_arrows', 3001);
ShoesGear.neonSeaSlugs = new ShoesGear('gear.shoes.neon_sea_slugs', 3002);
ShoesGear.whiteArrows = new ShoesGear('gear.shoes.white_arrows', 3003);
ShoesGear.cyanTrainers = new ShoesGear('gear.shoes.cyan_trainers', 3004);
ShoesGear.blueSeaSlugs = new ShoesGear('gear.shoes.blue_sea_slugs', 3005);
ShoesGear.redSeaSlugs = new ShoesGear('gear.shoes.red_sea_slugs', 3006);
ShoesGear.purpleSeaSlugs = new ShoesGear('gear.shoes.purple_sea_slugs', 3007);
ShoesGear.crazyArrows = new ShoesGear('gear.shoes.crazy_arrows', 3008);
ShoesGear.blackTrainers = new ShoesGear('gear.shoes.black_trainers', 3009);
ShoesGear.violetTrainers = new ShoesGear('gear.shoes.violet_trainers', 3010);
ShoesGear.canaryTrainers = new ShoesGear('gear.shoes.canary_trainers', 3011);
ShoesGear.yellowMeshSneakers = new ShoesGear('gear.shoes.yellow_mesh_sneakers', 3012);
ShoesGear.arrowPullOns = new ShoesGear('gear.shoes.arrow_pull_ons', 3013);
ShoesGear.redMeshSneakers = new ShoesGear('gear.shoes.red_mesh_sneakers', 3014);
ShoesGear.nPacerCao = new ShoesGear('gear.shoes.n_pacer_cao', 3015);
ShoesGear.nPacerAg = new ShoesGear('gear.shoes.n_pacer_ag', 3016);
ShoesGear.nPacerAu = new ShoesGear('gear.shoes.n_pacer_au', 3017);
ShoesGear.seaSlugVolt95S = new ShoesGear('gear.shoes.sea_slug_volt_95s', 3018);
ShoesGear.athleticArrows = new ShoesGear('gear.shoes.athletic_arrows', 3019);
ShoesGear.oysterClogs = new ShoesGear('gear.shoes.oyster_clogs', 4000);
ShoesGear.chocoClogs = new ShoesGear('gear.shoes.choco_clogs', 4001);
ShoesGear.blueberryCasuals = new ShoesGear('gear.shoes.blueberry_casuals', 4002);
ShoesGear.plumCasuals = new ShoesGear('gear.shoes.plum_casuals', 4003);
ShoesGear.neonDeltaStraps = new ShoesGear('gear.shoes.neon_delta_straps', 4007);
ShoesGear.blackFlipFlops = new ShoesGear('gear.shoes.black_flip_flops', 4008);
ShoesGear.snowDeltaStraps = new ShoesGear('gear.shoes.snow_delta_straps', 4009);
ShoesGear.luminousDeltaStraps = new ShoesGear('gear.shoes.luminous_delta_straps', 4010);
ShoesGear.redFishfrySandals = new ShoesGear('gear.shoes.red_fishfry_sandals', 4011);
ShoesGear.yellowFishfrySandals = new ShoesGear('gear.shoes.yellow_fishfry_sandals', 4012);
ShoesGear.musselforgeFlipFlops = new ShoesGear('gear.shoes.musselforge_flip_flops', 4013);
ShoesGear.trailBoots = new ShoesGear('gear.shoes.trail_boots', 5000);
ShoesGear.customTrailBoots = new ShoesGear('gear.shoes.custom_trail_boots', 5001);
ShoesGear.proTrailBoots = new ShoesGear('gear.shoes.pro_trail_boots', 5002);
ShoesGear.motoBoots = new ShoesGear('gear.shoes.moto_boots', 6000);
ShoesGear.tanWorkBoots = new ShoesGear('gear.shoes.tan_work_boots', 6001);
ShoesGear.redWorkBoots = new ShoesGear('gear.shoes.red_work_boots', 6002);
ShoesGear.blueMotoBoots = new ShoesGear('gear.shoes.blue_moto_boots', 6003);
ShoesGear.greenRainBoots = new ShoesGear('gear.shoes.green_rain_boots', 6004);
ShoesGear.acerolaRainBoots = new ShoesGear('gear.shoes.acerola_rain_boots', 6005);
ShoesGear.punkWhites = new ShoesGear('gear.shoes.punk_whites', 6006);
ShoesGear.punkCherries = new ShoesGear('gear.shoes.punk_cherries', 6007);
ShoesGear.punkYellows = new ShoesGear('gear.shoes.punk_yellows', 6008);
ShoesGear.bubbleRainBoots = new ShoesGear('gear.shoes.bubble_rain_boots', 6009);
ShoesGear.snowyDownBoots = new ShoesGear('gear.shoes.snowy_down_boots', 6010);
ShoesGear.icyDownBoots = new ShoesGear('gear.shoes.icy_down_boots', 6011);
ShoesGear.huntingBoots = new ShoesGear('gear.shoes.hunting_boots', 6012);
ShoesGear.punkBlacks = new ShoesGear('gear.shoes.punk_blacks', 6013);
ShoesGear.deepseaLeatherBoots = new ShoesGear('gear.shoes.deepsea_leather_boots', 6014);
ShoesGear.moistGhillieBoots = new ShoesGear('gear.shoes.moist_ghillie_boots', 6015);
ShoesGear.annakiArachnoBoots = new ShoesGear('gear.shoes.annaki_arachno_boots', 6016);
ShoesGear.newLeafLeatherBoots = new ShoesGear('gear.shoes.new_leaf_leather_boots', 6017);
ShoesGear.teaGreenHuntingBoots = new ShoesGear('gear.shoes.tea_green_hunting_boots', 6018);
ShoesGear.blueSlipOns = new ShoesGear('gear.shoes.blue_slip_ons', 7000);
ShoesGear.redSlipOns = new ShoesGear('gear.shoes.red_slip_ons', 7001);
ShoesGear.squidStitchSlipOns = new ShoesGear('gear.shoes.squid_stitch_slip_ons', 7002);
ShoesGear.polkaDotSlipOns = new ShoesGear('gear.shoes.polka_dot_slip_ons', 7003);
ShoesGear.whiteKicks = new ShoesGear('gear.shoes.white_kicks', 8000);
ShoesGear.cherryKicks = new ShoesGear('gear.shoes.cherry_kicks', 8001);
ShoesGear.turquoiseKicks = new ShoesGear('gear.shoes.turquoise_kicks', 8002);
ShoesGear.squinkWingtips = new ShoesGear('gear.shoes.squink_wingtips', 8003);
ShoesGear.roastedBrogues = new ShoesGear('gear.shoes.roasted_brogues', 8004);
ShoesGear.kidClams = new ShoesGear('gear.shoes.kid_clams', 8005);
ShoesGear.smokyWingtips = new ShoesGear('gear.shoes.smoky_wingtips', 8006);
ShoesGear.navyRedSoledWingtips = new ShoesGear('gear.shoes.navy_red_soled_wingtips', 8007);
ShoesGear.grayYellowSoledWingtips = new ShoesGear('gear.shoes.gray_yellow_soled_wingtips', 8008);
ShoesGear.inkyKidClams = new ShoesGear('gear.shoes.inky_kid_clams', 8009);
ShoesGear.annakiHabaneros = new ShoesGear('gear.shoes.annaki_habaneros', 8010);
ShoesGear.annakiTigers = new ShoesGear('gear.shoes.annaki_tigers', 8011);
ShoesGear.sennyuInksoles = new ShoesGear('gear.shoes.sennyu_inksoles', 8012);
ShoesGear.angryRainBoots = new ShoesGear('gear.shoes.angry_rain_boots', 21001);
ShoesGear.nonSlipSenseis = new ShoesGear('gear.shoes.non_slip_senseis', 21002);
ShoesGear.octoleetBoots = new ShoesGear('gear.shoes.octoleet_boots', 21003);
ShoesGear.friendshipBracelet = new ShoesGear('gear.shoes.friendship_bracelet', 21004);
ShoesGear.flipperFloppers = new ShoesGear('gear.shoes.flipper_floppers', 21005);
ShoesGear.woodenSandals = new ShoesGear('gear.shoes.wooden_sandals', 21006);
ShoesGear.mechaLegsLbs = new ShoesGear('gear.shoes.mecha_legs_lbs', 22000);
ShoesGear.pearlScoutLaceUps = new ShoesGear('gear.shoes.pearl_scout_lace_ups', 23000);
ShoesGear.pearlescentSquidkidIv = new ShoesGear('gear.shoes.pearlescent_squidkid_iv', 23001);
ShoesGear.pearlPunkCrowns = new ShoesGear('gear.shoes.pearl_punk_crowns', 23002);
ShoesGear.newDayArrows = new ShoesGear('gear.shoes.new_day_arrows', 23003);
ShoesGear.marinationLaceUps = new ShoesGear('gear.shoes.marination_lace_ups', 23004);
ShoesGear.rinaSquidkidIv = new ShoesGear('gear.shoes.rina_squidkid_iv', 23005);
ShoesGear.trooperPowerStripes = new ShoesGear('gear.shoes.trooper_power_stripes', 23006);
ShoesGear.midnightSlipOns = new ShoesGear('gear.shoes.midnight_slip_ons', 23007);
ShoesGear.schoolShoes = new ShoesGear('gear.shoes.school_shoes', 25000);
ShoesGear.samuraiShoes = new ShoesGear('gear.shoes.samurai_shoes', 25001);
ShoesGear.powerBoots = new ShoesGear('gear.shoes.power_boots', 25002);
ShoesGear.fringedLoafers = new ShoesGear('gear.shoes.fringed_loafers', 25003);
ShoesGear.squinjaBoots = new ShoesGear('gear.shoes.squinja_boots', 25004);
ShoesGear.powerBootsMkI = new ShoesGear('gear.shoes.power_boots_mk_i', 25005);
ShoesGear.pearlescentKicks = new ShoesGear('gear.shoes.pearlescent_kicks', 25006);
ShoesGear.marinatedSlipOns = new ShoesGear('gear.shoes.marinated_slip_ons', 25007);
ShoesGear.enchantedBoots = new ShoesGear('gear.shoes.enchanted_boots', 25008);
ShoesGear.steelGreaves = new ShoesGear('gear.shoes.steel_greaves', 25009);
ShoesGear.freshFishFeet = new ShoesGear('gear.shoes.fresh_fish_feet', 25010);
ShoesGear.heroRunnerReplicas = new ShoesGear('gear.shoes.hero_runner_replicas', 27000);
ShoesGear.armorBootReplicas = new ShoesGear('gear.shoes.armor_boot_replicas', 27004);
ShoesGear.heroSnowbootsReplicas = new ShoesGear('gear.shoes.hero_snowboots_replicas', 27101);
ShoesGear.neoOctolingBoots = new ShoesGear('gear.shoes.neo_octoling_boots', 27104);
ShoesGear.nullBootsReplica = new ShoesGear('gear.shoes.null_boots_replica', 27105);
ShoesGear.oldTimeyShoes = new ShoesGear('gear.shoes.old_timey_shoes', 27106);

Object.freeze(ShoesGear);

class Gear extends Base {
  constructor(e, gear, url, brand, primaryAbility, secondaryAbilities) {
    super(e);
    this.gear = gear;
    this.url = url;
    this.brand = brand;
    this.primaryAbility = primaryAbility;
    this.secondaryAbilities = secondaryAbilities;
  }

  static parse = (type, gearData, abilitiesData) => {
    try {
      let gear;
      switch (type) {
        case GearType.headgear:
          gear = HeadgearGear.parse(parseInt(gearData.id));
          break;
        case GearType.clothes:
          gear = ClothesGear.parse(parseInt(gearData.id));
          break;
        case GearType.shoes:
          gear = ShoesGear.parse(parseInt(gearData.id));
          break;
        default:
          throw new RangeError();
      }
      const brand = Brand.parse(gearData.brand);
      const primaryAbility = Ability.parsePrimary(abilitiesData.main);
      if (primaryAbility.error !== null) {
        // Handle previous error
        return new Gear(primaryAbility.error);
      }
      let secondaryAbilities = [];
      abilitiesData.subs.forEach(element => {
        if (element !== null) {
          const secondaryAbility = Ability.parseSecondary(element);
          secondaryAbilities.push(secondaryAbility);
        }
      });
      secondaryAbilities.forEach(element => {
        if (element.error !== null) {
          // Handle previous error
          return new Gear(element.error);
        }
      });
      return new Gear(null, gear, gearData.image, brand, primaryAbility, secondaryAbilities);
    } catch (e) {
      console.error(e);
      switch (type) {
        case GearType.headgear:
          return new Gear('can_not_parse_headgear_gear');
        case GearType.clothes:
          return new Gear('can_not_parse_clothes_gear');
        case GearType.shoes:
          return new Gear('can_not_parse_shoes_gear');
        default:
          return new Gear('can_not_parse_gear');
      }
    }
  };

  static parseHeadgear = (gearData, abilitiesData) => {
    return Gear.parse(GearType.headgear, gearData, abilitiesData);
  };

  static parseClothes = (gearData, abilitiesData) => {
    return Gear.parse(GearType.clothes, gearData, abilitiesData);
  };

  static parseShoes = (gearData, abilitiesData) => {
    return Gear.parse(GearType.shoes, gearData, abilitiesData);
  };

  static deserialize = (type, data) => {
    try {
      let gear;
      switch (type) {
        case GearType.headgear:
          gear = HeadgearGear.parse(parseInt(data.gear.value));
          break;
        case GearType.clothes:
          gear = ClothesGear.parse(parseInt(data.gear.value));
          break;
        case GearType.shoes:
          gear = ShoesGear.parse(parseInt(data.gear.value));
          break;
        default:
          throw new RangeError();
      }
      const brand = Brand.deserialize(data.brand);
      const primaryAbility = Ability.deserializePrimary(data.primaryAbility);
      if (primaryAbility.error !== null) {
        // Handle previous error
        return new Gear(primaryAbility.error);
      }
      let secondaryAbilities = [];
      data.secondaryAbilities.forEach(element => {
        if (element !== null) {
          const secondaryAbility = Ability.deserializeSecondary(element);
          secondaryAbilities.push(secondaryAbility);
        }
      });
      secondaryAbilities.forEach(element => {
        if (element.error !== null) {
          // Handle previous error
          return new Gear(element.error);
        }
      });
      return new Gear(null, gear, data.url, brand, primaryAbility, secondaryAbilities);
    } catch (e) {
      console.error(e);
      switch (type) {
        case GearType.headgear:
          return new Gear('can_not_deserialize_headgear_gear');
        case GearType.clothes:
          return new Gear('can_not_deserialize_clothes_gear');
        case GearType.shoes:
          return new Gear('can_not_deserialize_shoes_gear');
        default:
          return new Gear('can_not_deserialize_gear');
      }
    }
  };

  static deserializeHeadgear = data => {
    return Gear.deserialize(GearType.headgear, data);
  };

  static deserializeClothes = data => {
    return Gear.deserialize(GearType.clothes, data);
  };

  static deserializeShoes = data => {
    return Gear.deserialize(GearType.shoes, data);
  };
}

export { GearType, HeadgearGear, ClothesGear, ShoesGear, Gear };
