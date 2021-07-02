# Contracts

Contracts for Lido Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-js-sdk/#readme)

## Install

```bash
yarn add @lido-sdk/contracts
```

## Contracts

```ts
import { getERC20Contract } from '@lido-sdk/contracts';
import { CHAINS, TOKENS } from '@lido-sdk/constants';

const stethAddress = getTokenAddress(CHAINS.Mainnet, TOKENS.STETH);
const contract = getERC20Contract(stethAddress, providerRPC);
```

Available getters:

```ts
getAggregatorContract();
getERC20Contract();
getWSTETHContract();
getSTETHContract();
getLDOContract();
```
