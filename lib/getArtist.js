'use strict';

var request = require('superagent');
var assign = require('lodash.assign');
var filter = require('lodash.filter');
var Utils = require('./Utils');

var lyricsApi = 'http://lyrics.wikia.com/api.php';

function getArtist(artist, opts, done) {
    // Pass the function from opts to done when user doesn't provide custom options
    done = typeof opts === 'function' ? opts : done;

    // Return error if artist arg is missing
    if (!artist) {
        return done(new Error('"artist" cannot be an empty string'));
    }

    // Options:
    //    Format: JSON (default), XML, HTML
    //    Ignore: none (default), 'Unreleased', 'B-Sides', 'Other Songs', 'Other Releases';
    var defaultOpts = {
        fmt: 'json',
        ignore: null
    };

    // If no options are provided use the default ones
    opts = typeof opts === 'object' ? assign(defaultOpts, opts) : defaultOpts;

    request.get(lyricsApi)
        .accept(opts.fmt)
        .query({
            func: 'getArtist'
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

            // Return if there are no albums
            if (artistBody.albums.length === 0) {
                return done(new Error(artist + ' couldn\'t be found in the api'));
            }

            // Applying ignore filtering
            if (opts.ignore !== null) {
                var ignore = Array.isArray(opts.ignore) ? opts.ignore : [opts.ignore];
                ignore.forEach(function(ignoreAlbum) {
                    artistBody = filter(artistBody.albums, function(data) {
                        return ignoreAlbum !== data.album;
                    });
                });
            }
            return done(null, artistBody);
        });
}

module.exports = getArtist;
