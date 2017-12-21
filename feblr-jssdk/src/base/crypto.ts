/// <reference path="../typings/jsencrypt.d.ts" />
import { JSEncrypt } from 'jsencrypt';

export class RSACrypto {
  crypto: JSEncrypt;

  constructor(key: string) {
    this.crypto = new JSEncrypt();
    this.crypto.setPublicKey(key);
  }

  encrypt(plaintext: string): string | boolean {
    return this.crypto.encrypt(plaintext);
  }
}
