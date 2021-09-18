jest.mock('../../src/hooks/useWeb3');
jest.mock('../../src/hooks/useConnectors');

import { renderHook, act } from '@testing-library/react-hooks';
import { useWeb3 } from '../../src/hooks/useWeb3';
import { useConnectorWalletConnect } from '../../src/hooks/useConnectorWalletConnect';
import { useConnectors } from '../../src/hooks/useConnectors';

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
