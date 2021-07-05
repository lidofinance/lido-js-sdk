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

  test('should multiply correct', async () => {
    mockUseEthPrice.mockReturnValue({ data: ethPrice, ...common });
    mockUseEthereumSWR.mockReturnValue({ data: WeiPerEther, ...common });

    const { result } = renderHook(() => useTxPrice(gasLimit));
    expect(result.current.data).toBe(ethPrice * gasLimit);
  });

  test('should return undefined if error', async () => {
    mockUseEthPrice.mockReturnValue({
      ...common,
      data: ethPrice,
      error: new Error(),
    });
    mockUseEthereumSWR.mockReturnValue({ data: WeiPerEther, ...common });

    const { result } = renderHook(() => useTxPrice(gasLimit));
    expect(result.current.data).toBeUndefined();
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
    act(() => result.current.update());
    expect(mockUpdate).toHaveBeenCalledTimes(2);
  });
});
