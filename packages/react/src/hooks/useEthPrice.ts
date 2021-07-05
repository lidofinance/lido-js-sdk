import { BigNumber } from '@ethersproject/bignumber';
import { getAggregatorContract } from '@lido-sdk/contracts';
import { getAggregatorAddress, CHAINS } from '@lido-sdk/constants';
import { divide } from '@lido-sdk/helpers';
import { useSDK } from './useSDK';
import { useContractSWR } from './useContractSWR';
import { useCallback, useMemo } from 'react';

export const useEthPrice = (): {
  data: number | undefined;
  loading: boolean;
  initialLoading: boolean;
  error: Error | undefined;
  update: () => void;
} => {
  const { providerRpc } = useSDK();
  const address = getAggregatorAddress(CHAINS.Mainnet);
  const aggregatorContract = getAggregatorContract(address, providerRpc);

  const decimals = useContractSWR({
    contract: aggregatorContract,
    method: 'decimals',
  });

  const latestAnswer = useContractSWR({
    contract: aggregatorContract,
    method: 'latestAnswer',
  });

  const initialLoading = decimals.initialLoading || latestAnswer.initialLoading;
  const loading = decimals.loading || latestAnswer.loading;
  const error = decimals.error || latestAnswer.error;

  const data = useMemo(() => {
    if (error || latestAnswer.data == null || decimals.data == null) {
      return undefined;
    }

    return divide(latestAnswer.data, BigNumber.from(10).pow(decimals.data));
  }, [latestAnswer.data, decimals.data, error]);

  const updateDecimals = decimals.update;
  const updateLatestAnswer = latestAnswer.update;

  const update = useCallback(() => {
    updateDecimals();
    updateLatestAnswer();
  }, [updateDecimals, updateLatestAnswer]);

  return {
    data,
    loading,
    initialLoading,
    error,
    update,
  };
};
