// Script to initialize the DailySAT token on Solana Devnet
import { TokenManager } from '../src/lib/token/TokenManager.js';

(async () => {
  try {
    console.log('Starting DailySAT token initialization...');
    
    // Create new token manager
    const tokenManager = new TokenManager();
    
    // Request SOL from faucet
    console.log('Requesting SOL from Devnet faucet...');
    await tokenManager.requestAirdrop();
    
    // Create token mint
    console.log('Creating DailySAT token mint...');
    const mintAddress = await tokenManager.createTokenMint();
    
    // Get payer public key
    const payerPublicKey = tokenManager.getPayerPublicKey();
    const payerSecretKey = tokenManager.getPayerSecretKey();
    
    console.log('\n=== DailySAT Token Info ===');
    console.log('Token Mint Address:', mintAddress);
    console.log('Payer Public Key:', payerPublicKey);
    console.log('Payer Secret Key:', payerSecretKey.substring(0, 10) + '...');
    
    // Save token info
    const tokenInfo = {
      tokenMint: mintAddress,
      payerPublicKey,
      payerSecretKey
    };
    
    // Write to .env.local for server to use
    const envContent = `
# DailySAT Token Info
SOLANA_TOKEN_MINT="${mintAddress}"
SOLANA_PAYER_PUBLIC_KEY="${payerPublicKey}"
SOLANA_PAYER_SECRET_KEY="${payerSecretKey}"
`;
    
    const fs = require('fs');
    fs.appendFileSync('.env.local', envContent);
    
    console.log('\nToken info saved to .env.local');
    console.log('\nInstructions to view in Phantom:');
    console.log('1. Open Phantom wallet');
    console.log('2. Set network to Devnet (Settings → Developer Settings → Change Network)');
    console.log('3. Click "Receive" to see your wallet address');
    console.log('4. Use your wallet address in the DailySAT dashboard to receive tokens');
    console.log('5. After transfer, tokens will appear in your wallet');
    
    return tokenInfo;
  } catch (error) {
    console.error('Error initializing token:', error);
    process.exit(1);
  }
})(); 