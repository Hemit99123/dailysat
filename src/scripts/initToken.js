// Script to initialize the DailySAT token on Solana Devnet
const { initializeToken } = require('../lib/token/initToken');

(async () => {
  try {
    console.log('Starting DailySAT token initialization...');
    
    const tokenInfo = await initializeToken();
    
    console.log('\n=== DailySAT Token Info ===');
    console.log('Token Mint Address:', tokenInfo.tokenMint);
    console.log('Payer Public Key:', tokenInfo.payerPublicKey);
    console.log('\nToken initialization complete!');
    console.log('\nInstructions to view in Phantom:');
    console.log('1. Open Phantom wallet');
    console.log('2. Set network to Devnet (Settings → Developer Settings → Change Network)');
    console.log('3. Click "Receive" to see your wallet address');
    console.log('4. Use your wallet address in the DailySAT dashboard to receive tokens');
    console.log('5. After transfer, tokens will appear in your wallet');
    
  } catch (error) {
    console.error('Error initializing token:', error);
    process.exit(1);
  }
})(); 