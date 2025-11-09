// Minimal ERC‑20 with initial supply minted to deployer. Uses OZ Contracts.
// Compile this in Remix (Solidity ^0.8.20), then paste ABI + bytecode into src/chains/ethereum.ts
// =========================
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v5.0.2/contracts/access/Ownable.sol";


contract Token is ERC20, Ownable {
constructor(string memory name_, string memory symbol_, uint256 initialSupply) ERC20(name_, symbol_) Ownable(msg.sender) {
_mint(msg.sender, initialSupply);
}
}