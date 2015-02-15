[![Dependency Status](https://david-dm.org/oada/oada-client-secret.svg)](https://david-dm.org/oada/oada-client-secret)
[![License](http://img.shields.io/:license-Apache%202.0-green.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)

oada-client-secret
==================

A node library for creating and verifying client secrets

Examples
========
```js
var clientSecret = require('oada-client-secret');

var id = getOAuth2SessionClientId();
var accessCode = getOAuth2SessionAccessCode();
var audience = getOAuth2SessionAudience();
var issuer = getOAuth2Issuer();
var key = getSigningKey();

// Generate Client Secret
var cSecret =  clientSecret.generate(key, issuer, audience, accessCode);

// Verify Client Secret

clientSecret.verify(id, cSecret, accessCode, audience, function(err, valid) {
  if(valid) {
    // Approve OAuth 2.0 request
  }
});
```
