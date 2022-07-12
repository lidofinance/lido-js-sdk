jest.mock('@lido-sdk/helpers');
jest.mock('../../src/hooks/useWeb3');
jest.mock('../../src/hooks/useConnectors');

import { renderHook, act } from '@testing-library/react-hooks';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectorBraveWallet } from '../../src/hooks/useConnectorBraveWallet';
import { useWeb3 } from '../../src/hooks/useWeb3';
import { useConnectors } from '../../src/hooks/useConnectors';

const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;
const mockUseConnectors = useConnectors as jest.MockedFunction<
  typeof useConnectors
>;
const mockOpenWindow = openWindow as jest.MockedFunction<typeof openWindow>;

beforeEach(() => {
  delete window.ethereum;
  mockUseWeb3.mockReturnValue({} as any);
  mockUseConnectors.mockReturnValue({ injected: {} } as any);
  mockOpenWindow.mockReset();
});

describe('useConnectorBraveWallet', () => {
  test('should connect if ethereum and Brave are presented', async () => {
    const mockActivate = jest.fn(async () => true);
    const injected = {};

    window.ethereum = {};
    window.ethereum.isBraveWallet = true;
    mockUseWeb3.mockReturnValue({ activate: mockActivate } as any);
    mockUseConnectors.mockReturnValue({ injected } as any);

    const { result } = renderHook(() => useConnectorBraveWallet());
    const { connect } = result.current;

    await act(() => connect());
    expect(mockActivate).toHaveBeenCalledWith(injected);
    expect(mockActivate).toHaveBeenCalledTimes(1);
  });

  test('should open window if ethereum is not presented', async () => {
    const { result } = renderHook(() => useConnectorBraveWallet());
    const { connect } = result.current;

    window.ethereum = undefined;

    await act(() => connect());
    expect(mockOpenWindow).toHaveBeenCalledTimes(1);
  });

  test('should open window if Brave is not presented', async () => {
    const { result } = renderHook(() => useConnectorBraveWallet());
    const { connect } = result.current;

    window.ethereum = {};
    window.ethereum.isBraveWallet = undefined;

    await act(() => connect());
    expect(mockOpenWindow).toHaveBeenCalledTimes(1);
  });
});
