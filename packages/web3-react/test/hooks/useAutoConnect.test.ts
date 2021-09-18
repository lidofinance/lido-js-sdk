jest.mock('tiny-warning');
jest.mock('../../src/hooks/useWeb3');
jest.mock('../../src/hooks/useConnectorStorage');
jest.mock('../../src/hooks/useConnectorInfo');
jest.mock('../../src/hooks/useDisconnect');
jest.mock('../../src/helpers/injected');

import warning from 'tiny-warning';
import { renderHook, act } from '@testing-library/react-hooks';
import { useWeb3 } from '../../src/hooks/useWeb3';
import { useConnectorStorage } from '../../src/hooks/useConnectorStorage';
import { useConnectorInfo } from '../../src/hooks/useConnectorInfo';
import { useDisconnect } from '../../src/hooks/useDisconnect';
import {
  useAutoConnect,
  useEagerConnector,
  useSaveConnectorToLS,
  useDeleteConnectorFromLS,
  useWatchConnectorInLS,
} from '../../src/hooks/useAutoConnect';
import { isDappBrowserProvider } from '../../src/helpers/injected';

const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;
const mockUseConnectorStorage = useConnectorStorage as jest.MockedFunction<
  typeof useConnectorStorage
>;
const mockUseConnectorInfo = useConnectorInfo as jest.MockedFunction<
  typeof useConnectorInfo
>;
const mockUseDisconnect = useDisconnect as jest.MockedFunction<
  typeof useDisconnect
>;
const mockWarning = warning as jest.MockedFunction<typeof warning>;
const mockIsDappBrowserProvider = isDappBrowserProvider as jest.MockedFunction<
  typeof isDappBrowserProvider
>;
const mockActivate = jest.fn(async () => true);

beforeEach(() => {
  mockUseDisconnect.mockReturnValue({});
  mockUseWeb3.mockReturnValue({ activate: mockActivate } as any);
  mockUseConnectorStorage.mockReturnValue([] as any);
  mockUseConnectorInfo.mockReturnValue({} as any);
  mockIsDappBrowserProvider.mockReturnValue(false);
});

afterEach(() => {
  delete window.ethereum;
  mockUseWeb3.mockReset();
  mockUseConnectorStorage.mockReset();
  mockWarning.mockReset();
  mockUseDisconnect.mockReset();
  mockUseConnectorInfo.mockReset();
  mockIsDappBrowserProvider.mockReset();
  mockActivate.mockReset();
});

describe('useAutoConnect', () => {
  test('should work without errors', async () => {
    const { result } = renderHook(() => useAutoConnect({} as any));
    expect(result.error).toBeUndefined();
  });
});

describe('useEagerConnector', () => {
  test('should activate gnosis connector', async () => {
    const gnosis = { isSafeApp: async () => true };
    const { waitFor } = renderHook(() => useEagerConnector({ gnosis } as any));

    await waitFor(() => expect(mockActivate).toHaveBeenCalledTimes(1));
    expect(mockActivate).toHaveBeenCalledWith(gnosis, undefined, true);
  });

  test('should catch an error', async () => {
    const gnosis = { isSafeApp: async () => true };
    const { waitFor } = renderHook(() => useEagerConnector({ gnosis } as any));

    mockActivate.mockImplementationOnce(() => {
      throw new Error();
    });

    await waitFor(() => expect(mockActivate).toHaveBeenCalledTimes(1));
    expect(mockWarning).toHaveBeenCalledTimes(1);
  });

  test('should activate ledger live connector', async () => {
    const ledgerlive = { isLedgerApp: () => true };
    const { waitFor } = renderHook(() =>
      useEagerConnector({ ledgerlive } as any),
    );

    await waitFor(() => expect(mockActivate).toHaveBeenCalledTimes(1));
    expect(mockActivate).toHaveBeenCalledWith(ledgerlive, undefined, true);
  });

  test('should activate injected connector if it’s dapp browser', async () => {
    const injected = {};
    window.ethereum = {};
    mockIsDappBrowserProvider.mockReturnValue(true);

    const { waitFor } = renderHook(() =>
      useEagerConnector({ injected } as any),
    );

    await waitFor(() => expect(mockActivate).toHaveBeenCalledTimes(1));
    expect(mockActivate).toHaveBeenCalledWith(injected, undefined, true);
  });

  test('should not activate any connectors', async () => {
    const injected = {};

    const { waitFor } = renderHook(() =>
      useEagerConnector({ injected } as any),
    );

    await expect(async () => {
      await waitFor(() => expect(mockActivate).toHaveBeenCalled(), {
        timeout: 50,
      });
    }).rejects.toThrowError();

    expect(mockActivate).not.toHaveBeenCalled();
  });

  test('should not activate after rerender', async () => {
    const injected = {};
    window.ethereum = {};
    mockIsDappBrowserProvider.mockReturnValue(true);

    const { waitFor, rerender } = renderHook(() =>
      useEagerConnector({ injected } as any),
    );

    await waitFor(() => expect(mockActivate).toHaveBeenCalledTimes(1));
    expect(mockActivate).toHaveBeenCalledWith(injected, undefined, true);

    act(() => rerender());

    await expect(async () => {
      await waitFor(() => expect(mockActivate).toHaveBeenCalledTimes(2), {
        timeout: 50,
      });
    }).rejects.toThrowError();

    expect(mockActivate).toHaveBeenCalledTimes(1);
  });

  test('should activate connector from LS', async () => {
    mockUseConnectorStorage.mockReturnValue(['injected'] as any);
    const injected = {};

    const { waitFor } = renderHook(() =>
      useEagerConnector({ injected } as any),
    );

    await waitFor(() => expect(mockActivate).toHaveBeenCalledTimes(1));
    expect(mockActivate).toHaveBeenCalledWith(injected, undefined, true);
  });
});

describe('useSaveConnectorToLS', () => {
  test('should save injected connector to LS', async () => {
    const mockSaveConnector = jest.fn(() => void 0);
    mockUseConnectorInfo.mockReturnValue({ isInjected: true } as any);
    mockUseConnectorStorage.mockReturnValue([null, mockSaveConnector]);

    const { waitFor } = renderHook(() => useSaveConnectorToLS());

    await waitFor(() => expect(mockSaveConnector).toHaveBeenCalledTimes(1));
    expect(mockSaveConnector).toHaveBeenCalledWith('injected');
  });

  test('should save walletconnect connector to LS', async () => {
    const mockSaveConnector = jest.fn(() => void 0);
    mockUseConnectorInfo.mockReturnValue({ isWalletConnect: true } as any);
    mockUseConnectorStorage.mockReturnValue([null, mockSaveConnector]);

    const { waitFor } = renderHook(() => useSaveConnectorToLS());

    await waitFor(() => expect(mockSaveConnector).toHaveBeenCalledTimes(1));
    expect(mockSaveConnector).toHaveBeenCalledWith('walletconnect');
  });

  test('should save coinbase connector to LS', async () => {
    const mockSaveConnector = jest.fn(() => void 0);
    mockUseConnectorInfo.mockReturnValue({ isCoinbase: true } as any);
    mockUseConnectorStorage.mockReturnValue([null, mockSaveConnector]);

    const { waitFor } = renderHook(() => useSaveConnectorToLS());

    await waitFor(() => expect(mockSaveConnector).toHaveBeenCalledTimes(1));
    expect(mockSaveConnector).toHaveBeenCalledWith('coinbase');
  });
});

describe('useDeleteConnectorFromLS', () => {
  test('should delete connector from LS if active is changed', async () => {
    const mockSaveConnector = jest.fn(() => void 0);
    mockUseWeb3.mockReturnValue({ active: true } as any);
    mockUseConnectorStorage.mockReturnValue(['injected', mockSaveConnector]);

    const { waitFor, rerender } = renderHook(() => useDeleteConnectorFromLS());
    mockUseWeb3.mockReturnValue({ active: false } as any);

    act(() => rerender());

    await waitFor(() => expect(mockSaveConnector).toHaveBeenCalledTimes(1));
    expect(mockSaveConnector).toHaveBeenCalledWith(null);
  });
});

describe('useWatchConnectorInLS', () => {
  test('should disconnect if connector in LS becomes null', async () => {
    const mockDisconnect = jest.fn(() => void 0);
    mockUseDisconnect.mockReturnValue({ disconnect: mockDisconnect });
    mockUseConnectorStorage.mockReturnValue(['injected'] as any);

    const { waitFor, rerender } = renderHook(() => useWatchConnectorInLS());
    mockUseConnectorStorage.mockReturnValue([null] as any);

    act(() => rerender());

    await waitFor(() => expect(mockDisconnect).toHaveBeenCalledTimes(1));
  });
});
