# Kubera
## Verifiable on-chain credit score system
Kubera brings a paradigm shift with regards to how users are whitelisted for Institutional DeFi Protocols. Now, there is no need to trust any centralized provider for information regarding the credit worthiness of an user. Data on the blockchain is public and provably so. So why shouldn't we use that as a bsis for selection. These types of protocols require users to meet certain checkpoints to be eligible for whitelisting. Kubera provides a trust minimized solution for these protocols to verify if a user meets their required threshold.

## How it works

* Data Indexing - Onchain data is indexed using ORA protocol's CLE(previously zkGraph). The CLE ensured verifiable and tamper-proof data retrieval and computation of onchaindata.Currently, we are indexing Aave V2 contracts; specifically the Borroww and Repay events.
* Credit Formula - Our present credit score formula is at a very nascent level and is an aggreagation of the outstanding amout to be repaid by the user. However, this will be updated very soon to match a more real world credit score calculation which would include credit mix, historical length and health factor as well.
* Conversion - The resulting credit is in the form of Ethereum's token(ether) in wei format. This would be difficult to comprehend by a user and hence needs to be converted to a suitable format. For this purpose, we are converting to USD. <br />
* API- <br />
  `/insert`: To inseert data of a new user. Will fetch user's onchain data from a hardcoded specified block to current block. <br />
  `/update`: Fetches data from Tableland API and then calculates the credit score from the last Timestamp to the current block. Once done, it is updated in the Kubera contract.

## Workflow

* USERS - new users can request to get their credit calculated when they click on update for the first time. The code checks if there is a score mapped to the user's address. If not, it will start indexing from a hardcoded block to the current block.<br />
The purpose of hardcoding the initial block is for easier demo purpose. Theoretically, it could be set to the genesis of Aave v2(since we are indexing only Aave right now). <br />
Once the score, is updated it will send the data to the frontend which will create a transaction and store the value as well as the last block  in Tableland tables through the contract. <br />
If the user already exists in our contract, then we fetch the score and the last block indexed till and run the indexer till the current block. Hence, we do not need to re-run any previously indexed blocks for a specific user. Once completed, it will send the updated value and block to the frontend.

