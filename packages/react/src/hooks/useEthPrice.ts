import { BigNumber } from '@ethersproject/bignumber';
import { getAggregatorContract } from '@lido-sdk/contracts';
import { getAggregatorAddress, CHAINS } from '@lido-sdk/constants';
import { divide } from '@lido-sdk/helpers';
import { useSDK } from './useSDK';
import { SWRResponse } from './useLidoSWR';
import { useContractSWR } from './useContractSWR';
import { useCallback, useMemo } from 'react';

const getEthPrice = (decimals?: number, latestAnswer?: BigNumber) => {
  if (decimals == null || latestAnswer == null) {
    return undefined;
  }

  return divide(latestAnswer, BigNumber.from(10).pow(decimals));
};

export const useEthPrice = (): Omit<SWRResponse<number>, 'mutate'> => {
  const { providerMainnetRpc } = useSDK();
  const address = getAggregatorAddress(CHAINS.Mainnet);
  const aggregatorContract = getAggregatorContract(address, providerMainnetRpc);

  const decimals = useContractSWR({
    contract: aggregatorContract,
    method: 'decimals',
  });

  const latestAnswer = useContractSWR({
    contract: aggregatorContract,
    method: 'latestAnswer',
  });

  const decimalsData = decimals.data;
  const latestAnswerData = latestAnswer.data;

  const data = useMemo(() => {
    return getEthPrice(decimalsData, latestAnswerData);
  }, [decimalsData, latestAnswerData]);

  const updateDecimals = decimals.update;
  const updateLatestAnswer = latestAnswer.update;

  const update = useCallback(async () => {
    const [decimals, latestAnswer] = await Promise.all([
      updateDecimals(),
      updateLatestAnswer(),
    ]);

    return getEthPrice(decimals, latestAnswer);
  }, [updateDecimals, updateLatestAnswer]);

  return {
    update,
    data,

    /*
     * support dependency collection
     * https://swr.vercel.app/advanced/performance#dependency-collection
     */

    get loading() {
      return decimals.loading || latestAnswer.loading;
    },
    get initialLoading() {
      return decimals.initialLoading || latestAnswer.initialLoading;
    },
    get error() {
      return decimals.error || latestAnswer.error;
    },
  };
};
