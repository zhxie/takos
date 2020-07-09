import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, Descriptions, Row, Col, Tooltip, Progress } from 'antd';

import './StageStatisticsCard.css';
import FileFolderUrl from '../utils/FileFolderUrl';

class StageStatisticsCard extends React.Component {
  render() {
    return (
      <Card hoverable bordered={false} bodyStyle={{ padding: 0 }} style={{ cursor: 'default' }}>
        <Descriptions bordered style={this.props.style} column={4}>
          <Descriptions.Item label={<FormattedMessage id="stage" defaultMessage="Stage" />} span={4}>
            <div>
              <img
                className="StageStatisticsCard-stage"
                src={FileFolderUrl.SPLATNET + this.props.stage.stage.url}
                alt="stage"
              />
              <br />
              <FormattedMessage id={this.props.stage.stage.stage.name} />
            </div>
          </Descriptions.Item>
          {(() => {
            if (!this.props.stage.isSalmonRun) {
              return this.props.stage.result.map((element) => {
                return (
                  <Descriptions.Item
                    key={element.rule.value}
                    label={<FormattedMessage id={element.rule.name} />}
                    span={4}
                  >
                    <Row gutter={8}>
                      <Col span={12}>
                        <Tooltip
                          title={(() => {
                            let ratio = 0;
                            if (element.win + element.lose > 0) {
                              ratio = element.win / (element.win + element.lose);
                            }
                            return ratio.toFixed(2);
                          })()}
                        >
                          <Progress
                            className={(() => {
                              if (element.win + element.lose > 0) {
                                return 'StageStatisticsCard-battle-progress';
                              } else {
                                return 'StageStatisticsCard-progress';
                              }
                            })()}
                            percent={(() => {
                              if (element.win + element.lose > 0) {
                                return (element.win / (element.win + element.lose)) * 100;
                              } else {
                                return 0;
                              }
                            })()}
                            showInfo={false}
                            strokeLinecap="square"
                          />
                        </Tooltip>
                      </Col>
                      <Col span={12}>
                        {(() => {
                          if (element.win > element.lose) {
                            return (
                              <span>
                                <b>
                                  {element.win}
                                  {(() => {
                                    if (element.knockOut !== undefined && element.knockOut > 0) {
                                      return (
                                        <span>
                                          {' '}
                                          (<FormattedMessage
                                            id="battle.knock_out.abbreviation"
                                            defaultMessage="KO"
                                          />{' '}
                                          <Tooltip title={(element.knockOut / (element.win + element.lose)).toFixed(2)}>
                                            {element.knockOut}
                                          </Tooltip>
                                          )
                                        </span>
                                      );
                                    }
                                  })()}{' '}
                                  - {element.lose}
                                  {(() => {
                                    if (element.knockedOut !== undefined && element.knockedOut > 0) {
                                      return (
                                        <span>
                                          {' '}
                                          (<FormattedMessage
                                            id="battle.knock_out.abbreviation"
                                            defaultMessage="KO"
                                          />{' '}
                                          <Tooltip
                                            title={(element.knockedOut / (element.win + element.lose)).toFixed(2)}
                                          >
                                            {element.knockedOut}
                                          </Tooltip>
                                          )
                                        </span>
                                      );
                                    }
                                  })()}
                                </b>
                              </span>
                            );
                          } else {
                            return (
                              <span>
                                {element.win}
                                {(() => {
                                  if (element.knockOut !== undefined && element.knockOut > 0) {
                                    return (
                                      <span>
                                        {' '}
                                        (<FormattedMessage
                                          id="battle.knock_out.abbreviation"
                                          defaultMessage="KO"
                                        />{' '}
                                        <Tooltip title={(element.knockOut / (element.win + element.lose)).toFixed(2)}>
                                          {element.knockOut}
                                        </Tooltip>
                                        )
                                      </span>
                                    );
                                  }
                                })()}{' '}
                                - {element.lose}
                                {(() => {
                                  if (element.knockedOut !== undefined && element.knockedOut > 0) {
                                    return (
                                      <span>
                                        {' '}
                                        (<FormattedMessage
                                          id="battle.knock_out.abbreviation"
                                          defaultMessage="KO"
                                        />{' '}
                                        <Tooltip title={(element.knockedOut / (element.win + element.lose)).toFixed(2)}>
                                          {element.knockedOut}
                                        </Tooltip>
                                        )
                                      </span>
                                    );
                                  }
                                })()}
                              </span>
                            );
                          }
                        })()}
                      </Col>
                    </Row>
                  </Descriptions.Item>
                );
              });
            }
          })()}
          {(() => {
            if (this.props.stage.isSalmonRun) {
              return this.props.stage.result.map((element, index) => {
                return (
                  <Descriptions.Item
                    key={index}
                    label={
                      <FormattedMessage
                        id="job.wave.index"
                        defaultMessage="WAVE {index}"
                        values={{
                          index: index + 1
                        }}
                      />
                    }
                    span={4}
                  >
                    <Row gutter={8}>
                      <Col span={12}>
                        <Tooltip
                          title={(() => {
                            let ratio = 0;
                            if (element.clear + element.timeLimit + element.wipeOut > 0) {
                              ratio = element.clear / (element.clear + element.timeLimit + element.wipeOut);
                            }
                            return ratio.toFixed(2);
                          })()}
                        >
                          <Progress
                            className="StageStatisticsCard-job-progress"
                            percent={(() => {
                              if (element.clear + element.timeLimit + element.wipeOut > 0) {
                                return (element.clear / (element.clear + element.timeLimit + element.wipeOut)) * 100;
                              } else {
                                return 0;
                              }
                            })()}
                            showInfo={false}
                            strokeColor="#fa8c16"
                          />
                        </Tooltip>
                      </Col>
                      <Col span={12}>
                        {(() => {
                          if (element.clear > element.timeLimit + element.wipeOut) {
                            return (
                              <span>
                                <b>
                                  {element.clear} - {element.timeLimit + element.wipeOut}
                                  {(() => {
                                    if (element.timeLimit + element.wipeOut > 0) {
                                      return (
                                        <span>
                                          {' '}
                                          (
                                          <FormattedMessage
                                            id="job_result.time_limit.abbreviation"
                                            defaultMessage="Time Up"
                                          />{' '}
                                          <Tooltip
                                            title={(
                                              element.timeLimit /
                                              (element.clear + element.timeLimit + element.wipeOut)
                                            ).toFixed(2)}
                                          >
                                            {element.timeLimit}
                                          </Tooltip>{' '}
                                          /{' '}
                                          <FormattedMessage
                                            id="job_result.wipe_out.abbreviation"
                                            defaultMessage="DEFEAT"
                                          />{' '}
                                          <Tooltip
                                            title={(
                                              element.wipeOut /
                                              (element.clear + element.timeLimit + element.wipeOut)
                                            ).toFixed(2)}
                                          >
                                            {element.wipeOut}
                                          </Tooltip>
                                          )
                                        </span>
                                      );
                                    }
                                  })()}
                                </b>
                              </span>
                            );
                          } else {
                            return (
                              <span>
                                {element.clear} - {element.timeLimit + element.wipeOut}
                                {(() => {
                                  if (element.timeLimit + element.wipeOut > 0) {
                                    return (
                                      <span>
                                        {' '}
                                        (
                                        <FormattedMessage
                                          id="job_result.time_limit.abbreviation"
                                          defaultMessage="Time Up"
                                        />{' '}
                                        <Tooltip
                                          title={(
                                            element.timeLimit /
                                            (element.clear + element.timeLimit + element.wipeOut)
                                          ).toFixed(2)}
                                        >
                                          {element.timeLimit}
                                        </Tooltip>{' '}
                                        /{' '}
                                        <FormattedMessage
                                          id="job_result.wipe_out.abbreviation"
                                          defaultMessage="DEFEAT"
                                        />{' '}
                                        <Tooltip
                                          title={(
                                            element.wipeOut /
                                            (element.clear + element.timeLimit + element.wipeOut)
                                          ).toFixed(2)}
                                        >
                                          {element.wipeOut}
                                        </Tooltip>
                                        )
                                      </span>
                                    );
                                  }
                                })()}
                              </span>
                            );
                          }
                        })()}
                      </Col>
                    </Row>
                  </Descriptions.Item>
                );
              });
            }
          })()}
        </Descriptions>
      </Card>
    );
  }
}

export default StageStatisticsCard;
