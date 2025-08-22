// server.js (Updated to handle amount validation)
require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// --- Ethers Setup (v6 Syntax) ---
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const faucetWallet = new ethers.Wallet(process.env.FAUCET_PRIVATE_KEY, provider);

const tokenAbi = ["function transfer(address to, uint256 amount)"];
const tokenInterface = new ethers.Interface(tokenAbi);

const tokenContract = new ethers.Contract(
    process.env.TOKEN_CONTRACT_ADDRESS,
    tokenInterface,
    faucetWallet
);

// --- API Endpoint ---
app.post('/claim', async (req, res) => {
    try {
        // --- MODIFIED: Get both address and amount from the request ---
        const { address, amount } = req.body;

        if (!ethers.isAddress(address)) {
            return res.status(400).json({ error: "Invalid wallet address." });
        }

        // --- NEW: Validation logic for the amount ---
        const numericAmount = parseFloat(amount);

        if (!amount || isNaN(numericAmount)) {
            return res.status(400).json({ error: "Invalid amount provided." });
        }

        if (numericAmount < 1) {
            return res.status(400).json({ error: "Claim amount must be at least 1 token." });
        }
        
        if (numericAmount > 1000) { // Safety limit
            return res.status(400).json({ error: "Claim amount cannot exceed 1000 tokens." });
        }
        // --- END OF NEW VALIDATION ---


        // --- MODIFIED: Use the validated user amount ---
        // The amount is a string from the user, parseUnits will handle it.
        const amountToSend = ethers.parseUnits(amount, 18);

        console.log(`Attempting to send ${amount.toString()} tokens to ${address}...`);

        const tx = await tokenContract.transfer(address, amountToSend);
        await tx.wait();

        console.log(`Success! Transaction Hash: ${tx.hash}`);
        res.status(200).json({ message: "Tokens claimed successfully!", txHash: tx.hash });

    } catch (error) {
        console.error("Claiming failed:", error);
        res.status(500).json({ error: "Failed to claim tokens. Please try again later." });
    }
});

app.listen(PORT, () => {
    console.log(`Token claim server running at http://localhost:${PORT}`);
});