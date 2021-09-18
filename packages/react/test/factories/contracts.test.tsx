import { FC } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { ProviderWrapper } from '../hooks/testUtils';
import {
  useSTETHContractRPC,
  useWSTETHContractRPC,
  useLDOContractRPC,
  useSTETHContractWeb3,
  useWSTETHContractWeb3,
  useLDOContractWeb3,
} from '../../src/factories/contracts';

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
  const ProviderWeb3 = new Web3Provider(async () => void 0);

  Object.entries(hooksWeb3).map(([name, hook]) => {
    test(`${name} should be a function`, async () => {
      expect(hook).toBeInstanceOf(Function);
    });

    test(`${name} should work`, async () => {
      const wrapper: FC = (props) => (
        <ProviderWrapper providerWeb3={ProviderWeb3} {...props} />
      );

      const { result } = renderHook(() => hook(), { wrapper });
      expect(result.current).toBeInstanceOf(Contract);
    });

    test(`${name} should return null if providerWeb3 is not passed`, async () => {
      const wrapper = ProviderWrapper;

      const { result } = renderHook(() => hook(), { wrapper });
      expect(result.current).toBeNull();
    });

    test(`${name} should return the same contract`, async () => {
      const wrapper: FC = (props) => (
        <ProviderWrapper providerWeb3={ProviderWeb3} {...props} />
      );

      const { result, rerender } = renderHook(() => hook(), { wrapper });
      const firstResult = result.current;
      act(() => rerender());
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
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

    test(`${name} should return the same contract`, async () => {
      const wrapper = ProviderWrapper;

      const { result, rerender } = renderHook(() => hook(), { wrapper });
      const firstResult = result.current;
      act(() => rerender());
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });
  });
});
