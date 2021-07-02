# React helpers

React helpers for Lido Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-js-sdk/#readme)

## Install

```bash
yarn add @lido-sdk/react
```

## ERC20 hooks

To use ERC20 hooks, your app must be wrapped with `<ProviderSDK />`.

```tsx
import { ProviderSDK } from '@lido-sdk/react';
import { CHAINS } from '@lido-sdk/constants';

const supportedChainIds = [CHAINS.Mainnet];
const defaultChainId = CHAINS.Mainnet;
const providerRpc = getRpcProvider(CHAINS.Mainnet, '/api/rpc');

const App = ({ children }) => {
  const { chainId, providerWeb3 } = FromYourLibrary; // web3-react for example

  return (
    <ProviderSDK
      chainId={chainId || defaultChainId}
      supportedChainIds={supportedChainIds}
      providerRpc={providerRpc}
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
import { CHAINS, TOKENS } from '@lido-sdk/constants';

const tokenAddress = getTokenAddress(CHAINS.Mainnet, TOKENS.STETH);

const Component = () => {
  const { data, loading } = useTotalSupply(tokenAddress);
  const totalSupply = data?.toString();

  return <div>{loading ? 'loading...' : totalSupply}</div>;
};
```

### useTokenBalance

```tsx
import { useTokenBalance } from '@lido-sdk/react';
import { CHAINS, TOKENS } from '@lido-sdk/constants';

const tokenAddress = getTokenAddress(CHAINS.Mainnet, TOKENS.STETH);

const Component = () => {
  const accountAddress = 'your address';
  const { data, loading } = useTokenBalance(tokenAddress, accountAddress);
  const balance = data?.toString();

  return <div>{loading ? 'loading...' : balance}</div>;
};
```

### useAllowance

```tsx
import { useAllowance } from '@lido-sdk/react';
import { CHAINS, TOKENS } from '@lido-sdk/constants';

const tokenAddress = getTokenAddress(CHAINS.Mainnet, TOKENS.STETH);

const Component = () => {
  const spender = 'spender address';
  const { data, loading } = useAllowance(tokenAddress, spender);
  const balance = data?.toString();

  return <div>{loading ? 'loading...' : balance}</div>;
};
```

### useDecimals

```tsx
import { useDecimals } from '@lido-sdk/react';
import { CHAINS, TOKENS } from '@lido-sdk/constants';

const stethAddress = getTokenAddress(CHAINS.Mainnet, TOKENS.STETH);

const Component = () => {
  const { data, loading } = useDecimals(stethAddress);

  return <div>{loading ? 'loading...' : data}</div>;
};
```

## Factories

### Contracts factory

Use `contractHooksFactory` to create hooks, which return RPC and web3 contracts.

```ts
// use typechain package to generate factories for your contracts
import { YOUR_ABI_FACTORY } from 'your/abi/folder';
import { contractHooksFactory } from '@lido-sdk/react';
import { CHAINS, TOKENS } from '@lido-sdk/constants';

const getMyContractAddress = (chainId) => {
  // get token address by chainId
};

const { useContractRPC, useContractWeb3 } = contractHooksFactory(
  YOUR_ABI_FACTORY,
  getMyContractAddress,
);
```

Hooks for `WSTETH`, `STETH` and `LDO` contracts:

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

### ERC20 Sets

Use `hooksFactory` to create the ERC20 set of hooks for your token.

```ts
import { hooksFactory } from '@lido-sdk/react';
import { CHAINS, TOKENS } from '@lido-sdk/constants';

const getXETHTokenAddress = (chainId) => {
  // get token address by chainId
};

const xeth = hooksFactory(getXETHTokenAddress);
export const useXETHBalance = xeth.useTokenBalance;
export const useXETHTotalSupply = xeth.useTotalSupply;
export const useXETHDecimals = xeth.useDecimals;
export const useXETHAllowance = xeth.useAllowance;
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

## useLidoSWR

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

## useContractSWR

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
