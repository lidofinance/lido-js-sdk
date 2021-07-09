# Web3 react helpers

Web3 react helpers for Lido Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-js-sdk/#readme)

## Install

```bash
yarn add @lido-sdk/web3-react
```

## Provider

To use hooks from `@lido-sdk/web3-react` you need to wrap your app with `ProviderWeb3`. ProviderWeb3 also contains `ProviderSDK` from `@lido-sdk/react`. No need to wrap again.

```tsx
import { CHAINS } from '@lido-sdk/constants';
import { ProviderWeb3 } from '@lido-sdk/web3-react';

const rpc = {
  [CHAINS.Mainnet]: '/rpc/mainnet'
  [CHAINS.Rinkeby]: '/rpc/rinkeby'
};

const supportedChainIds = [CHAINS.Mainnet, CHAINS.Rinkeby]

const Provider = () => {
  return (
    <ProviderWeb3
      defaultChainId={CHAINS.Mainnet}
      supportedChainIds={supportedChainIds}
      rpc={rpc}
    >
      {children}
    </ProviderWeb3>
  );
};
```

## Connectors

The `ProviderWeb3` creates several connectors and stores them in context. To access them directly use `useConnectors` hook.

Used connectors:

- [InjectedConnector](https://www.npmjs.com/package/@web3-react/injected-connector)
- [WalletConnectConnector](https://www.npmjs.com/package/@web3-react/walletconnect-connector)
- [WalletLinkConnector](https://www.npmjs.com/package/@web3-react/walletlink-connector)
- [SafeAppConnector](https://www.npmjs.com/package/@gnosis.pm/safe-apps-web3-react)

## Auto connect

The `ProviderWeb3` contains logic to automatically activate one of the connectors when the application is initialized. It checks the conditions and tries to connect in the following order:

1. To Dapp browser provider with `InjectedConnector`.
2. To Gnosis Safe with `SafeAppConnector`.
3. To a connector saved in Local Storage.

## Connector hooks

Hooks for manually connecting to the user's wallet:

- useConnectorCoinbase
- useConnectorImToken
- useConnectorMetamask
- useConnectorTrust
- useConnectorWalletConnect

They return an object with a `connect` handler if connecting is possible. In Metamask, Trust and ImToken hooks the `connect` method contains the Deep Linking logic.

## Disconnect

`useDisconnect` return an object with a `disconnect` handler if disconnection is possible.
