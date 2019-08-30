'use strict';

var request = require('superagent');
var assign = require('lodash.assign');
var filter = require('lodash.filter');
var { parseJSON, LYRICS_API } = require('./utils');


function getArtist(artist, opts) {
    // Return error if artist arg is missing
    if (!artist) {
        throw new Error('"artist" cannot be an empty string');
    }

    // Options:
    //    Format: JSON (default), XML, HTML
    //    Ignore: none (default), 'Unreleased', 'B-Sides', 'Other Songs', 'Other Releases';
    var defaultOpts = {
        func: 'getArtist',
        artist,
        fmt: 'json',
        ignore: null
    };

    // If no options are provided use the default ones
    opts = typeof opts === 'object' ? assign(defaultOpts, opts) : defaultOpts;

    return request.get(LYRICS_API)
        .query(opts)
        .buffer() // for XML responses
        .then(function(res) {
            // Parse to string without tabs
            if (opts.fmt !== 'json') {
                var resData = filter(res.text.split('\t'), function(e) {
                    return e;
                }).join('');

                return resData;
            }

            // Sync: Parsing JSON with try/catch
            const artistBody = parseJSON(res.text);

            // Return if there are no albums
            if (artistBody.albums.length === 0) {
                throw new Error(artist + ' couldn\'t be found in the api');
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
            return artistBody;
        });
}

module.exports = getArtist;
