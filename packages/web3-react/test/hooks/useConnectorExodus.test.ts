jest.mock('@lido-sdk/helpers');
jest.mock('tiny-warning');
jest.mock('../../src/hooks/useWeb3');
jest.mock('../../src/hooks/useConnectors');

import warning from 'tiny-warning';
import { renderHook, act } from '@testing-library/react-hooks';
import { openWindow } from '@lido-sdk/helpers';
import { useConnectorExodus } from '../../src/hooks/useConnectorExodus';
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
});

describe('useConnectorExodus', () => {
  test('should connect if ethereum and Exodus are presented', async () => {
    const mockActivate = jest.fn(async () => true);
    const injected = {};

    window.ethereum = {};
    window.ethereum.isExodus = true;
    mockUseWeb3.mockReturnValue({ activate: mockActivate } as any);
    mockUseConnectors.mockReturnValue({ injected } as any);

    const { result } = renderHook(() => useConnectorExodus());
    const { connect } = result.current;

    await act(() => connect());
    expect(mockActivate).toHaveBeenCalledWith(injected);
    expect(mockActivate).toHaveBeenCalledTimes(1);
  });

  test('should open window if ethereum is not presented', async () => {
    const { result } = renderHook(() => useConnectorExodus());
    const { connect } = result.current;

    await act(() => connect());
    expect(mockOpenWindow).toHaveBeenCalledTimes(1);
  });
});
