import { TrustedKeys } from '../service/Handshake.service'
import { StartVote } from '../service/Consensus.service'

export async function VoteRoute (req, res) {
  if (TrustedKeys.indexOf(req.body.key) !== -1) {
    await StartVote(req.body.target, req.body.url)

    return res.status(200).json({
      status: 'OK',
      message: 'Probe request accepted'
    })
  } else {
    return res.status(403).json({
      status: 'FORBIDDEN',
      message: 'Unauthorized Probe Node'
    })
  }
}
