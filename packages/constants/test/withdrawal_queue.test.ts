import { CHAINS } from '../src/chains';
import { getWithdrawalQueueAddress } from '../src/withdrawal_queue';

describe('getWithdrawalQueueAddress', () => {
  test('should work if chain is correct', () => {
    expect(typeof getWithdrawalQueueAddress(CHAINS.Mainnet)).toBe('string');
  });
  test('should throw if chain is incorrect', () => {
    expect(() => getWithdrawalQueueAddress(-1)).toThrowError();
    expect(() => getWithdrawalQueueAddress('' as any)).toThrowError();
  });
});
