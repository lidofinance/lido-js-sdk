jest.mock('@lido-sdk/helpers');
jest.mock('tiny-warning');
jest.mock('./useWeb3');
jest.mock('./useConnectors');

const mockIsMobileOrTablet = jest.fn();
jest.mock('../helpers/ua', () => ({
  get isMobileOrTablet() {
    return mockIsMobileOrTablet();
  },
}));

import warning from 'tiny-warning';
import { renderHook, act } from '@testing-library/react-hooks';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectorTrust } from './useConnectorTrust';
import { useWeb3 } from './useWeb3';
import { useConnectors } from './useConnectors';

const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;
const mockUseConnectors = useConnectors as jest.MockedFunction<
  typeof useConnectors
>;
const mockOpenWindow = openWindow as jest.MockedFunction<typeof openWindow>;
const mockWarning = warning as jest.MockedFunction<typeof warning>;

beforeEach(() => {
  delete window.ethereum;
  mockUseWeb3.mockReturnValue({} as any);
  mockUseConnectors.mockReturnValue({ injected: {} } as any);
  mockOpenWindow.mockReset();
  mockWarning.mockReset();
  mockIsMobileOrTablet.mockReturnValue(true);
});

describe('useConnectorTrust', () => {
  test('should not return connect if it’s mobile', async () => {
    mockIsMobileOrTablet.mockReturnValue(true);
    const { result } = renderHook(() => useConnectorTrust());
    const { connect } = result.current;

    expect(connect).toBeDefined;
  });

  test('should not return connect if it’s not mobile', async () => {
    mockIsMobileOrTablet.mockReturnValue(false);
    const { result } = renderHook(() => useConnectorTrust());
    const { connect } = result.current;

    expect(connect).toBeUndefined();
  });

  test('should connect if ethereum if presented', async () => {
    const mockActivate = jest.fn(async () => true);
    const injected = {};

    window.ethereum = {};
    mockUseWeb3.mockReturnValue({ activate: mockActivate } as any);
    mockUseConnectors.mockReturnValue({ injected } as any);

    const { result } = renderHook(() => useConnectorTrust());
    const { connect } = result.current;

    act(() => connect?.());
    expect(mockActivate).toHaveBeenCalledWith(injected);
    expect(mockActivate).toHaveBeenCalledTimes(1);
  });

  test('should open window if ethereum is not presented', async () => {
    const { result } = renderHook(() => useConnectorTrust());
    const { connect } = result.current;

    act(() => connect?.());
    expect(mockOpenWindow).toHaveBeenCalledTimes(1);
  });

  test('should show warning if link is not opened', async () => {
    const locationSpy = jest.spyOn(window, 'location', 'get');
    locationSpy.mockReturnValueOnce(undefined as any);

    const { result } = renderHook(() => useConnectorTrust());
    const { connect } = result.current;

    act(() => connect?.());
    expect(mockWarning).toHaveBeenCalledTimes(1);
  });
});
