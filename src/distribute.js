const { JsonRpcProvider, Wallet } = require("ethers");

const {
  DISTRIBUTION_VALUE,
  PRIVATE_KEY,
  RPC_URL
} = require("./config");

const provider = new JsonRpcProvider(RPC_URL);
const wallet = new Wallet(PRIVATE_KEY, provider);

async function Distribute({ address }) {
  try {
    const transaction = await wallet.sendTransaction({
      to: address,
      value: DISTRIBUTION_VALUE
    });

    // Assuming the transaction was successful, return relevant data
    return {
      success: true,
      message: "Gas distributed successfully.",
      transactionHash: transaction.hash
    };
  } catch (error) {
    // Handle errors here.. one day..
    return {
      success: false,
      message: "Gas distribution failed.",
      error: error.message // Include the error message for better debugging
    };
  }
}

module.exports = Distribute;
