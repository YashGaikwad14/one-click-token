import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'

// Fallback constant for mint account size when not exported
const MINT_ACCOUNT_SIZE = 82

export async function createSplToken(params: {
  cluster: 'devnet' | 'mainnet',
  decimals: number,
  initialSupply: bigint,
  payerPublicKey: PublicKey,
  signTx: (tx: Transaction) => Promise<{ signature: string }>,
}) {
  const endpoint = params.cluster === 'devnet' ? 'https://api.devnet.solana.com' : 'https://api.mainnet-beta.solana.com'
  const connection = new Connection(endpoint, 'confirmed')

  // 1) Create new mint keypair
  const mintKeypair = Keypair.generate()

  // 2) Rent-exempt lamports (use static helper if available)
  let lamportsForMint = await connection.getMinimumBalanceForRentExemption(MINT_ACCOUNT_SIZE)
  try {
    // Some builds expose this helper
    // @ts-ignore
    lamportsForMint = await (Token as any).getMinBalanceRentForExemptMint(connection)
  } catch {}

  // 3) Derive ATA using Token.getAssociatedTokenAddress
  const ataPubkey = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mintKeypair.publicKey,
    params.payerPublicKey,
    false
  )

  // 4) Build transaction with legacy Token.* instruction builders
  const tx = new Transaction()

  // Create mint account owned by the SPL Token program
  tx.add(SystemProgram.createAccount({
    fromPubkey: params.payerPublicKey,
    newAccountPubkey: mintKeypair.publicKey,
    lamports: lamportsForMint,
    space: MINT_ACCOUNT_SIZE,
    programId: TOKEN_PROGRAM_ID,
  }))

  // Initialize mint (mint & freeze authority = payer)
  tx.add(
    Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mintKeypair.publicKey,
      params.decimals,
      params.payerPublicKey,
      params.payerPublicKey,
    )
  )

  // Create associated token account for payer
  tx.add(
    Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mintKeypair.publicKey,
      ataPubkey,
      params.payerPublicKey,
      params.payerPublicKey,
    )
  )

  // Mint initial supply (if any)
  if (params.initialSupply > 0n) {
    tx.add(
      Token.createMintToInstruction(
        TOKEN_PROGRAM_ID,
        mintKeypair.publicKey,
        ataPubkey,
        params.payerPublicKey,
        [],
        Number(params.initialSupply),
      )
    )
  }

  // Renounce mint authority to make supply fixed (use string union AuthorityType)
  tx.add(
    Token.createSetAuthorityInstruction(
      TOKEN_PROGRAM_ID,
      mintKeypair.publicKey,
      null,
      'MintTokens',
      params.payerPublicKey,
      [],
    )
  )

  tx.feePayer = params.payerPublicKey
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

  // Partially sign with the mint key (account creation)
  tx.partialSign(mintKeypair)

  // Wallet signs as fee payer & sends
  const { signature } = await params.signTx(tx)
  await connection.confirmTransaction(signature, 'confirmed')

  return { mint: mintKeypair.publicKey.toBase58(), ata: ataPubkey.toBase58(), signature }
}