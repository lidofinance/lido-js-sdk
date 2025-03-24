# ⚠️DEPRECATION WARNING⚠️

This project is being slowly deprecated and may not receive further updates.
Check out [modern Lido SDK](https://github.com/lidofinance/lido-ethereum-sdk/pulls) to access latest functionality. It is actively maintained and is built for interacting with Lido Protocol.

# Constants

Constants for Lido Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-js-sdk/#readme)

- [Install](#install)
- [Chains](#chains)
  - [Chains enum](#chains-enum)
  - [Array of chains ids](#array-of-chains-ids)
  - [getChainColor](#getchaincolor)
- [Tokens](#tokens)
  - [Lido tokens enum](#lido-tokens-enum)
  - [getTokenAddress](#gettokenaddress)
- [Aggregator](#aggregator)
  - [getAggregatorAddress](#getaggregatoraddress)
- [WithdrawalQueue](#withdrawalqueue)
  - [getWithdrawalQueueAddress](#getWithdrawalQueueAddress)

## Install

```bash
yarn add @lido-sdk/constants
```

## Chains

[Source](src/chains.ts)

### Chains enum

```ts
import { CHAINS } from '@lido-sdk/constants';

console.log(CHAINS.Mainnet, CHAINS.Hoodi); // 1, 560048
```

### Array of chains ids

```ts
import { CHAINS_IDS } from '@lido-sdk/constants';

console.log(CHAINS_IDS); // [1, 3, 4, 5, 42]
```

### getChainColor

Color getter by chain id

```ts
import { CHAINS, getChainColor } from '@lido-sdk/constants';

const hoodiChainColor = getChainColor(CHAINS.Hoodi);
console.log(hoodiChainColor); // #AA346A
```

## Tokens

[Source](src/tokens.ts)

### Lido tokens enum

```ts
import { TOKENS } from '@lido-sdk/constants';

console.log(TOKENS.WSTETH); // WSTETH
console.log(TOKENS.STETH); // STETH
console.log(TOKENS.LDO); // LDO
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

## WithdrawalQueue

WithdrawalQueue contract for LIDO protocol

### getWithdrawalQueueAddress

```ts
import { CHAINS, getWithdrawalQueueAddress } from '@lido-sdk/constants';

const withdrawalQueueAddress = getWithdrawalQueueAddress(CHAINS.Mainnet);
console.log(withdrawalQueueAddress); // 0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1
```
