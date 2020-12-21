import { post } from 'superagent'
import { Keychain } from '../util/Crypto.util'
import { Command } from '../Amplify'

export const VoteQueue = []

export const TemporaryTarget = 'dow7mxks0QGGV7zOmHEE1OOi5LyfHpcrDH9n0UPw9eY'
export const TemporaryUrl = 'https://arweave.net/graphql'

export async function InitiateProbe () {
  ProbeQuery()

  setInterval(
    () => {
      ProbeQuery()
    },
    Number(Command.frequency)
  )
}

export function GenerateQuery () {
  return `query {
        transactions(ids: ["G-1t0Lqysin897HC3IV8xu_Mr884B-Mo5YEnlhUH54k"]) {
            edges {
                node {
                    id
                    tags {
                        name
                        value
                    }
                }
            }
        }
    }`
}

export async function ProbeQuery (target: string = TemporaryTarget, peer: string = TemporaryUrl) {
  console.log('Initiating Probe Query for'.green, peer)
  const query = GenerateQuery()

  const peerPayload = await post(peer).send({ query })
  const peerResult = peerPayload.text + 'error'

  const payload = await post(TemporaryUrl).send({ query })
  const result = payload.text

  if (peerResult === result) {
    console.log('Peer Gateway has passed testing'.green.bold, peer)
  } else {
    console.log('Peer Gateway has failed testing, initiated vote'.red.bold, peer)

    try {
      await post(`${Command.gateway}/vote`).send({
        key: Keychain.getPublicKey().toString('base64'),
        target,
        url: peer
      })
      console.log('Vote request received by full node'.green.bold)
    } catch (error) {
      console.error(error);
      console.log(`There was an error trying to send a vote request`.red.bold);
    }
  }
}
