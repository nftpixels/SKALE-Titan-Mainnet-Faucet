# Gas Distribution API

This API facilitates the distribution of gas for SKALE. It utilizes a queue system to handle requests efficiently and retries failed attempts to ensure successful gas distribution.

## Installation

To set up and run the Gas Distribution API, follow these steps:

1. Clone the repository:

```
Using you preferred method
```

2. Install dependencies:

```
npm install
```

3. Start the server:

```
npm start
```

## Endpoints

### 1. Check API Health

- **Endpoint:** `/`
- **Method:** GET
- **Description:** Verifies if the API server is healthy.
- **Response Codes:**
  - 200: API is healthy

### 2. Claim sFUEL

- **Endpoint:** `/claim/:address`
- **Method:** GET
- **Description:** Claims sFUEL for the specified Ethereum address.
- **Parameters:**
  - `address` (string): Ethereum address to claim sFUEL for.
- **Response Codes:**
  - 200: Successful gas distribution
  - 400: Invalid Ethereum address
  - 500: Internal server error
- **Response Body (Success):**
  ```
  {
    "success": true,
    "message": "Gas distributed successfully.",
    "data": { ... }
  }
  ```
- **Response Body (Failure):**
  ```
  {
    "success": false,
    "message": "Gas distribution failed after maximum retries."
  }
  ```

## Dependencies

- **express:** Fast, unopinionated, minimalist web framework for Node.js.
- **helmet:** Helps secure Express apps with various HTTP headers.
- **cors:** Enables Cross-Origin Resource Sharing (CORS) in Express.
- **ethers:** Ethereum library for handling addresses and other Ethereum-related functionality.
- **p-queue:** Promise-based, priority job queue with concurrency control.

## Usage

This API is intended for gas distribution in SKALE Applications where a seamless or invisible flow is required. It handles requests asynchronously using a queue to prevent dropped requests and retries failed attempts to ensure successful gas distribution. You'll see mechanics like this API being used all throughout the SKALE Ecosystem.