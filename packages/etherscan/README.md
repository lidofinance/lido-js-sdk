# Etherscan utils

Etherscan utils for Lido Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-js-sdk/#readme)

## Install

```bash
yarn add @lido-sdk/etherscan
```

## Etherscan

```ts
import { getEtherscanTxLink } from '@lido-sdk/etherscan';
import { CHAINS } from '@lido-sdk/constants';

const link = getEtherscanTxLink(
  CHAINS.Mainnet,
  '0x0000000000000000000000000000000000000000000000000000000000000000',
);
```

```ts
import { getEtherscanTokenLink } from '@lido-sdk/etherscan';
import { CHAINS } from '@lido-sdk/constants';

const link = getEtherscanTokenLink(
  CHAINS.Mainnet,
  '0x0000000000000000000000000000000000000000',
);
```

```ts
import { getEtherscanAddressLink } from '@lido-sdk/etherscan';
import { CHAINS } from '@lido-sdk/constants';

const link = getEtherscanAddressLink(
  CHAINS.Mainnet,
  '0x0000000000000000000000000000000000000000',
);
```
