import React, { useMemo, useState } from 'react'
import { useApp } from './store'
import { ConnectButtons } from './components/ConnectButtons'

import { PublicKey } from '@solana/web3.js'
import { createSplToken } from '@/chains/solana'


export default function App(){
  const { network, setNetwork, solAddress } = useApp()

  const [forcePrompt, setForcePrompt] = useState(true)


  const [name, setName] = useState('MyToken')
  const [symbol, setSymbol] = useState('MTK')
  const [decimals, setDecimals] = useState(9)
  const [supply, setSupply] = useState('1000000')
  const [status, setStatus] = useState<string>('')
  const [result, setResult] = useState<any>(null)
  const decimalsOk = Number.isInteger(decimals) && decimals >= 0 && decimals <= 18

  const disabled = useMemo(() => {
    const hasWallet = !!solAddress
    return !hasWallet || !name || !symbol || !decimalsOk || !supply
  }, [solAddress, name, symbol, decimalsOk, supply])

  const disabledReason = useMemo(() => {
    if (!solAddress) return 'Connect your Solana wallet'
    if (!name) return 'Enter a token name'
    if (!symbol) return 'Enter a token symbol'
    if (!decimalsOk) return 'Decimals must be an integer between 0 and 18'
    if (!supply) return 'Enter an initial supply'
    return ''
  }, [solAddress, name, symbol, decimalsOk, supply])


  const onCreate = async () => {
  try {
    setStatus('Sending transaction… Approve in your wallet.');
    setResult(null);

    const units = BigInt(Math.floor(Number(supply))) * (10n ** BigInt(decimals));

    const provider = (window as any).phantom?.solana || (window as any).backpack?.solana;
    if (!provider) throw new Error('Solana wallet not found.');
    if (!solAddress) throw new Error('No Solana address connected');

    // Optional: force a fresh connect prompt first
    try { await provider.disconnect(); } catch {}
    await provider.connect({ onlyIfTrusted: false });

    const pubkey = new PublicKey(solAddress);
    const res = await createSplToken({
      cluster: network,
      decimals,
      initialSupply: units,
      payerPublicKey: pubkey,
      signTransaction: provider.signTransaction, // ✅ triggers sign modal
    });

    setResult(res);
    setStatus('✅ SPL token created!');
  } catch (err: any) {
    console.error(err);
    setStatus('❌ ' + (err?.message || 'Failed'));
  }
};




  return (
    <div className="container">
      <h1 style={{marginBottom:8}}>One‑Click Token Creator</h1>
      <p className="small">Create a token on <b>Solana</b>. Connect Phantom/Backpack or MetaMask, fill in details, and click Create. On mainnet, fees apply.</p>

      <div className="card" style={{marginTop:16}}>
        <div className="row">
          <div>
            <label>Token Name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="MyToken"/>
          </div>
          <div>
            <label>Token Symbol</label>
            <input value={symbol} onChange={(e)=>setSymbol(e.target.value)} placeholder="MTK"/>
          </div>
        </div>
        <div className="row" style={{marginTop:12}}>
          <div>
            <label>Decimals</label>
            <input type="number" value={decimals} onChange={(e)=>setDecimals(parseInt(e.target.value||'0',10))} />
          </div>
          <div>
            <label>Initial Supply (human units)</label>
            <input value={supply} onChange={(e)=>setSupply(e.target.value)} placeholder="1000000"/>
          </div>
        </div>
        <div className="row" style={{marginTop:12}}>
          <div>
            <label>Network</label>
            <select value={network} onChange={(e)=>setNetwork(e.target.value as any)}>
              <option value="devnet">Devnet (free to test)</option>
              <option value="mainnet">Mainnet (real fees)</option>
            </select>
          </div>
          <div>
            <label>Action</label>
            <button className="btn" onClick={onCreate} disabled={disabled}>Create Token</button>
            <div className="small" style={{ marginTop: 8, opacity: .9 }}>
              <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={forcePrompt}
                  onChange={(e) => setForcePrompt(e.target.checked)}
                  style={{ width: 16, height: 16 }}
                />
                Always show wallet prompt
              </label>
              {disabled && disabledReason && (
                <span className="badge warn" style={{ marginLeft: 8 }}>{disabledReason}</span>
              )}
            </div>

          </div>
        </div>
      </div>

      <ConnectButtons />

      {status && <div className="card" style={{marginTop:12}}><div className="small mono">{status}</div></div>}

        {result && (
    <div className="card" style={{ marginTop: 12 }}>
      <h3>Result</h3>
      <div className="kv">
        <div>Mint:</div>
        <div>
          <a
            className="link mono"
            href={`https://explorer.solana.com/address/${result.mint}?cluster=${network==='devnet'?'devnet':''}`}
            target="_blank"
          >
            {result.mint}
          </a>
        </div>
        <div>ATA:</div>
        <div className="mono">{result.ata}</div>
        <div>Sig:</div>
        <div className="mono">{result.signature}</div>
      </div>
    </div>
  )}


      <div className="card" style={{marginTop:12}}>
        <h3>Safety Notes</h3>
        <ul>
          <li>Devnet recommended for testing. On mainnet you pay real fees.</li>
          <li>Renouncing mint authority is enabled by default for SPL. Remove that call if you want a mintable token.</li>
          <li>For ERC‑20, the contract is standard OpenZeppelin (below). Verify source on Etherscan after deploy.</li>
        </ul>
      </div>
    </div>
  )
}
