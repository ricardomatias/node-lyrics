/* global describe: false*/
/* global it: false*/

'use strict';

var chai = require('chai');
var expect = chai.expect;

var getAlbums = require('../lib/getAlbums');

describe('getAlbums', function() {
    it('should return an array of albums', function(done) {
        getAlbums('Local Natives', function(err, albums) {
            if (err) {
                return done(err);
            }
            expect(albums).to.be.eql(['Gorilla Manor', 'Hummingbird']);
            done();
        });
    });

    it('should return an array of albums ignoring one', function(done) {
        getAlbums('Foals', {
            ignore: 'Other Songs'
        }, function(err, albums) {
            if (err) {
                return done(err);
            }
            expect(albums).to.be.eql(['Antidotes', 'Total Life Forever', 'Holy Fire']);
            done();
        });
    });
});
