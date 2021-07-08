jest.mock('@web3-react/core');
jest.mock('@lido-sdk/helpers');
jest.mock('tiny-warning');
jest.mock('./useConnectors');

import { renderHook, act } from '@testing-library/react-hooks';
import { useConnectorTrust } from './useConnectorTrust';
import { useWeb3React } from '@web3-react/core';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectors } from './useConnectors';
import warning from 'tiny-warning';

const mockUseWeb3React = useWeb3React as jest.MockedFunction<
  typeof useWeb3React
>;
const mockUseConnectors = useConnectors as jest.MockedFunction<
  typeof useConnectors
>;
const mockOpenWindow = openWindow as jest.MockedFunction<typeof openWindow>;
const mockWarning = warning as jest.MockedFunction<typeof warning>;

beforeEach(() => {
  delete window.ethereum;
  mockUseWeb3React.mockReturnValue({} as any);
  mockUseConnectors.mockReturnValue({ injected: {} } as any);
  mockOpenWindow.mockReset();
  mockWarning.mockReset();
});

describe('useConnectorTrust', () => {
  test('should connect if ethereum if presented', async () => {
    const mockActivate = jest.fn(async () => true);
    const injected = {};

    window.ethereum = {};
    mockUseWeb3React.mockReturnValue({ activate: mockActivate } as any);
    mockUseConnectors.mockReturnValue({ injected } as any);

    const { result } = renderHook(() => useConnectorTrust());
    const { connect } = result.current;

    act(() => connect());
    expect(mockActivate).toHaveBeenCalledWith(injected);
    expect(mockActivate).toHaveBeenCalledTimes(1);
  });

  test('should open window if ethereum is not presented', async () => {
    const { result } = renderHook(() => useConnectorTrust());
    const { connect } = result.current;

    act(() => connect());
    expect(mockOpenWindow).toHaveBeenCalledTimes(1);
  });

  test('should show warning if link is not opened', async () => {
    const locationSpy = jest.spyOn(window, 'location', 'get');
    locationSpy.mockReturnValueOnce(undefined as any);

    const { result } = renderHook(() => useConnectorTrust());
    const { connect } = result.current;

    act(() => connect());
    expect(mockWarning).toHaveBeenCalledTimes(1);
  });
});
