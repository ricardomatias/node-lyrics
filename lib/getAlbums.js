'use strict';

var request = require('superagent');
var map = require('lodash.map');
var filter = require('lodash.filter');
var Utils = require('./Utils');

var lyricsApi = 'http://lyrics.wikia.com/api.php';

function getAlbums(artist, opts, done) {
    // Pass the function from opts to done when user doesn't provide custom options
    done = typeof opts === 'function' ? opts : done;

    // Return error if artist arg is missing
    if (!artist) {
        return done(new Error('"artist" cannot be an empty string'));
    }

    // Options:
    //    Ignore: none (default), 'Unreleased', 'B-Sides', 'Other Songs', 'Other Releases';
    var defaultOpts = {
        ignore: null
    };

    // If no options are provided use the default ones
    opts = typeof opts === 'object' ? opts : defaultOpts;

    request.get(lyricsApi)
        .accept('json')
        .query({
            func: 'getArtist'
        })
        .query({
            artist: artist
        })
        .query({
            fmt: 'json'
        })
        .buffer() // for XML responses
        .end(function(err, res) {
            if (err) {
                return done(err);
            }

            var artistBody;

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

            var albums = map(artistBody.albums, function(elem) {
                return elem.album;
            });

            // Remove ignored albums
            if (opts.ignore !== null) {
                // In case only one album is to be ignored
                var ignore = Array.isArray(opts.ignore) ? opts.ignore : [opts.ignore];
                ignore.forEach(function(ignoreAlbum) {
                    albums = filter(albums, function(album) {
                        return album !== ignoreAlbum;
                    });
                });
            }

            return done(null, albums);
        });
}

module.exports = getAlbums;
