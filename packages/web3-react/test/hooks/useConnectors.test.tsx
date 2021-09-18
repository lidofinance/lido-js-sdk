jest.mock('@gnosis.pm/safe-apps-web3-react');
jest.mock('@ethersproject/providers');
jest.mock('../../src/hooks/useAutoConnect');

import { FC } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { Web3Provider } from '@ethersproject/providers';
import { renderHook as renderHookOnServer } from '@testing-library/react-hooks/server';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import { CHAINS } from '@lido-sdk/constants';
import { useAutoConnect } from '../../src/hooks/useAutoConnect';
import { useConnectors } from '../../src/hooks/useConnectors';
import { useWeb3 } from '../../src/hooks/useWeb3';
import { ProviderWeb3 } from '../../src/context';

const mockSafeAppConnector = SafeAppConnector as jest.MockedClass<
  typeof SafeAppConnector
>;

const mockWeb3Provider = Web3Provider as jest.MockedClass<typeof Web3Provider>;

const mockUseAutoConnect = useAutoConnect as jest.MockedFunction<
  typeof useAutoConnect
>;

beforeEach(() => {
  mockUseAutoConnect.mockImplementation(() => true);
});

afterEach(() => {
  mockUseAutoConnect.mockReset();
  mockSafeAppConnector.mockReset();
  mockWeb3Provider.mockReset();
});

const rpc = {
  [CHAINS.Mainnet]: '/rpc',
  [CHAINS.Rinkeby]: '/rpc',
};

const supportedChainIds = [CHAINS.Mainnet, CHAINS.Rinkeby];

const wrapper: FC = (props) => (
  <ProviderWeb3
    defaultChainId={CHAINS.Rinkeby}
    supportedChainIds={supportedChainIds}
    rpc={rpc}
    {...props}
  />
);

describe('useConnectors', () => {
  test('should work', async () => {
    const { result } = renderHook(() => useConnectors());

    expect(result.error).toBeUndefined();
    expect(result.current).toBeInstanceOf(Object);
  });

  test('should return connectors', async () => {
    const { result } = renderHook(() => useConnectors(), { wrapper });

    expect(result.error).toBeUndefined();
    expect(result.current).toBeInstanceOf(Object);
  });

  test('should work with SSR', async () => {
    const windowSpy = jest
      .spyOn(global, 'window', 'get')
      .mockReturnValue(undefined as any);

    const { result } = renderHookOnServer(() => useConnectors(), { wrapper });

    expect(result.error).toBeUndefined();
    expect(result.current).toBeInstanceOf(Object);

    windowSpy.mockRestore();
  });
});

describe('gnosis SSR', () => {
  test('should return gnosis connector', async () => {
    const { result } = renderHookOnServer(() => useConnectors(), { wrapper });

    expect(result.error).toBeUndefined();
    expect(result.current.gnosis).toBeDefined();
  });

  test('should work if gnosis constructor throws an error', async () => {
    mockSafeAppConnector.mockImplementation(function () {
      throw new Error('test');
    });
    const { result } = renderHookOnServer(() => useConnectors(), { wrapper });

    expect(result.error).toBeUndefined();
    expect(result.current.gnosis).toBeUndefined();
  });
});

describe('getLibrary', () => {
  test('should wrap with web3', async () => {
    const { result } = renderHook(() => useWeb3(), { wrapper });
    const { activate } = result.current;

    class Connector extends AbstractConnector {
      async activate() {
        return {};
      }
      async getProvider() {
        return {};
      }
      async getChainId() {
        return 1;
      }
      async getAccount() {
        return null;
      }
      deactivate() {
        return undefined;
      }
    }

    await act(() => activate(new Connector()));
    expect(mockWeb3Provider).toHaveBeenCalledTimes(1);
  });
});
