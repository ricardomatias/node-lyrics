'use strict';

var request = require('superagent');
var cheerio = require('cheerio');
var filter = require('lodash.filter');
var map = require('lodash.map');
var forEach = require('lodash.foreach');
var includes = require('lodash.includes');

var getArtist = require('./getArtist');
var getSong = require('./getSong');


function parseLyrics(artist, song) {
    return getSong(artist, song).then(function(songData) {
        return parse(artist, song, songData.url);
    });
}

function parse(artist, song, url) {
    return request
        .get(url)
        .then(function(res) {
            if (res.statusCode !== 200) {
                return new Error('Lyrics page not found');
            }

            const lyrics = [];

            // load cheerio
            var $ = cheerio.load(res.text);
            var $lyricbox = $('.lyricbox').contents();

            // Parse Lyrics
            forEach($lyricbox, (node) => {
                if (node.type === 'text' && node.data !== '\n') {
                    lyrics.push(node.data.trim());
                }
                else if (node.type === 'tag' && node.name === 'br') {
                    lyrics.push('\n');
                }
            });

            // Parse Album's title
            var album = $('#mw-content-text')
                .children('#song-header-container')
                .children('p')
                .children('i')
                .children('a')
                .text()
                .replace(/\s\(\d+\)$/, '');

            // artistBody
            var artistBody = {
                song: song,
                artist: artist,
                album: album,
                lyrics: lyrics.join()
            };

            // Fetch album's title from API if not able parse it
            if (album === '') {
                return getArtist(artist, function(err, artistInfo) {
                    var albumName = filter(artistInfo.albums, function(elem) {
                        return includes(elem.songs, song);
                    });
                    albumName = map(albumName, function(elem) {
                        return elem.album;
                    });

                    artistBody.album = albumName[0];
                    return artistBody;
                });
            }

            return artistBody;
        });
}

module.exports = parseLyrics;
