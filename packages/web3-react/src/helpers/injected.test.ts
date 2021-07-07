import {
  hasInjected,
  isMetamaskProvider,
  isImTokenProvider,
  isTrustProvider,
} from './injected';

const windowSpy = jest.spyOn(global, 'window', 'get');

beforeEach(() => {
  windowSpy.mockReturnValue(undefined as any);
});

describe('hasInjected', () => {
  test('should detect ethereum in window', async () => {
    windowSpy.mockReturnValue({ ethereum: {} } as any);
    expect(hasInjected()).toBe(true);
  });

  test('should not detect ethereum in window', async () => {
    expect(() => hasInjected()).not.toThrowError();
    expect(hasInjected()).toBe(false);
  });
});

describe('isMetamaskProvider', () => {
  test('should detect metamask', async () => {
    windowSpy.mockReturnValue({ ethereum: { isMetaMask: true } } as any);
    expect(isMetamaskProvider()).toBe(true);
  });

  test('should not metamask', async () => {
    expect(() => isMetamaskProvider()).not.toThrowError();
    expect(isMetamaskProvider()).toBe(false);
  });
});

describe('isImTokenProvider', () => {
  test('should detect imToken', async () => {
    windowSpy.mockReturnValue({ ethereum: { isImToken: true } } as any);
    expect(isImTokenProvider()).toBe(true);
  });

  test('should not imToken', async () => {
    expect(() => isImTokenProvider()).not.toThrowError();
    expect(isImTokenProvider()).toBe(false);
  });
});

describe('isTrustProvider', () => {
  test('should detect trust wallet', async () => {
    windowSpy.mockReturnValue({ ethereum: { isTrust: true } } as any);
    expect(isTrustProvider()).toBe(true);
  });

  test('should not trust wallet', async () => {
    expect(() => isTrustProvider()).not.toThrowError();
    expect(isTrustProvider()).toBe(false);
  });
});
