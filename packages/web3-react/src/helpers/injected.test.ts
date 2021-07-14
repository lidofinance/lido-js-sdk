import {
  hasInjected,
  isImTokenProvider,
  isMetamaskProvider,
  isTrustProvider,
  isDappBrowserProvider,
  isIframe,
  isLedgerDappBrowserProvider,
} from './injected';

const windowSpy = jest.spyOn(global, 'window', 'get');
const mockIsMobileOrTablet = jest.fn();

jest.mock('./ua', () => ({
  get isMobileOrTablet() {
    return mockIsMobileOrTablet();
  },
}));

beforeEach(() => {
  windowSpy.mockReturnValue(undefined as any);
  mockIsMobileOrTablet.mockReturnValue(false);
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

  test('should not detect metamask', async () => {
    expect(() => isMetamaskProvider()).not.toThrowError();
    expect(isMetamaskProvider()).toBe(false);
  });
});

describe('isImTokenProvider', () => {
  test('should detect imToken', async () => {
    windowSpy.mockReturnValue({ ethereum: { isImToken: true } } as any);
    expect(isImTokenProvider()).toBe(true);
  });

  test('should not detect imToken', async () => {
    expect(() => isImTokenProvider()).not.toThrowError();
    expect(isImTokenProvider()).toBe(false);
  });
});

describe('isTrustProvider', () => {
  test('should detect trust wallet', async () => {
    windowSpy.mockReturnValue({ ethereum: { isTrust: true } } as any);
    expect(isTrustProvider()).toBe(true);
  });

  test('should not detect trust wallet', async () => {
    expect(() => isTrustProvider()).not.toThrowError();
    expect(isTrustProvider()).toBe(false);
  });
});

describe('isDappBrowserProvider', () => {
  test('should detect dapp browser', async () => {
    mockIsMobileOrTablet.mockReturnValue(true);
    windowSpy.mockReturnValue({ ethereum: {} } as any);
    expect(isDappBrowserProvider()).toBe(true);
  });

  test('should not detect dapp browser', async () => {
    expect(isDappBrowserProvider()).toBe(false);
  });
});

describe('isIframe', () => {
  test('should detect iframe', async () => {
    windowSpy.mockReturnValue({ self: {}, top: {} } as any);
    expect(isIframe()).toBe(true);
  });

  test('should not detect iframe', async () => {
    expect(isIframe()).toBe(false);
  });
});

describe('isLedgerDappBrowserProvider', () => {
  test('should detect ledger dapp browser', async () => {
    const self = { location: { search: '?embed=true' } };
    windowSpy.mockReturnValue({ self, top: {} } as any);
    expect(isLedgerDappBrowserProvider()).toBe(true);
  });

  test('should not detect ledger dapp browser if it’s not iframe', async () => {
    const same = { location: { search: '?embed=true' } };
    windowSpy.mockReturnValue({ self: same, top: same } as any);
    expect(isLedgerDappBrowserProvider()).toBe(false);
  });

  test('should not detect ledger dapp browser if urls doesn’t contain embed', async () => {
    const self = { location: { search: '' } };
    windowSpy.mockReturnValue({ self: self, top: {} } as any);
    expect(isLedgerDappBrowserProvider()).toBe(false);
  });

  test('should catch an error', async () => {
    windowSpy.mockReturnValue({ self: {}, top: {} } as any);
    expect(isLedgerDappBrowserProvider()).toBe(false);
  });
});
