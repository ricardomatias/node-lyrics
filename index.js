module.exports = {
    getAlbums: require('./lib/getAlbums'),
    getArtist: require('./lib/getArtist'),
    getHometown: require('./lib/getHometown'),
    getSOTD: require('./lib/getRanks').getSOTD,
    getTopSongs: require('./lib/getRanks').getTopSongs,
    getSong: require('./lib/getSong'),
    parseLyrics: require('./lib/parseLyrics')
}
