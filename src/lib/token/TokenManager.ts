import { 
  Connection, 
  Keypair, 
  PublicKey,
  clusterApiUrl
} from '@solana/web3.js';
import { 
  createMint, 
  getOrCreateAssociatedTokenAccount, 
  mintTo, 
  transfer, 
  TOKEN_PROGRAM_ID,
  getMint
} from '@solana/spl-token';
import bs58 from 'bs58';

// Default to Devnet for testing
const SOLANA_NETWORK = 'devnet';

export class TokenManager {
  private connection: Connection;
  private payer: Keypair; // The wallet that pays for transactions
  private mintAuthority: Keypair; // The wallet that can mint new tokens
  private freezeAuthority: Keypair | null; // The wallet that can freeze token accounts
  private tokenMint: PublicKey | null = null; // The token mint address
  private decimals: number = 8; // Number of decimal places for the token
  
  constructor(payerSecretKey?: string, mintSecretKey?: string) {
    this.connection = new Connection(clusterApiUrl(SOLANA_NETWORK), 'confirmed');
    
    // Use provided secret keys or generate new ones
    this.payer = payerSecretKey 
      ? this.createKeypairFromSecret(payerSecretKey)
      : Keypair.generate();
      
    this.mintAuthority = mintSecretKey
      ? this.createKeypairFromSecret(mintSecretKey)
      : this.payer; // Use payer as mint authority by default
      
    this.freezeAuthority = this.mintAuthority; // Use mint authority as freeze authority by default
  }

  /**
   * Create a keypair from a secret key string which could be in base58 or base64 format
   */
  private createKeypairFromSecret(secretKeyString: string): Keypair {
    try {
      // First try to decode as base58
      return Keypair.fromSecretKey(bs58.decode(secretKeyString));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      try {
        // If base58 fails, try to decode as base64
        const buffer = Buffer.from(secretKeyString, 'base64');
        return Keypair.fromSecretKey(new Uint8Array(buffer));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        // If both fail, throw a more descriptive error
        throw new Error('Invalid secret key format. Must be base58 or base64 encoded.');
      }
    }
  }

  /**
   * Get the payer keypair
   */
  public getPayer(): Keypair {
    return this.payer;
  }

  /**
   * Get the address of the DailySAT token mint
   */
  public getMintAddress(): string | null {
    return this.tokenMint ? this.tokenMint.toBase58() : null;
  }

  /**
   * Get the public key of the payer
   */
  public getPayerPublicKey(): string {
    return this.payer.publicKey.toBase58();
  }

  /**
   * Get the private key of the payer (for dev purposes only!)
   */
  public getPayerSecretKey(): string {
    return bs58.encode(this.payer.secretKey);
  }

  /**
   * Request SOL from the Solana Devnet faucet
   */
  public async requestAirdrop(amount: number = 1): Promise<string> {
    const signature = await this.connection.requestAirdrop(
      this.payer.publicKey,
      amount * 1000000000 // lamports (1 SOL = 1,000,000,000 lamports)
    );
    
    await this.connection.confirmTransaction(signature);
    return signature;
  }

  /**
   * Create a new token mint for DailySAT tokens
   */
  public async createTokenMint(): Promise<string> {
    try {
      // Check if payer has enough SOL
      const balance = await this.connection.getBalance(this.payer.publicKey);
      if (balance < 5000000) { // Need at least 0.005 SOL
        await this.requestAirdrop();
      }

      // Create the token mint
      this.tokenMint = await createMint(
        this.connection,
        this.payer,
        this.mintAuthority.publicKey,
        this.freezeAuthority?.publicKey || null,
        this.decimals,
        undefined,
        { commitment: 'confirmed' },
        TOKEN_PROGRAM_ID
      );

      console.log(`Token mint created: ${this.tokenMint.toBase58()}`);
      return this.tokenMint.toBase58();
    } catch (error) {
      console.error('Error creating token mint:', error);
      throw error;
    }
  }

  /**
   * Set an existing token mint address
   */
  public setTokenMint(mintAddress: string): void {
    this.tokenMint = new PublicKey(mintAddress);
  }

  /**
   * Get token metadata
   */
  public async getTokenInfo(): Promise<{
    address: string;
    decimals: number;
    freezeAuthority: string | null;
    mintAuthority: string | null;
    isInitialized: boolean;
    supply: number;
  }> {
    if (!this.tokenMint) {
      throw new Error('Token mint not initialized');
    }

    try {
      const mintInfo = await getMint(
        this.connection,
        this.tokenMint,
        'confirmed',
        TOKEN_PROGRAM_ID
      );

      return {
        address: this.tokenMint.toBase58(),
        decimals: mintInfo.decimals,
        freezeAuthority: mintInfo.freezeAuthority?.toBase58() || null,
        mintAuthority: mintInfo.mintAuthority?.toBase58() || null,
        isInitialized: mintInfo.isInitialized,
        supply: Number(mintInfo.supply)
      };
    } catch (error) {
      console.error('Error getting token info:', error);
      throw error;
    }
  }

  /**
   * Send tokens to a recipient
   */
  public async sendTokens(recipientAddress: string, amount: number): Promise<{ signature: string, tokenAccount: string }> {
    if (!this.tokenMint) {
      throw new Error('Token mint not initialized');
    }

    try {
      // Check if sender has enough SOL for transaction fees
      const balance = await this.connection.getBalance(this.payer.publicKey);
      if (balance < 5000000) { // Need at least 0.005 SOL
        await this.requestAirdrop();
      }

      // Get or create the associated token account for the sender
      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        this.payer,
        this.tokenMint,
        this.payer.publicKey
      );

      // Mint tokens to the sender's account if needed
      const mintAmount = amount * Math.pow(10, this.decimals);
      await mintTo(
        this.connection,
        this.payer,
        this.tokenMint,
        senderTokenAccount.address,
        this.mintAuthority,
        mintAmount
      );

      // Get or create the associated token account for the recipient
      const recipientPublicKey = new PublicKey(recipientAddress);
      const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        this.payer,
        this.tokenMint,
        recipientPublicKey
      );

      // Transfer tokens from sender to recipient
      const transferSignature = await transfer(
        this.connection,
        this.payer,
        senderTokenAccount.address,
        recipientTokenAccount.address,
        this.payer, // Use payer as the owner of the sender account
        mintAmount
      );

      console.log(`Tokens transferred: ${amount} to ${recipientAddress}`);
      console.log(`Recipient token account: ${recipientTokenAccount.address.toBase58()}`);
      
      return { 
        signature: transferSignature, 
        tokenAccount: recipientTokenAccount.address.toBase58() 
      };
    } catch (error) {
      console.error('Error sending tokens:', error);
      throw error;
    }
  }
} 