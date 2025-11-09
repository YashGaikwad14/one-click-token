import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import { Buffer } from 'buffer'; // 🔧 Fix: add missing semicolon to avoid SyntaxError
import "./polyfills";



// Polyfill Buffer for spl-token/web3.js stacks
// @ts-ignore
window.Buffer = window.Buffer || Buffer


ReactDOM.createRoot(document.getElementById('root')!).render(
<React.StrictMode>
<App />
</React.StrictMode>
)