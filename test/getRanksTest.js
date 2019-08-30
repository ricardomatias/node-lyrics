/* global describe: false*/
/* global it: false*/
/* global before: false*/

'use strict';

const chai = require('chai');
const expect = chai.expect;

const {getSOTD, getTopSongs } = require('../lib/getRanks');

describe('getSOTD', function() {
    it('should at least return the keys of artist, song, lyrics from json', async function() {
        const data = await getSOTD();

        expect(data).to.include.keys(['artist', 'song', 'lyrics']);
    });

    it('should have the tag <songOfTheDay> when format is xml', async function() {
        const data = await getSOTD({ fmt: 'xml' });

        expect(data).to.match(/.*<songOfTheDay>.*/g);
    });
});

