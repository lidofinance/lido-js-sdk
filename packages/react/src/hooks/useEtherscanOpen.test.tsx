import { renderHook } from '@testing-library/react-hooks';
import { useEtherscanOpen } from './useEtherscanOpen';
import { ProviderWrapper } from './testUtils';

describe('useEtherscanOpen', () => {
  test('should fetch data', async () => {
    const wrapper = ProviderWrapper;
    const spy = jest.spyOn(window, 'open').mockImplementation(() => null);

    const { result } = renderHook(
      () => useEtherscanOpen('http://foo.bar', 'token'),
      { wrapper },
    );

    expect(result.current).toBeInstanceOf(Function);
    expect(() => result.current()).not.toThrow();
    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });
});
