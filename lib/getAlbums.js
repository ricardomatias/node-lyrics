'use strict';

var request = require('superagent');
var map = require('lodash.map');
var filter = require('lodash.filter');
var { parseJSON, LYRICS_API } = require('./utils');


function getAlbums(artist, opts) {
    // Return error if artist arg is missing
    if (!artist) {
        return done(new Error('"artist" cannot be an empty string'));
    }

    // Options:
    //    Ignore: none (default), 'Unreleased', 'B-Sides', 'Other Songs', 'Other Releases';
    var defaultOpts = {
        func: 'getArtist',
        artist,
        fmt: 'json',
        ignore: null
    };

    // If no options are provided use the default ones
    opts = typeof opts === 'object' ? Object.assign(defaultOpts, opts) : defaultOpts;

    return request.get(LYRICS_API)
        .accept('json')
        .query(opts)
        .buffer() // for XML responses
        .then((res) => {
            // Sync: Parsing JSON with try/catch
            let artistBody = parseJSON(res.text);

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

            return albums;
        });
}

module.exports = getAlbums;
