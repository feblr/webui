declare namespace jsencrypt {
  export interface JSEncryptOption {
    default_key_size?: number;
    default_public_exponent?: string;
    log?: boolean;
  }

  export class JSEncrypt {
    default_key_size: number;
    default_public_exponent: string;
    log: boolean;

    constructor(options?: JSEncryptOption);
    setKey(key: string): void;
    setPrivateKey(key: string): void;
    setPublicKey(key: string): void;
    decrypt(plaintext: string): string | boolean;
    encrypt(ciphertext: string): string | boolean;
  }
}

declare module "jsencrypt" {
  export = jsencrypt;
}
