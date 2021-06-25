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

A wrapper over `fetch` that takes an array of URLs. If a request to the URL throws an exception, the following URL is taken

```ts
import { fetchWithFallbacks } from '@lido-sdk/fetch';

const urls = ['https://example.com', 'https://fallback.com'];

const response = await fetchWithFallbacks(urls);
const result = await response.json();
```

## Fetch RPC

RPC fetcher with

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

// get chainId and body from request
const chainId = Number(req.query.chainId);
const body = JSON.stringify(req.body);

const response = await fetchRPC(chainId, { body, ...options });
const result = await response.json();
```
