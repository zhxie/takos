import React from 'react';
import { FormattedMessage } from 'react-intl';

import './StringHelper';

class TimeConverter {
  static getScheduleTime = time => {
    const date = new Date(time * 1000);
    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();
    const seconds = '0' + date.getSeconds();
    return (
      <FormattedMessage
        id="app.time"
        defaultMessage="{hour}:{min}:{sec}"
        values={{
          hour: hours,
          min: minutes.substr(-2),
          sec: seconds.substr(-2)
        }}
      />
    );
  };

  static getSchedulePeriod = (startTime, endTime) => {
    return (
      <div>
        {this.getScheduleTime(startTime)} - {this.getScheduleTime(endTime)}
      </div>
    );
  };

  static getRemainedTime = time => {
    const now = new Date();
    const diff = new Date(time * 1000) - now;
    if (diff < 0) {
      return (
        <FormattedMessage
          id="app.time.to.min"
          defaultMessage="in {min} min"
          values={{
            min: 0
          }}
        />
      );
    } else {
      const days = Math.floor(diff / (24 * 3600 * 1000));
      const hours = Math.floor((diff - days * 24 * 3600 * 1000) / (3600 * 1000));
      const minutes = Math.floor((diff - days * 24 * 3600 * 1000 - hours * 3600 * 1000) / (60 * 1000));
      if (days > 0) {
        return (
          <FormattedMessage
            id="app.time.to.day_hour_min"
            defaultMessage="in {day} day {hour} hour {min} min"
            values={{
              day: days,
              hour: hours,
              min: minutes
            }}
          />
        );
      } else if (hours > 0) {
        return (
          <FormattedMessage
            id="app.time.to.hour_min"
            defaultMessage="in {hour} hour {min} min"
            values={{
              hour: hours,
              min: minutes
            }}
          />
        );
      } else {
        return (
          <FormattedMessage
            id="app.time.to.min"
            defaultMessage="in {min} min"
            values={{
              min: minutes
            }}
          />
        );
      }
    }
  };
}

export default TimeConverter;
