import { FC } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { ProviderWrapper } from '../hooks/testUtils';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import {
  useSTETHContractRPC,
  useWSTETHContractRPC,
  useLDOContractRPC,
  useSTETHContractWeb3,
  useWSTETHContractWeb3,
  useLDOContractWeb3,
} from './contracts';

const hooksRpc = {
  useSTETHContractRPC,
  useWSTETHContractRPC,
  useLDOContractRPC,
};

const hooksWeb3 = {
  useSTETHContractWeb3,
  useWSTETHContractWeb3,
  useLDOContractWeb3,
};

describe('web3 contracts', () => {
  Object.entries(hooksWeb3).map(([name, hook]) => {
    test(`${name} should be a function`, async () => {
      expect(hook).toBeInstanceOf(Function);
    });

    test(`${name} should work`, async () => {
      const wrapper: FC = (props) => (
        <ProviderWrapper
          providerWeb3={new Web3Provider(async () => void 0)}
          {...props}
        />
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

describe('RPC contracts', () => {
  Object.entries(hooksRpc).map(([name, hook]) => {
    test(`${name} should be a function`, async () => {
      expect(hook).toBeInstanceOf(Function);
    });

    test(`${name} should return a contract`, async () => {
      const wrapper = ProviderWrapper;

      const { result } = renderHook(() => hook(), { wrapper });
      expect(result.current).toBeInstanceOf(Contract);
    });
  });
});
