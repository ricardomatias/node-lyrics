'use strict';

var request = require('superagent');
var filter = require('lodash.filter');
var Utils = require('./Utils');

var lyricsApi = 'http://lyrics.wikia.com/api.php';

function getSong(artist, song, opts, done) {
    // Pass the function from opts to done when user doesn't provide custom options
    done = typeof opts === 'function' ? opts : done;

    // return error if artist or song are empty
    if (!artist || !song) {
        return done(new Error('"artist" or "song" cannot be an empty string'));
    }

    // Options:
    //    Format: JSON (default), XML, HTML
    var defaultOpts = {
        fmt: 'realjson',
    };

    // If no options are provided use the default ones
    opts = typeof opts === 'object' ? opts : defaultOpts;

    request
        .get(lyricsApi)
        // .accept(opts.fmt)
        .query({
            artist: artist
        })
        .query({
            song: song
        })
        .query({
            fmt: opts.fmt
        })
        .buffer() // for XML responses
        .end(function(err, res) {
            if (err) {
                return done(err);
            }

            var body;

            // Parse to string without tabs
            if (opts.fmt !== 'realjson') {
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
                body = data;
            });

            if (err) {
                return done(err);
            }

            // Return error if the status code isn't 200 or if the API returns 'Not Found'
            if (res.statusCode !== 200 || body.lyrics === 'Not found') {
                return done(new Error('Lyrics for ' + artist + ' - ' + song + ' not found'));
            }

            return done(null, body);
        });
}

module.exports = getSong;
