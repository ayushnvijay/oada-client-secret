var secret = require("../index.js");
var expect = require('chai').expect;
var fs = require('fs');
var pem = fs.readFileSync('../../oada-id-client-js/examples/server-client/privkey.pem');
//found these keys in Alex's repo
var pem2 = fs.readFileSync('../../oada-id-client-js/examples/server-client/pubkey.pem');
var kid = '1234';
var key = {pem:pem, kid:kid};
var key2 = {pem:pem2,kid:kid};
describe("testing if generate(key) returns undefined even after passing PEM ",function(){
    it("should not pass as key is PEM (using deep equal)",function(done){
        expect(secret.generate(key)).to.deep.equal(undefined);
        done();
    });
});
//though keys are pem, generate(key) is returning value "undefined" and tests are passing!
describe("testing if generate(key) returns undefined even after passing PEM",function(){
    it("should not pass as key is PEM (using equal)",function(done){
        expect(secret.generate(key2)).to.equal(undefined);
        done();
    });
});
