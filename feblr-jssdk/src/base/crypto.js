"use strict";
/// <reference path="../typings/jsencrypt.d.ts" />
const jsencrypt_1 = require("jsencrypt");
class RSACrypto {
    constructor(key) {
        this.crypto = new jsencrypt_1.JSEncrypt();
        this.crypto.setPublicKey(key);
    }
    encrypt(plaintext) {
        return this.crypto.encrypt(plaintext);
    }
}
exports.RSACrypto = RSACrypto;
//# sourceMappingURL=crypto.js.map