import './StringHelper';

class TimeConverter {
  static getScheduleTime = time => {
    var date = new Date(time * 1000);
    var hours = date.getHours();
    var minutes = '0' + date.getMinutes();
    var seconds = '0' + date.getSeconds();
    return '{0}:{1}:{2}'.format(hours, minutes.substr(-2), seconds.substr(-2));
  };

  static getSchedulePeriod = (startTime, endTime) => {
    return this.getScheduleTime(startTime) + ' - ' + this.getScheduleTime(endTime);
  };

  static getRemainedTime = time => {
    var now = new Date();
    var diff = new Date(time * 1000) - now;
    if (diff < 0) {
      return 'in 0 min';
    } else {
      var days = Math.floor(diff / (24 * 3600 * 1000));
      var hours = Math.floor((diff - days * 24 * 3600 * 1000) / (3600 * 1000));
      var minutes = Math.floor((diff - days * 24 * 3600 * 1000 - hours * 3600 * 1000) / (60 * 1000));
      if (days > 0) {
        return 'in {0} day {1} hour {2} min'.format(days, hours, minutes);
      } else if (hours > 0) {
        return 'in {0} hour {1} min'.format(hours, minutes);
      } else {
        return 'in {0} min'.format(minutes);
      }
    }
  };
}

export default TimeConverter;
