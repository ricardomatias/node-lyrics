const utils = require('./lib/utils');
const getAlbums = require('./lib/getAlbums');
const getArtist = require('./lib/getArtist');
const getHometown = require('./lib/getHometown');
const { getSOTD } = require('./lib/getRanks');
const parseLyrics = require('./lib/parseLyrics');

module.exports = {
    getAlbums,
    getArtist,
    getHometown,
    getSOTD,
    getSong,
    parseLyrics,
}
