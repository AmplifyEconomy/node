import { strictEqual } from 'assert';
import { ECDH } from 'crypto';
import { GenerateKeychain, GenerateSecret, CipherMessage, DecipherMessage } from '../src/util/Crypto.util';

export interface Keychains {
    chain1: ECDH;
    chain2: ECDH;
}

describe('ECDH Crypto Communication Tests', () => {
    const keychains: Keychains = {
        chain1: null,
        chain2: null,
    };

    it('Should generate keychains', done => {
        keychains.chain1 = GenerateKeychain();
        keychains.chain2 = GenerateKeychain();

        strictEqual(keychains.chain1.getPublicKey() !== null, true);
        strictEqual(keychains.chain2.getPublicKey() !== null, true);

        done();
    });

    it('Should generate shared secrets', done => {
        const secret1 = GenerateSecret(keychains.chain1, keychains.chain2.getPublicKey());
        const secret2 = GenerateSecret(keychains.chain2, keychains.chain1.getPublicKey());

        strictEqual(secret1 !== null, true);
        strictEqual(secret2 !== null, true);

        done();
    });

    it('Should generate encrypted messages', done => {
        const secret1 = GenerateSecret(keychains.chain1, keychains.chain2.getPublicKey());
        const secret2 = GenerateSecret(keychains.chain2, keychains.chain1.getPublicKey());

        const message1 = CipherMessage(secret1, 'hello');
        const message2 = CipherMessage(secret2, 'world');

        strictEqual(message1.iv !== null, true);
        strictEqual(message2.iv !== null, true);

        strictEqual(message1.payload !== null, true);
        strictEqual(message2.payload !== null, true);

        done();
    });

    it('Should encrypt and then decrypt messages', done => {
        const secret1 = GenerateSecret(keychains.chain1, keychains.chain2.getPublicKey());
        const secret2 = GenerateSecret(keychains.chain2, keychains.chain1.getPublicKey());

        const message1 = CipherMessage(secret1, 'hello');
        const message2 = CipherMessage(secret2, 'world');

        const deciphered1 = DecipherMessage(secret2, message1);
        const deciphered2 = DecipherMessage(secret1, message2);

        strictEqual(deciphered1 === 'hello', true);
        strictEqual(deciphered2 === 'world', true);

        done();
    });
});