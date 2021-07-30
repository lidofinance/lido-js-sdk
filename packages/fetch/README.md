# Fetchers

Fetchers for Lido Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-js-sdk/#readme)

## Install

```bash
yarn add @lido-sdk/fetch
```

## Fetch

node-fetch package [NPM](https://www.npmjs.com/package/node-fetch), [Github](https://github.com/node-fetch/node-fetch)

```ts
import { fetch } from '@lido-sdk/fetch';

const response = await fetch('https://example.com');
const result = await response.json();
```

## Fetch With Fallbacks

[Source](src/fetchWithFallbacks.ts)

A wrapper over `fetch` which takes an array of URLs instead of a single URL. If a request throws an exception, it takes the following URL from the array and repeats the request to it.

```ts
import { fetchWithFallbacks } from '@lido-sdk/fetch';

const urls = ['https://example.com', 'https://fallback.com'];

const response = await fetchWithFallbacks(urls);
const result = await response.json();
```

## Fetch RPC

[Source](src/fetchRPC.ts)

A wrapper over `fetchWithFallbacks`, which is useful as a backend part of proxying RPC requests from frontend to API provider.

```ts
import { fetchRPC } from '@lido-sdk/fetch';

const options = {
  urls: [
    'http://your_rpc_server.url',
    (chainId) => `http://your_rpc_server.url/?chainId=${chainId}`,
  ],
  providers: {
    infura: 'INFURA_API_KEY',
    alchemy: 'ALCHEMY_API_KEY',
  },
};

const rpc = async (req, res) => {
  // chainId and body from request
  const chainId = Number(req.query.chainId);
  const body = JSON.stringify(req.body);

  const response = await fetchRPC(chainId, { body, ...options });
  const result = await response.json();

  res.json(result);
};
```

### Options

Options extend `RequestInit` interface with the `urls` and `providers`. `urls` have priority over `providers`.

```tsx
import { CHAINS } from '@lido-sdk/constants';
import { RequestInit } from 'node-fetch';

interface FetchRPCOptions extends RequestInit {
  providers?: {
    infura?: string;
    alchemy?: string;
  };
  urls?: Array<string, (chainId: CHAINS) => string>;
}
```

## Helpers

[Source](src/providersUrls.ts)

### getInfuraRPCUrl

Returns [infura](https://infura.io/) endpoint for API key and chainId

```ts
import { getInfuraRPCUrl } from '@lido-sdk/fetch';
import { CHAINS } from '@lido-sdk/constants';

const url = getInfuraRPCUrl(CHAINS.Mainnet, 'YOUR_API_KEY');
console.log(url); // https://mainnet.infura.io/v3/YOUR_API_KEY
```

### getAlchemyRPCUrl

Returns [alchemy](https://www.alchemy.com/) endpoint for API key and chainId

```ts
import { getAlchemyRPCUrl } from '@lido-sdk/fetch';
import { CHAINS } from '@lido-sdk/constants';

const url = getAlchemyRPCUrl(CHAINS.Mainnet, 'YOUR_API_KEY');
console.log(url); // https://eth-mainnet.alchemyapi.io/v2/YOUR_API_KEY
```
