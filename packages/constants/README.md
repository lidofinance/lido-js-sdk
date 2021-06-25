# Constants

Constants for Lido Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-js-sdk/#readme)

## Install

```bash
yarn add @lido-sdk/constants
```

## Chains

```ts
import { CHAINS, CHAINS_IDS } from '@lido-sdk/constants';

console.log(CHAINS.Mainnet);
console.log(CHAINS_IDS);
```

```ts
import { CHAINS, getChainColor } from '@lido-sdk/constants';

const color = getChainColor(CHAINS.Goerli);
```

## Tokens

```ts
import { CHAINS, TOKENS } from '@lido-sdk/constants';

const stethAddress = getTokenAddress(CHAINS.Mainnet, TOKENS.steth);
```
