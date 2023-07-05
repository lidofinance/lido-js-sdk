# Contracts

Contracts for Lido Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-js-sdk/#readme)

A Contract is an abstraction of code that has been deployed to the blockchain. A Contract may be sent transactions, which will trigger its code to be run with the input of the transaction data. More details in the [ethers docs](https://docs.ethers.io/v5/api/contract/contract/).

It uses [TypeChain](https://github.com/ethereum-ts/TypeChain) under the hood to generate TypeScript typings for contacts.

- [Install](#install)
- [Getters](#getters)
  - [getERC20Contract](#geterc20contract)
  - [getWSTETHContract](#getwstethcontract)
  - [getSTETHContract](#getstethcontract)
  - [getLDOContract](#getldocontract)
- [Cache](#cache)

## Install

```bash
yarn add @lido-sdk/contracts
```

## Getters

[Source](src/contracts.ts)

Each getter returns a cached [Contract](https://docs.ethers.io/v5/api/contract/contract/#Contract--creating) instance with an attached [Provider](https://docs.ethers.io/v5/api/providers/) and an [ABI](https://docs.ethers.io/v5/api/utils/abi/). The Provider is required to work with the network and sign transactions and the ABI contains information about methods of the contract on the ethereum side. So, the resulting instance contains all the methods supported by the contract and allows you to call them.

_If a contract method requires signing a transaction, then you need a provider with [Signer](https://docs.ethers.io/v5/api/signer/)_

### getERC20Contract

Returns an instance of `Contract` based on [ERC20](https://eips.ethereum.org/EIPS/eip-20) standard contract ABI.

```ts
import { getERC20Contract } from '@lido-sdk/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';

const provider = new JsonRpcProvider('http://localhost:8545');
const contract = getERC20Contract(
  '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
  provider,
);

const symbol = await contract.symbol();
const decimals = await contract.decimals();
```

### getWSTETHContract

Returns an instance of `Contract` based on wstETH contract [ABI](https://docs.ethers.io/v5/api/utils/abi/). Available contract methods and detailed documentation can be found here: https://docs.lido.fi/contracts/wsteth

### getSTETHContract

Returns an instance of `Contract` based on stETH contract [ABI](https://docs.ethers.io/v5/api/utils/abi/). Available contract methods and detailed documentation can be found here: https://docs.lido.fi/contracts/lido

### getWithdrawalQueueContract

Returns an instance of `Contract` based on WithdrawalQueue contract [ABI](https://docs.ethers.io/v5/api/utils/abi/). Contract docs here: https://docs.lido.fi/contracts/withdrawal-queue-erc721

### getAggregatorContract

Returns an instance of `Contract` based on ChainLink USD/ETH price oracle [ABI](https://docs.ethers.io/v5/api/utils/abi/). EACAggregatorProxy https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419

## Cache

To get another contract instance, getters have a third optional parameter `cacheSeed`.

Calls without `cacheSeed` or with the same `cacheSeed` return the same contracts:

```ts
const contractFirst = getERC20Contract('0x0...', provider, 1);
const contractSecond = getERC20Contract('0x0...', provider, 1);

contractFirst === contractSecond; // true
```

Calls with different `cacheSeed` return different contracts:

```ts
const contractFirst = getERC20Contract('0x0...', provider, 1);
const contractSecond = getERC20Contract('0x0...', provider, 2);

contractFirst !== contractSecond; // true
```

Of course, if the `cacheSeed` is the same, but `address` or `provider` are different the result contracts will also be different:

```ts
const contractFirst = getERC20Contract('0x1...', provider, 1);
const contractSecond = getERC20Contract('0x0...', provider, 1);

contractFirst !== contractSecond; // true, because the addresses are different
```
