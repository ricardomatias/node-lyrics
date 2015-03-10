'use strict';

var request = require('superagent');
var cheerio = require('cheerio');
var filter = require('lodash.filter');
var map = require('lodash.map');
var includes = require('lodash.includes');
var http = require('http');

var getArtist = require('./getArtist');
var getSong = require('./getSong');

var keepAliveAgent = new http.Agent({
    keepAlive: true
});

function parseLyrics(artist, song, done) {

    getSong(artist, song, function(err, songData) {
        if (err) {
            done(err);
        }

        request
            .get(songData.url)
            .agent(keepAliveAgent)
            .end(function(err, res) {
                if (res.statusCode !== 200) {
                    return done(new Error('Lyrics page not found'));
                }

                if (err) {
                    return done(err);
                }

                // load cheerio
                var $ = cheerio.load(res.text);
                var $lyricbox = $('.lyricbox').contents();

                // Parse Lyrics
                var lyrics = filter($lyricbox, function(child) {
                    return child.type === 'text';
                });

                lyrics = map(lyrics, function(child) {
                    return child.data;
                });

                lyrics = filter(lyrics, function(phrase) {
                        return phrase !== '\n';
                    }).join(". ")
                    .replace(/\b(\n)/g, '.')
                    .trim();

                // Parse Album's title
                var album = $('#mw-content-text')
                    .children('i')
                    .children('a')
                    .text()
                    .replace(/\s\(\d+\)$/, '');

                // artistBody
                var artistBody = {
                    song: song,
                    artist: artist,
                    album: album,
                    lyrics: lyrics
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
                        return done(null, artistBody);
                    });
                }

                return done(null, artistBody);
            });
    });
}

module.exports = parseLyrics;
