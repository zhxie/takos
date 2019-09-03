class TimeConverter {
  static getScheduleTime = time => {
    var date = new Date(time * 1000);
    var hours = date.getHours();
    var minutes = '0' + date.getMinutes();
    var seconds = '0' + date.getSeconds();
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  };

  static getSchedulePeriod = (startTime, endTime) => {
    return (
      this.getScheduleTime(startTime) + ' - ' + this.getScheduleTime(endTime)
    );
  };

  static getRemainedTime = time => {
    var now = new Date();
    var diff = new Date(time * 1000) - now;
    if (diff < 0) {
      return 'in 0 min';
    } else {
      var days = Math.floor(diff / (24 * 3600 * 1000));
      var hours = Math.floor((diff - days * 24 * 3600 * 1000) / (3600 * 1000));
      var minutes = Math.floor(
        (diff - days * 24 * 3600 * 1000 - hours * 3600 * 1000) / (60 * 1000)
      );
      if (days > 0) {
        return 'in ' + days + ' day ' + hours + ' hour ' + minutes + ' min';
      } else if (hours > 0) {
        return 'in ' + hours + ' hour ' + minutes + ' min';
      } else {
        return 'in ' + minutes + ' min';
      }
    }
  };
}

export default TimeConverter;
