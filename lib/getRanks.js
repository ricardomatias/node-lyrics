'use strict';

var request = require('superagent');
var filter = require('lodash.filter');
var Utils = require('./Utils');

var lyricsApi = 'http://lyrics.wikia.com/api.php';

function getRanks(getFn, opts, done) {
    // Pass the function from opts to done when user doesn't provide custom options
    done = typeof opts === 'function' ? opts : done;

    // Options:
    //    Format: JSON (default), XML
    var defaultOpts = {
        fmt: 'json'
    };

    // If no options are provided use the default ones
    opts = typeof opts === 'object' ? opts : defaultOpts;

    request
        .get(lyricsApi)
        .accept(opts.fmt)
        .query({
            func: getFn
        })
        .query({
            fmt: opts.fmt
        })
        .buffer() // for XML responses
        .end(function(err, res) {
            if (err) {
                return done(err);
            }
            var artistBody;

            // Parse to string without tabs
            if (opts.fmt !== 'json') {
                var resData = filter(res.text.split('\t'), function(e) {
                    return e;
                }).join('');

                return done(null, resData);
            }

            // Sync: Parsing JSON with try/catch
            Utils.parseJSON(res.text, function(err, data) {
                if (err) {
                    return done(err);
                }
                artistBody = data;
            });

            return done(null, artistBody);
        });
}

exports.getSOTD = function(opts, done) {
    return getRanks.call(this, 'getSOTD', opts, done);
};

exports.getTopSongs = function(opts, done) {
    return getRanks.call(this, 'getTopSongs', opts, done);
};
