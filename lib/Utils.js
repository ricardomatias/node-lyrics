'use strict';

exports.parseJSON = function(data, cb) {
    var body;
    var err;
    try {
        var text = data && data.replace(/^\s*|\s*$/g, '');
        body = text && JSON.parse(text);
    } catch (e) {
        err = e;
    } finally {
        return cb(err, body);
    }
};
