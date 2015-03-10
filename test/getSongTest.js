/* global describe: false*/
/* global it: false*/

'use strict';

var chai = require('chai');
var expect = chai.expect;

var getSong = require('../lib/getSong');

describe('getSong', function() {
    it('should return the url to the lyrics page in json', function(done) {
        getSong('Radiohead', 'Reckoner', function(err, body) {
            if (err) {
                return done(err);
            }
            expect(body.url).to.eql('http://lyrics.wikia.com/Radiohead:Reckoner');
            return done();
        });
    });

    it('should return the url to the lyrics page in xml', function(done) {
        getSong('Radiohead', 'Reckoner', {
            fmt: 'xml'
        }, function(err, body) {
            if (err) {
                return done(err);
            }
            expect(body).to.match(/.*<LyricsResult>.*/g);
            done();
        });
    });

    it('should return the url to the lyrics page in html', function(done) {
        getSong('Radiohead', 'Reckoner', {
            fmt: 'html'
        }, function(err, body) {
            if (err) {
                return done(err);
            }
            expect(body).to.match(/.*Radiohead Reckoner lyrics.*/g);
            done();
        });
    });

    it('should return an error object when lyrics aren\'t found', function(done) {
        getSong('Radiohead', 'Bonkers', function(err, body) {
            expect(err.message).to.eql('Lyrics for Radiohead - Bonkers not found');
            done();
        });
    });


});
