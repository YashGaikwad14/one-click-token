# One‑Click Token Creator

Create a token on **Solana (SPL)** from a single React + Vite app with one click.

## Quick Start

```bash
# 1) Install & run
npm i
npm run dev
# open http://localhost:5173
```

- Install **Phantom** (or **Backpack**) for Solana 
- Switch Network dropdown to **Devnet** while testing Solana.
- Fund your devnet wallet from the Solana faucet (search: "solana devnet faucet").

## Solana (SPL) — Works Out of the Box
- Click **Connect Phantom/Backpack**.
- Fill **name, symbol, decimals, supply**.
- Click **Create Token** and approve the transactions.
- The app mints the initial supply to your ATA then **renounces mint authority** (fixed supply). You can comment that out in `src/chains/solana.ts` if you prefer mintable.


## Tests

I have added a minimal test suite using **Vitest**.

```bash
npm run test
```

- `src/__tests__/sanity.test.ts` – sanity and Buffer/Node availability checks to catch regressions.

## Common Issues

- **Buffer is not defined**: fixed by our Buffer polyfill in `src/main.tsx` and Vite config.
- **Phantom not detected**: Make sure the extension is enabled. The provider is available as `window.phantom.solana`.
- **Decimals and Supply**: The UI asks for human‑readable supply (e.g. `1,000,000`). We convert to smallest units using `decimals`.

## Security Notes
This demo sends transactions directly from your wallet. Always review the transaction details before approving. For production, add:
- Better error handling and status steps.
- Contract verification + metadata.
- Optional features: mint authority retention, freeze authority toggles, token metadata (SPL Metadata program), logo upload.

## License
MIT
