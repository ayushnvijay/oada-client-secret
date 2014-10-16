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

function generate(key, issuer, audience, accessCode) {
    var sec = {
        ac: accessCode,
    };
    var options = {
        algorithm: 'RS256',
        audience: audience,
        issuer: issuer,
    };

    return jwt.sign(sec, key, options);
}

function verify() {
	/* Stuff here */
}

module.exports.generate = generate;
module.exports.verify = verify;
