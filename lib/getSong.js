'use strict';

var request = require('superagent');
var filter = require('lodash.filter');
var { parseJSON, LYRICS_API } = require('./utils');


function getSong(artist, song, opts) {
    // return error if artist or song are empty
    if (!artist || !song) {
        return done(new Error('"artist" or "song" cannot be an empty string'));
    }

    // Options:
    //    Format: JSON (default), XML, HTML
    var defaultOpts = {
        func: 'getSong',
        artist,
        song,
        fmt: 'realjson',
    };

    // If no options are provided use the default ones
    opts = typeof opts === 'object' ? Object.assign(defaultOpts, opts) : defaultOpts;

    return request
        .get(LYRICS_API)
        .accept(opts.fmt)
        .query(opts)
        .buffer() // for XML responses
        .then(function(res) {
            // Parse to string without tabs
            if (opts.fmt !== 'realjson') {
                var resData = filter(res.text.split('\t'), function(e) {
                    return e;
                }).join('');

                return resData;
            }

            // Sync: Parsing JSON with try/catch
            const body = parseJSON(res.text);

            // Return error if the status code isn't 200 or if the API returns 'Not Found'
            if (res.statusCode !== 200 || body.lyrics === 'Not found') {
                throw new Error('Lyrics for ' + artist + ' - ' + song + ' not found');
            }

            return body;
        });
}

module.exports = getSong;
