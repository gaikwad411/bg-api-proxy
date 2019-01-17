var expect = require('chai').expect;
var config = require('./config.js');


describe('config is set', function () {
    
    it('config should have port key', function () {
        expect(config.port).not.to.be.undefined();
    });

    it('config should have proxyURL', function () {
        expect(config.proxyURL).not.to.be.undefined();
    });
});