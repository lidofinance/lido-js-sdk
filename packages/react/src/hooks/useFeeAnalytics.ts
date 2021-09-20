import { BigNumber } from '@ethersproject/bignumber';
import { Zero } from '@ethersproject/constants';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { SWRConfiguration } from 'swr';
import { FeeHistory, useFeeHistory } from './useFeeHistory';
import { SWRResponse } from './useLidoSWR';

export type FeeAnalytics = Omit<SWRResponse<FeeHistory, Error>, 'data'> & {
  percentile: number;
  baseFee: BigNumber;
};

export const calculatePercentile = (
  array: BigNumber[],
  target: BigNumber,
): number => {
  const lessThenTarget = array.reduce(
    (counter, current) => (current.lt(target) ? counter + 1 : counter),
    0,
  );

  return array.length ? lessThenTarget / array.length : 1;
};

export const useFeeAnalytics = (props: {
  shouldFetch?: boolean;
  providerRpc?: JsonRpcProvider;
  providerWeb3?: Web3Provider;
  blocks?: number;
  config?: SWRConfiguration<FeeHistory, Error>;
}): FeeAnalytics => {
  const history = useFeeHistory(props);
  const { mutate, update } = history;

  const feeHistory = history.data?.baseFeePerGas || [];
  const baseFee = feeHistory[feeHistory.length - 1] ?? Zero;

  const percentile = calculatePercentile([...feeHistory], baseFee);

  return {
    percentile,
    baseFee,

    mutate,
    update,

    /*
     * support dependency collection
     * https://swr.vercel.app/advanced/performance#dependency-collection
     */

    get loading() {
      return history.loading;
    },
    get initialLoading() {
      return history.initialLoading;
    },
    get error() {
      return history.error;
    },
  };
};
