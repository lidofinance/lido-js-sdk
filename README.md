# ⚠️DEPRECATION WARNING⚠️

This project is being slowly deprecated and may not receive further updates.
Check out [modern Lido SDK](https://github.com/lidofinance/lido-ethereum-sdk/pulls) to access latest functionality. It is actively maintained and is built for interacting with Lido Protocol.

# Lido JS SDK

JS SDK for Lido Finance projects.

## Packages

- [@lido-sdk/constants](/packages/constants/README.md). Chain ids, Lido tokens
- [@lido-sdk/contracts](/packages/contracts/README.md). Typed contracts for Lido tokens, ERC20 contract factory
- [@lido-sdk/fetch](/packages/fetch/README.md). Ethereum data fetcher with fallbacks
- [@lido-sdk/helpers](/packages/helpers/README.md)
- [@lido-sdk/providers](/packages/providers/README.md). RPC provider getters with cache
- [@lido-sdk/react](/packages/react/README.md). React hooks and providers. SSR ready

## Install

1. `yarn && yarn postinstall`
2. `yarn build`

## Usage

- `yarn build` — Build all packages
- `yarn lint` — Run eslint across packages
- `yarn test` — Run tests across packages
- `yarn test:watch` — Run tests in watch mode
- `yarn typechain` — Generate types
