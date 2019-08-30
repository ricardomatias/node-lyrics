/* global describe: false*/
/* global it: false*/
/* global before: false*/

'use strict';

var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;


var { getArtist } = require('../');

describe('getArtist', function() {

    describe('Errors', function() {
        it('should return an Error when its called without a name', async function() {
            try {
                await getArtist('');
            } catch (err) {
                expect(err.message).to.eql('"artist" cannot be an empty string');
            }
        });

        it('should return an Error when artist couldn\'t be found or has no records', async function() {
            try {
                await getArtist('Frodo Baggins');
            } catch (err) {
                expect(err.message).to.eql('Frodo Baggins couldn\'t be found in the api');
            }
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

            it('should return an json response by default', async function() {
                const artistInfo = await getArtist('Local Natives');

                expect(artistInfo).to.deep.eql(testJSON);
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

            it('should return a valid xml response', async function() {
                const artistInfo = await getArtist('Local Natives', {
                    fmt: 'xml'
                });

                expect(artistInfo).to.deep.eql(testXML);
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

            it('should return a valid html response', async function() {
                const artistInfo = await getArtist('Local Natives', {
                    fmt: 'html'
                });

                expect(artistInfo).to.deep.eql(testHTML);
            });
        });

    });
});
