/* global describe: false*/
/* global it: false*/

'use strict';

const chai = require('chai');
const expect = chai.expect;

const getAlbums = require('../lib/getAlbums');

describe('getAlbums', function() {
    it('should return an array of albums', async function() {
        const albums = await getAlbums('Local Natives');

        expect(albums).to.be.eql([
            'Gorilla Manor',
            'Hummingbird',
            'Sunlit Youth',
            'Violet Street'
        ]);
    });

    it('should return an array of albums ignoring one', async function() {
        const albums = await getAlbums('Foals', { ignore: 'Other Songs' });

        expect(albums).to.be.eql([
            'Antidotes',
            'Total Life Forever',
            'Holy Fire',
            'What Went Down',
            'Everything Not Saved Will Be Lost - Part 1'
        ]);
    });
});
