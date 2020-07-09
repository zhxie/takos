/*eslint no-extend-native: ["error", { "exceptions": ["String"] }]*/

String.prototype.format = function (args) {
  let result = this;
  if (arguments.length > 0) {
    if (arguments.length === 1 && typeof args == 'object') {
      for (const key in args) {
        if (args[key] !== undefined) {
          const reg = new RegExp('({' + key + '})', 'g');
          result = result.replace(reg, args[key]);
        }
      }
    } else {
      for (let i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) {
          let reg = new RegExp('({)' + i + '(})', 'g');
          result = result.replace(reg, arguments[i]);
        }
      }
    }
  }
  return result;
};
