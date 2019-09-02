class Stage {
  constructor(name, value) {
    this.name = name;
    this.value = value;
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
Stage.windmillHouseOnThePearlie = new Stage(
  'windmill_house_on_the_pearlie',
  100
);
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

class ScheduledStage {
  constructor(stage, url) {
    this.stage = stage;
    this.url = url;
  }

  getStage = () => {
    return this.stage;
  };

  getUrl = () => {
    return this.url;
  };
}

export { Stage, ScheduledStage };
