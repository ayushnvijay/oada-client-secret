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
var key3 = {kty:'asd'};
var payload = 'accessCode';
var audience = 'Ayush';
var issuer = 'OADA';
var cSecret = secret.generate(key, issuer, audience, payload);
var cID_diff = 'ID1254@oada.com';
var cID_lookupErr = 'aasf';
var options = {
    algorithm: 'RS256',
    audience: audience,
    issuer: issuer,
    headers: {
        kid: key.kid,
        }
    };
describe("testing what generate(key) returns after passing PEM and something else",function(){
    it("should pass as key is PEM (using deep equal)",function(done){
        expect(secret.generate(key)).not.to.deep.equal(undefined);
        done();
    });
    it("should return undefined as key is not of type PEM",function(done){
        expect(secret.generate(key3)).to.deep.equal(undefined);
        done();
    })
});
describe("testing if generate(key) passes even after passing a public PEM",function(){
    it("should throw SignFinal Error",function(done){
        try{secret.generate(key2);}
    catch(e){
        expect(e.toString()).equal('Error: SignFinal error');
        //should add error to index.js files, as passing public key will break the execution
        //SignFinal error is predifined error in node.
    };
        done();
    });
});
describe("testing function generate() as a whole",function(){
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
    it("should expect jwt string",function(done){
        expect(typeof cSecret).to.deep.equal('string');
        done();
    })

});
describe("testing verify",function(){
    it("should expect client id and accessCode to be same and returns valid as false",function(done){
        secret.verify(cSecret, 'same_client', 'same_client', audience, function(err,valid){
            expect(err.toString()).to.equal('Error: Invalid clientId');
            done();
        });
    });
    it("should throw an error from lookup.js as invalid client id is passed",function(done){
        var error = new Error('Invalid clientId');
        secret.verify(cSecret,'secret@client@oada', payload, audience, function(err,valid){
            expect(err).to.deep.equal(error);
            done();
        });
    });
});

/*ToDo
need to change PEM keys ie making your own instead of getting it from diff repos!
need to get rid of all these global variables. Use editor config
Error handling with signFinal thingy
Istanbul is giving some vague errors like "describe() undefined", need to learn how to use it
Testing of verify is under progress*/
