jest.mock('../../src/hooks/useWeb3');
jest.mock('../../src/hooks/useConnectors');

import { renderHook } from '@testing-library/react-hooks';
import { useWeb3, UnsupportedChainIdError } from '../../src/hooks/useWeb3';
import { useSupportedChains } from '../../src/hooks/useSupportedChains';

const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;

describe('useSupportedChains', () => {
  test('should return supportedChains correctly', async () => {
    const supportedChainIds = [1, 4];
    mockUseWeb3.mockReturnValue({ connector: { supportedChainIds } } as any);

    const { result } = renderHook(() => useSupportedChains());
    expect(result.current.supportedChains).toEqual(
      supportedChainIds.map((chainId) => expect.objectContaining({ chainId })),
    );
  });

  test('should detect unsupported network', async () => {
    const error = new UnsupportedChainIdError(1);
    mockUseWeb3.mockReturnValue({ error } as any);

    const { result } = renderHook(() => useSupportedChains());
    expect(result.current.isUnsupported).toBe(true);
  });
});
