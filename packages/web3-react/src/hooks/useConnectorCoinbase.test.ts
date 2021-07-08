jest.mock('@web3-react/core');
jest.mock('./useConnectors');

import { renderHook, act } from '@testing-library/react-hooks';
import { useConnectorCoinbase } from './useConnectorCoinbase';
import { useWeb3React } from '@web3-react/core';
import { useConnectors } from './useConnectors';

const mockUseWeb3React = useWeb3React as jest.MockedFunction<
  typeof useWeb3React
>;
const mockUseConnectors = useConnectors as jest.MockedFunction<
  typeof useConnectors
>;

describe('useConnectorCoinbase', () => {
  test('should connect', async () => {
    const mockActivate = jest.fn(async () => true);
    const coinbase = {};

    mockUseWeb3React.mockReturnValue({ activate: mockActivate } as any);
    mockUseConnectors.mockReturnValue({ coinbase } as any);

    const { result } = renderHook(() => useConnectorCoinbase());
    const { connect } = result.current;

    act(() => connect());
    expect(mockActivate).toHaveBeenCalledWith(coinbase);
    expect(mockActivate).toHaveBeenCalledTimes(1);
  });
});
