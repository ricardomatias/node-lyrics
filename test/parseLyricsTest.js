/* global describe: false*/
/* global it: false*/
/* global before: false*/

'use strict';

var chai = require('chai');
var expect = chai.expect;
var fs = require('fs');

var parseLyrics = require('../lib/parseLyrics');

describe('parseLyrics', function() {
    var testData;

    before(function(done) {
        fs.readFile('./test/testJSON.json', function(err, data) {
            if (err) {
                done(err);
            }
            testData = JSON.parse(data.toString()).parseLyrics;
            done();
        });
    });
    describe('James Blake:Unluck', function() {
        var artistData;

        before(function(done) {
            parseLyrics('James Blake', 'Unluck', function(err, data) {
                if (err) {
                    return done(err);
                }

                artistData = data;
                done();
            });
        });

        it('should return an object', function() {
            expect(artistData).to.be.a('object');
        });

        it('should have the keys: artist, album, lyrics, song', function() {
            expect(artistData).to.have.keys(['artist', 'album', 'song', 'lyrics']);
        });

        it('should match the artist\'s name', function() {
            expect(artistData).to.have.deep.property('artist', 'James Blake');
        });

        it('should match the song\'s name', function() {
            expect(artistData).to.have.deep.property('song', 'Unluck');
        });

        it('should match the album\'s name', function() {
            expect(artistData).to.have.deep.property('album', 'James Blake');
        });

        it('should have the same lyrics', function() {
            expect(artistData.lyrics).to.eql(testData[0].lyrics);
        });
    });

    describe('Thom Yorke:A Rat\'s Nest', function() {
        var artistData;

        before(function(done) {
            parseLyrics('Thom Yorke', 'A Rat\'s Nest', function(err, data) {
                if (err) {
                    return done(err);
                }

                artistData = data;
                done();
            });
        });

        it('should return an object', function() {
            expect(artistData).to.be.a('object');
        });

        it('should have the keys: artist, album, lyrics, song', function() {
            expect(artistData).to.have.keys(['artist', 'album', 'song', 'lyrics']);
        });

        it('should match the artist\'s name', function() {
            expect(artistData).to.have.deep.property('artist', 'Thom Yorke');
        });

        it('should match the song\'s name', function() {
            expect(artistData).to.have.deep.property('song', 'A Rat\'s Nest');
        });

        it('should match the album\'s name', function() {
            expect(artistData).to.have.deep.property('album', 'Spitting Feathers');
        });

        it('should have the same lyrics', function() {
            expect(artistData.lyrics).to.eql(testData[1].lyrics);
        });
    });

});
