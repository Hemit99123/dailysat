require('dotenv').config({ path: '.env.local' });
const { Connection, Keypair, PublicKey, clusterApiUrl, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { createSetAuthorityInstruction, AuthorityType, MINT_SIZE, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
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
      // If both fail, try JSON format
      try {
        const keypairData = JSON.parse(secretKeyString);
        return Keypair.fromSecretKey(new Uint8Array(keypairData));
      } catch (_) {
        throw new Error('Invalid secret key format. Must be base58, base64, or JSON encoded.');
      }
    }
  }
}

async function setTokenName() {
  try {
    console.log("Setting DailySAT token name and symbol...");
    
    // Get token mint and payer information from environment variables
    const tokenMint = process.env.SOLANA_TOKEN_MINT || process.env.NEXT_PUBLIC_DAILYSAT_MINT_ADDRESS;
    const payerSecretKey = process.env.SOLANA_PAYER_SECRET_KEY || process.env.PAYER_SECRET_KEY;
    
    if (!tokenMint || !payerSecretKey) {
      console.error('Missing token information in .env.local');
      console.log('Required variables:');
      console.log('SOLANA_TOKEN_MINT or NEXT_PUBLIC_DAILYSAT_MINT_ADDRESS');
      console.log('SOLANA_PAYER_SECRET_KEY or PAYER_SECRET_KEY');
      return;
    }
    
    // Create connection to Solana
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    // Create keypair from secret key
    console.log('Creating keypair from secret key...');
    const payer = createKeypairFromSecret(payerSecretKey);
    console.log('Payer public key:', payer.publicKey.toString());
    
    // Convert token mint string to PublicKey
    const mintPublicKey = new PublicKey(tokenMint);
    console.log('Token mint:', mintPublicKey.toString());
    
    // Special instructions for the user
    console.log("\nImportant information about token names in Phantom Wallet:");
    console.log("1. Phantom Wallet gets token names from a centralized registry for security reasons");
    console.log("2. Custom tokens not in the registry may appear as 'Unknown token'");
    console.log("3. You can manually rename tokens in Phantom Wallet by clicking on the token and selecting 'Edit Token'");
    console.log("\nInstructions to rename in Phantom Wallet:");
    console.log("1. Open your Phantom Wallet");
    console.log("2. Find your DailySAT token (may appear as 'Unknown token')");
    console.log("3. Click on the token");
    console.log("4. Select the three dots menu (···) in the top right");
    console.log("5. Choose 'Edit token'");
    console.log("6. Enter 'DailySAT Coin' as the name and 'DSAT' as the symbol");
    console.log("7. Save the changes");

  } catch (error) {
    console.error('Error updating token name:', error);
  }
}

setTokenName(); 