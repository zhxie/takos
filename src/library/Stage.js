import { ArgumentOutOfRangeError } from 'rxjs';

class Stage {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  static parse(id) {
    switch (id) {
      case 0:
        return Stage.theReef;
      case 1:
        return Stage.musselforgeFitness;
      case 2:
        return Stage.starfishMainstage;
      case 3:
        return Stage.sturgeonShipyard;
      case 4:
        return Stage.inkblotArtAcademy;
      case 5:
        return Stage.humpbackPumpTrack;
      case 6:
        return Stage.mantaMaria;
      case 7:
        return Stage.portMackerel;
      case 8:
        return Stage.morayTowers;
      case 9:
        return Stage.snapperCanal;
      case 10:
        return Stage.kelpDome;
      case 11:
        return Stage.blackbellySkatepark;
      case 12:
        return Stage.shellendorfInstitute;
      case 13:
        return Stage.makomart;
      case 14:
        return Stage.walleyeWarehouse;
      case 15:
        return Stage.arowanaMall;
      case 16:
        return Stage.campTriggerfish;
      case 17:
        return Stage.piranhaPit;
      case 18:
        return Stage.gobyArena;
      case 19:
        return Stage.newAlbacoreHotel;
      case 20:
        return Stage.wahooWorld;
      case 21:
        return Stage.anchovGames;
      case 22:
        return Stage.skipperPavilion;
      case 100:
        return Stage.windmillHouseOnThePearlie;
      case 101:
        return Stage.wayslideCool;
      case 102:
        return Stage.theSecretOfSplat;
      case 103:
        return Stage.goosponge;
      case 105:
        return Stage.cannonFirePearl;
      case 106:
        return Stage.zoneOfGlass;
      case 107:
        return Stage.fancySpew;
      case 108:
        return Stage.grapplinkGirl;
      case 109:
        return Stage.zappyLongshocking;
      case 110:
        return Stage.theBunkerGames;
      case 111:
        return Stage.aSwiftlyTiltingBalance;
      case 112:
        return Stage.theSwitches;
      case 113:
        return Stage.sweetValleyTentacles;
      case 114:
        return Stage.theBounceyTwins;
      case 115:
        return Stage.railwayChillin;
      case 116:
        return Stage.gusherTowns;
      case 117:
        return Stage.theMazeDasher;
      case 118:
        return Stage.floodersInTheAttic;
      case 119:
        return Stage.theSplatInOurZones;
      case 120:
        return Stage.theInkIsSpreading;
      case 121:
        return Stage.bridgeToTentaswitchia;
      case 122:
        return Stage.theChroniclesOfRolonium;
      case 123:
        return Stage.furlerInTheAshes;
      case 124:
        return Stage.mcPrincessDiaries;
      case 9999:
        return Stage.shiftyStation;
      default:
        throw new ArgumentOutOfRangeError();
    }
  }
}

Stage.theReef = new Stage('the_reef', 0);
Stage.musselforgeFitness = new Stage('musselforge_fitness', 1);
Stage.starfishMainstage = new Stage('starfish_mainstage', 2);
Stage.sturgeonShipyard = new Stage('sturgeon_shipyard', 3);
Stage.inkblotArtAcademy = new Stage('inkblot_art_academy', 4);
Stage.humpbackPumpTrack = new Stage('humpback_pump_track', 5);
Stage.mantaMaria = new Stage('manta_maria', 6);
Stage.portMackerel = new Stage('port_mackerel', 7);
Stage.morayTowers = new Stage('moray_towers', 8);
Stage.snapperCanal = new Stage('snapper_canal', 9);
Stage.kelpDome = new Stage('kelp_dome', 10);
Stage.blackbellySkatepark = new Stage('blackbelly_skatepark', 11);
Stage.shellendorfInstitute = new Stage('shellendorf_institute', 12);
Stage.makomart = new Stage('makomart', 13);
Stage.walleyeWarehouse = new Stage('walleye_warehouse', 14);
Stage.arowanaMall = new Stage('arowana_mall', 15);
Stage.campTriggerfish = new Stage('camp_triggerfish', 16);
Stage.piranhaPit = new Stage('piranha_pit', 17);
Stage.gobyArena = new Stage('goby_arena', 18);
Stage.newAlbacoreHotel = new Stage('new_albacore_hotel', 19);
Stage.wahooWorld = new Stage('wahoo_world', 20);
Stage.anchovGames = new Stage('anchov_games', 21);
Stage.skipperPavilion = new Stage('skipper_pavilion', 22);
Stage.windmillHouseOnThePearlie = new Stage('windmill_house_on_the_pearlie', 100);
Stage.wayslideCool = new Stage('wayslide_cool', 101);
Stage.theSecretOfSplat = new Stage('the_secret_of_splat', 102);
Stage.goosponge = new Stage('goosponge', 103);
Stage.cannonFirePearl = new Stage('cannon_fire_pearl', 105);
Stage.zoneOfGlass = new Stage('zone_of_glass', 106);
Stage.fancySpew = new Stage('fancy_spew', 107);
Stage.grapplinkGirl = new Stage('grapplink_girl', 108);
Stage.zappyLongshocking = new Stage('zappy_longshocking', 109);
Stage.theBunkerGames = new Stage('the_bunker_games', 110);
Stage.aSwiftlyTiltingBalance = new Stage('a_swiftly_tilting_balance', 111);
Stage.theSwitches = new Stage('the_switches', 112);
Stage.sweetValleyTentacles = new Stage('sweet_valley_tentacles', 113);
Stage.theBounceyTwins = new Stage('the_bouncey_twins', 114);
Stage.railwayChillin = new Stage('railway_chillin', 115);
Stage.gusherTowns = new Stage('gusher_towns', 116);
Stage.theMazeDasher = new Stage('the_maze_dasher', 117);
Stage.floodersInTheAttic = new Stage('flooders_in_the_attic', 118);
Stage.theSplatInOurZones = new Stage('the_splat_in_our_zones', 119);
Stage.theInkIsSpreading = new Stage('the_ink_is_spreading', 120);
Stage.bridgeToTentaswitchia = new Stage('bridge_to_tentaswitchia', 121);
Stage.theChroniclesOfRolonium = new Stage('the_chronicles_of_rolonium', 122);
Stage.furlerInTheAshes = new Stage('furler_in_the_ashes', 123);
Stage.mcPrincessDiaries = new Stage('mc_princess_diaries', 124);
Stage.shiftyStation = new Stage('shifty_station', 9999);

Object.freeze(Stage);

export default Stage;
