/* Copyright 2014 Open Ag Data Alliance
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var jwt = require('jsonwebtoken');
var jwks = require('jwks-utils');
var pem = require('rsa-pem-from-mod-exp');
var lookup = require('oada-lookup');

function generate(key, issuer, audience, accessCode) {
    // Can only sign with PEM
    if(key.kty !== 'PEM') {
        // Not sure what to do here...
        return undefined;
    }

    var sec = {
        ac: accessCode,
    };
    var options = {
        algorithm: 'RS256',
        audience: audience,
        issuer: issuer,
        headers: {
            kid: key.kid,
        },
    };

    return jwt.sign(sec, key.pem, options);
}

function verify(cSecret, clientId, accessCode, aud, done) {

        lookup.clientRegistration(clientId, {timeout: 1000}, function(err, reg) {

        if(err) { return done(err); }

        var jwk = jwks.jwkForSignature(cSecret, reg);

        if(!jwk) {
            return done('JWK for client secret in the client\'s registration');
        }

        if(jwk.kty !== "RSA") {
            return done('Client secret\'s must be signed by an RSA JWK');
        }

        jwt.verify(cSecret, pem(jwk.n, jwk.e), {
            audience: aud,
            issuer: clientId,
        },
        function(err, secret) {
            if(err) { return done(err); }
            if(secret.ac != accessCode) { 
                return done(null, false);
            }

            done(null, true);
        });
    });
}

module.exports.generate = generate;
module.exports.verify = verify;
