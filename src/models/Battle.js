import Base from './Base';
import { Mode, SplatfestMode } from './Mode';
import { Rank, BattlePlayer } from './Player';
import Rule from './Rule';
import { ScheduledStage } from './Stage';
import { Freshness } from './Weapon';

class Battle extends Base {
  constructor(
    e,
    raw,
    type,
    rule,
    number,
    startTime,
    elapsedTime,
    gameMode,
    stage,
    myTeamMembers,
    otherTeamMembers,
    totalPaint,
    levelAfter,
    myTeamCount,
    otherTeamCount
  ) {
    super(e, raw);
    this.type = type;
    this.number = number;
    this.startTime = startTime;
    this.elapsedTime = elapsedTime;
    this.gameMode = gameMode;
    this.rule = rule;
    this.stage = stage;
    this.myTeamMembers = myTeamMembers;
    this.otherTeamMembers = otherTeamMembers;
    this.totalPaint = totalPaint;
    this.levelAfter = levelAfter;
    this.myTeamCount = myTeamCount;
    this.otherTeamCount = otherTeamCount;
  }

  get selfPlayer() {
    return this.myTeamMembers.find((element) => {
      return element.isSelf === true;
    });
  }

  get isWin() {
    return this.myTeamCount > this.otherTeamCount;
  }

  get isLevelAfterWithStar() {
    return this.levelAfter > 99;
  }

  get levelAfterWithStar() {
    return this.levelAfter - this.star * 100;
  }

  get myTeamPaint() {
    let paint = 0;
    this.myTeamMembers.forEach((element) => {
      paint = paint + element.paint;
    });
    return paint;
  }
  get myTeamKill() {
    let kill = 0;
    this.myTeamMembers.forEach((element) => {
      kill = kill + element.kill;
    });
    return kill;
  }
  get myTeamAssist() {
    let assist = 0;
    this.myTeamMembers.forEach((element) => {
      assist = assist + element.assist;
    });
    return assist;
  }
  get myTeamKillAndAssist() {
    return this.myTeamKill + this.myTeamAssist;
  }
  get myTeamDeath() {
    let death = 0;
    this.myTeamMembers.forEach((element) => {
      death = death + element.death;
    });
    return death;
  }
  get myTeamSpecial() {
    let special = 0;
    this.myTeamMembers.forEach((element) => {
      special = special + element.special;
    });
    return special;
  }

  get otherTeamPaint() {
    let paint = 0;
    this.otherTeamMembers.forEach((element) => {
      paint = paint + element.paint;
    });
    return paint;
  }
  get otherTeamKill() {
    let kill = 0;
    this.otherTeamMembers.forEach((element) => {
      kill = kill + element.kill;
    });
    return kill;
  }
  get otherTeamAssist() {
    let assist = 0;
    this.otherTeamMembers.forEach((element) => {
      assist = assist + element.assist;
    });
    return assist;
  }
  get otherTeamKillAndAssist() {
    return this.otherTeamKill + this.otherTeamAssist;
  }
  get otherTeamDeath() {
    let death = 0;
    this.otherTeamMembers.forEach((element) => {
      death = death + element.death;
    });
    return death;
  }
  get otherTeamSpecial() {
    let special = 0;
    this.otherTeamMembers.forEach((element) => {
      special = special + element.special;
    });
    return special;
  }

  get star() {
    return parseInt(this.levelAfter / 100);
  }

  static parse = (data) => {
    try {
      const raw = JSON.stringify(data);
      const type = Mode.parse(data.type);
      const number = parseInt(data.battle_number);
      const startTime = parseInt(data.start_time);
      const gameMode = Mode.parse(data.game_mode.key);
      const rule = Rule.parse(data.rule);
      const stage = ScheduledStage.parse(data.stage);
      if (stage.error !== null) {
        // Handle previous error
        return new Battle(stage.error);
      }
      let myTeamMembers = [];
      let otherTeamMembers = [];
      myTeamMembers.push(BattlePlayer.parse(data.player_result, true));
      data.my_team_members.forEach((element) => {
        myTeamMembers.push(BattlePlayer.parse(element, false));
      });
      myTeamMembers.forEach((element) => {
        if (element.error !== null) {
          return new Battle(element.error);
        }
      });
      data.other_team_members.forEach((element) => {
        otherTeamMembers.push(BattlePlayer.parse(element, false));
      });
      otherTeamMembers.forEach((element) => {
        if (element.error !== null) {
          return new Battle(element.error);
        }
      });
      const totalPaint = parseInt(data.weapon_paint_point);
      const levelAfter = parseInt(data.player_rank) + 100 * parseInt(data.star_rank);
      switch (type) {
        case Mode.regularBattle: {
          let winMeter;
          if (data.win_meter % 1 === 0) {
            winMeter = parseInt(data.win_meter);
          } else {
            winMeter = parseFloat(data.win_meter).toFixed(1);
          }
          return new RegularBattle(
            null,
            raw,
            rule,
            number,
            startTime,
            gameMode,
            stage,
            myTeamMembers,
            otherTeamMembers,
            totalPaint,
            levelAfter,
            parseFloat(data.my_team_percentage).toFixed(1),
            parseFloat(data.other_team_percentage).toFixed(1),
            winMeter
          );
        }
        case Mode.rankedBattle: {
          if (
            myTeamMembers.find((element) => {
              return element.isSelf;
            }).Rank !== Rank.x ||
            gameMode !== Mode.rankedBattle
          ) {
            let estimatedRankPower = 0;
            if (gameMode === Mode.rankedBattle) {
              estimatedRankPower = parseInt(data.estimate_gachi_power);
            }
            return new RankedBattle(
              null,
              raw,
              rule,
              number,
              startTime,
              parseInt(data.elapsed_time),
              gameMode,
              stage,
              myTeamMembers,
              otherTeamMembers,
              totalPaint,
              levelAfter,
              parseInt(data.my_team_count),
              parseInt(data.other_team_count),
              Rank.parse(data.udemae),
              estimatedRankPower
            );
          } else {
            let xPowerAfter = null;
            if (data.x_power !== null) {
              xPowerAfter = parseFloat(data.x_power).toFixed(1);
            }
            return new RankedXBattle(
              null,
              raw,
              rule,
              number,
              startTime,
              parseInt(data.elapsed_time),
              gameMode,
              stage,
              myTeamMembers,
              otherTeamMembers,
              totalPaint,
              levelAfter,
              parseInt(data.my_team_count),
              parseInt(data.other_team_count),
              Rank.parse(data.udemae),
              xPowerAfter,
              parseInt(data.estimate_x_power)
            );
          }
        }
        case Mode.leagueBattle: {
          let leaguePoint = null;
          if (data.league_point !== null) {
            leaguePoint = parseFloat(data.league_point).toFixed(1);
          }
          return new LeagueBattle(
            null,
            raw,
            rule,
            number,
            startTime,
            parseInt(data.elapsed_time),
            gameMode,
            stage,
            myTeamMembers,
            otherTeamMembers,
            totalPaint,
            levelAfter,
            parseInt(data.my_team_count),
            parseInt(data.other_team_count),
            parseInt(data.my_estimate_league_point),
            parseInt(data.other_estimate_league_point),
            leaguePoint,
            parseFloat(data.max_league_point).toFixed(1)
          );
        }
        case Mode.splatfest: {
          let winMeter;
          if (data.win_meter % 1 === 0) {
            winMeter = parseInt(data.win_meter);
          } else {
            winMeter = parseFloat(data.win_meter).toFixed(1);
          }
          return new SplatfestBattle(
            null,
            raw,
            rule,
            number,
            startTime,
            gameMode,
            stage,
            myTeamMembers,
            otherTeamMembers,
            totalPaint,
            levelAfter,
            parseFloat(data.my_team_percentage).toFixed(1),
            parseFloat(data.other_team_percentage).toFixed(1),
            winMeter,
            SplatfestMode.parse(data.fes_mode.key),
            parseInt(data.my_estimate_fes_power),
            parseInt(data.other_estimate_fes_power),
            parseFloat(data.fes_power).toFixed(1),
            parseFloat(data.max_fes_power).toFixed(1),
            parseInt(data.contribution_point),
            parseInt(data.contribution_point_total)
          );
        }
        default:
          throw new RangeError();
      }
    } catch (e) {
      console.error(e);
      return new Battle('can_not_parse_battle');
    }
  };

  static deserialize = (data) => {
    try {
      const raw = data.raw;
      const type = Mode.deserialize(data.type);
      const number = parseInt(data.number);
      const startTime = parseInt(data.startTime);
      const gameMode = Mode.deserialize(data.gameMode);
      const rule = Rule.deserialize(data.rule);
      const stage = ScheduledStage.deserialize(data.stage);
      if (stage.error !== null) {
        // Handle previous error
        return new Battle(stage.error);
      }
      let myTeamMembers = [];
      data.myTeamMembers.forEach((element) => {
        myTeamMembers.push(BattlePlayer.deserialize(element));
      });
      myTeamMembers.forEach((element) => {
        if (element.error !== null) {
          // Handle previous error
          return new Battle(element.error);
        }
      });
      let otherTeamMembers = [];
      data.otherTeamMembers.forEach((element) => {
        otherTeamMembers.push(BattlePlayer.deserialize(element));
      });
      otherTeamMembers.forEach((element) => {
        if (element.error !== null) {
          // Handle previous error
          return new Battle(element.error);
        }
      });
      const totalPaint = parseInt(data.totalPaint);
      const levelAfter = parseInt(data.levelAfter);
      switch (type) {
        case Mode.regularBattle: {
          let winMeter;
          if (data.winMeter % 1 === 0) {
            winMeter = parseInt(data.winMeter);
          } else {
            winMeter = parseFloat(data.winMeter).toFixed(1);
          }
          return new RegularBattle(
            null,
            raw,
            rule,
            number,
            startTime,
            gameMode,
            stage,
            myTeamMembers,
            otherTeamMembers,
            totalPaint,
            levelAfter,
            parseFloat(data.myTeamCount).toFixed(1),
            parseFloat(data.otherTeamCount).toFixed(1),
            winMeter
          );
        }
        case Mode.rankedBattle: {
          if (
            myTeamMembers.find((element) => {
              return element.isSelf;
            }).Rank !== Rank.x ||
            gameMode !== Mode.rankedBattle
          ) {
            return new RankedBattle(
              null,
              raw,
              rule,
              number,
              startTime,
              parseInt(data.elapsedTime),
              gameMode,
              stage,
              myTeamMembers,
              otherTeamMembers,
              totalPaint,
              levelAfter,
              parseInt(data.myTeamCount),
              parseInt(data.otherTeamCount),
              Rank.deserialize(data.rankAfter),
              parseInt(data.estimatedRankPower)
            );
          } else {
            let xPowerAfter;
            if (data.xPowerAfter !== null) {
              xPowerAfter = parseFloat(data.xPowerAfter).toFixed(1);
            }
            return new RankedXBattle(
              null,
              raw,
              rule,
              number,
              startTime,
              parseInt(data.elapsedTime),
              gameMode,
              stage,
              myTeamMembers,
              otherTeamMembers,
              totalPaint,
              levelAfter,
              parseInt(data.myTeamCount),
              parseInt(data.otherTeamCount),
              xPowerAfter,
              parseInt(data.estimatedRankPower)
            );
          }
        }
        case Mode.leagueBattle: {
          let leaguePoint = null;
          if (data.leaguePoint !== null) {
            leaguePoint = parseFloat(data.leaguePoint).toFixed(1);
          }
          return new LeagueBattle(
            null,
            raw,
            rule,
            number,
            startTime,
            parseInt(data.elapsedTime),
            gameMode,
            stage,
            myTeamMembers,
            otherTeamMembers,
            totalPaint,
            levelAfter,
            parseInt(data.myTeamCount),
            parseInt(data.otherTeamCount),
            parseInt(data.myEstimatedLeaguePoint),
            parseInt(data.otherEstimatedLeaguePoint),
            leaguePoint,
            parseFloat(data.maxLeaguePoint).toFixed(1)
          );
        }
        case Mode.splatfest: {
          let winMeter;
          if (data.winMeter % 1 === 0) {
            winMeter = parseInt(data.winMeter);
          } else {
            winMeter = parseFloat(data.winMeter).toFixed(1);
          }
          return new SplatfestBattle(
            null,
            raw,
            rule,
            number,
            startTime,
            gameMode,
            stage,
            myTeamMembers,
            otherTeamMembers,
            totalPaint,
            levelAfter,
            parseFloat(data.myTeamCount).toFixed(1),
            parseFloat(data.otherTeamCount).toFixed(1),
            winMeter,
            SplatfestMode.deserialize(data.splatfestMode),
            parseInt(data.myEstimatedSplatfestPower),
            parseInt(data.otherEstimatedSplatfestPower),
            parseFloat(data.splatfestPower).toFixed(1),
            parseFloat(data.maxSplatfestPower).toFixed(1),
            parseInt(data.contributionPoint),
            parseInt(data.totalContributionPoint)
          );
        }
        default:
          throw new RangeError();
      }
    } catch (e) {
      console.error(e);
      return new Battle('can_not_deserialize_battle');
    }
  };
}

class RegularBattle extends Battle {
  constructor(
    e,
    raw,
    rule,
    number,
    startTime,
    gameMode,
    stage,
    myTeamMembers,
    otherTeamMembers,
    totalPaint,
    levelAfter,
    myTeamPercentage,
    otherTeamPercentage,
    winMeter
  ) {
    super(
      e,
      raw,
      Mode.regularBattle,
      rule,
      number,
      startTime,
      180,
      gameMode,
      stage,
      myTeamMembers,
      otherTeamMembers,
      totalPaint,
      levelAfter,
      myTeamPercentage,
      otherTeamPercentage
    );
    this.winMeter = winMeter;
  }

  get freshness() {
    return Freshness.parse(this.winMeter);
  }
}

class RankedBattle extends Battle {
  constructor(
    e,
    raw,
    rule,
    number,
    startTime,
    elapsedTime,
    gameMode,
    stage,
    myTeamMembers,
    otherTeamMembers,
    totalPaint,
    levelAfter,
    myTeamCount,
    otherTeamCount,
    rankAfter,
    estimatedRankPower
  ) {
    super(
      e,
      raw,
      Mode.rankedBattle,
      rule,
      number,
      startTime,
      elapsedTime,
      gameMode,
      stage,
      myTeamMembers,
      otherTeamMembers,
      totalPaint,
      levelAfter,
      myTeamCount,
      otherTeamCount
    );
    this.rankAfter = rankAfter;
    this.estimatedRankPower = estimatedRankPower;
  }

  get isKnockOut() {
    return this.myTeamCount === 100;
  }
  get isKnockedOut() {
    return this.otherTeamCount === 100;
  }
}

class RankedXBattle extends RankedBattle {
  constructor(
    e,
    rule,
    number,
    startTime,
    elapsedTime,
    gameMode,
    stage,
    myTeamMembers,
    otherTeamMembers,
    totalPaint,
    levelAfter,
    myTeamCount,
    otherTeamCount,
    rankAfter,
    xPowerAfter,
    estimatedXPower
  ) {
    super(
      e,
      rule,
      number,
      startTime,
      elapsedTime,
      gameMode,
      stage,
      myTeamMembers,
      otherTeamMembers,
      totalPaint,
      levelAfter,
      myTeamCount,
      otherTeamCount,
      rankAfter,
      estimatedXPower
    );
    this.xPowerAfter = xPowerAfter;
  }

  get estimatedXPower() {
    return this.estimatedRankPower;
  }

  get isCalculating() {
    return this.xPowerAfter === null;
  }

  get isX() {
    return this.rankAfter === Rank.x;
  }
}

class LeagueBattle extends Battle {
  constructor(
    e,
    raw,
    rule,
    number,
    startTime,
    elapsedTime,
    gameMode,
    stage,
    myTeamMembers,
    otherTeamMembers,
    totalPaint,
    levelAfter,
    myTeamCount,
    otherTeamCount,
    myEstimatedLeaguePoint,
    otherEstimatedLeaguePoint,
    leaguePoint,
    maxLeaguePoint
  ) {
    super(
      e,
      raw,
      Mode.leagueBattle,
      rule,
      number,
      startTime,
      elapsedTime,
      gameMode,
      stage,
      myTeamMembers,
      otherTeamMembers,
      totalPaint,
      levelAfter,
      myTeamCount,
      otherTeamCount
    );
    this.myEstimatedLeaguePoint = myEstimatedLeaguePoint;
    this.otherEstimatedLeaguePoint = otherEstimatedLeaguePoint;
    this.leaguePoint = leaguePoint;
    this.maxLeaguePoint = maxLeaguePoint;
  }

  get isKnockOut() {
    return this.myTeamCount === 100;
  }
  get isKnockedOut() {
    return this.otherTeamCount === 100;
  }

  get isCalculating() {
    return this.leaguePoint === null;
  }
}

class SplatfestBattle extends Battle {
  constructor(
    e,
    raw,
    rule,
    number,
    startTime,
    gameMode,
    stage,
    myTeamMembers,
    otherTeamMembers,
    totalPaint,
    levelAfter,
    myTeamPercentage,
    otherTeamPercentage,
    winMeter,
    splatfestMode,
    myEstimatedSplatfestPower,
    otherEstimatedSplatfestPower,
    splatfestPower,
    maxSplatfestPower,
    contributionPoint,
    totalContributionPoint
  ) {
    super(
      e,
      raw,
      Mode.splatfest,
      rule,
      number,
      startTime,
      180,
      gameMode,
      stage,
      myTeamMembers,
      otherTeamMembers,
      totalPaint,
      levelAfter,
      myTeamPercentage,
      otherTeamPercentage
    );
    this.winMeter = winMeter;
    this.splatfestMode = splatfestMode;
    this.myEstimatedSplatfestPower = myEstimatedSplatfestPower;
    this.otherEstimatedSplatfestPower = otherEstimatedSplatfestPower;
    this.splatfestPower = splatfestPower;
    this.maxSplatfestPower = maxSplatfestPower;
    this.contributionPoint = contributionPoint;
    this.totalContributionPoint = totalContributionPoint;
  }

  get isCalculating() {
    return parseFloat(this.splatfestPower) === 0;
  }
}

export { Battle, RegularBattle, RankedBattle, RankedXBattle, LeagueBattle, SplatfestBattle };
