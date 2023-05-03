import { BaseContract } from '@ethersproject/contracts';
import { Provider } from '@ethersproject/providers';
import { Signer } from '@ethersproject/abstract-signer';
import {
  AggregatorAbiFactory,
  Erc20AbiFactory,
  StethAbiFactory,
  WstethAbiFactory,
  LdoAbiFactory,
  WithdrawalQueueAbiFactory,
} from './factories';

export interface Factory<C extends BaseContract> {
  connect(address: string, signerOrProvider: Signer | Provider): C;
}

export const createContractGetter = <C extends BaseContract>(
  factory: Factory<C>,
): ((
  address: string,
  signerOrProvider: Signer | Provider,
  cacheSeed?: number,
) => C) => {
  const providerCache = new WeakMap<Signer | Provider, Record<string, C>>();

  return (address, signerOrProvider, cacheSeed = 0) => {
    const cacheByAddressKey = `${address}-${cacheSeed}`;
    let cacheByAddress = providerCache.get(signerOrProvider);
    let contract = cacheByAddress?.[cacheByAddressKey];

    if (!cacheByAddress) {
      cacheByAddress = {};
      providerCache.set(signerOrProvider, cacheByAddress);
    }

    if (!contract) {
      contract = factory.connect(address, signerOrProvider);
      cacheByAddress[cacheByAddressKey] = contract;
    }

    return contract;
  };
};

export const getAggregatorContract = createContractGetter(AggregatorAbiFactory);
export const getERC20Contract = createContractGetter(Erc20AbiFactory);
export const getSTETHContract = createContractGetter(StethAbiFactory);
export const getWSTETHContract = createContractGetter(WstethAbiFactory);
export const getLDOContract = createContractGetter(LdoAbiFactory);
export const getWithdrawalQueueContract = createContractGetter(
  WithdrawalQueueAbiFactory,
);
