import Base from './Base';
import { Mode, SplatfestMode } from './Mode';
import { Rank, BattlePlayer } from './Player';
import Rule from './Rule';
import { ScheduledStage } from './Stage';
import { Freshness } from './Weapon';
import TakosError from '../utils/ErrorHelper';

class Battle extends Base {
  constructor(
    e,
    type,
    rule,
    number,
    startTime,
    elapsedTime,
    gameMode,
    stage,
    myTeamMembers,
    otherTeamMembers,
    levelAfter,
    myTeamCount,
    otherTeamCount
  ) {
    super(e);
    this.type = type;
    this.number = number;
    this.startTime = startTime;
    this.elapsedTime = elapsedTime;
    this.gameMode = gameMode;
    this.rule = rule;
    this.stage = stage;
    this.myTeamMembers = myTeamMembers;
    this.otherTeamMembers = otherTeamMembers;
    this.levelAfter = levelAfter;
    this.myTeamCount = myTeamCount;
    this.otherTeamCount = otherTeamCount;
  }

  selfPlayer = () => {
    return this.myTeamMembers.find(element => {
      return (element.isSelf = true);
    });
  };

  isWin = () => {
    return this.myTeamCount > this.otherTeamCount;
  };

  static parse = data => {
    try {
      const type = Mode.parse(data.type);
      const number = parseInt(data.battle_number);
      const startTime = new Date(parseInt(data.start_time) * 1000);
      const gameMode = Mode.parse(data.game_mode.key);
      const rule = Rule.parse(data.rule);
      const stage = ScheduledStage.parse(data.stage);
      if (stage.error !== null) {
        // Handle previous error
        return new Battle(stage.error);
      }
      let myTeamMembersCount = 1;
      let players = [];
      let myTeamMembers = [];
      let otherTeamMembers = [];
      players.push(BattlePlayer.parsePromise(data.player_result, true));
      data.my_team_members.forEach(element => {
        players.push(BattlePlayer.parsePromise(element, false));
        myTeamMembersCount++;
      });
      data.other_team_members.forEach(element => {
        players.push(BattlePlayer.parsePromise(element, false));
      });
      const levelAfter = parseInt(data.player_rank) + 100 * parseInt(data.star_rank);
      return Promise.all(players)
        .then(values => {
          for (let i = 0; i < myTeamMembersCount; ++i) {
            myTeamMembers.push(values[i]);
          }
          for (let i = myTeamMembersCount; i < values.length; ++i) {
            otherTeamMembers.push(values[i]);
          }
          myTeamMembers.forEach(element => {
            if (element.error !== null) {
              // Handle previous error
              throw new TakosError(element.error);
            }
          });
          otherTeamMembers.forEach(element => {
            if (element.error !== null) {
              // Handle previous error
              throw new TakosError(element.error);
            }
          });
        })
        .then(() => {
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
                rule,
                number,
                startTime,
                gameMode,
                stage,
                myTeamMembers,
                otherTeamMembers,
                levelAfter,
                parseFloat(data.my_team_percentage).toFixed(1),
                parseFloat(data.other_team_percentage).toFixed(1),
                winMeter
              );
            }
            case Mode.rankedBattle: {
              if (myTeamMembers[0].Rank !== Rank.x) {
                return new RankedBattle(
                  null,
                  rule,
                  number,
                  startTime,
                  parseInt(data.elapsed_time),
                  gameMode,
                  stage,
                  myTeamMembers,
                  otherTeamMembers,
                  levelAfter,
                  parseInt(data.my_team_count),
                  parseInt(data.other_team_count),
                  Rank.parse(data.udemae),
                  parseInt(data.estimate_gachi_power)
                );
              } else {
                let xPowerAfter;
                if (data.x_power === null) {
                  xPowerAfter = null;
                } else {
                  xPowerAfter = parseFloat(data.x_power).toFixed(1);
                }
                return new RankedXBattle(
                  null,
                  rule,
                  number,
                  startTime,
                  parseInt(data.elapsed_time),
                  gameMode,
                  stage,
                  myTeamMembers,
                  otherTeamMembers,
                  levelAfter,
                  parseInt(data.my_team_count),
                  parseInt(data.other_team_count),
                  xPowerAfter,
                  parseInt(data.estimate_x_power)
                );
              }
            }
            case Mode.leagueBattle: {
              let leaguePoint;
              if (data.league_point === null) {
                leaguePoint = null;
              } else {
                leaguePoint = parseFloat(data.league_point).toFixed(1);
              }
              return new LeagueBattle(
                null,
                rule,
                number,
                startTime,
                parseInt(data.elapsed_time),
                gameMode,
                stage,
                myTeamMembers,
                otherTeamMembers,
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
                rule,
                number,
                startTime,
                gameMode,
                stage,
                myTeamMembers,
                otherTeamMembers,
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
        })
        .catch(e => {
          if (e instanceof TakosError) {
            return new Battle(e.message);
          } else {
            console.error(e);
            return new Battle('can_not_parse_battle');
          }
        });
    } catch (e) {
      console.error(e);
      return new Battle('can_not_parse_battle');
    }
  };
}

class RegularBattle extends Battle {
  constructor(
    e,
    rule,
    number,
    startTime,
    gameMode,
    stage,
    myTeamMembers,
    otherTeamMembers,
    levelAfter,
    myTeamPercentage,
    otherTeamPercentage,
    winMeter
  ) {
    super(
      e,
      Mode.regularBattle,
      rule,
      number,
      startTime,
      180,
      gameMode,
      stage,
      myTeamMembers,
      otherTeamMembers,
      levelAfter,
      myTeamPercentage,
      otherTeamPercentage
    );
    this.winMeter = winMeter;
  }

  freshness = () => {
    return Freshness.parse(this.winMeter);
  };
}

class RankedBattle extends Battle {
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
    levelAfter,
    myTeamCount,
    otherTeamCount,
    rankAfter,
    estimatedRankPower
  ) {
    super(
      e,
      Mode.rankedBattle,
      rule,
      number,
      startTime,
      elapsedTime,
      gameMode,
      stage,
      myTeamMembers,
      otherTeamMembers,
      levelAfter,
      myTeamCount,
      otherTeamCount
    );
    this.rankAfter = rankAfter;
    this.estimatedRankPower = estimatedRankPower;
  }

  isKnockOut = () => {
    return this.myTeamCount === 100;
  };
  isKnockedOut = () => {
    return this.otherTeamCount === 100;
  };
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
    levelAfter,
    myTeamCount,
    otherTeamCount,
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
      levelAfter,
      myTeamCount,
      otherTeamCount,
      Rank.x,
      estimatedXPower
    );
    this.xPowerAfter = xPowerAfter;
  }

  estimatedXPower = () => {
    return this.estimatedRankPower;
  };
}

class LeagueBattle extends Battle {
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
      Mode.leagueBattle,
      rule,
      number,
      startTime,
      elapsedTime,
      gameMode,
      stage,
      myTeamMembers,
      otherTeamMembers,
      levelAfter,
      myTeamCount,
      otherTeamCount
    );
    this.myEstimatedLeaguePoint = myEstimatedLeaguePoint;
    this.otherEstimatedLeaguePoint = otherEstimatedLeaguePoint;
    this.leaguePoint = leaguePoint;
    this.maxLeaguePoint = maxLeaguePoint;
  }

  isKnockOut = () => {
    return this.myTeamCount === 100;
  };
  isKnockedOut = () => {
    return this.otherTeamCount === 100;
  };

  isCalculating = () => {
    return this.leaguePoint === null;
  };
}

class SplatfestBattle extends Battle {
  constructor(
    e,
    rule,
    number,
    startTime,
    gameMode,
    stage,
    myTeamMembers,
    otherTeamMembers,
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
      Mode.regularBattle,
      rule,
      number,
      startTime,
      180,
      gameMode,
      stage,
      myTeamMembers,
      otherTeamMembers,
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

  isCalculating = () => {
    return this.splatfestPower === 0;
  };
}

export default Battle;
