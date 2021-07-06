# React helpers

React helpers for Lido Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-js-sdk/#readme)

- [Install](#install)
- [Factories](#factories)
  - [Contracts factory](#contracts-factory)
  - [ERC20 hooks factory](#erc20-hooks-factory)
- [ERC20 hooks](#erc20-hooks)
  - [ProviderSDK](#providersdk)
  - [useTotalSupply](#usetotalsupply)
  - [useTokenBalance](#usetokenbalance)
  - [useAllowance](#useallowance)
  - [useApprove](#usepprove)
  - [useDecimals](#usedecimals)
- [SWR hooks](#swr-hooks)
  - [useLidoSWR](#uselidoswr)
  - [useContractSWR](#usecontractswr)
  - [useEthereumSWR](#useethereumswr)
  - [useEthereumBalance](#useethereumbalance)
- [Price hooks](#price-hooks)
  - [useEthPrice](#useethprice)
  - [useTxPrice](#usetxprice)
- [Other hooks](#other-hooks)
  - [useTokenToWallet](#usetokentowallet)

## Install

```bash
yarn add @lido-sdk/react
```

## Factories

### Contracts factory

`contractHooksFactory` creates set of hooks, which return RPC and Web3 contracts.

```ts
// use typechain package to generate factories for your contracts
import { YOUR_ABI_FACTORY } from 'your/abi/folder';
import { contractHooksFactory } from '@lido-sdk/react';
import { CHAINS, TOKENS } from '@lido-sdk/constants';

const getMyContractAddress = (chainId) => {
  // should return contract address
};

const { useContractRPC, useContractWeb3 } = contractHooksFactory(
  YOUR_ABI_FACTORY,
  getMyContractAddress,
);
```

Package `@lido-sdk/react` exports hooks for `WSTETH`, `STETH` and `LDO` contracts:

```ts
useWSTETHContractRPC();
useWSTETHContractWeb3();
```

```ts
useSTETHContractRPC();
useSTETHContractWeb3();
```

```ts
useLDOContractRPC();
useLDOContractWeb3();
```

### ERC20 hooks factory

`hooksFactory` creates the ERC20 set of hooks.

```ts
import { hooksFactory } from '@lido-sdk/react';

const getMyContractAddress = (chainId) => {
  // should return contract address
};

const {
  useTokenBalance,
  useTotalSupply,
  useDecimals,
  useAllowance,
  useApprove,
} = hooksFactory(getMyContractAddress);
```

Hooks for tokens `WSTETH`, `STETH` and `LDO` with attached addresses:

```ts
useWSTETHBalance()
useWSTETHTotalSupply()
useWSTETHDecimals()
useWSTETHAllowance(spender: string)
```

```ts
useSTETHBalance()
useSTETHTotalSupply()
useSTETHDecimals()
useSTETHAllowance(spender: string)
```

```ts
useLDOBalance()
useLDOTotalSupply()
useLDODecimals()
useLDOAllowance(spender: string)
```

## ERC20 hooks

### ProviderSDK

To use ERC20 hooks, your app must be wrapped with `<ProviderSDK />`.

```tsx
import { ProviderSDK } from '@lido-sdk/react';
import { CHAINS } from '@lido-sdk/constants';

const supportedChainIds = [CHAINS.Mainnet, CHAINS.Goerli];
const defaultChainId = CHAINS.Mainnet;

const providerRpc = getRpcProvider(
  CHAINS.Goerli,
  `/api/rpc?chainId=${CHAINS.Goerli}`,
);
const providerMainnetRpc = getRpcProvider(
  CHAINS.Mainnet,
  `/api/rpc?chainId=${CHAINS.Mainnet}`,
);

const App = ({ children }) => {
  const { chainId, providerWeb3 } = FromYourLibrary; // web3-react for example

  return (
    <ProviderSDK
      chainId={chainId || defaultChainId}
      supportedChainIds={supportedChainIds}
      providerRpc={providerRpc}
      providerMainnetRpc={providerMainnetRpc}
      providerWeb3={providerWeb3}
    >
      {children}
    </ProviderSDK>
  );
};
```

### useTotalSupply

```tsx
import { useTotalSupply } from '@lido-sdk/react';

const Component = () => {
  const token = 'token address';
  const { data, loading } = useTotalSupply(token);
  const totalSupply = data?.toString();

  return <div>{loading ? 'loading...' : totalSupply}</div>;
};
```

### useTokenBalance

```tsx
import { useTokenBalance } from '@lido-sdk/react';

const Component = () => {
  const token = 'token address';
  const account = 'account address';
  const { data, loading } = useTokenBalance(token, account);
  const balance = data?.toString();

  return <div>{loading ? 'loading...' : balance}</div>;
};
```

### useAllowance

```tsx
import { useAllowance } from '@lido-sdk/react';

const Component = () => {
  const token = 'token address';
  const spender = 'spender address';
  const { data, loading } = useAllowance(token, spender);
  const balance = data?.toString();

  return <div>{loading ? 'loading...' : balance}</div>;
};
```

### useApprove

```tsx
import { useApprove } from '@lido-sdk/react';
import { BigNumber } from '@ethersproject/bignumber';

const Component = () => {
  const amount = BigNumber.from(10);
  const token = 'token address';
  const spender = 'spender address';
  const { approve } = useApprove(amount, token, spender);

  return <button onClick={approve}>Approve</div>;
};
```

### useDecimals

```tsx
import { useDecimals } from '@lido-sdk/react';

const Component = () => {
  const token = 'token address';
  const { data, loading } = useDecimals(token);

  return <div>{loading ? 'loading...' : data}</div>;
};
```

## SWR hooks

### useLidoSWR

`useLidoSWR` hook is a wrapped `useSWR`. The hook additionally returns:

- `update` function, which implements `mutate(undefined, true)`
- `loading` and `initialLoading` flags

```tsx
import { useLidoSWR } from '@lido-sdk/react';

const Component = () => {
  const { data, loading } = useLidoSWR('/data', fetcher);

  return <div>{loading ? 'loading...' : data}</div>;
};
```

### useContractSWR

`useLidoSWR` for contracts

```tsx
import { useContractSWR } from '@lido-sdk/react';
import { CHAINS, TOKENS } from '@lido-sdk/constants';

const Component = () => {
  const accountAddress = 'your address';
  const tokenAddress = getTokenAddress(CHAINS.Mainnet, TOKENS.STETH);
  const contractRpc = getERC20Contract(tokenAddress, providerRpc);

  const { data, loading } = useContractSWR({
    contract: contractRpc,
    method: 'balanceOf',
    params: [accountAddress],
  });

  const balance = data?.toString();

  return <div>{loading ? 'loading...' : balance}</div>;
};
```

### useEthereumSWR

`useLidoSWR` for RPC provider

```tsx
import { useEthereumSWR } from '@lido-sdk/react';

const Component = () => {
  const { data, loading } = useEthereumSWR({ method: 'getGasPrice' });
  const gasPrice = data?.toString();

  return <div>{loading ? 'loading...' : gasPrice}</div>;
};
```

### useEthereumBalance

```tsx
import { useEthereumBalance } from '@lido-sdk/react';

const Component = () => {
  const { data, loading } = useEthereumBalance();
  const balance = data?.toString();

  return <div>{loading ? 'loading...' : balance}</div>;
};
```

## Price hooks

### useEthPrice

```tsx
import { useEthPrice } from '@lido-sdk/react';

const Component = () => {
  const { data, loading } = useEthPrice();
  const ethPrice = data?.toString();

  return <div>{loading ? 'loading...' : ethPrice}</div>;
};
```

### useTxPrice

```tsx
import { useTxPrice } from '@lido-sdk/react';

const Component = () => {
  const gasLimit = 10_000;
  const { data, loading } = useTxPrice(gasLimit);
  const txPrice = data?.toString();

  return <div>{loading ? 'loading...' : txPrice}</div>;
};
```

## Other hooks

### useTokenToWallet

```tsx
import { useTokenToWallet } from '@lido-sdk/react';

const Component = () => {
  const token = 'token address';
  const { addToken } = useTokenToWallet(token);

  return <button onClick={addToken}>Add token</div>;
};
```
