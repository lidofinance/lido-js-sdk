jest.mock('@web3-react/core');
jest.mock('./useConnectorInfo');

import { renderHook, act } from '@testing-library/react-hooks';
import { useWeb3React } from '@web3-react/core';
import { useConnectorInfo } from './useConnectorInfo';
import { useDisconnect } from './useDisconnect';

const mockUseWeb3React = useWeb3React as jest.MockedFunction<
  typeof useWeb3React
>;
const mockUseConnectorInfo = useConnectorInfo as jest.MockedFunction<
  typeof useConnectorInfo
>;

beforeEach(() => {
  mockUseWeb3React.mockReturnValue({} as any);
  mockUseConnectorInfo.mockReturnValue({} as any);
});

afterEach(() => {
  mockUseWeb3React.mockReset();
  mockUseConnectorInfo.mockReset();
});

describe('useDisconnect', () => {
  test('should work without errors', async () => {
    const { result } = renderHook(() => useDisconnect());
    expect(result.error).toBeUndefined();
  });

  test('should return callback', async () => {
    mockUseWeb3React.mockReturnValue({ active: true } as any);

    const { result } = renderHook(() => useDisconnect());
    expect(result.current).toBeInstanceOf(Function);
  });

  test('should not return callback if it is gnosis', async () => {
    mockUseConnectorInfo.mockReturnValue({ isGnosis: true } as any);
    mockUseWeb3React.mockReturnValue({ active: true } as any);

    const { result } = renderHook(() => useDisconnect());
    expect(result.current).toBeUndefined();
  });

  test('should not return callback if it is imToken', async () => {
    mockUseConnectorInfo.mockReturnValue({ isImToken: true } as any);
    mockUseWeb3React.mockReturnValue({ active: true } as any);

    const { result } = renderHook(() => useDisconnect());
    expect(result.current).toBeUndefined();
  });

  test('should not return callback if it is Trust', async () => {
    mockUseConnectorInfo.mockReturnValue({ isTrust: true } as any);
    mockUseWeb3React.mockReturnValue({ active: true } as any);

    const { result } = renderHook(() => useDisconnect());
    expect(result.current).toBeUndefined();
  });

  test('should disconnect', async () => {
    const mockDeactivate = jest.fn(async () => void 0);

    const connector = {
      deactivate: jest.fn(async () => void 0),
      close: jest.fn(async () => void 0),
    };

    mockUseWeb3React.mockReturnValue({
      deactivate: mockDeactivate,
      connector,
      active: true,
    } as any);

    const { result } = renderHook(() => useDisconnect());
    expect(result.current).toBeInstanceOf(Function);

    const disconnect = result.current as () => void;
    act(() => disconnect());

    expect(mockDeactivate).toHaveBeenCalledTimes(1);
    expect(connector.deactivate).toHaveBeenCalledTimes(1);
    expect(connector.close).toHaveBeenCalledTimes(1);
  });
});
