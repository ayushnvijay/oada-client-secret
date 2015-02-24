var secret = require("../index.js");
var expect = require('chai').expect;
var fs = require('fs');
var jwt = require('jsonwebtoken');
var pem = fs.readFileSync('../../oada-id-client-js/examples/server-client/privkey.pem');
//found these keys in Alex's repo
var pem2 = fs.readFileSync('../../oada-id-client-js/examples/server-client/pubkey.pem');
var kid = '1234';
var key = {kty:'PEM',pem:pem, kid:kid};
var key2 = {kty:'PEM',pem:pem2,kid:kid};
var payload = 'accessCode';
var audience = 'Ayush';
var issuer = 'OADA';
var options = {
    algorithm: 'RS256',
    audience: audience,
    issuer: issuer,
    headers: {
        kid: key.kid,
        }
    };
describe("testing if generate(key) returns undefined even after passing PEM ",function(){
    it("should pass as key is PEM (using deep equal)",function(done){
        expect(secret.generate(key)).not.to.deep.equal(undefined);
        done();
    });
});
describe("testing if generate(key) passes even after passing a public PEM",function(){
    it("should throw SignFinal Error",function(done){
        try{
        secret.generate(key2);
        }
    catch(e){
        expect(e.toString()).equal('Error: SignFinal error');
    };
        done();
    });
});
describe("testing function generate() as a whole",function(){
    var cSecret = secret.generate(key, issuer, audience, payload);
    var decode = jwt.decode(cSecret);
    it("should expect issuer",function(done){
        expect(decode.iss).to.deep.equal(issuer);
        done();
    });
    it("should expect audience",function(done){
        expect(decode.aud).to.deep.equal(audience);
        done();
    });
    it("should expect accessCode",function(done){
        expect(decode.ac).to.deep.equal(payload);
        done();
    });
    it("should expect iat stamp to be a number",function(done){
        expect(decode.iat).to.be.a('number');
        done();
    });

});
