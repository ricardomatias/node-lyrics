/* global describe: false*/
/* global it: false*/

'use strict';

const chai = require('chai');
const expect = chai.expect;

const { getSong } = require('../');

describe('getSong', function() {
    it('should return the url to the lyrics page in json', async function() {
        const { url } = await getSong('Radiohead', 'Reckoner');

        expect(url).to.eql('http://lyrics.wikia.com/Radiohead:Reckoner');
    });

    it('should return the url to the lyrics page in xml', async function() {
        const body = await getSong('Radiohead', 'Reckoner', {
            fmt: 'xml'
        });

        expect(body).to.match(/.*<LyricsResult>.*/g);
    });

    it('should return the url to the lyrics page in html', async function() {
        const body = await getSong('Radiohead', 'Reckoner', {
            fmt: 'html'
        });

        expect(body).to.match(/.*Radiohead Reckoner lyrics.*/g);
    });

    it('should return an error object when lyrics aren\'t found', async function() {
        try {
            await getSong('Radiohead', 'Bonkers');
        } catch (err) {
            expect(err.message).to.eql('Lyrics for Radiohead - Bonkers not found');
        }
    });


});
