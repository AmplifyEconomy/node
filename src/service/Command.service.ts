import { randomBytes, createHash } from 'crypto'
import { Server } from '../Amplify'
import { KeyRoute, HandshakeRoute } from '../routes/Handshake.routes'
import { VoteRoute } from '../routes/Consensus.routes'
import { LoadWallet, GetAddress, LoadCommunity } from '../util/Arweave.util'
import { InitiateHandshake } from './Handshake.service'
import { InitiateProbe } from './Probe.service'

export function DeployCommand (Command) {
  Command
    .description('Amplify | A CLI tool to deploy an Amplify Full Node or Probe Node')
    .option('--gateway [url]', 'the url of the Amplify full node, must be specified when running a probe node', 'http://0.0.0.0:3000')
    .option('--frequency [ms]', 'the frequency to test and validate peer Gateways (in ms)', '60000')
    .option('--secret [key]', 'the shared secret key to verify communication between nodes', (process.env.SECRET || 'secret'))
    .option('--host [host]', 'the host to listen on', (process.env.HOST || '0.0.0.0'))
    .option('--port [port]', 'the port to listen on', (process.env.PORT || '3000'))
    .option('--wallet [wallet]', 'the path to your Arweave wallet', (process.env.WALLET || '.arweave.creds.json'))

  Command
    .command('secret')
    .description('generate a new and random secret')
    .action(() => {
      const hash = createHash('sha256')
      const string = hash.update(randomBytes(16)).digest().toString('hex')

      console.log('Generated a new secret'.green.bold, string, '\n')
    })

  Command
    .command('start')
    .description('starts a full node')
    .action(async () => {
      Server.get('/key', KeyRoute)
      Server.post('/handshake', HandshakeRoute)
      Server.post('/vote', VoteRoute)

      const address = await GetAddress()
      console.log(`Successfully loaded wallet with ${address}`.green.bold)
      await LoadCommunity()

      Server.listen(Command.port, () => {
        console.log(`Amplify Full Node is running on ${Command.host}:${Command.port}`.green.bold)
      })
    })

  Command
    .command('probe')
    .description('starts a probe node')
    .action(async () => {
      console.log('Amplify Probe Node is connecting to', Command.gateway)

      await InitiateHandshake()
      await InitiateProbe()
    })
}
