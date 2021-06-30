jest.mock('@lido-sdk/contracts');

import { renderHook } from '@testing-library/react-hooks';
import { getERC20Contract } from '@lido-sdk/contracts';
import { ProviderWrapper } from './hooks/testUtils';
import * as hooks from './tokens';

const mockGetter = getERC20Contract as jest.MockedFunction<
  typeof getERC20Contract
>;

describe('tokens', () => {
  Object.entries(hooks).map(([name, hook]) => {
    test(`${name} should be a function`, async () => {
      expect(hook).toBeInstanceOf(Function);
    });

    test(`${name} should work`, async () => {
      const wrapper = ProviderWrapper;

      mockGetter.mockReturnValue({} as any);

      const { result } = renderHook(() => hook('spender'), { wrapper });
      expect(result.error).toBeUndefined();
    });
  });
});
