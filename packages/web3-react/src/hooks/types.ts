import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { LedgerHQConnector } from 'web3-ledgerhq-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export type InjectedHookResult = {
  connect: () => Promise<void>;
  connector: InjectedConnector;
};

export type WalletLinkHookResult = {
  connect: () => Promise<void>;
  connector: WalletLinkConnector;
};

export type LedgerHookResult = {
  connect: () => Promise<void>;
  connector: LedgerHQConnector;
};

export type WalletConnectHookResult = {
  connect: () => Promise<void>;
  connector: WalletConnectConnector;
};
