// server.js (Final Debug Version)
require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');

const app = express();

app.use(express.json());
app.use(express.static('public'));

// --- Ethers Setup with Error Catching ---
let provider, faucetWallet, tokenContract, initializationError;

try {
    provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    faucetWallet = new ethers.Wallet(process.env.FAUCET_PRIVATE_KEY, provider);

    const tokenAbi = ["function transfer(address to, uint256 amount)"];
    const tokenInterface = new ethers.Interface(tokenAbi);

    tokenContract = new ethers.Contract(
        process.env.TOKEN_CONTRACT_ADDRESS,
        tokenInterface,
        faucetWallet
    );
    console.log("Ethers setup successful.");
} catch (error) {
    console.error("CRITICAL ERROR DURING INITIALIZATION:", error);
    initializationError = error.message; // Store the error message
}

// --- API Endpoint ---
app.post('/claim', async (req, res) => {
    // FIRST, check if the initialization failed.
    if (initializationError) {
        return res.status(500).json({ error: `Server initialization failed: ${initializationError}` });
    }
    
    try {
        const { address, amount } = req.body;

        if (!ethers.isAddress(address)) {
            return res.status(400).json({ error: "Invalid wallet address." });
        }

        const numericAmount = parseFloat(amount);

        if (!amount || isNaN(numericAmount)) {
            return res.status(400).json({ error: "Invalid amount provided." });
        }

        if (numericAmount < 1) {
            return res.status(400).json({ error: "Claim amount must be at least 1 token." });
        }
        
        if (numericAmount > 1000) { 
            return res.status(400).json({ error: "Claim amount cannot exceed 1000 tokens." });
        }

        const amountToSend = ethers.parseUnits(amount, 18);
        const tx = await tokenContract.transfer(address, amountToSend);
        await tx.wait();

        res.status(200).json({ message: "Tokens claimed successfully!", txHash: tx.hash });

    } catch (error) {
        console.error("Claiming failed:", error);
        res.status(500).json({ error: "Failed to claim tokens. Please try again later." });
    }
});

// Export the app for Vercel to use
module.exports = app;