jest.mock('./useEthPrice');
jest.mock('./useEthereumSWR');

import { renderHook, act } from '@testing-library/react-hooks';
import { useEthPrice } from './useEthPrice';
import { useEthereumSWR } from './useEthereumSWR';
import { useTxPrice } from './useTxPrice';
import { WeiPerEther } from '@ethersproject/constants';

const mockUseEthPrice = useEthPrice as jest.MockedFunction<typeof useEthPrice>;

const mockUseEthereumSWR = useEthereumSWR as jest.MockedFunction<
  typeof useEthereumSWR
>;

const common = {
  loading: false,
  initialLoading: false,
  error: undefined,
  mutate: async () => void 0,
  update: async () => void 0,
};

describe('useTxPrice', () => {
  const ethPrice = 1000;
  const gasLimit = 10;

  beforeEach(() => {
    mockUseEthPrice.mockReturnValue({ data: ethPrice, ...common });
    mockUseEthereumSWR.mockReturnValue({ data: WeiPerEther, ...common });
  });

  afterAll(() => {
    mockUseEthPrice.mockReset();
    mockUseEthereumSWR.mockReset();
  });

  test('should multiply correct', async () => {
    const { result } = renderHook(() => useTxPrice(gasLimit));
    expect(result.current.data).toBe(ethPrice * gasLimit);
  });

  test('should update', async () => {
    const mockUpdate = jest.fn(async () => void 0);

    mockUseEthPrice.mockReturnValue({
      ...common,
      data: ethPrice,
      update: mockUpdate,
    });

    mockUseEthereumSWR.mockReturnValue({
      ...common,
      data: WeiPerEther,
      update: mockUpdate,
    });

    const { result } = renderHook(() => useTxPrice(gasLimit));

    expect(mockUpdate).toHaveBeenCalledTimes(0);
    await act(async () => {
      await result.current.update();
    });
    expect(mockUpdate).toHaveBeenCalledTimes(2);
  });

  test('should inherit eth loading', async () => {
    mockUseEthPrice.mockReturnValue({ loading: true } as any);
    const { result } = renderHook(() => useTxPrice(gasLimit));
    expect(result.current.loading).toBe(true);
  });

  test('should inherit gas loading', async () => {
    mockUseEthereumSWR.mockReturnValue({ loading: true } as any);
    const { result } = renderHook(() => useTxPrice(gasLimit));
    expect(result.current.loading).toBe(true);
  });

  test('should inherit eth initial loading', async () => {
    mockUseEthPrice.mockReturnValue({ initialLoading: true } as any);
    const { result } = renderHook(() => useTxPrice(gasLimit));
    expect(result.current.initialLoading).toBe(true);
  });

  test('should inherit gas initial loading', async () => {
    mockUseEthereumSWR.mockReturnValue({ initialLoading: true } as any);
    const { result } = renderHook(() => useTxPrice(gasLimit));
    expect(result.current.initialLoading).toBe(true);
  });

  test('should inherit eth errors', async () => {
    mockUseEthPrice.mockReturnValue({ error: new Error() } as any);
    const { result } = renderHook(() => useTxPrice(gasLimit));
    expect(result.current.error).toBeInstanceOf(Error);
  });

  test('should inherit gas errors', async () => {
    mockUseEthereumSWR.mockReturnValue({ error: new Error() } as any);
    const { result } = renderHook(() => useTxPrice(gasLimit));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
