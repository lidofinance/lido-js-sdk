import {
  hasInjected,
  isImTokenProvider,
  isMetamaskProvider,
  isCoin98Provider,
  isMathWalletProvider,
  isTrustProvider,
  isDappBrowserProvider,
} from '../../src/helpers/providerDetectors';

const windowSpy = jest.spyOn(global, 'window', 'get');
const mockIsMobileOrTablet = jest.fn();

jest.mock('../../src/helpers/ua', () => ({
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

describe('isCoin98Provider', () => {
  test('should detect coin98', async () => {
    windowSpy.mockReturnValue({ ethereum: { isCoin98: true } } as any);
    expect(isCoin98Provider()).toBe(true);
  });

  test('should not detect coin98', async () => {
    expect(() => isCoin98Provider()).not.toThrowError();
    expect(isCoin98Provider()).toBe(false);
  });
});

describe('isMathWalletProvider', () => {
  test('should detect MathWallet', async () => {
    windowSpy.mockReturnValue({ ethereum: { isMathWallet: true } } as any);
    expect(isMathWalletProvider()).toBe(true);
  });

  test('should not detect MathWallet', async () => {
    expect(() => isMathWalletProvider()).not.toThrowError();
    expect(isMathWalletProvider()).toBe(false);
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
