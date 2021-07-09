jest.mock('./useWeb3');
jest.mock('./useConnectors');

import { renderHook, act } from '@testing-library/react-hooks';
import { useWeb3 } from './useWeb3';
import { useConnectorCoinbase } from './useConnectorCoinbase';
import { useConnectors } from './useConnectors';

const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;
const mockUseConnectors = useConnectors as jest.MockedFunction<
  typeof useConnectors
>;

describe('useConnectorCoinbase', () => {
  test('should connect', async () => {
    const mockActivate = jest.fn(async () => true);
    const coinbase = {};

    mockUseWeb3.mockReturnValue({ activate: mockActivate } as any);
    mockUseConnectors.mockReturnValue({ coinbase } as any);

    const { result } = renderHook(() => useConnectorCoinbase());
    const { connect } = result.current;

    act(() => connect());
    expect(mockActivate).toHaveBeenCalledWith(coinbase);
    expect(mockActivate).toHaveBeenCalledTimes(1);
  });
});
