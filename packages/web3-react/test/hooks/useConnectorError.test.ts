jest.mock('../../src/hooks/useWeb3');
jest.mock('../../src/hooks/useConnectorInfo');

import { renderHook } from '@testing-library/react-hooks';
import { useWeb3, useConnectorInfo, useConnectorError } from '../../src';
import { errorDict } from '../../src/helpers/interceptLedgerError';

const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;
const mockUseConnectorInfo = useConnectorInfo as jest.MockedFunction<
  typeof useConnectorInfo
>;

describe('useConnectorError', () => {
  beforeEach(() => {
    mockUseConnectorInfo.mockReturnValue({
      isLedger: true,
    } as any);
  });

  it('should return undefined if there is no error', () => {
    mockUseWeb3.mockReturnValue({
      activate: jest.fn(async () => true),
      error: undefined,
    } as any);

    const { result } = renderHook(() => useConnectorError());
    expect(result.current).toEqual(undefined);
  });

  it('should return the same error if its not related to the ledger', () => {
    const error = new Error('Test error');
    mockUseWeb3.mockReturnValue({
      error,
      activate: jest.fn(async () => true),
    } as any);
    const { result } = renderHook(() => useConnectorError());
    expect(result.current).toBe(error);
  });

  it('should return the same error if ledger connector is not ledger but the error is some of the ledger ones', () => {
    const errorName = 'TransportOpenUserCancelled';
    const error = new Error('Error');
    error.name = errorName;

    mockUseWeb3.mockReturnValue({
      error,
      activate: jest.fn(async () => true),
    } as any);

    mockUseConnectorInfo.mockReturnValue({
      isLedger: false,
    } as any);

    const { result } = renderHook(() => useConnectorError());
    expect(result.current).toBe(error);
  });

  it('should return intercepted error', () => {
    const errorName = 'TransportOpenUserCancelled';
    const error = new Error(errorDict[errorName]);
    error.name = errorName;

    mockUseWeb3.mockReturnValue({
      error,
      activate: jest.fn(async () => true),
    } as any);

    const { result } = renderHook(() => useConnectorError());
    expect(result.current).toEqual(new Error(errorDict[errorName]));
  });
});
