import { Command } from '../Amplify'
import { CipherPayload, Keychain, GenerateSecret, DecipherMessage } from '../util/Crypto.util'
import { TrustedKeys } from '../service/Handshake.service'

export async function KeyRoute (req, res) {
  return res.status(200).json({
    status: 'OK',
    key: Keychain.getPublicKey().toString('base64')
  })
}

export async function HandshakeRoute (req, res) {
  const cipher: CipherPayload = {
    iv: Buffer.from(req.body.iv, 'base64'),
    payload: req.body.payload
  }

  const PublicKey = Buffer.from(req.body.key, 'base64')
  const secret = GenerateSecret(Keychain, PublicKey)
  const payload = DecipherMessage(secret, cipher)

  if (payload === Command.secret) {
    TrustedKeys.push(req.body.key)
    console.log('Added a new trusted key'.green.bold, req.body.key)
  } else {
    console.log('New key failed handshake'.yellow.bold, req.body.key)
  }

  return res.status(200).json({
    status: 'OK',
    verified: payload === Command.secret
  })
}
