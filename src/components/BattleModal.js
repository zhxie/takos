import React from 'react';
import { FormattedMessage, FormattedDate, FormattedTime } from 'react-intl';
import { Modal, Descriptions, Tag, Progress } from 'antd';

import './BattleModal.css';
import leagueIcon from '../assets/images/mode-league.png';
import privateIcon from '../assets/images/mode-private.png';
import turfWarIcon from '../assets/images/mode-regular.png';
import regularIcon from '../assets/images/mode-regular.png';
import splatfestIcon from '../assets/images/mode-splatfest.png';
import clamBlitzIcon from '../assets/images/rule-clam-blitz.png';
import rainmakerIcon from '../assets/images/rule-rainmaker.png';
import rankedIcon from '../assets/images/mode-ranked.png';
import splatZonesIcon from '../assets/images/rule-splat-zones.png';
import towerControlIcon from '../assets/images/rule-tower-control.png';
import { RegularBattle, RankedBattle, LeagueBattle, SplatfestBattle } from '../models/Battle';
import { Mode } from '../models/Mode';
import Rule from '../models/Rule';
import { SPLATNET } from '../utils/FileFolderUrl';
import TimeConverter from '../utils/TimeConverter';

class BattleModal extends React.Component {
  modeIconSelector = mode => {
    switch (mode) {
      case Mode.regularBattle:
        return regularIcon;
      case Mode.rankedBattle:
        return rankedIcon;
      case Mode.leagueBattle:
        return leagueIcon;
      case Mode.privateBattle:
        return privateIcon;
      case Mode.splatfest:
        return splatfestIcon;
      default:
        throw new RangeError();
    }
  };

  ruleIconSelector = rule => {
    switch (rule) {
      case Rule.turfWar:
        return turfWarIcon;
      case Rule.splatZones:
        return splatZonesIcon;
      case Rule.towerControl:
        return towerControlIcon;
      case Rule.rainmaker:
        return rainmakerIcon;
      case Rule.clamBlitz:
        return clamBlitzIcon;
      default:
        throw new RangeError();
    }
  };

  renderBattle() {
    return (
      <Descriptions title={<FormattedMessage id="app.battle" defaultMessage="Battle" />} bordered>
        <Descriptions.Item label={<FormattedMessage id="mode" defaultMessage="Mode" />} span={2}>
          <span className="BattleModal-battle-span">
            <img
              className="BattleModal-battle-icon"
              src={this.modeIconSelector(this.props.value.gameMode)}
              alt="mode"
            />
            <FormattedMessage id={this.props.value.gameMode.name} />
          </span>
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="rule" defaultMessage="Rule" />} span={2}>
          <span className="BattleModal-battle-span">
            <img className="BattleModal-battle-icon" src={this.ruleIconSelector(this.props.value.rule)} alt="rule" />
            <FormattedMessage id={this.props.value.rule.name} />
          </span>
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="stage" defaultMessage="Stage" />} span={3}>
          <div>
            <img className="BattleModal-battle-stage" src={SPLATNET + this.props.value.stage.url} alt="stage" />
            <br />
            <FormattedMessage id={this.props.value.stage.stage.name} />
          </div>
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="app.battle.result" defaultMessage="Result" />} span={3}>
          <span>
            {(() => {
              if (this.props.value.isWin()) {
                return (
                  <Tag color="magenta" key="result">
                    <FormattedMessage id="app.battle.win" defaultMessage="Win!" />
                  </Tag>
                );
              } else {
                return (
                  <Tag color="green" key="result">
                    <FormattedMessage id="app.battle.lose" defaultMessage="Lose.." />
                  </Tag>
                );
              }
            })()}
            {(() => {
              if (this.props.value instanceof RankedBattle || this.props.value instanceof LeagueBattle) {
                if (this.props.value.isKnockOut()) {
                  return (
                    <Tag color="red" key="ko">
                      <FormattedMessage id="app.battle.knock_out" defaultMessage="KO BONUS!" />
                    </Tag>
                  );
                }
                if (this.props.value.isKnockedOut()) {
                  return (
                    <Tag color="green" key="ko">
                      <FormattedMessage id="app.battle.knock_out" defaultMessage="KO BONUS!" />
                    </Tag>
                  );
                }
              }
            })()}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label={<FormattedMessage id="app.battle.count" defaultMessage="Count" />} span={3}>
          <span className="BattleModal-battle-span">
            <Progress
              className="BattlesModal-battle-progress"
              percent={(() => {
                if (this.props.value.otherTeamCount === 0) {
                  return 100;
                } else {
                  return (
                    (parseFloat(this.props.value.myTeamCount) /
                      (parseFloat(this.props.value.myTeamCount) + parseFloat(this.props.value.otherTeamCount))) *
                    100
                  );
                }
              })()}
              showInfo={false}
              strokeLinecap="square"
            />
            {this.props.value.myTeamCount} - {this.props.value.otherTeamCount}
          </span>
        </Descriptions.Item>
        <Descriptions.Item
          label={<FormattedMessage id="app.battle.level" defaultMessage="Level" />}
          span={(() => {
            if (this.props.value instanceof RankedBattle) {
              return 2;
            } else {
              return 4;
            }
          })()}
        >
          {(() => {
            if (this.props.value.isLevelAfterWithStar() > this.props.value.selfPlayer().isLevelWithStar) {
              return (
                <span>
                  <b>
                    {(() => {
                      if (this.props.value.selfPlayer().isLevelWithStar()) {
                        return (
                          <span>
                            <span className="BattleModal-battle-star">★</span>
                            {this.props.value.selfPlayer().levelWithStar()}
                          </span>
                        );
                      } else {
                        return this.props.value.selfPlayer().levelWithStar();
                      }
                    })()}{' '}
                    →{' '}
                    {(() => {
                      if (this.props.value.isLevelAfterWithStar()) {
                        return (
                          <span>
                            <span className="BattleModal-battle-star">★</span>
                            {this.props.value.levelAfterWithStar()}
                          </span>
                        );
                      } else {
                        return this.props.value.levelAfterWithStar();
                      }
                    })()}
                  </b>
                </span>
              );
            } else {
              return (
                <span>
                  {(() => {
                    if (this.props.value.selfPlayer().isLevelWithStar()) {
                      return (
                        <span>
                          <span className="BattleModal-battle-star">★</span>
                          {this.props.value.selfPlayer().levelWithStar()}
                        </span>
                      );
                    } else {
                      return this.props.value.selfPlayer().levelWithStar();
                    }
                  })()}{' '}
                  →{' '}
                  {(() => {
                    if (this.props.value.isLevelAfterWithStar()) {
                      return (
                        <span>
                          <span className="BattleModal-battle-star">★</span>
                          {this.props.value.levelAfterWithStar()}
                        </span>
                      );
                    } else {
                      return this.props.value.levelAfterWithStar();
                    }
                  })()}
                </span>
              );
            }
          })()}
        </Descriptions.Item>
        {(() => {
          if (this.props.value instanceof RankedBattle) {
            return (
              <Descriptions.Item label={<FormattedMessage id="app.battle.rank" defaultMessage="Rank" />} span={2}>
                {(() => {
                  if (this.props.value.rankAfter !== this.props.value.selfPlayer().rank) {
                    return (
                      <span>
                        <b>
                          <FormattedMessage id={this.props.value.selfPlayer().rank.name} /> →{' '}
                          <FormattedMessage id={this.props.value.rankAfter.name} />
                        </b>
                      </span>
                    );
                  } else {
                    return (
                      <span>
                        <FormattedMessage id={this.props.value.selfPlayer().rank.name} /> →{' '}
                        <FormattedMessage id={this.props.value.rankAfter.name} />
                      </span>
                    );
                  }
                })()}
              </Descriptions.Item>
            );
          }
        })()}
        <Descriptions.Item label={<FormattedMessage id="app.battle.start_time" defaultMessage="Start Time" />} span={2}>
          {TimeConverter.formatStartTime(this.props.value.startTime)}
        </Descriptions.Item>
        <Descriptions.Item
          label={<FormattedMessage id="app.battle.elapsed_time" defaultMessage="Elapsed Time" />}
          span={2}
        >
          {TimeConverter.formatElapsedTime(this.props.value.elapsedTime)}
        </Descriptions.Item>
      </Descriptions>
    );
  }

  render() {
    return (
      <Modal
        title={(() => {
          return (
            <span>
              <FormattedMessage id="app.battle" defaultMessage="Battle" />{' '}
              <FormattedMessage
                id="app.battle.id"
                defaultMessage="#{id}"
                values={{
                  id: (() => {
                    if (this.props.value === undefined || this.props.value === null) {
                      return '';
                    } else {
                      return this.props.value.number.toString();
                    }
                  })()
                }}
              />
            </span>
          );
        })()}
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        footer={null}
        column={2}
        width="800px"
        centered
      >
        {(() => {
          if (this.props.value !== undefined && this.props.value !== null) {
            return this.renderBattle();
          }
        })()}
      </Modal>
    );
  }
}

BattleModal.defaultProps = { visible: false };

export default BattleModal;
