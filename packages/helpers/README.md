# Helpers

Helpers for Lido Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-js-sdk/#readme)

- [Install](#install)
- [Etherscan](#etherscan)
  - [getEtherscanTxLink](#getetherscantxlink)
  - [getEtherscanTokenLink](#getetherscantokenlink)
  - [getEtherscanAddressLink](#getetherscanaddresslink)
- [Open window](#open-window)

## Install

```bash
yarn add @lido-sdk/helpers
```

## Etherscan

A set of functions for generating links to [etherscan](https://etherscan.io/)

### getEtherscanTxLink

```ts
import { getEtherscanTxLink } from '@lido-sdk/helpers';
import { CHAINS } from '@lido-sdk/constants';

const link = getEtherscanTxLink(
  CHAINS.Mainnet,
  '0x0000000000000000000000000000000000000000000000000000000000000000',
);
console.log(link); // https://etherscan.io/tx/0x0000000000000000000000000000000000000000000000000000000000000000
```

### getEtherscanTokenLink

```ts
import { getEtherscanTokenLink } from '@lido-sdk/helpers';
import { CHAINS } from '@lido-sdk/constants';

const link = getEtherscanTokenLink(
  CHAINS.Mainnet,
  '0x0000000000000000000000000000000000000000',
);
console.log(link); // https://etherscan.io/address/0x0000000000000000000000000000000000000000
```

### getEtherscanAddressLink

```ts
import { getEtherscanAddressLink } from '@lido-sdk/helpers';
import { CHAINS } from '@lido-sdk/constants';

const link = getEtherscanAddressLink(
  CHAINS.Mainnet,
  '0x0000000000000000000000000000000000000000',
);
console.log(link); // https://etherscan.io/address/0x0000000000000000000000000000000000000000
```

## Open window

```ts
import { openWindow } from '@lido-sdk/helpers';

openWindow('https://lido.fi');
```
