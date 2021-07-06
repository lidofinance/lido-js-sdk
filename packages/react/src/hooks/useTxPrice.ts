import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { WeiPerEther } from '@ethersproject/constants';
import { divide } from '@lido-sdk/helpers';
import { useCallback, useMemo } from 'react';
import { useEthereumSWR } from './useEthereumSWR';
import { useEthPrice } from './useEthPrice';
import { SWRResponse } from './useLidoSWR';

const getTxPrice = (
  gasLimit: BigNumberish,
  ethPrice?: number,
  gasPrice?: BigNumber,
) => {
  if (!gasLimit || ethPrice == null || gasPrice == null) {
    return undefined;
  }

  const txCostInWei = gasPrice.mul(BigNumber.from(gasLimit));
  const txCostInEth = divide(txCostInWei, WeiPerEther);

  return ethPrice * txCostInEth;
};

export const useTxPrice = (
  gasLimit: BigNumberish,
): Omit<SWRResponse<number>, 'mutate'> => {
  const eth = useEthPrice();
  const gas = useEthereumSWR({ method: 'getGasPrice' });

  const ethPrice = eth.data;
  const gasPrice = gas.data;

  const data = useMemo(() => {
    return getTxPrice(gasLimit, ethPrice, gasPrice);
  }, [gasLimit, ethPrice, gasPrice]);

  const updateEth = eth.update;
  const updateGas = gas.update;

  const update = useCallback(async () => {
    const [ethPrice, gasPrice] = await Promise.all([updateEth(), updateGas()]);
    return getTxPrice(gasLimit, ethPrice, gasPrice);
  }, [gasLimit, updateEth, updateGas]);

  return {
    update,
    data,

    /*
     * support dependency collection
     * https://swr.vercel.app/advanced/performance#dependency-collection
     */

    get loading() {
      return eth.loading || gas.loading;
    },
    get initialLoading() {
      return eth.initialLoading || gas.initialLoading;
    },
    get error() {
      return eth.error || gas.error;
    },
  };
};
