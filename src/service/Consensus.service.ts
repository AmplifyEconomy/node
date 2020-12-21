import { VoteInterface } from 'community-js/lib/faces'
import { Contract, GetAddress, GetBalance } from '../util/Arweave.util'

export async function GetVotes () {
  const State = await Contract.getState(true)
  return State.votes
}

export async function StartVote (target: string, url: string) {
  const address = await GetAddress()
  const balance = await GetBalance(target)
  const votes = await GetVotes()

  let existingVote = false

  for (let i = 0; i < votes.length; i++) {
    const vote = votes[i]

    if (vote.note === url) {
      if (vote.voted.indexOf(address) === -1) {
        await Contract.vote(vote.id, 'yay')
        existingVote = true
        console.log('Existing vote found, voted to boot'.green.bold, url)
      } else {
        console.log('Already voted to boot'.green.bold, url)
      }
    }
  }

  if (existingVote === false) {
    const NewVote: VoteInterface = {
      note: url,
      qty: balance,
      target: target,
      recipient: address,
      type: 'burnVault',
      status: 'active'
    }

    const tx = await Contract.proposeVote(NewVote)
    console.log('Successfully proposed a new vote to boot'.green.bold, url)
    console.log('New vote TX ID'.green, tx)
  }
}
