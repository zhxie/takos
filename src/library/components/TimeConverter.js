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
}

export default TimeConverter;
