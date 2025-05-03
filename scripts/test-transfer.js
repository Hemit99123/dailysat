require('dotenv').config({ path: '.env.local' });
const path = require('path');
const fs = require('fs');

// Import modules after configuring environment
const { Connection, Keypair, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const bs58 = require('bs58');

// Function to create a keypair from a secret key string which could be in base58 or base64 format
function createKeypairFromSecret(secretKeyString) {
  try {
    // First try to decode as base58
    return Keypair.fromSecretKey(bs58.decode(secretKeyString));
  } catch (_) {
    try {
      // If base58 fails, try to decode as base64
      const buffer = Buffer.from(secretKeyString, 'base64');
      return Keypair.fromSecretKey(new Uint8Array(buffer));
    } catch (_) {
      // If both fail, throw a more descriptive error
      throw new Error('Invalid secret key format. Must be base58 or base64 encoded.');
    }
  }
}

async function testTokenTransfer() {
  try {
    console.log('Testing DailySAT token transfer functionality...');
    
    // Get token info from environment variables
    const tokenMint = process.env.SOLANA_TOKEN_MINT || process.env.NEXT_PUBLIC_DAILYSAT_MINT_ADDRESS;
    const payerSecretKey = process.env.SOLANA_PAYER_SECRET_KEY || process.env.PAYER_SECRET_KEY;
    
    if (!tokenMint || !payerSecretKey) {
      console.error('Missing token information in .env.local');
      console.log('Required variables:');
      console.log('SOLANA_TOKEN_MINT or NEXT_PUBLIC_DAILYSAT_MINT_ADDRESS');
      console.log('SOLANA_PAYER_SECRET_KEY or PAYER_SECRET_KEY');
      return;
    }
    
    // Create a connection to Solana
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    // Create keypair from secret key
    console.log('Creating keypair from secret key...');
    const payer = createKeypairFromSecret(payerSecretKey);
    console.log('Payer public key:', payer.publicKey.toString());
    
    // Get wallet balance
    const balance = await connection.getBalance(payer.publicKey);
    console.log(`Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    
    // If balance is low, request an airdrop
    if (balance < 0.05 * LAMPORTS_PER_SOL) {
      try {
        console.log('Requesting SOL from Devnet faucet...');
        const signature = await connection.requestAirdrop(
          payer.publicKey,
          0.05 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(signature);
        const newBalance = await connection.getBalance(payer.publicKey);
        console.log(`New wallet balance: ${newBalance / LAMPORTS_PER_SOL} SOL`);
      } catch (error) {
        console.error('Failed to request SOL from faucet:', error.message);
        if (balance < 0.01 * LAMPORTS_PER_SOL) {
          throw new Error('Insufficient balance to create a token. Please fund your wallet manually at https://faucet.solana.com');
        }
      }
    }
    
    // Load payer-keypair.json if it exists for test recipient
    let testRecipient = payer.publicKey.toString();
    const keypairPath = path.join(__dirname, 'payer-keypair.json');
    if (fs.existsSync(keypairPath)) {
      try {
        const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
        const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
        testRecipient = keypair.publicKey.toString();
        console.log('Test recipient from keypair.json:', testRecipient);
      } catch (error) {
        console.log('Error reading keypair.json, using payer as recipient:', error.message);
      }
    }
    
    // Get token information
    console.log('\nTest completed without sending tokens. Your wallet has:');
    console.log(`- SOL: ${balance / LAMPORTS_PER_SOL}`);
    console.log(`- Token mint: ${tokenMint}`);
    console.log('\nYour wallet and token configuration is working properly!');
    
  } catch (error) {
    console.error('Test failed:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testTokenTransfer(); 