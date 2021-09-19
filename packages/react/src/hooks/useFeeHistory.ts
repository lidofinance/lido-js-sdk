import warning from 'tiny-warning';
import invariant from 'tiny-invariant';
import { useCallback, useEffect } from 'react';
import { SWRConfiguration } from 'swr';
import { CHAINS } from '@lido-sdk/constants';
import {
  BaseProvider,
  JsonRpcProvider,
  Web3Provider,
} from '@ethersproject/providers';
import { BigNumber } from '@ethersproject/bignumber';
import { useSDK } from './useSDK';
import { useLidoSWR, SWRResponse } from './useLidoSWR';
import { useDebounceCallback } from './useDebounceCallback';

export type SourceFeeHistory = {
  oldestBlock: number;
  baseFeePerGas: readonly string[];
  gasUsedRatio: readonly number[];
};

export type FeeHistory = {
  oldestBlock: number;
  baseFeePerGas: readonly BigNumber[];
  gasUsedRatio: readonly number[];
};

const MAX_BLOCKS_PER_REQUEST = 1024;
const DEFAULT_HISTORY_BLOCKS = MAX_BLOCKS_PER_REQUEST;
const DEFAULT_CACHE_DATA = Object.freeze({
  oldestBlock: -1,
  baseFeePerGas: Object.freeze([]),
  gasUsedRatio: Object.freeze([]),
});

export const historyCache = new Map<CHAINS, FeeHistory>();

export const getBlockNumber = async (
  provider: BaseProvider,
): Promise<number> => {
  const cachedNumber = provider.blockNumber;
  return cachedNumber === -1 ? await provider.getBlockNumber() : cachedNumber;
};

export const getChunksArguments = <T extends [number, string, number[]]>(
  fromBlock: number,
  toBlock: number,
  chunkSize = MAX_BLOCKS_PER_REQUEST,
): T[] => {
  invariant(
    fromBlock <= toBlock,
    'fromBlock should be less than or equal to toBlock',
  );
  invariant(chunkSize > 0, 'chunkSize should be greater than 0');

  const totalBlocks = toBlock - fromBlock + 1;
  const totalChunks = Math.ceil(totalBlocks / chunkSize);

  return Array.from({ length: totalChunks }, (_value, index) => {
    const newestBlock = toBlock - chunkSize * index;
    const blocks = Math.min(1 + newestBlock - fromBlock, chunkSize);

    return [blocks, BigNumber.from(newestBlock).toHexString(), []];
  }).reverse() as T[];
};

export const combineHistory = (...histories: FeeHistory[]): FeeHistory => {
  histories.forEach((currentHistory, index) => {
    if (index === 0) return;
    const previousHistory = histories[index - 1];

    invariant(
      currentHistory.oldestBlock ===
        previousHistory.oldestBlock + previousHistory.baseFeePerGas.length - 1,
      'Histories cannot be merged',
    );
  }, []);

  const lastHistory = histories[histories.length - 1];
  const lastHistoryFees = lastHistory.baseFeePerGas;
  const lastFeePerGas = lastHistoryFees[lastHistoryFees.length - 1];

  const oldestBlock = histories[0].oldestBlock;
  const baseFeePerGas = histories
    .flatMap(({ baseFeePerGas }) => baseFeePerGas.slice(0, -1))
    .concat(lastFeePerGas);

  const gasUsedRatio = histories.flatMap(({ gasUsedRatio }) => gasUsedRatio);

  return {
    oldestBlock,
    baseFeePerGas,
    gasUsedRatio,
  };
};

export const trimHistory = (
  history: FeeHistory,
  blocks: number,
): FeeHistory => {
  invariant(blocks > 0, 'blocks number should be greater than 0');

  const currentBlocks = history.gasUsedRatio.length;
  const trimmedBlocks = Math.max(0, currentBlocks - blocks);
  const oldestBlock = history.oldestBlock + trimmedBlocks;

  const baseFeePerGas = history.baseFeePerGas.slice(-(blocks + 1));
  const gasUsedRatio = history.gasUsedRatio.slice(-blocks);

  return {
    oldestBlock,
    baseFeePerGas,
    gasUsedRatio,
  };
};

export const getFeeHistory = async (
  provider: JsonRpcProvider,
  fromBlock: number,
  toBlock: number,
  chunkSize?: number,
): Promise<FeeHistory> => {
  const chunksArgs = getChunksArguments(fromBlock, toBlock, chunkSize);

  const histories = await Promise.all(
    chunksArgs.map((args) => {
      return provider.send('eth_feeHistory', args) as Promise<SourceFeeHistory>;
    }),
  );

  const convertedHistories = histories.map((history) => ({
    ...history,
    oldestBlock: BigNumber.from(history.oldestBlock).toNumber(),
    baseFeePerGas: history.baseFeePerGas.map((fee) => BigNumber.from(fee)),
  }));

  return combineHistory(...convertedHistories);
};

export const useFeeHistory = <
  P extends JsonRpcProvider,
  W extends Web3Provider,
>(props?: {
  shouldFetch?: boolean;
  providerRpc?: P;
  providerWeb3?: W;
  blocks?: number;
  config?: SWRConfiguration<FeeHistory, Error>;
}): SWRResponse<FeeHistory, Error> => {
  const {
    shouldFetch = true,
    blocks = DEFAULT_HISTORY_BLOCKS,
    config,
  } = props || {};
  const providerRpcFromSdk = useSDK().providerRpc as P;
  const providerRpc = props?.providerRpc ?? providerRpcFromSdk;

  const providerWeb3FromSdk = useSDK().providerWeb3 as W;
  const providerWeb3 = props?.providerWeb3 ?? providerWeb3FromSdk;

  const { chainId } = useSDK();

  invariant(providerRpc != null, 'RPC Provider is not provided');
  invariant(blocks > 0, 'blocks number should be greater than 0');

  const result = useLidoSWR<FeeHistory, Error>(
    shouldFetch ? [providerRpc, chainId, blocks] : null,
    async (
      providerRpc: P,
      chainId: CHAINS,
      blocks: number,
    ): Promise<FeeHistory> => {
      const currentBlock = await getBlockNumber(providerRpc);

      const cachedHistory = historyCache.get(chainId) ?? DEFAULT_CACHE_DATA;
      const oldestCachedBlock = cachedHistory.oldestBlock;
      const blocksInCache = cachedHistory.gasUsedRatio.length;
      const newestCachedBlock = blocksInCache
        ? oldestCachedBlock + blocksInCache - 1
        : -1;
      const firstRequiredBlock = currentBlock - blocks + 1;

      if (blocksInCache && newestCachedBlock >= currentBlock) {
        return cachedHistory;
      }

      const fromBlock = Math.max(newestCachedBlock + 1, firstRequiredBlock);
      const toBlock = currentBlock;

      const newHistory = await getFeeHistory(providerRpc, fromBlock, toBlock);

      const shouldCombine = blocksInCache
        ? newestCachedBlock < newHistory.oldestBlock
        : false;

      const combinedHistory = shouldCombine
        ? combineHistory(cachedHistory, newHistory)
        : newHistory;

      const trimmedHistory = trimHistory(combinedHistory, blocks);

      historyCache.set(chainId, trimmedHistory);
      return trimmedHistory;
    },
    config,
  );

  const updateHistory = useDebounceCallback(result.update);

  const subscribeToUpdates = useCallback(() => {
    const provider = providerWeb3 || providerRpc;

    try {
      provider.on('block', updateHistory);

      return () => {
        provider.off('block', updateHistory);
      };
    } catch (error) {
      return warning(false, 'Cannot subscribe to Block event');
    }
  }, [providerRpc, providerWeb3, updateHistory]);

  useEffect(subscribeToUpdates, [subscribeToUpdates]);

  return result;
};
