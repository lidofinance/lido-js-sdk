jest.mock('@lido-sdk/helpers');
jest.mock('tiny-warning');
jest.mock('../../src/hooks/useWeb3');
jest.mock('../../src/hooks/useConnectors');

const mockIsMobileOrTablet = jest.fn();
jest.mock('../../src/helpers/ua', () => ({
  get isMobileOrTablet() {
    return mockIsMobileOrTablet();
  },
}));

import warning from 'tiny-warning';
import { renderHook, act } from '@testing-library/react-hooks';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectorImToken } from '../../src/hooks/useConnectorImToken';
import { useWeb3 } from '../../src/hooks/useWeb3';
import { useConnectors } from '../../src/hooks/useConnectors';

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

describe('useConnectorImToken', () => {
  test('should not return connect if it’s mobile', async () => {
    mockIsMobileOrTablet.mockReturnValue(true);
    const { result } = renderHook(() => useConnectorImToken());
    const { connect } = result.current;

    expect(connect).toBeDefined;
  });

  test('should connect if ethereum and imToken are presented', async () => {
    const mockActivate = jest.fn(async () => true);
    const injected = {};

    window.ethereum = {};
    window.ethereum.isImToken = true;
    mockUseWeb3.mockReturnValue({ activate: mockActivate } as any);
    mockUseConnectors.mockReturnValue({ injected } as any);

    const { result } = renderHook(() => useConnectorImToken());
    const { connect } = result.current;

    await act(async () => await connect?.());
    expect(mockActivate).toHaveBeenCalledWith(injected);
    expect(mockActivate).toHaveBeenCalledTimes(1);
  });

  test('should open window if ethereum is not presented', async () => {
    const { result } = renderHook(() => useConnectorImToken());
    const { connect } = result.current;

    await act(async () => await connect?.());
    expect(mockOpenWindow).toHaveBeenCalledTimes(1);
  });

  test('should show warning if link is not opened', async () => {
    const locationSpy = jest.spyOn(window, 'location', 'get');
    locationSpy.mockReturnValueOnce(undefined as any);

    const { result } = renderHook(() => useConnectorImToken());
    const { connect } = result.current;

    await act(async () => await connect?.());
    expect(mockWarning).toHaveBeenCalledTimes(1);
  });
});
