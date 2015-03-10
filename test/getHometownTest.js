/* global describe: false*/
/* global it: false*/
/* global before: false*/

'use strict';

var chai = require('chai');
var expect = chai.expect;

var getHometown = require('../lib/getHometown');

describe('getHomeTown', function() {
    var artistInfo;

    before(function(done) {
        getHometown('Radiohead', function(err, data) {
            if (err) {
                return done(err);
            }
            artistInfo = data;
            done();
        });

    });
    it('should fetch the artist\'s country', function() {
        expect(artistInfo.country).to.eql('England');
    });
    it('should fetch the artist\'s state', function() {
        expect(artistInfo.state).to.eql('Oxfordshire');
    });
    it('should fetch the artist\'s hometown', function() {
        expect(artistInfo.hometown).to.eql('Abingdon');
    });

    it('should match the tag <getHometownResponse> when format is xml', function(done) {
        getHometown('Radiohead', {
            fmt: 'xml'
        }, function(err, data) {
            if (err) {
                return done(err);
            }
            expect(data).to.match(/.*<getHometownResponse>.*/g);
            done();
        });
    });
});
