/* global describe: false*/
/* global it: false*/
/* global before: false*/

'use strict';

var chai = require('chai');
var expect = chai.expect;

var getSOTD = require('../lib/getRanks').getSOTD;
var getTopSongs = require('../lib/getRanks').getTopSongs;

describe('getSOTD', function() {
    it('should at least return the keys of artist, song, lyrics from json', function(done) {
        getSOTD(function(err, data) {
            if (err) {
                return done(err);
            }
            expect(data).to.include.keys(['artist', 'song', 'lyrics']);
            done();
        });
    });

    it('should have the tag <songOfTheDay> when format is xml', function(done) {
        getSOTD({
            fmt: 'xml'
        }, function(err, data) {
            if (err) {
                return done(err);
            }
            expect(data).to.match(/.*<songOfTheDay>.*/g);
            done();
        });
    });
});

describe('getTopSongs', function() {
    var artistInfo;
    before(function(done) {
        getTopSongs(function(err, data) {
            if (err) {
                return done(err);
            }
            artistInfo = data;
            done();
        });
    });
    it('should return an array', function() {
        expect(artistInfo).to.be.a('array');
    });

    it('each element should have the keys rank, artist, song, url', function() {
        expect(artistInfo[0]).to.include.keys(['rank', 'artist', 'song', 'url']);
    });

    it('the last element should have the rank 10', function() {
        expect(artistInfo[artistInfo.length - 1].rank).to.eql(10);
    });

    it('should have the tag <topSongs> when format is xml', function(done) {
        getTopSongs({
            fmt: 'xml'
        }, function(err, data) {
            if (err) {
                return done(err);
            }
            expect(data).to.match(/.*<topSongs>.*/g);
            done();
        });
    });
});
