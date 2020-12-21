import { get, post } from 'superagent'
import { Command } from '../Amplify'
import { Keychain, GenerateSecret, CipherMessage } from '../util/Crypto.util'

export const TrustedKeys: Array<String> = []

export async function InitiateHandshake () {
  const url = Command.gateway
  console.log('Initiating handshake with'.green, url)

  const keyData = await get(`${url}/key`)
  const PublicKey = Buffer.from(keyData.body.key, 'base64')

  const secret = GenerateSecret(Keychain, PublicKey)
  const cipher = CipherMessage(secret, Command.secret)

  const payload = await post(`${url}/handshake`)
    .send({
      key: Keychain.getPublicKey().toString('base64'),
      iv: cipher.iv.toString('base64'),
      payload: cipher.payload
    })

  if (payload.body.verified) {
    console.log('Verified as a probe node for'.green.bold, url)
  } else {
    console.log('Failed to verify with'.red.bold, url)
    console.log('Shutting down probe node, please double check your secret'.yellow.bold)
    process.exit()
  }
}
