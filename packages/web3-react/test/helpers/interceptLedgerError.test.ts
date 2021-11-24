import { interceptLedgerError } from '../../src/helpers';
import { errorDict } from '../../src/helpers/interceptLedgerError';

describe('interceptLedgerError', function () {
  it('should return undefined if there is no error', () => {
    const result = interceptLedgerError(undefined);
    expect(result).toBe(undefined);
  });

  it('should return the same error if its not related to the ledger', () => {
    const error = new Error('Test error');
    const result = interceptLedgerError(error);

    expect(result).toBe(error);
  });

  it('should return new error if its related to the ledger', () => {
    const errors = Object.entries(errorDict).map(([key, value]) => {
      if (!value) return undefined;
      const error = new Error(value);
      error.name = key;
      return error;
    });

    const results = errors.map((err) => interceptLedgerError(err));
    expect(results.map((r) => r?.message)).toEqual(Object.values(errorDict));
  });
});
