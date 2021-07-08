jest.mock('@web3-react/core');
jest.mock('./useConnectors');

import { renderHook, act } from '@testing-library/react-hooks';
import { useConnectorWalletConnect } from './useConnectorWalletConnect';
import { useWeb3React } from '@web3-react/core';
import { useConnectors } from './useConnectors';

const mockUseWeb3React = useWeb3React as jest.MockedFunction<
  typeof useWeb3React
>;
const mockUseConnectors = useConnectors as jest.MockedFunction<
  typeof useConnectors
>;

describe('useConnectorWalletConnect', () => {
  test('should connect', async () => {
    const mockActivate = jest.fn(async () => true);
    const walletconnect = {};

    mockUseWeb3React.mockReturnValue({ activate: mockActivate } as any);
    mockUseConnectors.mockReturnValue({ walletconnect } as any);

    const { result } = renderHook(() => useConnectorWalletConnect());
    const { connect } = result.current;

    act(() => connect());
    expect(mockActivate).toHaveBeenCalledWith(walletconnect);
    expect(mockActivate).toHaveBeenCalledTimes(1);
  });
});
