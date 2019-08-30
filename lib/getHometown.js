'use strict';

var request = require('superagent');
var filter = require('lodash.filter');
var { parseJSON, LYRICS_API } = require('./utils');


function getHometown(artist, opts) {
    // Return error if artist arg is missing
    if (!artist) {
        return done(new Error('"artist" cannot be an empty string'));
    }

    // Options:
    //    Format: JSON (default), XML, HTML
    var defaultOpts = {
        func: 'getHometown',
        artist,
        fmt: 'json'
    };

    // If no options are provided use the default ones
    opts = typeof opts === 'object' ? Object.assign(defaultOpts, opts) : defaultOpts;

    return request
        .get(LYRICS_API)
        .query(opts)
        .buffer() // for XML responses
        .then(function(res) {
            var artistBody;

            // Parse to string without tabs
            if (opts.fmt !== 'json') {
                var resData = filter(res.text.split('\t'), function(e) {
                    return e;
                }).join('');

                return resData;
            }

            // Sync: Parsing JSON with try/catch
            artistBody = parseJSON(res.text);

            return artistBody;
        });
}

module.exports = getHometown;
