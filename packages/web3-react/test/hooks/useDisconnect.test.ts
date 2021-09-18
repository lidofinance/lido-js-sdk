jest.mock('../../src/hooks/useWeb3');
jest.mock('../../src/hooks/useConnectorInfo');

import { renderHook, act } from '@testing-library/react-hooks';
import { useWeb3 } from '../../src/hooks/useWeb3';
import { useConnectorInfo } from '../../src/hooks/useConnectorInfo';
import { useDisconnect } from '../../src/hooks/useDisconnect';

const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;
const mockUseConnectorInfo = useConnectorInfo as jest.MockedFunction<
  typeof useConnectorInfo
>;

beforeEach(() => {
  mockUseWeb3.mockReturnValue({} as any);
  mockUseConnectorInfo.mockReturnValue({} as any);
});

afterEach(() => {
  mockUseWeb3.mockReset();
  mockUseConnectorInfo.mockReset();
});

describe('useDisconnect', () => {
  test('should work without errors', async () => {
    const { result } = renderHook(() => useDisconnect());
    expect(result.error).toBeUndefined();
  });

  test('should return callback', async () => {
    mockUseWeb3.mockReturnValue({ active: true } as any);

    const { result } = renderHook(() => useDisconnect());
    expect(result.current.disconnect).toBeInstanceOf(Function);
  });

  test('should not return callback if it is gnosis', async () => {
    mockUseConnectorInfo.mockReturnValue({ isGnosis: true } as any);
    mockUseWeb3.mockReturnValue({ active: true } as any);

    const { result } = renderHook(() => useDisconnect());
    expect(result.current.disconnect).toBeUndefined();
  });

  test('should not return callback if it’s Dapp Browser', async () => {
    mockUseConnectorInfo.mockReturnValue({ isDappBrowser: true } as any);
    mockUseWeb3.mockReturnValue({ active: true } as any);

    const { result } = renderHook(() => useDisconnect());
    expect(result.current.disconnect).toBeUndefined();
  });

  test('should disconnect', async () => {
    const mockDeactivate = jest.fn(async () => void 0);

    const connector = {
      deactivate: jest.fn(async () => void 0),
      close: jest.fn(async () => void 0),
    };

    mockUseWeb3.mockReturnValue({
      deactivate: mockDeactivate,
      connector,
      active: true,
    } as any);

    const { result } = renderHook(() => useDisconnect());
    expect(result.current.disconnect).toBeInstanceOf(Function);

    await act(() => result.current.disconnect?.());

    expect(mockDeactivate).toHaveBeenCalledTimes(1);
    expect(connector.deactivate).toHaveBeenCalledTimes(1);
    expect(connector.close).toHaveBeenCalledTimes(1);
  });
});
