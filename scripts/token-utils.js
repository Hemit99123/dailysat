const fs = require('fs');
const path = require('path');
const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Function to detect the format of a secret key
function detectKeyFormat(secretKey) {
  try {
    // Try base58 decode
    const decoded = bs58.decode(secretKey);
    if (decoded.length === 64) {
      return { format: 'base58', decoded };
    }
  } catch (_) {
    // Not base58
  }

  try {
    // Try base64 decode
    const buffer = Buffer.from(secretKey, 'base64');
    if (buffer.length === 64) {
      return { format: 'base64', decoded: buffer };
    }
  } catch (_) {
    // Not base64
  }

  // Check if it's a JSON array
  try {
    const array = JSON.parse(secretKey);
    if (Array.isArray(array) && array.length === 64) {
      return { format: 'json', decoded: new Uint8Array(array) };
    }
  } catch (_) {
    // Not JSON
  }

  return { format: 'unknown', decoded: null };
}

// Function to convert between formats
function convertKeyFormat(secretKey, targetFormat = 'base58') {
  const { format, decoded } = detectKeyFormat(secretKey);
  
  if (!decoded) {
    throw new Error(`Could not decode the key. Original format: ${format}`);
  }

  // Convert to target format
  switch (targetFormat) {
    case 'base58':
      return bs58.encode(Buffer.from(decoded));
    case 'base64':
      return Buffer.from(decoded).toString('base64');
    case 'json':
      return JSON.stringify(Array.from(decoded));
    default:
      throw new Error(`Unknown target format: ${targetFormat}`);
  }
}

// Function to get a keypair from a secret key string (any format)
function getKeypairFromSecretKey(secretKey) {
  const { decoded } = detectKeyFormat(secretKey);
  
  if (!decoded) {
    throw new Error('Could not decode the key');
  }

  return Keypair.fromSecretKey(new Uint8Array(decoded));
}

// Function to fix key formats in .env.local
function fixEnvKeys() {
  const envVars = [
    'SOLANA_PAYER_SECRET_KEY',
    'PAYER_SECRET_KEY'
  ];

  try {
    let envContent = fs.readFileSync('.env.local', 'utf8');
    let changes = 0;

    for (const varName of envVars) {
      const value = process.env[varName];
      if (!value) continue;

      const { format } = detectKeyFormat(value);
      
      if (format !== 'base58' && format !== 'unknown') {
        // Convert to base58 for TokenManager compatibility
        try {
          const base58Key = convertKeyFormat(value, 'base58');
          // Replace in env file
          const regex = new RegExp(`${varName}=.*`, 'g');
          envContent = envContent.replace(regex, `${varName}="${base58Key}"`);
          console.log(`Converted ${varName} from ${format} to base58`);
          changes++;
        } catch (error) {
          console.error(`Failed to convert ${varName}:`, error.message);
        }
      } else if (format === 'base58') {
        console.log(`${varName} is already in base58 format`);
      } else {
        console.log(`${varName} format is unknown, skipping`);
      }
    }

    if (changes > 0) {
      fs.writeFileSync('.env.local', envContent);
      console.log(`Updated ${changes} key(s) in .env.local`);
    } else {
      console.log('No changes needed in .env.local');
    }
  } catch (error) {
    console.error('Error fixing env keys:', error.message);
  }
}

// Function to print diagnostics
function diagnoseKeys() {
  console.log('=== Token Key Diagnostics ===');
  
  // Check environment variables
  const envVars = {
    'SOLANA_TOKEN_MINT': process.env.SOLANA_TOKEN_MINT || process.env.NEXT_PUBLIC_DAILYSAT_MINT_ADDRESS,
    'SOLANA_PAYER_PUBLIC_KEY': process.env.SOLANA_PAYER_PUBLIC_KEY || process.env.NEXT_PUBLIC_PAYER_PUBLIC_KEY,
    'SOLANA_PAYER_SECRET_KEY': process.env.SOLANA_PAYER_SECRET_KEY || process.env.PAYER_SECRET_KEY
  };

  for (const [name, value] of Object.entries(envVars)) {
    if (value) {
      if (name.includes('SECRET')) {
        // For secret keys, detect format
        const { format } = detectKeyFormat(value);
        console.log(`${name}: [${format} format]`);
        
        if (format !== 'unknown') {
          try {
            const keypair = getKeypairFromSecretKey(value);
            console.log(`  - Decoded public key: ${keypair.publicKey.toBase58()}`);
            
            // Check if the public key matches the stored public key
            const publicKeyVar = name.replace('SECRET', 'PUBLIC');
            if (envVars[publicKeyVar] && 
                envVars[publicKeyVar] !== keypair.publicKey.toBase58()) {
              console.log(`  - WARNING: Decoded public key does not match ${publicKeyVar}`);
              console.log(`    Expected: ${envVars[publicKeyVar]}`);
              console.log(`    Actual:   ${keypair.publicKey.toBase58()}`);
            }
          } catch (error) {
            console.log(`  - ERROR: Failed to create keypair: ${error.message}`);
          }
        }
      } else {
        console.log(`${name}: ${value}`);
      }
    } else {
      console.log(`${name}: [Not set]`);
    }
  }

  // Check token-info.json if exists
  const tokenInfoPath = path.join(process.cwd(), '.token-info.json');
  if (fs.existsSync(tokenInfoPath)) {
    console.log('\n=== .token-info.json ===');
    try {
      const tokenInfo = JSON.parse(fs.readFileSync(tokenInfoPath, 'utf8'));
      for (const [key, value] of Object.entries(tokenInfo)) {
        if (key.includes('Secret')) {
          const { format } = detectKeyFormat(value);
          console.log(`${key}: [${format} format]`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
    } catch (error) {
      console.log(`Error reading token-info.json: ${error.message}`);
    }
  }

  // Check payer-keypair.json if exists
  const keypairPath = path.join(__dirname, 'payer-keypair.json');
  if (fs.existsSync(keypairPath)) {
    console.log('\n=== payer-keypair.json ===');
    try {
      const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
      console.log(`Format: ${Array.isArray(keypairData) ? 'JSON array' : 'other'}`);
      
      if (Array.isArray(keypairData) && keypairData.length === 64) {
        const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
        console.log(`Public key: ${keypair.publicKey.toBase58()}`);
      }
    } catch (error) {
      console.log(`Error reading payer-keypair.json: ${error.message}`);
    }
  }
}

// Main function
function main() {
  const command = process.argv[2] || 'help';
  
  switch (command) {
    case 'diagnose':
      diagnoseKeys();
      break;
    
    case 'fix':
      fixEnvKeys();
      break;
      
    case 'convert':
      const key = process.argv[3];
      const targetFormat = process.argv[4] || 'base58';
      
      if (!key) {
        console.log('Usage: node token-utils.js convert <key> [format]');
        console.log('Formats: base58, base64, json');
        break;
      }
      
      try {
        const { format } = detectKeyFormat(key);
        console.log(`Original format: ${format}`);
        
        if (format !== 'unknown') {
          const converted = convertKeyFormat(key, targetFormat);
          console.log(`Converted to ${targetFormat}:`);
          console.log(converted);
          
          // Also show the public key
          const keypair = getKeypairFromSecretKey(key);
          console.log(`Public key: ${keypair.publicKey.toBase58()}`);
        } else {
          console.log('Could not determine the key format');
        }
      } catch (error) {
        console.error('Error converting key:', error.message);
      }
      break;
      
    default:
      console.log('DailySAT Token Utilities');
      console.log('========================');
      console.log('Commands:');
      console.log('  diagnose  - Check and diagnose token keys in .env.local');
      console.log('  fix       - Fix key formats in .env.local');
      console.log('  convert   - Convert a key between formats');
      console.log('\nUsage:');
      console.log('  node token-utils.js diagnose');
      console.log('  node token-utils.js fix');
      console.log('  node token-utils.js convert <key> [format]');
  }
}

main(); 