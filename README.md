# Kubera

Kubera is a verifiable on-chain credit score system. Kubera is specifically designed to tackle the criteria selection for permissioned DeFi protocols. These types of protocols require users to meet certain checkpoints to be eligible for whitelisting. Kubera provides a trust minimized solution for these protocols to verify if a user meets their required threshold.

## How it workds

* Data Indexing - Onchain data is indexed using ORA protocol's CLE(previously zkGraph). The CLE ensured verifiable and tamper-proof data retrieval and computation of onchaindata.Currently, we are indexing Aave V2 contracts; specifically the Borroww and Repay events.
* Credit Formula - Our present credit score formula is at a very nascent level and is an aggreagation of the outstanding amout to be repaid by the user. However, this will be updated very soon to match a more real world credit score calculation which would include credit mix, historical length and health factor as well.
* API-
  `/insert`: To inseert data of a new user. Will fetch user's onchain data from a hardcoded specified block to current block.
  `/update`: Fetches data from Tableland API and then calculates the credit score from the last Timestamp to the current block. Once done, it is updated in the Kubera contract.
