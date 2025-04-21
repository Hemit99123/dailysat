// Script to initialize the DailySAT token on Solana Devnet
const fs = require('fs');
const path = require('path');

// Import using transpiled file paths for CommonJS
const { Connection, Keypair, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const bs58 = require('bs58');

// Default to Devnet for testing
const SOLANA_NETWORK = 'devnet';
const DECIMALS = 8;
const KEYPAIR_FILE = path.join(__dirname, 'payer-keypair.json');

async function initializeToken() {
  try {
    console.log('Starting DailySAT token initialization...');
    
    // Check if a keypair file exists and use it, otherwise create a new one
    let payer;
    if (fs.existsSync(KEYPAIR_FILE)) {
      const keypairData = JSON.parse(fs.readFileSync(KEYPAIR_FILE, 'utf8'));
      payer = Keypair.fromSecretKey(new Uint8Array(keypairData));
      console.log('Using existing payer wallet:', payer.publicKey.toString());
    } else {
      payer = Keypair.generate();
      console.log('Created new payer wallet:', payer.publicKey.toString());
      // Save the keypair for future use
      fs.writeFileSync(
        KEYPAIR_FILE,
        JSON.stringify(Array.from(payer.secretKey)),
        'utf8'
      );
    }

    // Check current balance
    const connection = new Connection(clusterApiUrl(SOLANA_NETWORK), 'confirmed');
    const balance = await connection.getBalance(payer.publicKey);
    console.log(`Current wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);

    // Request SOL from faucet if balance is low
    if (balance < LAMPORTS_PER_SOL / 2) {
      console.log('Requesting SOL from Devnet faucet...');
      try {
        const signature = await connection.requestAirdrop(
          payer.publicKey,
          LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(signature);
        
        const newBalance = await connection.getBalance(payer.publicKey);
        console.log(`New wallet balance: ${newBalance / LAMPORTS_PER_SOL} SOL`);
      } catch (error) {
        console.log('Failed to request SOL from faucet:', error.message);
        if (balance < 0.01 * LAMPORTS_PER_SOL) {
          console.log('Insufficient balance to create a token. Please fund your wallet manually at https://faucet.solana.com');
          return;
        } else {
          console.log('Proceeding with existing balance');
        }
      }
    } else {
      console.log('Wallet has sufficient SOL, skipping airdrop request');
    }

    // Create a new token mint
    console.log('Creating token mint...');
    const tokenMint = await createMint(
      connection,
      payer,
      payer.publicKey,
      payer.publicKey,
      DECIMALS
    );
    console.log('Token mint created with address:', tokenMint.toString());

    // Create a token account for the payer
    console.log('Creating token account...');
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      tokenMint,
      payer.publicKey
    );
    console.log('Token account created:', tokenAccount.address.toString());

    // Mint some tokens to the payer's account
    console.log('Minting tokens...');
    const mintAmount = 1000 * Math.pow(10, DECIMALS); // 1000 tokens
    await mintTo(
      connection,
      payer,
      tokenMint,
      tokenAccount.address,
      payer,
      mintAmount
    );
    console.log(`Successfully minted 1000 DailySAT tokens to ${payer.publicKey.toString()}`);

    // Save token information to .env.local file
    const envContent = `
# Generated DailySAT token information
NEXT_PUBLIC_DAILYSAT_MINT_ADDRESS=${tokenMint.toString()}
NEXT_PUBLIC_PAYER_PUBLIC_KEY=${payer.publicKey.toString()}
PAYER_SECRET_KEY=${Buffer.from(payer.secretKey).toString('base64')}
`;

    fs.writeFileSync(path.join(process.cwd(), '.env.local'), envContent.trim(), 'utf8');
    console.log('Token information saved to .env.local file');

    console.log('\nToken initialization complete!');
    console.log('\nTo view your tokens in Phantom Wallet:');
    console.log('1. Open your Phantom Wallet');
    console.log('2. Switch to Solana Devnet network');
    console.log('3. Click "Add/Import token"');
    console.log(`4. Enter the mint address: ${tokenMint.toString()}`);
    console.log('5. Click "Add Token"');

    return {
      mint: tokenMint.toString(),
      payerPublicKey: payer.publicKey.toString(),
      tokenAccount: tokenAccount.address.toString()
    };
  } catch (error) {
    console.error('Error initializing token:', error);
    throw error;
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  initializeToken().catch(console.error);
}

module.exports = { initializeToken }; 