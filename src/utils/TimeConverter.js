import React from 'react';
import { FormattedMessage, FormattedDate, FormattedTime } from 'react-intl';

import './StringHelper';

class TimeConverter {
  static formatScheduleTime = time => {
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

  static formatSchedulePeriod = (startTime, endTime) => {
    return (
      <div>
        {this.formatScheduleTime(startTime)} - {this.formatScheduleTime(endTime)}
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

  static formatKoElapsedTime = time => {
    const minutes = parseInt(parseInt(time) / 60);
    const seconds = parseInt(time) - 60 * minutes;
    if (minutes > 0) {
      return (
        <FormattedMessage
          id="app.time.in.min_sec"
          defaultMessage="in {min} min {sec} sec"
          values={{
            min: minutes,
            sec: seconds
          }}
        />
      );
    } else {
      return (
        <FormattedMessage
          id="app.time.in.sec"
          defaultMessage="in {sec} sec"
          values={{
            sec: seconds
          }}
        />
      );
    }
  };

  static formatStartTime = time => {
    const date = new Date(time * 1000);
    return (
      <span>
        <FormattedDate value={date} /> <FormattedDate value={date} weekday="long" />{' '}
        <FormattedTime value={date} format="hour24" />
      </span>
    );
  };

  static formatElapsedTime = time => {
    const minutes = parseInt(parseInt(time) / 60);
    const seconds = '0' + (parseInt(time) - 60 * minutes);
    if (minutes > 0) {
      return (
        <span>
          {minutes}:{seconds.substr(-2)}{' '}
          <FormattedMessage
            id="app.time.elapsed.sec"
            defaultMessage="({sec} seconds)"
            values={{
              sec: parseInt(time)
            }}
          />
        </span>
      );
    }
  };
}

export default TimeConverter;
