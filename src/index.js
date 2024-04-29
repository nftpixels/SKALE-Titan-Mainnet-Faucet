const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { isAddress } = require("ethers");
const { json, urlencoded } = require("express");
const Distribute = require("./distribute");

const app = express();

app.use(json());
app.use(urlencoded());
app.use(cors());
app.use(helmet());

let queue;

async function initializeQueue() {
  const module = await import('p-queue');
  queue = new module.default({ concurrency: 1, intervalCap: 1, interval: 10000 });
}

// Initialize the queue when the server starts
initializeQueue();

app.get("/", (_, res) => {
  return res.status(200).send("API Distributor Healthy");
});

// Claim sFUEL with this endpoint
app.get("/claim/:address", async (req, res) => {
  const { address } = req.params;

  if (!isAddress(address)) return res.status(400).send("Invalid Ethereum Address");

  try {
    // Add each request to the queue to prevent dropped requests
    const distribute = await queue.add(async () => {
      console.log("Gas Request Added To Queue...");
      let retryCount = 0;
      let distributeResponse;

      // Sometimes the network can be busy, so provide a fallback and allow the API up to 5 retries before moving on
      while (retryCount < 5) {
        try {
          distributeResponse = await Distribute({ address });
          if (distributeResponse.success) {
            break;
          } else {
            retryCount++;
            console.warn(`Gas distribution failed. Retrying (${retryCount}/5)...`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
          }
        } catch (err) {
          retryCount++;
          console.warn(`Gas distribution error. Retrying (${retryCount}/5)...`);
          console.error(err);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
        }
      }

      if (retryCount >= 5 && !distributeResponse.success) {
        return {
          success: false,
          message: "Gas distribution failed after maximum retries.",
        };
      }

      return distributeResponse;
    });

    console.log("Response from Distribute:", distribute);

    // If the API has successfully sent the gas, we can use the below data for confirmation.
    return res.status(200).send({
      success: distribute.success,
      message: distribute.message,
      data: distribute.data,
    });
  } catch (err) {
    console.error("Error processing the request:", err);
    return res.status(500).send("Internal server error.");
  }
});

app.listen(8888, () => {
  console.log("SKALE API Distributor Listening on ", 8888);
});
