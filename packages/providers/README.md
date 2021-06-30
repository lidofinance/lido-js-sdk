# Providers

Providers for Lido Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-js-sdk/#readme)

## Install

```bash
yarn add @lido-sdk/providers
```

## RPC Providers

```ts
import { CHAINS } from '@lido-sdk/constants';
import { getRpcProvider, getRpcBatchProvider } from '@lido-sdk/providers';

const provider = getRpcProvider(CHAINS.Mainnet, '/rpc/url');
const batchProvider = getRpcBatchProvider(CHAINS.Mainnet, '/rpc/url');
```
