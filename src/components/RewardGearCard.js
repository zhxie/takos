import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, Tooltip } from 'antd';

import './RewardGearCard.css';
import FileFolderUrl from '../utils/FileFolderUrl';

const { Meta } = Card;

class RewardGearCard extends React.Component {
  render() {
    return (
      <Card
        className="RewardGearCard-card"
        hoverable={this.props.hoverable}
        bordered={this.props.bordered}
        cover={
          <div className="RewardGearCard-card-stage-cover-wrapper">
            <img
              className="RewardGearCard-card-stage-cover"
              alt="gear"
              src={FileFolderUrl.SPLATNET + this.props.gear.url}
            />
          </div>
        }
        bodyStyle={{
          padding: '6px'
        }}
        style={(() => {
          if (this.props.pointer) {
            return {
              cursor: 'pointer'
            };
          }
        })()}
      >
        <Meta
          className="RewardGearCard-card-meta"
          avatar={
            <Tooltip title={<FormattedMessage id={this.props.gear.brand.brand.name} />}>
              <img
                className="RewardGearCard-card-meta-image"
                src={FileFolderUrl.SPLATNET + this.props.gear.brand.url}
                alt="icon"
              />
            </Tooltip>
          }
          title={<FormattedMessage id={this.props.gear.gear.name} />}
          description={<FormattedMessage id="app.shifts.reward" defaultMessage="Current Gear" />}
        />
      </Card>
    );
  }
}

RewardGearCard.defaultProps = {
  bordered: true,
  hoverable: true,
  pointer: false
};

export default RewardGearCard;
