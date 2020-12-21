import Arweave from 'arweave/node'
import { JWKInterface } from 'arweave/node/lib/wallet'
import Community from 'community-js'
import { readFileSync } from 'fs'
import { Command } from '../Amplify'

export const CommunityId = 'k1yecVT91Duw47s83H6gxIE0P6dopEOJA56lNeGTjNo'
export let Contract: Community = null

export const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
  logging: false
})

export async function LoadWallet () {
  try {
    const walletPath = Command.wallet
    const walletFile = readFileSync(walletPath).toString()
    const walletJWK = JSON.parse(walletFile) as JWKInterface

    return walletJWK
  } catch (error) {
    console.error(error)
    console.log('There was an error trying to load your wallet, make sure the path to your wallet is correct'.red.bold)
    process.exit()
  }
}

export async function LoadCommunity () {
  try {
    const walletJWK = await LoadWallet()
    const AmplifyCommunity = new Community(arweave, walletJWK)
    const loaded = await AmplifyCommunity.setCommunityTx(CommunityId)
    if (loaded === false) throw new Error('Failed to load Smartweave contract')
    console.log('Successfully loaded the Amplify token contract'.green.bold)

    Contract = AmplifyCommunity
    return Contract
  } catch (error) {
    console.error(error)
    console.log('There was an error trying to load the Amplify token contract, please review debug logs'.red.bold)
    process.exit()
  }
}

export async function GetAddress () {
  const walletJWK = await LoadWallet()
  return await arweave.wallets.jwkToAddress(walletJWK)
}

export async function GetBalance (target: string) {
  const balance = await Contract.getBalance(target)
  return balance
}
