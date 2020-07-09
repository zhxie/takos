exports.default = async function (context) {
  var fs = require('fs');
  var localeDir = context.appOutDir + '/locales/';

  fs.readdir(localeDir, function (err, files) {
    //files is array of filenames (basename form)
    if (!(files && files.length)) return;
    for (var i = 0, len = files.length; i < len; i++) {
      if (files[i] !== 'en-US.pak' && files[i] !== 'ja.pak' && files[i] !== 'zh-CN.pak') {
        fs.unlinkSync(localeDir + files[i]);
      }
    }
  });
};
