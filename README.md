# Lido JS SDK

JS SDK for Lido Finance projects.

## Packages

- [@lido-sdk/constants](/packages/constants/README.md). Chain ids, Lido tokens
- [@lido-sdk/contracts](/packages/contracts/README.md). Typed contracts for Lido tokens, ERC20 contract factory
- [@lido-sdk/fetch](/packages/fetch/README.md). Ethereum data fetcher with fallbacks
- [@lido-sdk/helpers](/packages/helpers/README.md)
- [@lido-sdk/providers](/packages/providers/README.md). RPC provider getters with cache
- [@lido-sdk/react](/packages/react/README.md). React hooks and providers. SSR ready
- [@lido-sdk/web3-react](/packages/web3-react/README.md). Wrapped [web3-react](https://github.com/NoahZinsmeister/web3-react) provider

## Install

```
yarn && yarn postinstall
```

## Usage

- `yarn build` — Build all packages
- `yarn lint` — Run eslint across packages
- `yarn test` — Run tests across packages
- `yarn test:watch` — Run tests in watch mode
- `yarn typechain` — Generate types
