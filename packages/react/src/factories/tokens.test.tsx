jest.mock('@lido-sdk/contracts');

import { renderHook } from '@testing-library/react-hooks';
import { Zero } from '@ethersproject/constants';
import { getERC20Contract } from '@lido-sdk/contracts';
import { ProviderWrapper } from '../hooks/testUtils';
import * as tokensExport from './tokens';

const { hooksFactory, ...hooks } = tokensExport;

const mockGetter = getERC20Contract as jest.MockedFunction<
  typeof getERC20Contract
>;

describe('tokens', () => {
  afterEach(() => {
    mockGetter.mockReset();
  });

  Object.entries(hooks).map(([name, hook]) => {
    test(`${name} should be a function`, async () => {
      expect(hook).toBeInstanceOf(Function);
    });

    test(`${name} should wrap hook correctly`, async () => {
      const wrapper = ProviderWrapper;

      mockGetter.mockReturnValue({} as any);

      const getArguments = (name: string) => {
        if (name.endsWith('Allowance')) return ['spender'];
        if (name.endsWith('Approve')) return [Zero, 'spender'];
        return [];
      };

      const { result } = renderHook(() => hook(...getArguments(name)), {
        wrapper,
      });
      expect(result.error).toBeUndefined();
    });
  });
});
