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
        throw new RangeError();
    }
  }
}

Stage.theReef = new Stage('stage.the_reef', 0);
Stage.musselforgeFitness = new Stage('stage.musselforge_fitness', 1);
Stage.starfishMainstage = new Stage('stage.starfish_mainstage', 2);
Stage.sturgeonShipyard = new Stage('stage.sturgeon_shipyard', 3);
Stage.inkblotArtAcademy = new Stage('stage.inkblot_art_academy', 4);
Stage.humpbackPumpTrack = new Stage('stage.humpback_pump_track', 5);
Stage.mantaMaria = new Stage('stage.manta_maria', 6);
Stage.portMackerel = new Stage('stage.port_mackerel', 7);
Stage.morayTowers = new Stage('stage.moray_towers', 8);
Stage.snapperCanal = new Stage('stage.snapper_canal', 9);
Stage.kelpDome = new Stage('stage.kelp_dome', 10);
Stage.blackbellySkatepark = new Stage('stage.blackbelly_skatepark', 11);
Stage.shellendorfInstitute = new Stage('stage.shellendorf_institute', 12);
Stage.makomart = new Stage('stage.makomart', 13);
Stage.walleyeWarehouse = new Stage('stage.walleye_warehouse', 14);
Stage.arowanaMall = new Stage('stage.arowana_mall', 15);
Stage.campTriggerfish = new Stage('stage.camp_triggerfish', 16);
Stage.piranhaPit = new Stage('stage.piranha_pit', 17);
Stage.gobyArena = new Stage('stage.goby_arena', 18);
Stage.newAlbacoreHotel = new Stage('stage.new_albacore_hotel', 19);
Stage.wahooWorld = new Stage('stage.wahoo_world', 20);
Stage.anchovGames = new Stage('stage.anchov_games', 21);
Stage.skipperPavilion = new Stage('stage.skipper_pavilion', 22);
Stage.windmillHouseOnThePearlie = new Stage('stage.windmill_house_on_the_pearlie', 100);
Stage.wayslideCool = new Stage('stage.wayslide_cool', 101);
Stage.theSecretOfSplat = new Stage('stage.the_secret_of_splat', 102);
Stage.goosponge = new Stage('stage.goosponge', 103);
Stage.cannonFirePearl = new Stage('stage.cannon_fire_pearl', 105);
Stage.zoneOfGlass = new Stage('stage.zone_of_glass', 106);
Stage.fancySpew = new Stage('stage.fancy_spew', 107);
Stage.grapplinkGirl = new Stage('stage.grapplink_girl', 108);
Stage.zappyLongshocking = new Stage('stage.zappy_longshocking', 109);
Stage.theBunkerGames = new Stage('stage.the_bunker_games', 110);
Stage.aSwiftlyTiltingBalance = new Stage('stage.a_swiftly_tilting_balance', 111);
Stage.theSwitches = new Stage('stage.the_switches', 112);
Stage.sweetValleyTentacles = new Stage('stage.sweet_valley_tentacles', 113);
Stage.theBounceyTwins = new Stage('stage.the_bouncey_twins', 114);
Stage.railwayChillin = new Stage('stage.railway_chillin', 115);
Stage.gusherTowns = new Stage('stage.gusher_towns', 116);
Stage.theMazeDasher = new Stage('stage.the_maze_dasher', 117);
Stage.floodersInTheAttic = new Stage('stage.flooders_in_the_attic', 118);
Stage.theSplatInOurZones = new Stage('stage.the_splat_in_our_zones', 119);
Stage.theInkIsSpreading = new Stage('stage.the_ink_is_spreading', 120);
Stage.bridgeToTentaswitchia = new Stage('stage.bridge_to_tentaswitchia', 121);
Stage.theChroniclesOfRolonium = new Stage('stage.the_chronicles_of_rolonium', 122);
Stage.furlerInTheAshes = new Stage('stage.furler_in_the_ashes', 123);
Stage.mcPrincessDiaries = new Stage('stage.mc_princess_diaries', 124);
Stage.shiftyStation = new Stage('stage.shifty_station', 9999);

Object.freeze(Stage);

export default Stage;
