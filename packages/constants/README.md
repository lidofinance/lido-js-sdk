# Constants

Constants for Lido Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-js-sdk/#readme)

## Install

```bash
yarn add @lido-sdk/constants
```

## Chains

[Source](src/chains.ts)

### CHAINS

Chains ids enum

```ts
import { CHAINS } from '@lido-sdk/constants';

console.log(CHAINS.Mainnet, CHAINS.Goerli); // 1, 5
```

### CHAINS_IDS

Array of chains ids

```ts
import { CHAINS_IDS } from '@lido-sdk/constants';

console.log(CHAINS_IDS); // [1, 3, 4, 5, 42]
```

### getChainColor

Color getter by chain id

```ts
import { CHAINS, getChainColor } from '@lido-sdk/constants';

const goerliChainColor = getChainColor(CHAINS.Goerli);
console.log(goerliChainColor); // #3099f2
```

## Tokens

[Source](src/tokens.ts)

### TOKENS

Lido tokens enum

```ts
import { TOKENS } from '@lido-sdk/constants';

console.log(TOKENS.STETH); // STETH
```

### getTokenAddress

Getter for Lido token addresses. Returns a contract address or throws an error if the contract is not deployed in the chain.

```ts
import { CHAINS, TOKENS, getTokenAddress } from '@lido-sdk/constants';

const stethAddress = getTokenAddress(CHAINS.Mainnet, TOKENS.STETH);
console.log(stethAddress); // 0xae7ab96520de3a18e5e111b5eaab095312d7fe84
```

## Aggregator

[Source](src/aggregator.ts)

EACAggregatorProxy https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419  
It’s used to get the ETH price

### getAggregatorAddress

```ts
import { CHAINS, getAggregatorAddress } from '@lido-sdk/constants';

const aggregatorAddress = getAggregatorAddress(CHAINS.Mainnet);
console.log(aggregatorAddress); // 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
```
