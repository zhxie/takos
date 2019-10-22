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
        id="app.time.schedule"
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
        {TimeConverter.formatScheduleTime(startTime)} - {TimeConverter.formatScheduleTime(endTime)}
      </div>
    );
  };

  static formatShiftTime = time => {
    const date = new Date(time * 1000);
    const month = date.getMonth() + 1;
    const day = '0' + date.getDate();
    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();
    const seconds = '0' + date.getSeconds();
    return (
      <FormattedMessage
        id="app.time.shift"
        defaultMessage="{month}/{day} {hour}:{min}:{sec}"
        values={{
          month: month,
          day: day.substr(-2),
          hour: hours,
          min: minutes.substr(-2),
          sec: seconds.substr(-2)
        }}
      />
    );
  };

  static formatShiftPeriod = (startTime, endTime) => {
    return (
      <div>
        {TimeConverter.formatShiftTime(startTime)} - {TimeConverter.formatShiftTime(endTime)}
      </div>
    );
  };

  static getTimeTo = time => {
    const now = new Date();
    const diff = new Date(time * 1000) - now;
    if (diff < 0) {
      return (
        <FormattedMessage
          id="app.time.span.to.min"
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
            id="app.time.span.to.day_hour_min"
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
            id="app.time.span.to.hour_min"
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
            id="app.time.span.to.min"
            defaultMessage="in {min} min"
            values={{
              min: minutes
            }}
          />
        );
      }
    }
  };

  static getTimeRemained = time => {
    const now = new Date();
    const diff = new Date(time * 1000) - now;
    if (diff < 0) {
      return (
        <FormattedMessage
          id="app.time.span.to.min"
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
            id="app.time.span.remain.day_hour_min"
            defaultMessage="{day} day {hour} hour {min} min remaining"
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
            id="app.time.span.remain.hour_min"
            defaultMessage="{hour} hour {min} min remaining"
            values={{
              hour: hours,
              min: minutes
            }}
          />
        );
      } else {
        return (
          <FormattedMessage
            id="app.time.span.remain.min"
            defaultMessage="in {min} min remaining"
            values={{
              min: minutes
            }}
          />
        );
      }
    }
  };

  static formatBattleKoElapsedTime = time => {
    const minutes = parseInt(parseInt(time) / 60);
    const seconds = parseInt(time) - 60 * minutes;
    if (minutes > 0) {
      return (
        <FormattedMessage
          id="app.time.span.elapsed.in.min_sec"
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
          id="app.time.span.elapsed.in.sec"
          defaultMessage="in {sec} sec"
          values={{
            sec: seconds
          }}
        />
      );
    }
  };

  static formatResultStartTime = time => {
    const date = new Date(time * 1000);
    return (
      <span>
        <FormattedDate value={date} /> <FormattedDate value={date} weekday="long" />{' '}
        <FormattedTime value={date} format="hour24" />
      </span>
    );
  };

  static formatBattleElapsedTime = time => {
    const minutes = parseInt(parseInt(time) / 60);
    const seconds = '0' + (parseInt(time) - 60 * minutes);
    if (minutes > 0) {
      return (
        <span>
          {minutes}:{seconds.substr(-2)}{' '}
          <FormattedMessage
            id="app.time.span.elapsed.sec"
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
