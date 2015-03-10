/* global describe: false*/
/* global it: false*/
/* global before: false*/

'use strict';

var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;


var getArtist = require('../lib/getArtist');

describe('getArtist', function() {

    describe('Errors', function() {
        it('should return an Error when its called without a name', function(done) {
            return getArtist('', function(err, artistInfo) {
                expect(err.message).to.eql('"artist" cannot be an empty string');
                done();
            });
        });

        it('should return an Error when artist couldn\'t be found or has no records', function(done) {
            return getArtist('Frodo Baggins', function(err, artistInfo) {
                expect(err.message).to.eql('Frodo Baggins couldn\'t be found in the api');
                done();
            });
        });
    });

    describe('Options', function() {
        describe('fmt: json', function() {
            var testJSON;
            before(function(done) {
                fs.readFile('./test/testJSON.json', function(err, data) {
                    if (err) {
                        return done(err);
                    }
                    testJSON = JSON.parse(data.toString()).getArtist;
                    done();
                });
            });

            it('should return an json response by default', function(done) {
                return getArtist('Local Natives', function(err, artistInfo) {
                    if (err) {
                        return done(err);
                    }
                    expect(artistInfo).to.deep.eql(testJSON);
                    done();
                });
            });
        });

        describe('fmt: xml', function() {
            var testXML;
            before(function(done) {
                fs.readFile('./test/testXML.xml', function(err, data) {
                    if (err) {
                        return done(err);
                    }
                    testXML = data.toString();
                    done();
                });
            });

            it('should return a valid xml response', function(done) {
                return getArtist('Local Natives', {
                    fmt: 'xml'
                }, function(err, artistInfo) {
                    if (err) {
                        return done(err);
                    }
                    expect(artistInfo).to.equal(testXML);
                    done();
                });
            });
        });

        describe('fmt: html', function() {
            var testHTML;
            before(function(done) {
                fs.readFile('./test/testHTML.html', function(err, data) {
                    if (err) {
                        return done(err);
                    }
                    testHTML = data.toString();
                    done();
                });
            });

            it('should return a valid html response', function(done) {
                return getArtist('Local Natives', {
                    fmt: 'html'
                }, function(err, artistInfo) {
                    if (err) {
                        return done(err);
                    }
                    expect(artistInfo).to.eql(testHTML);
                    done();
                });
            });
        });

    });
});
