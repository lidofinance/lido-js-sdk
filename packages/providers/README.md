# Providers

Providers for Lido Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-js-sdk/#readme)

A Provider is an abstraction of a connection to the Ethereum network, providing a concise, consistent interface to standard Ethereum node functionality. More details in the [ethers docs](https://docs.ethers.io/v5/api/providers/).

- [Install](#install)
- [RPC providers](#rpc-providers)
  - [getRpcProvider](#getrpcprovider)
  - [getRpcBatchProvider](#getrpcbatchprovider)

## Install

```bash
yarn add @lido-sdk/providers
```

## RPC providers

[Source](src/providersRPC.ts)

Each getter returns a cached [Provider](https://docs.ethers.io/v5/api/providers/provider/) instance.

### getRpcProvider

Returns a [JsonRpcProvider](https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#JsonRpcProvider) instance.

```ts
import { CHAINS } from '@lido-sdk/constants';
import { getRpcProvider } from '@lido-sdk/providers';

const provider = getRpcProvider(CHAINS.Mainnet, '/rpc/url');
```

### getRpcBatchProvider

Returns an instance of batch version of [JsonRpcProvider](https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#JsonRpcProvider).

```ts
import { CHAINS } from '@lido-sdk/constants';
import { getRpcBatchProvider } from '@lido-sdk/providers';

const batchProvider = getRpcBatchProvider(CHAINS.Mainnet, '/rpc/url');
```
