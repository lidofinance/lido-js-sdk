jest.mock('../../src/hooks/useWeb3');

import { renderHook } from '@testing-library/react-hooks';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { LedgerHQFrameConnector } from 'web3-ledgerhq-frame-connector';
import { LedgerHQConnector } from 'web3-ledgerhq-connector';
import { useConnectorInfo } from '../../src/hooks/useConnectorInfo';
import { useWeb3 } from '../../src/hooks/useWeb3';

const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;

const mockConnector = (Connector: any) => {
  class EmptyConnector {}
  const connector = new EmptyConnector();
  Object.setPrototypeOf(connector, Connector.prototype);
  mockUseWeb3.mockReturnValue({ active: true, connector } as any);
};

beforeEach(() => {
  mockUseWeb3.mockReturnValue({} as any);
  delete window.ethereum;
});

describe('useConnectorInfo', () => {
  test('should detect gnosis', async () => {
    mockConnector(SafeAppConnector);
    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isGnosis, ...rest } = result.current;

    expect(isGnosis).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect ledger live', async () => {
    mockConnector(LedgerHQConnector);
    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isLedger, ...rest } = result.current;

    expect(isLedger).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect ledger live', async () => {
    mockConnector(LedgerHQFrameConnector);
    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isLedgerLive, ...rest } =
      result.current;

    expect(isLedgerLive).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect walletconnect', async () => {
    mockConnector(WalletConnectConnector);
    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isWalletConnect, ...rest } =
      result.current;

    expect(isWalletConnect).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect coinbase', async () => {
    mockConnector(WalletLinkConnector);
    window.ethereum = { isCoinbaseWallet: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isCoinbase, isWalletLink, ...rest } =
      result.current;

    expect(isCoinbase).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect injected', async () => {
    mockConnector(InjectedConnector);
    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isInjected, ...rest } = result.current;

    expect(isInjected).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect MetaMask', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isMetaMask: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isInjected, isMetamask, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isMetamask).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect Coin98', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isCoin98: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isInjected, isCoin98, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isCoin98).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect MathWallet', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isMathWallet: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isInjected, isMathWallet, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isMathWallet).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect imToken', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isImToken: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isInjected, isImToken, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isImToken).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect Trust', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isTrust: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isInjected, isTrust, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isTrust).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect Tally', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isTally: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isInjected, isTally, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isTally).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect Brave', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isBraveWallet: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isInjected, isBraveWallet, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isBraveWallet).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect Opera', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isOpera: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isInjected, isOperaWallet, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isOperaWallet).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect Exodus', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isExodus: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isInjected, isExodus, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isExodus).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect Gamestop', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isGamestop: true };

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isInjected, isGamestop, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isGamestop).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should detect XDEFI', async () => {
    mockConnector(InjectedConnector);
    window.ethereum = { isXDEFI: true };
    window.xfi = {};

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, isInjected, isXdefi, ...rest } =
      result.current;

    expect(isInjected).toBe(true);
    expect(isXdefi).toBe(true);
    expect(Object.values(rest).includes(true)).toBeFalsy();
  });

  test('should not detect connector', async () => {
    mockUseWeb3.mockReturnValue({ active: false } as any);

    const { result } = renderHook(() => useConnectorInfo());
    const { connectorName, providerName, ...flags } = result.current;

    expect(Object.values(flags).includes(true)).toBeFalsy();
    expect(connectorName).toBeUndefined();
    expect(providerName).toBeUndefined();
  });
});
