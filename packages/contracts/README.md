# Contracts

Contracts for Lido Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-js-sdk/#readme)

## Install

```bash
yarn add @lido-sdk/contracts
```

## Usage

```ts
import { getERC20Contract } from '@lido-sdk/contracts';
import { CHAINS, TOKENS } from '@lido-sdk/constants';

const stethAddress = getTokenAddress(CHAINS.Mainnet, TOKENS.STETH);
const contract = getERC20Contract(stethAddress, providerRPC);
```

Available getters:

```ts
getAggregatorContract(address: string, signerOrProvider: Signer | Provider);
getERC20Contract(address: string, signerOrProvider: Signer | Provider);
getWSTETHContract(address: string, signerOrProvider: Signer | Provider);
getSTETHContract(address: string, signerOrProvider: Signer | Provider);
getLDOContract(address: string, signerOrProvider: Signer | Provider);
```
