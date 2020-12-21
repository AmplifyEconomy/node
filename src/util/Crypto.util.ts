import { ECDH, createECDH, createCipheriv, createDecipheriv, randomBytes } from 'crypto'

export const CipherType = 'aes-256-ctr'

export interface CipherPayload {
    iv: Buffer;
    payload: String;
}

export function GenerateKeychain () {
  const keychain = createECDH('secp256k1')
  keychain.generateKeys()

  return keychain
}

export function GenerateSecret (keychain: ECDH, publicKey: Buffer) {
  return keychain.computeSecret(publicKey)
}

export function CipherMessage (secret: Buffer, message: string): CipherPayload {
  const iv = randomBytes(16)
  const cipher = createCipheriv(CipherType, secret, iv)
  const payload = cipher.update(message, 'utf-8', 'hex') + cipher.final('hex')
  return { iv, payload }
}

export function DecipherMessage (secret: Buffer, cipher: CipherPayload) {
  const decipher = createDecipheriv(CipherType, secret, cipher.iv)
  const message = decipher.update(Buffer.from(cipher.payload, 'hex'))
  return message + decipher.final('hex')
}

export const Keychain = GenerateKeychain()
