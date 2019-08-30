'use strict';

var request = require('superagent');
var filter = require('lodash.filter');
var { parseJSON, LYRICS_API } = require('./utils');


function getRanks(getFn, opts) {
    // Options:
    //    Format: JSON (default), XML
    var defaultOpts = {
        func: getFn,
        fmt: 'json',
        limit: 30,
    };

    // If no options are provided use the default ones
    opts = typeof opts === 'object' ? Object.assign(defaultOpts, opts) : defaultOpts;

    return request
        .get(LYRICS_API)
        .accept(opts.fmt)
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

exports.getSOTD = function(opts) {
    return getRanks('getSOTD', opts);
};

// ! DEPRECATED
// exports.getTopSongs = function(opts) {
//     return getRanks('getTopSongs', opts);
// };
