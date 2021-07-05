import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { WeiPerEther } from '@ethersproject/constants';
import { divide } from '@lido-sdk/helpers';
import { useCallback, useMemo } from 'react';
import { useEthereumSWR } from './useEthereumSWR';
import { useEthPrice } from './useEthPrice';

export const useTxPrice = (
  gasLimit: BigNumberish,
): {
  data: number | undefined;
  loading: boolean;
  initialLoading: boolean;
  error: Error | undefined;
  update: () => void;
} => {
  const eth = useEthPrice();
  const gas = useEthereumSWR({ method: 'getGasPrice' });

  const ethPrice = eth.data;
  const gasPrice = gas.data;

  const initialLoading = eth.initialLoading || gas.initialLoading;
  const loading = eth.loading || gas.loading;
  const error = eth.error || gas.error;

  const data = useMemo(() => {
    if (error || !gasLimit || !ethPrice || !gasPrice) {
      return undefined;
    }

    const txCostInWei = gasPrice.mul(BigNumber.from(gasLimit));
    const txCostInEth = divide(txCostInWei, WeiPerEther);

    return ethPrice * txCostInEth;
  }, [ethPrice, gasPrice, gasLimit, error]);

  const updateEth = eth.update;
  const updateGas = gas.update;

  const update = useCallback(() => {
    updateEth();
    updateGas();
  }, [updateEth, updateGas]);

  return {
    data,
    loading,
    initialLoading,
    error,
    update,
  };
};
