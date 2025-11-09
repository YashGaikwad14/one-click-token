# One‑Click Token Creator

Create a token on **Solana (SPL)** or **Ethereum (ERC‑20)** from a single React + Vite app.

## Quick Start

```bash
# 1) Install & run
npm i
npm run dev
# open http://localhost:5173
```

- Install **Phantom** (or **Backpack**) for Solana and **MetaMask** for Ethereum.
- Switch Network dropdown to **Devnet** while testing Solana.
- Fund your devnet wallet from the Solana faucet (search: "solana devnet faucet").

## Solana (SPL) — Works Out of the Box
- Click **Connect Phantom/Backpack**.
- Fill **name, symbol, decimals, supply**.
- Click **Create Token** and approve the transactions.
- The app mints the initial supply to your ATA then **renounces mint authority** (fixed supply). You can comment that out in `src/chains/solana.ts` if you prefer mintable.

## Ethereum (ERC‑20) — Paste ABI + Bytecode Once
To deploy an ERC‑20 without adding a backend, you need to provide the compiled contract **ABI + bytecode**.

1. Open **Remix** (remix.ethereum.org).
2. Create `Token.sol` and paste the contents from `/contracts/Token.sol` in this repo.
3. In **Solidity Compiler**, select `0.8.20` (or equivalent supporting OZ v5), compile.
4. In **Deploy & Run**, choose **Injected Provider - MetaMask** (select your testnet or mainnet) and deploy with constructor args:
   - `name` (string)
   - `symbol` (string)
   - `initialSupply` (**in smallest units**: supply * 10^decimals)
   > You can do a tiny test first on a testnet like Sepolia.
5. Copy the generated **ABI** and **bytecode** from Remix (artifacts tab or compilation details).
6. Paste them into `src/chains/ethereum.ts`:
   ```ts
   export const ERC20_COMPILED = {
     abi: [ /* … ABI from Remix … */ ],
     bytecode: '0x…' // from Remix
   }
   ```
7. Restart the dev server if needed. Now the **Create Token** button will work on Ethereum.

### Why this step?
Browsers cannot compile Solidity safely/quickly. Providing precompiled bytecode keeps the app fully client‑side and avoids backend servers.

## Tests

I have added a minimal test suite using **Vitest**.

```bash
npm run test
```

- `src/__tests__/sanity.test.ts` – sanity and Buffer/Node availability checks to catch regressions.

## Common Issues

- **Buffer is not defined**: fixed by our Buffer polyfill in `src/main.tsx` and Vite config.
- **Phantom not detected**: Make sure the extension is enabled. The provider is available as `window.phantom.solana`.
- **MetaMask deploy fails**: Ensure you pasted ABI+bytecode and you are on a network with gas.
- **Decimals and Supply**: The UI asks for human‑readable supply (e.g. `1,000,000`). We convert to smallest units using `decimals`.

## Security Notes
This demo sends transactions directly from your wallet. Always review the transaction details before approving. For production, add:
- Better error handling and status steps.
- Contract verification + metadata.
- Optional features: mint authority retention, freeze authority toggles, token metadata (SPL Metadata program), logo upload.

## License
MIT
