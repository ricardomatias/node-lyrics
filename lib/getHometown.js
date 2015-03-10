'use strict';

var request = require('superagent');
var filter = require('lodash.filter');
var Utils = require('./Utils');

var lyricsApi = 'http://lyrics.wikia.com/api.php';

function getHometown(artist, opts, done) {
    // Pass the function from opts to done when user doesn't provide custom options
    done = typeof opts === 'function' ? opts : done;

    // Return error if artist arg is missing
    if (!artist) {
        return done(new Error('"artist" cannot be an empty string'));
    }

    // Options:
    //    Format: JSON (default), XML, HTML
    var defaultOpts = {
        fmt: 'json'
    };

    // If no options are provided use the default ones
    opts = typeof opts === 'object' ? opts : defaultOpts;

    request
        .get(lyricsApi)
        .accept(opts.fmt)
        .query({
            func: 'getHometown'
        })
        .query({
            artist: artist
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

module.exports = getHometown;
