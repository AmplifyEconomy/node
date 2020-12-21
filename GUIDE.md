# Amplify Network Guide

This guide goes over how to deploy and setup an Amplify node. Before continuing make sure you have the following.

- An Arweave Gateway

- A way to release and cycle your IP addresses

- A Linux based OS with Node.js installed

## Creating a Secret Key

Before you begin, you should create a secret key for the full and probe nodes to authenticate with each other.

```bash
amplify secret

# outputs
Generated a new secret 83e845e218ca5831e14d59a747130a787c20ab697fba900db7adea198e8d3f5c
```

Keep the newly generated secret handy for the next step.

## Starting a Full Node

The full node should be hosted on the same VPS and IP as the Arweave Gateway. Make sure your arweave wallet is accessible in the filesystem.

```bash
amplify start \
    --port 80 \
    --secret 83e845e218ca5831e14d59a747130a787c20ab697fba900db7adea198e8d3f5c \
    --wallet /path/to/wallet.jwk.json

# outputs
Amplify Full Node is running on 0.0.0.0:80
```

## Starting a Probe Node

The probe node should be hosted on a different VPS and IP than the Gateway. It must verify itself as a trusted probe by matching the secret provided to the full node.

```bash
amplify probe \
    --gateway http://gateway.url \
    --secret 83e845e218ca5831e14d59a747130a787c20ab697fba900db7adea198e8d3f5c
```

Which should then output.

```bash
Amplify Probe Node is connecting to http://gateway.url
Initiating handshake with http://gateway.url
Verified as a probe node for http://gateway.url
```

On the full node server, it will output.

```bash
Added a new trusted key BBCUlA2RqQGb9vV6QWd+iLcTO3W60uOM5XXylmXdxTZz8pRaY1lhUfvvAe/M3HTM/4nC54139QHZGhf74pp6G6M=
```

Please note that if the secret is incorrect, the probe node will automatically shut down and output.

```bash
Shutting down probe node, please double check your secret
```

## Verifying Peer Gateways

Probe nodes by default will attempt to verify a random peer gateway every minute. You can change the frequency by specifying the `--frequency` flag.

```bash
# initiate a probe request every 30 seconds instead
amplify probe \
    --frequency 30000 \
    --gateway http://gateway.url \
    --secret 83e845e218ca5831e14d59a747130a787c20ab697fba900db7adea198e8d3f5c
```

The probe node will test Gateways and output test results to the console.

```bash
Initiating Probe Query for http://peer.gateway.url
Peer Gateway has passed testing http://peer.gateway.url
```

If the Peer fails testing. It will output.

```bash
Peer Gateway has failed testing, added to vote queue http://peer.gateway.url
```

Which would then start a vote. If the full node receives the request. It outputs.

**Probe Node**:

```bash
Vote request received by full node
```

**Full Node**:

```bash
# If no existing vote to boot peer exists
Successfully proposed a new vote to boot http://peer.gateway.url
New vote TX ID TUY1f1xSc5tzCEKhKsVylMB8ly2nOGDSGgEl9rR-m78

# If there is an existing vote to boot peer
Existing vote found, voted to boot http://peer.gateway.url

# If the full node has already voted on
Already voted to boot http://peer.gateway.url
```

IF the vote request fails or is unauthorized it will output.

```bash
There was an error trying to send a vote request
```

## Voting Epochs

Voting is done autonomously and simutaneously after every `100,000` seconds UNIX time (approximately measured in Arweave blocks). Please make sure that your wallet has enough Winston to cast a vote. Elsewise you will not be eligible to receive tokens after each voting distribution cycle.

If over 51% of Peer Gateways vote that specific gateway failed testing. The Gateway is removed from the network and the staked tokens are distributed to all casters that voted against said Gateway.

## Cycling your IP Address

By default, probe nodes will attempt to access `ifconfig` to cycle your IP address. `ifconfig` will only work if your ISP has a dynamic IP. If your home network has a static IP, you might want to look into the IP Cycling Guides we have for `AWS` and `DigitalOcean`.