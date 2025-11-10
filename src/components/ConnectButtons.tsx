import React from 'react'
import { useApp } from '@/store'

export const ConnectButtons: React.FC = () => {
  const { setSolAddress, solAddress } = useApp()

  const connectSol = async () => {
  const provider = (window as any).phantom?.solana || (window as any).backpack?.solana
  if (!provider) { alert('Install Phantom or Backpack'); return }
  // Force a visible connect prompt
  const res = await provider.connect({ onlyIfTrusted: false })
  setSolAddress(res.publicKey.toString())
  
}


  return (
    <div className="card" style={{ marginTop: 12 }}>
      <div className="row">
        <div>
          <label>Wallet</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, width: 880 }}>
            <button onClick={connectSol} style={{ cursor: 'pointer' }}>Connect Phantom/Backpack</button>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <span className={`badge ${solAddress ? 'ok' : 'warn'}`}>
          Solana: {solAddress ? solAddress.slice(0, 6) + '…' + solAddress.slice(-4) : 'Not connected'}
        </span>
      </div>
    </div>
  )
}

export default ConnectButtons
