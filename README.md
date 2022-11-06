# Sample Hardhat Project

Hardhat project for ballot.sol

For using the scripts oyu need to do as the following:

1.  give-voting-rights
    Can be called by the chairman
    the account need to be provided through encrypted-json file
    One environment variable should be provided
    1.1. give_right_to: which is the address you want to grant the voting power

2.  casting-vote
    Can be called by an address which the voting power is already granted to
    Two environment variable should be provided
    2.1. voter: The private key of the voter
    2.2. proposalIndex: The index of the proposal which you want to vote to

        Notice: Before voting, the voting right need to be granted

3.  delegating-vote
    Can be called by an address which the voting power is already granted to
    One environment variable should be provided
    3.1. delegateTo: The address whcih you want to delegate the voting power

4.  querying-result
    Will give you the result of the voting
