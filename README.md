# Token Faucet DApp

A simple, full-stack decentralized application (DApp) that allows users to claim a specific amount of a custom ERC20 token. The project features a clean web interface and a secure backend built with Node.js and Ethers.js.



---

## Features

-   **Web Interface:** A simple HTML/CSS page for users to enter their wallet address and the desired token amount.
-   **Secure Backend:** The faucet wallet's private key is stored securely on the server and is never exposed to the frontend.
-   **Amount Validation:** The backend validates the user's requested amount against a configurable minimum and maximum limit.
-   **Direct Transaction Link:** After a successful claim, the user is provided with a direct link to view their transaction on a block explorer (e.g., Polygonscan Amoy).

---

## Tech Stack

-   **Backend:** Node.js, Express.js
-   **Blockchain Interaction:** Ethers.js
-   **Frontend:** HTML, CSS, vanilla JavaScript
-   **Environment Variables:** `dotenv`
-   **Development Server:** `nodemon`

---

## Setup and Installation

Follow these steps to get the project running on your local machine.

### *1. Clone the Repository*

```bash
git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
cd YOUR_REPOSITORY_NAME
```

### **2. Install Dependencies**

Install all the necessary npm packages.

```bash
npm install
```

### **3. Create Environment File**

Create a `.env` file in the root of the project. This file will store your secret keys and RPC URL.

```bash
touch .env
```

Now, open the `.env` file and add the following variables. **This file is critical and must not be shared.**

```env
# Your blockchain network connection URL from a provider like Alchemy or Infura
RPC_URL="YOUR_ALCHEMY_OR_INFURA_RPC_URL"

# The private key of the wallet that holds the tokens to be distributed
FAUCET_PRIVATE_KEY="YOUR_FAUCET_WALLET_PRIVATE_KEY"

# The address of your deployed ERC20 token contract
TOKEN_CONTRACT_ADDRESS="YOUR_TOKEN_CONTRACT_ADDRESS"
```

### **4. Run the Server**

Start the application using the development script, which uses `nodemon` for automatic restarts on file changes.

```bash
npm run dev
```

The server will start, and you can access the faucet by navigating to `http://localhost:3000` in your web browser.

---

## ## Configuration

You can easily configure the minimum and maximum token claim limits by editing the `server.js` file. Find the following lines and adjust the numbers as needed:

```javascript
// In server.js
if (numericAmount < 1) { // <-- Change minimum here
if (numericAmount > 1000) { // <-- Change maximum here
```
