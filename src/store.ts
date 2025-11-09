import { create } from 'zustand'

interface AppState {
  solAddress?: string
  setSolAddress: (a?: string) => void
  network: 'devnet' | 'mainnet'
  setNetwork: (n: 'devnet' | 'mainnet') => void
}

export const useApp = create<AppState>((set) => ({
  solAddress: undefined,
  setSolAddress: (a) => set({ solAddress: a }),
  network: 'devnet',
  setNetwork: (n) => set({ network: n }),
}))
