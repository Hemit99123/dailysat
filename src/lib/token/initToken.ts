import { TokenManager } from './TokenManager';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';

// Load environment variables
dotenv.config();

// Path to save token information
const TOKEN_INFO_PATH = path.join(process.cwd(), '.token-info.json');
const ENV_LOCAL_PATH = path.join(process.cwd(), '.env.local');

/**
 * Initialize or load the DailySAT token
 */
export async function initializeToken(): Promise<{
  tokenMint: string;
  payerPublicKey: string;
  payerSecretKey: string;
}> {
  try {
    // First check if token info already exists in .env.local
    let tokenMint = process.env.SOLANA_TOKEN_MINT || process.env.NEXT_PUBLIC_DAILYSAT_MINT_ADDRESS;
    let payerPublicKey = process.env.SOLANA_PAYER_PUBLIC_KEY || process.env.NEXT_PUBLIC_PAYER_PUBLIC_KEY;
    let payerSecretKey = process.env.SOLANA_PAYER_SECRET_KEY || process.env.PAYER_SECRET_KEY;

    if (tokenMint && payerPublicKey && payerSecretKey) {
      console.log('Loading token information from environment variables...');
      return { tokenMint, payerPublicKey, payerSecretKey };
    }

    // Second, check if token info exists in file
    if (fs.existsSync(TOKEN_INFO_PATH)) {
      console.log('Loading existing token information from file...');
      const tokenInfo = JSON.parse(fs.readFileSync(TOKEN_INFO_PATH, 'utf8'));
      return tokenInfo;
    }

    console.log('Initializing DailySAT token...');

    // Create token manager with existing keys or generate new ones
    const tokenManager = new TokenManager(payerSecretKey);

    // Check if the wallet already has some SOL
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const balance = await connection.getBalance(tokenManager.getPayer().publicKey);
    console.log(`Current wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);

    // Only request an airdrop if balance is low
    if (balance < 0.05 * LAMPORTS_PER_SOL) {
      try {
        console.log('Requesting SOL from Devnet faucet...');
        await tokenManager.requestAirdrop();
        const newBalance = await connection.getBalance(tokenManager.getPayer().publicKey);
        console.log(`New wallet balance: ${newBalance / LAMPORTS_PER_SOL} SOL`);
      } catch (error) {
        console.error('Failed to request SOL from faucet:', error);
        if (balance < 0.01 * LAMPORTS_PER_SOL) {
          throw new Error('Insufficient balance to create a token. Please fund your wallet manually at https://faucet.solana.com');
        } else {
          console.log('Proceeding with existing balance');
        }
      }
    } else {
      console.log('Wallet has sufficient SOL, skipping airdrop request');
    }

    // Create the token mint
    console.log('Creating DailySAT token mint...');
    const mintAddress = await tokenManager.createTokenMint();

    // Save token information for future use
    const tokenInfo = {
      tokenMint: mintAddress,
      payerPublicKey: tokenManager.getPayerPublicKey(),
      payerSecretKey: tokenManager.getPayerSecretKey(),
    };

    // Save token info to file
    fs.writeFileSync(TOKEN_INFO_PATH, JSON.stringify(tokenInfo, null, 2));
    console.log('Token information saved to', TOKEN_INFO_PATH);

    // Also save to .env.local for Next.js to use
    const envContent = `
# DailySAT Token Info
SOLANA_TOKEN_MINT="${mintAddress}"
SOLANA_PAYER_PUBLIC_KEY="${tokenInfo.payerPublicKey}"
SOLANA_PAYER_SECRET_KEY="${tokenInfo.payerSecretKey}"
`;

    // Check if .env.local exists, append if it does, create if not
    if (fs.existsSync(ENV_LOCAL_PATH)) {
      fs.appendFileSync(ENV_LOCAL_PATH, envContent);
    } else {
      fs.writeFileSync(ENV_LOCAL_PATH, envContent.trim());
    }

    console.log('Token info added to .env.local');
    console.log('DailySAT token initialized with mint address:', mintAddress);

    return tokenInfo;
  } catch (error) {
    console.error('Error initializing token:', error);
    throw error;
  }
}

// Run the initialization if this file is executed directly
if (require.main === module) {
  initializeToken()
    .then((tokenInfo) => {
      console.log('Token mint address:', tokenInfo.tokenMint);
      console.log('Payer public key:', tokenInfo.payerPublicKey);
      // Don't log the secret key in production code!
      console.log('Initialization complete!');
    })
    .catch((error) => {
      console.error('Initialization failed:', error);
      process.exit(1);
    });
} 