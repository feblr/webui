/// <reference path="../typings/jsencrypt.d.ts" />
import { JSEncrypt } from 'jsencrypt';
export declare class RSACrypto {
    crypto: JSEncrypt;
    constructor(key: string);
    encrypt(plaintext: string): string | boolean;
}
