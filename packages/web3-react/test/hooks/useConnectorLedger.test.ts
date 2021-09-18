jest.mock('../../src/hooks/useWeb3');
jest.mock('../../src/hooks/useConnectors');

import { renderHook, act } from '@testing-library/react-hooks';
import { useWeb3 } from '../../src/hooks/useWeb3';
import { useConnectorLedger } from '../../src/hooks/useConnectorLedger';
import { useConnectors } from '../../src/hooks/useConnectors';

const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;
const mockUseConnectors = useConnectors as jest.MockedFunction<
  typeof useConnectors
>;

describe('useConnectorLedger', () => {
  test('should connect', async () => {
    const mockActivate = jest.fn(async () => true);
    const ledger = { isSupported: () => true };

    mockUseWeb3.mockReturnValue({ activate: mockActivate } as any);
    mockUseConnectors.mockReturnValue({ ledger } as any);

    const { result } = renderHook(() => useConnectorLedger());
    const { connect } = result.current;

    await act(async () => await connect?.());
    expect(mockActivate).toHaveBeenCalledWith(ledger);
    expect(mockActivate).toHaveBeenCalledTimes(1);
  });

  test('should not return connect if HID is not supported', async () => {
    const mockActivate = jest.fn(async () => true);
    const ledger = { isSupported: () => false };

    mockUseWeb3.mockReturnValue({ activate: mockActivate } as any);
    mockUseConnectors.mockReturnValue({ ledger } as any);

    const { result } = renderHook(() => useConnectorLedger());
    const { connect } = result.current;

    expect(connect).toBeUndefined();
  });
});
