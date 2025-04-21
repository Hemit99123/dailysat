const fs = require('fs');
const path = require('path');
const { Keypair } = require('@solana/web3.js');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Function to convert a base64 secret key to a keypair
function getKeypairFromBase64(base64Key) {
  const buffer = Buffer.from(base64Key, 'base64');
  return Keypair.fromSecretKey(new Uint8Array(buffer));
}

// Manually update the .env.local file
function updateEnvFile() {
  try {
    // Check if .env.local exists
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      console.log('.env.local file not found');
      return;
    }

    // Get secret key from environment
    const payerSecretKeyB64 = process.env.PAYER_SECRET_KEY;
    if (!payerSecretKeyB64) {
      console.log('PAYER_SECRET_KEY not found in .env.local');
      return;
    }

    try {
      // Convert from base64 to keypair
      const keypair = getKeypairFromBase64(payerSecretKeyB64);
      
      // Get public key for verification
      const publicKey = keypair.publicKey.toString();
      console.log('Generated public key:', publicKey);
      
      // Read the current .env.local content
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Update the environment variables
      envContent = envContent.replace(
        /PAYER_SECRET_KEY=.*/,
        `PAYER_SECRET_KEY="${payerSecretKeyB64}"`
      );
      
      // Add SOLANA variables if they don't exist
      if (!envContent.includes('SOLANA_PAYER_SECRET_KEY')) {
        envContent += `\nSOLANA_PAYER_SECRET_KEY="${payerSecretKeyB64}"\n`;
      } else {
        envContent = envContent.replace(
          /SOLANA_PAYER_SECRET_KEY=.*/,
          `SOLANA_PAYER_SECRET_KEY="${payerSecretKeyB64}"`
        );
      }
      
      if (!envContent.includes('SOLANA_PAYER_PUBLIC_KEY')) {
        envContent += `SOLANA_PAYER_PUBLIC_KEY="${publicKey}"\n`;
      } else {
        envContent = envContent.replace(
          /SOLANA_PAYER_PUBLIC_KEY=.*/,
          `SOLANA_PAYER_PUBLIC_KEY="${publicKey}"`
        );
      }
      
      // Add token mint if it exists in NEXT_PUBLIC variables but not in SOLANA
      const mintAddress = process.env.NEXT_PUBLIC_DAILYSAT_MINT_ADDRESS;
      if (mintAddress && !envContent.includes('SOLANA_TOKEN_MINT')) {
        envContent += `SOLANA_TOKEN_MINT="${mintAddress}"\n`;
      } else if (mintAddress) {
        envContent = envContent.replace(
          /SOLANA_TOKEN_MINT=.*/,
          `SOLANA_TOKEN_MINT="${mintAddress}"`
        );
      }
      
      // Write back to .env.local
      fs.writeFileSync(envPath, envContent);
      console.log('Updated .env.local with correct key formats');
      
    } catch (error) {
      console.error('Error processing the key:', error.message);
    }
  } catch (error) {
    console.error('Error updating .env.local:', error.message);
  }
}

// Run the function
updateEnvFile(); 