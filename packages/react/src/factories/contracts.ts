import { BaseContract } from '@ethersproject/contracts';
import { TOKENS, CHAINS, getTokenAddress } from '@lido-sdk/constants';
import {
  WstethAbiFactory,
  StethAbiFactory,
  Factory,
  createContractGetter,
} from '@lido-sdk/contracts';
import { useSDK } from '../hooks';

export const web3ContractHookFactory = <C extends BaseContract>(
  factory: Factory<C>,
  getTokenAddress: (chainId: CHAINS) => string,
): (() => C | null) => {
  const getContract = createContractGetter(factory);

  return () => {
    const { chainId, providerWeb3 } = useSDK();
    const tokenAddress = getTokenAddress(chainId);

    if (!providerWeb3) return null;
    return getContract(tokenAddress, providerWeb3.getSigner());
  };
};

export const useWSTETHContract = web3ContractHookFactory(
  WstethAbiFactory,
  (chainId) => getTokenAddress(chainId, TOKENS.WSTETH),
);

export const useSTETHContract = web3ContractHookFactory(
  StethAbiFactory,
  (chainId) => getTokenAddress(chainId, TOKENS.STETH),
);
