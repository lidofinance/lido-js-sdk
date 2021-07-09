jest.mock('./useWeb3');
jest.mock('./useConnectors');

import { renderHook, act } from '@testing-library/react-hooks';
import { useWeb3 } from './useWeb3';
import { useConnectorWalletConnect } from './useConnectorWalletConnect';
import { useConnectors } from './useConnectors';

const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;
const mockUseConnectors = useConnectors as jest.MockedFunction<
  typeof useConnectors
>;

describe('useConnectorWalletConnect', () => {
  test('should connect', async () => {
    const mockActivate = jest.fn(async () => true);
    const walletconnect = {};

    mockUseWeb3.mockReturnValue({ activate: mockActivate } as any);
    mockUseConnectors.mockReturnValue({ walletconnect } as any);

    const { result } = renderHook(() => useConnectorWalletConnect());
    const { connect } = result.current;

    await act(() => connect());
    expect(mockActivate).toHaveBeenCalledWith(walletconnect);
    expect(mockActivate).toHaveBeenCalledTimes(1);
  });
});
