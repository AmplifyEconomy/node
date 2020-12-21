## Amplify Node

The Amplify node can deploy either an Amplify Full Node or an Amplify Probe Node.

- A full node acts as an Arweave Gateway and is tethered to a staked token.

- A probe node acts as a scanning tool for the network. To identify malicious nodes.

---

### Command Line

```bash
Amplify | A CLI tool to deploy an Amplify Full Node or Probe Node

Options:
  --gateway [url]    the url of the Amplify full node, must be specified when running a probe node (default: "http://0.0.0.0:3000")
  --frequency [ms]   the frequency to test and validate peer Gateways (in ms) (default: "60000")
  --secret [key]     the shared secret key to verify communication between nodes (default: "secret")
  --host [host]      the host to listen on (default: "0.0.0.0")
  --port [port]      the port to listen on (default: "3000")
  --wallet [wallet]  the path to your Arweave wallet (default: ".arweave.creds.json")
  -h, --help         display help for command

Commands:
  secret             generate a new and random secret
  start              starts a full node
  probe              starts a probe node
  help [command]     display help for command
```

If you're looking to deploy to the Amplify network you should [read the guide](./GUIDE.md).

---

### Development

#### `yarn build`

Compiles the Amplify server into the `dist` folder.

#### `yarn start`

Starts the Amplify server. Can pass commands using this:

```bash
# output help information
yarn start --help

# start a full node
yarn start start --port 80
```

#### `yarn test`

Run the mocha unit testing suite.

#### `yarn lint`

Lint the project and fix any potential errors.