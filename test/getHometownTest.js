/* global describe: false*/
/* global it: false*/
/* global before: false*/

'use strict';

const chai = require('chai');
const expect = chai.expect;

const getHometown = require('../lib/getHometown');

describe('getHomeTown', function() {
    let artistInfo;

    before(async function() {
        artistInfo = await getHometown('Radiohead');
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

    it('should match the tag <getHometownResponse> when format is xml', async function() {
        const data = await getHometown('Radiohead', {
            fmt: 'xml'
        });

        expect(data).to.match(/.*<getHometownResponse>.*/g);
    });
});
