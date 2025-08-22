// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const claimButton = document.getElementById('claimButton');
    
    if (claimButton) {
        claimButton.addEventListener('click', async () => {
            const walletAddressInput = document.getElementById('walletAddress');
            const tokenAmountInput = document.getElementById('tokenAmount');
            const messageDiv = document.getElementById('message');

            const userAddress = walletAddressInput.value;
            const tokenAmount = tokenAmountInput.value;

            if (!userAddress || !tokenAmount) {
                messageDiv.textContent = "Please enter both a wallet address and an amount.";
                messageDiv.style.color = 'red';
                return;
            }

            claimButton.disabled = true;
            claimButton.textContent = 'Claiming...';
            messageDiv.textContent = 'Processing your request... please wait.';
            messageDiv.style.color = 'orange';

            try {
                const response = await fetch('/claim', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        address: userAddress, 
                        amount: tokenAmount 
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    // This is the line that was changed
                    messageDiv.innerHTML = `Success! Tokens sent. <br> <a href="https://amoy.polygonscan.com/tx/${result.txHash}" target="_blank" style="color: #007bff;">View Transaction</a>`;
                    messageDiv.style.color = 'green';
                } else {
                    messageDiv.textContent = `Error: ${result.error}`;
                    messageDiv.style.color = 'red';
                }

            } catch (error) {
                console.error("Fetch Error:", error);
                messageDiv.textContent = 'An unexpected network error occurred.';
                messageDiv.style.color = 'red';
            } finally {
                claimButton.disabled = false;
                claimButton.textContent = 'Claim Tokens';
            }
        });
    }
});