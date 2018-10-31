'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.voting.Vote} vote
 * @transaction
 */
async function vote(vote) {
    if (!vote.votedAsset.isVoted) {
        try {
            //Update totalVote
            let assetRegistry = await getAssetRegistry('org.voting.CandidateVote');
            vote.candidateVoteAsset.totalVote++;
            await assetRegistry.update(vote.candidateVoteAsset);

            //Update Voted, set isVoted=true
            assetRegistry = await getAssetRegistry('org.voting.Voted');
            vote.votedAsset.isVoted = true;
            await assetRegistry.update(vote.votedAsset);

            // Emit an event for the modified asset.
            let event = getFactory().newEvent('org.voting', 'VoteEvent');
            event.voter = vote.votedAsset.voterId;
            event.politicalParty = vote.candidateVoteAsset.politicalParty;
            var date=new Date();
            event.time = date;
            emit(event);
        } catch (err) {
            throw new Error(err.toString());
        }

    } else {
        throw new Error('Vote submitted already');
    }
}

