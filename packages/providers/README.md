# ⚠️DEPRECATION WARNING⚠️

This project is being slowly deprecated and may not receive further updates.
Check out [modern Lido SDK](https://github.com/lidofinance/lido-ethereum-sdk/pulls) to access latest functionality. It is actively maintained and is built for interacting with Lido Protocol.

# Providers

Providers for Lido Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-js-sdk/#readme)

A Provider is an abstraction of a connection to the Ethereum network, providing a concise, consistent interface to standard Ethereum node functionality. More details in the [ethers docs](https://docs.ethers.io/v5/api/providers/).

- [Install](#install)
- [RPC providers](#rpc-providers)
  - [getRpcProvider](#getrpcprovider)
  - [getRpcBatchProvider](#getrpcbatchprovider)
  - [getStaticRpcProvider](#getstaticrpcprovider)
  - [getStaticRpcBatchProvider](#getstaticrpcbatchprovider)
- [Cache](#cache)

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

### getStaticRpcProvider

Returns a [StaticJsonRpcProvider](https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#StaticJsonRpcProvider) instance.

```ts
import { CHAINS } from '@lido-sdk/constants';
import { getStaticRpcProvider } from '@lido-sdk/providers';

const staticProvider = getStaticRpcProvider(CHAINS.Mainnet, '/rpc/url');
```

### getStaticRpcBatchProvider

Returns an instance of batch version of [StaticJsonRpcProvider](https://docs.ethers.io/v5/api/providers/jsonrpc-provider/#StaticJsonRpcProvider).

```ts
import { CHAINS } from '@lido-sdk/constants';
import { getStaticRpcBatchProvider } from '@lido-sdk/providers';

const staticProvider = getStaticRpcBatchProvider(CHAINS.Mainnet, '/rpc/url');
```

## Cache

To get another provider instance, getters have a third optional parameter `cacheSeed`.

Calls without `cacheSeed` or with the same `cacheSeed` return the same providers:

```ts
const providerFirst = getRpcBatchProvider(CHAINS.Mainnet, '/rpc/url', 1);
const providerSecond = getRpcBatchProvider(CHAINS.Mainnet, '/rpc/url', 1);

providerFirst === providerSecond; // true
```

Calls with different `cacheSeed` return different providers:

```ts
const providerFirst = getRpcBatchProvider(CHAINS.Mainnet, '/rpc/url', 1);
const providerSecond = getRpcBatchProvider(CHAINS.Mainnet, '/rpc/url', 2);

providerFirst !== providerSecond; // true
```

Of course, if the `cacheSeed` is the same, but `chainId` or `url` are different the result providers will also be different:

```ts
const providerFirst = getRpcBatchProvider(CHAINS.Mainnet, '/rpc/url', 1);
const providerSecond = getRpcBatchProvider(
  CHAINS.Mainnet,
  '/another/rpc/url',
  1,
);

providerFirst !== providerSecond; // true, because the urls are different
```
