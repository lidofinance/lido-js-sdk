# Helpers

Helpers for Lido Finance projects.
Part of [Lido JS SDK](https://github.com/lidofinance/lido-js-sdk/#readme)

## Install

```bash
yarn add @lido-sdk/helpers
```

## Etherscan

```ts
import { getEtherscanTxLink } from '@lido-sdk/helpers';
import { CHAINS } from '@lido-sdk/constants';

const link = getEtherscanTxLink(
  CHAINS.Mainnet,
  '0x0000000000000000000000000000000000000000000000000000000000000000',
);
```

```ts
import { getEtherscanTokenLink } from '@lido-sdk/helpers';
import { CHAINS } from '@lido-sdk/constants';

const link = getEtherscanTokenLink(
  CHAINS.Mainnet,
  '0x0000000000000000000000000000000000000000',
);
```

```ts
import { getEtherscanAddressLink } from '@lido-sdk/helpers';
import { CHAINS } from '@lido-sdk/constants';

const link = getEtherscanAddressLink(
  CHAINS.Mainnet,
  '0x0000000000000000000000000000000000000000',
);
```

## Open window

```ts
import { openWindow } from '@lido-sdk/helpers';

const handleClick = openWindow('https://lido.fi');
```
