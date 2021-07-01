import { FC } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { ProviderWrapper } from '../hooks/testUtils';
import { getDefaultProvider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import * as contractsExport from './contracts';

const { web3ContractHookFactory, ...hooks } = contractsExport;

describe('contracts', () => {
  Object.entries(hooks).map(([name, hook]) => {
    test(`${name} should be a function`, async () => {
      expect(hook).toBeInstanceOf(Function);
    });

    test(`${name} should work`, async () => {
      const wrapper: FC = (props) => (
        <ProviderWrapper providerWeb3={getDefaultProvider()} {...props} />
      );

      const { result } = renderHook(() => hook(), { wrapper });
      expect(result.current).toBeInstanceOf(Contract);
    });

    test(`${name} should return null if providerWeb3 is not passed`, async () => {
      const wrapper = ProviderWrapper;

      const { result } = renderHook(() => hook(), { wrapper });
      expect(result.current).toBeNull();
    });
  });
});
