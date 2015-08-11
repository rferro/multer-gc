var debug, fs, onFinished;

debug = require('debug')('multer:gc');

fs = require('fs');

onFinished = require('on-finished');

module.exports = function() {
  return function(req, res, next) {
    var cleanFn;
    cleanFn = function() {
      var arr, file, i, j, k, len, len1, len2, list, name, ref, ref1;
      list = [];
      if (req.file) {
        list.push(req.file);
      }
      if (req.files instanceof Array) {
        ref = req.files;
        for (i = 0, len = ref.length; i < len; i++) {
          file = ref[i];
          list.push(file);
        }
      } else if (typeof req.files === 'object') {
        ref1 = req.files;
        for (name in ref1) {
          arr = ref1[name];
          for (j = 0, len1 = arr.length; j < len1; j++) {
            file = arr[j];
            list.push(file);
          }
        }
      }
      for (k = 0, len2 = list.length; k < len2; k++) {
        file = list[k];
        if (file.skip || file.removed) {
          debug(file.fieldname + " " + file.path + " skipped");
        } else {
          file.removed = true;
          (function(file) {
            return fs.unlink(file.path, function(err) {
              if (err) {
                return debug(file.fieldname + " " + file.path + " remove error: " + err.message);
              } else {
                return debug(file.fieldname + " " + file.path + " removed");
              }
            });
          })(file);
        }
      }
      return null;
    };
    res.on('error', cleanFn);
    onFinished(res, cleanFn);
    return next();
  };
};
