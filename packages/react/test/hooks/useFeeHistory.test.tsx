jest.mock('tiny-warning');

import warning from 'tiny-warning';
import { FC } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { hexValue } from '@ethersproject/bytes';
import { renderHook, act } from '@testing-library/react-hooks';
import {
  combineHistory,
  getBlockNumber,
  getChunksArguments,
  getFeeHistory,
  historyCache,
  trimHistory,
  useFeeHistory,
} from '../../src/hooks/useFeeHistory';
import { ProviderWrapper } from './testUtils';

const mockWarning = warning as jest.MockedFunction<typeof warning>;

const hex = (number: number) => hexValue(BigNumber.from(number));

describe('getBlockNumber', () => {
  test('should use cached data', async () => {
    const expected = 10;
    const providerRpc = { blockNumber: expected } as any;
    const blockNumber = await getBlockNumber(providerRpc);

    expect(blockNumber).toBe(expected);
  });

  test('should get block number from chain', async () => {
    const expected = 10;
    const providerRpc = {
      blockNumber: -1,
      getBlockNumber: () => expected,
    } as any;
    const blockNumber = await getBlockNumber(providerRpc);

    expect(blockNumber).toBe(expected);
  });
});

describe('getChunksArguments', () => {
  test('should split into chunks', () => {
    const chunkSize = 2;
    const chunksArgs = getChunksArguments(0, 3, chunkSize);

    expect(chunksArgs).toEqual([
      [chunkSize, '0x1', []],
      [chunkSize, '0x3', []],
    ]);
  });

  test('should work if from == to', () => {
    const chunksArgs = getChunksArguments(0, 0, 1000);
    expect(chunksArgs).toEqual([[1, '0x0', []]]);
  });

  test('should work if the first chunk is smaller than the others', () => {
    const chunkSize = 3;
    const chunksArgs = getChunksArguments(0, 7, chunkSize);

    expect(chunksArgs).toEqual([
      [2, '0x1', []],
      [3, '0x4', []],
      [3, '0x7', []],
    ]);
  });

  test('should throw an error if chunkSize is < 0', async () => {
    expect(() => getChunksArguments(1, 1, 0)).toThrow();
    expect(() => getChunksArguments(1, 1, -1)).toThrow();
  });

  test('should throw an error if from > to', async () => {
    expect(() => getChunksArguments(2, 1, 1)).toThrow();
  });
});

describe('combineHistory', () => {
  const first = {
    oldestBlock: 1,
    baseFeePerGas: [BigNumber.from(1), BigNumber.from(2)],
    gasUsedRatio: [1],
  };

  const second = {
    oldestBlock: 2,
    baseFeePerGas: [BigNumber.from(2), BigNumber.from(3)],
    gasUsedRatio: [2],
  };

  test('should combine two elements', () => {
    const combined = combineHistory(first, second);

    expect(combined).toEqual({
      oldestBlock: 1,
      baseFeePerGas: [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)],
      gasUsedRatio: [1, 2],
    });
  });

  test('should work with 1 element', () => {
    const combined = combineHistory(first);
    expect(combined).toEqual(first);
  });

  test('should throw an error if histories cannot be merged', () => {
    expect(() =>
      combineHistory(first, { ...second, oldestBlock: 3 }),
    ).toThrow();
  });
});

describe('trimHistory', () => {
  const history = {
    oldestBlock: 1,
    baseFeePerGas: [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)],
    gasUsedRatio: [1, 2],
  };

  test('should trim the history', () => {
    const blocks = 1;
    const trimmed = trimHistory(history, blocks);

    expect(trimmed).toEqual({
      oldestBlock: 2,
      baseFeePerGas: [BigNumber.from(2), BigNumber.from(3)],
      gasUsedRatio: [2],
    });
  });

  test('should not trim if the number of blocks is more than in the history', () => {
    const blocks = 2000;
    const trimmed = trimHistory(history, blocks);

    expect(trimmed).toEqual(history);
  });

  test('should throw if blocks == 0', () => {
    expect(() => trimHistory(history, 0)).toThrow();
  });
});

describe('getFeeHistory', () => {
  let call = 0;
  const histories = [
    {
      oldestBlock: hex(2),
      baseFeePerGas: [hex(1), hex(2), hex(3)],
      gasUsedRatio: [1, 2],
    },
    {
      oldestBlock: hex(4),
      baseFeePerGas: [hex(3), hex(4), hex(5)],
      gasUsedRatio: [3, 4],
    },
  ];

  const mockSend = jest.fn(() => histories[call++]);
  let providerRpc: any;

  beforeEach(() => {
    providerRpc = {
      send: mockSend,
      blockNumber: 5,
    };
  });

  test('should fetch a history', async () => {
    const history = await getFeeHistory(providerRpc, 1, 4, 2);

    expect(history).toEqual({
      oldestBlock: 2,
      baseFeePerGas: [
        BigNumber.from(1),
        BigNumber.from(2),
        BigNumber.from(3),
        BigNumber.from(4),
        BigNumber.from(5),
      ],
      gasUsedRatio: [1, 2, 3, 4],
    });
  });
});

describe('useFeeHistory', () => {
  const historyAnswer = {
    oldestBlock: 1,
    baseFeePerGas: [hex(1), hex(2), hex(3)],
    gasUsedRatio: [1, 2],
  };

  const historyResult = {
    oldestBlock: 1,
    baseFeePerGas: [BigNumber.from(1), BigNumber.from(2), BigNumber.from(3)],
    gasUsedRatio: [1, 2],
  };

  const mockSend = jest.fn(() => historyAnswer);
  let providerRpc: any;

  beforeEach(() => {
    historyCache.clear();

    providerRpc = {
      send: mockSend,
      blockNumber: 2,
    };
  });

  afterEach(() => {
    mockSend.mockClear();
    mockWarning.mockReset();
  });

  test('should fetch data', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useFeeHistory({ providerRpc, blocks: 2 }),
      { wrapper: ProviderWrapper },
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toEqual(historyResult);
  });

  test('should not fetch', async () => {
    const { result } = renderHook(
      () => useFeeHistory({ shouldFetch: false, providerRpc }),
      { wrapper: ProviderWrapper },
    );

    expect(result.current.data).toBeUndefined();
    expect(mockSend).toBeCalledTimes(0);
  });

  test('should not update on rerender', async () => {
    const { result, rerender, waitForNextUpdate } = renderHook(
      () => useFeeHistory({ providerRpc, blocks: 2 }),
      { wrapper: ProviderWrapper },
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toEqual(historyResult);

    act(() => rerender());

    expect(result.current.data).toEqual(historyResult);
    expect(mockSend).toBeCalledTimes(1);
  });

  test('should use cache', async () => {
    const { result, rerender, waitForNextUpdate } = renderHook(
      () => useFeeHistory({ blocks: 2 }).data,
      { initialProps: { providerRpc }, wrapper: ProviderWrapper },
    );

    expect(result.current).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current).toEqual(historyResult);
    expect(mockSend).toBeCalledTimes(1);

    act(() => rerender({ providerRpc: { ...providerRpc } }));
    expect(result.current).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current).toEqual(historyResult);
    expect(mockSend).toBeCalledTimes(1);
  });

  test('should merge new history with cached', async () => {
    const { result, rerender, waitForNextUpdate } = renderHook(
      () => useFeeHistory({ blocks: 3 }),
      { initialProps: { providerRpc }, wrapper: ProviderWrapper },
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toEqual(historyResult);
    expect(mockSend).toBeCalledTimes(1);

    const mockSendSecond = jest.fn(() => ({
      oldestBlock: 3,
      baseFeePerGas: [hex(3), hex(4), hex(5)],
      gasUsedRatio: [3, 4],
    }));

    act(() =>
      rerender({
        providerRpc: {
          ...providerRpc,
          blockNumber: 3,
          send: mockSendSecond,
        },
      }),
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(result.current.data).toEqual({
      oldestBlock: 2,
      baseFeePerGas: [
        BigNumber.from(2),
        BigNumber.from(3),
        BigNumber.from(4),
        BigNumber.from(5),
      ],
      gasUsedRatio: [2, 3, 4],
    });
    expect(mockSend).toBeCalledTimes(1);
    expect(mockSendSecond).toBeCalledTimes(1);
    expect(mockSendSecond).toBeCalledWith('eth_feeHistory', [1, '0x3', []]);
  });

  test('should use providerRpc from SDK', async () => {
    const wrapper: FC = (props) => (
      <ProviderWrapper providerRpc={providerRpc} {...props} />
    );
    const { result, waitForNextUpdate } = renderHook(
      () => useFeeHistory({ blocks: 1 }),
      { wrapper },
    );

    expect(result.current.data).toBeUndefined();
    await waitForNextUpdate();
    expect(mockSend).toBeCalledTimes(1);
  });

  test('should subscribe to the events', async () => {
    const mockOn = jest.fn(() => void 0);
    const mockOff = jest.fn(() => void 0);
    const providerWeb3 = { on: mockOn, off: mockOff } as any;

    const wrapper: FC = (props) => (
      <ProviderWrapper
        providerRpc={providerRpc}
        providerWeb3={providerWeb3}
        {...props}
      />
    );
    const { unmount } = renderHook(() => useFeeHistory(), { wrapper });

    expect(mockOn).toHaveBeenCalledTimes(1);
    expect(mockOff).toHaveBeenCalledTimes(0);

    act(() => unmount());

    expect(mockOn).toHaveBeenCalledTimes(1);
    expect(mockOff).toHaveBeenCalledTimes(1);
  });

  test('should catch a subscribe error', async () => {
    const wrapper: FC = (props) => (
      <ProviderWrapper
        providerRpc={providerRpc}
        providerWeb3={{} as any}
        {...props}
      />
    );
    renderHook(() => useFeeHistory({ blocks: 2 }), { wrapper });

    expect(mockWarning).toHaveBeenCalledTimes(1);
  });
});
