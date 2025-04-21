require('dotenv').config({ path: '.env.local' });
const { Metaplex, keypairIdentity, bundlrStorage } = require('@metaplex-foundation/js');
const { Connection, Keypair, PublicKey, clusterApiUrl } = require('@solana/web3.js');
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

async function updateTokenMetadata() {
  try {
    console.log('Updating DailySAT token metadata...');
    
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
    
    // Initialize Metaplex
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(payer))
      .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: clusterApiUrl('devnet'),
        timeout: 60000,
      }));
    
    console.log('Creating token metadata...');
    
    // Upload metadata
    const { uri } = await metaplex.nfts().uploadMetadata({
      name: "DailySAT Coin",
      symbol: "DSAT",
      description: "DailySAT Coin is an educational token for the DailySAT app, rewarding students for completing SAT practice questions and exercises.",
      image: "https://raw.githubusercontent.com/solana-developers/assets/main/images/tokens/coin.png",
      external_url: "https://dailysat.vercel.app",
      properties: {
        files: [
          {
            uri: "https://raw.githubusercontent.com/solana-developers/assets/main/images/tokens/coin.png",
            type: "image/png"
          }
        ],
        category: "educational",
        creators: []
      }
    }).run();
    
    console.log('Metadata URI:', uri);
    
    // Create token metadata
    const { response } = await metaplex.nfts().createSft({
      updateAuthority: payer,
      mint: mintPublicKey,
      mintAuthority: payer,
      name: "DailySAT Coin",
      symbol: "DSAT",
      uri: uri,
      sellerFeeBasisPoints: 0,
      isMutable: true,
    }).run();
    
    console.log('Transaction successful!');
    console.log('Signature:', response.signature);
    console.log('Explorer URL:', `https://explorer.solana.com/tx/${response.signature}?cluster=devnet`);
    console.log('\nToken metadata updated successfully!');
    console.log('Name: DailySAT Coin');
    console.log('Symbol: DSAT');
    
    console.log('\nInstructions:');
    console.log('1. In Phantom wallet, you may need to refresh or restart the app');
    console.log('2. Your token should now appear as "DailySAT Coin" with the symbol "DSAT"');
    
  } catch (error) {
    console.error('Error updating token metadata:', error);
    if (error.name === 'TokenMetadataError' && error.message.includes('already in use')) {
      console.error('\nIt appears the metadata account already exists. You might need to update it instead of creating it.');
      console.log('\nTry restarting your Phantom wallet to see if the token name appears correctly.');
    }
  }
}

updateTokenMetadata(); 