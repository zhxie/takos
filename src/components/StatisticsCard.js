import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Row, Col, Card, Statistic } from 'antd';

import './StatisticsCard.css';

class StatisticsCard extends React.Component {
  render() {
    return (
      <Card
        className="StatisticsCard-card"
        hoverable
        title={this.props.title}
        bodyStyle={{ padding: '16px 16px 0 16px', minHeight: '170px' }}
      >
        <Row gutter={16}>
          {(() => {
            if (this.props.total !== undefined) {
              return (
                <Col className="StatisticsCard-card-column" span={24}>
                  <Statistic
                    className="StatisticsCard-card-statistic"
                    title={<FormattedMessage id="app.total" defaultMessage="Total" />}
                    value={this.props.total}
                    suffix={this.props.totalSuffix}
                  />
                </Col>
              );
            }
          })()}
          {(() => {
            if (this.props.average !== undefined) {
              return (
                <Col className="StatisticsCard-card-column" span={12}>
                  <Statistic
                    className="StatisticsCard-card-statistic"
                    title={<FormattedMessage id="app.average" defaultMessage="Average" />}
                    value={this.props.average}
                    suffix={this.props.averageSuffix}
                  />
                </Col>
              );
            }
          })()}
          {(() => {
            if (this.props.max !== undefined) {
              return (
                <Col className="StatisticsCard-card-column" span={12}>
                  <Statistic
                    className="StatisticsCard-card-statistic"
                    title={<FormattedMessage id="app.max" defaultMessage="Max" />}
                    value={this.props.max}
                    suffix={this.props.maxSuffix}
                  />
                </Col>
              );
            }
          })()}
        </Row>
      </Card>
    );
  }
}

StatisticsCard.defaultProps = { title: null, totalSuffix: null, averageSuffix: null, maxSuffix: null };

export default StatisticsCard;
