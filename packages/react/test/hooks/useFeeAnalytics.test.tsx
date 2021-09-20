jest.mock('../../src/hooks/useFeeHistory');

import { BigNumber } from '@ethersproject/bignumber';
import { renderHook } from '@testing-library/react-hooks';
import { useFeeHistory } from '../../src/hooks/useFeeHistory';
import {
  calculatePercentile,
  useFeeAnalytics,
} from '../../src/hooks/useFeeAnalytics';

const mockUseFeeHistory = useFeeHistory as jest.MockedFunction<
  typeof useFeeHistory
>;

describe('calculatePercentile', () => {
  test('should work correctly', () => {
    const percentile = calculatePercentile(
      [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)],
      BigNumber.from(2),
    );
    expect(percentile).toBe(1 / 3);
  });

  test('should work if target is not in array', () => {
    const percentile = calculatePercentile(
      [BigNumber.from(1), BigNumber.from(2)],
      BigNumber.from(3),
    );
    expect(percentile).toBe(1);
  });

  test('should work if array is empty', () => {
    const percentile = calculatePercentile([], BigNumber.from(3));
    expect(percentile).toBe(1);
  });
});

const common = {
  loading: false,
  initialLoading: false,
  error: undefined,
  mutate: async () => void [],
  update: async () => void [],
};

describe('useFeeAnalytics', () => {
  beforeEach(() => {
    const feeHistory = {
      oldestBlock: 1,
      baseFeePerGas: [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)],
      gasUsedRatio: [1, 2],
    };
    mockUseFeeHistory.mockReturnValue({ data: feeHistory, ...common });
  });

  afterEach(() => {
    mockUseFeeHistory.mockReset();
  });

  test('should return percentile', async () => {
    const { result } = renderHook(() => useFeeAnalytics());
    expect(result.current.percentile).toBe(2 / 3);
  });

  test('should return last baseFee', async () => {
    const { result } = renderHook(() => useFeeAnalytics());
    expect(result.current.baseFee).toEqual(BigNumber.from(3));
  });

  test('should inherit useFeeHistory errors', async () => {
    mockUseFeeHistory.mockReturnValue({ error: new Error() } as any);
    const { result } = renderHook(() => useFeeAnalytics());
    expect(result.current.error).toBeInstanceOf(Error);
  });

  test('should inherit useFeeHistory initialLoading', async () => {
    mockUseFeeHistory.mockReturnValue({ initialLoading: true } as any);
    const { result } = renderHook(() => useFeeAnalytics());
    expect(result.current.initialLoading).toBe(true);
  });

  test('should inherit useFeeHistory loading', async () => {
    mockUseFeeHistory.mockReturnValue({ loading: true } as any);
    const { result } = renderHook(() => useFeeAnalytics());
    expect(result.current.loading).toBe(true);
  });
});
