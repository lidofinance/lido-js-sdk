import { isMobileOrTablet } from './ua';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      isTrust?: boolean;
      isImToken?: boolean;
    };
  }
}

export const hasInjected = (): boolean => {
  try {
    return !!window.ethereum;
  } catch (error) {
    return false;
  }
};

export const isMetamaskProvider = (): boolean => {
  try {
    return !!window.ethereum?.isMetaMask;
  } catch (error) {
    return false;
  }
};

export const isImTokenProvider = (): boolean => {
  try {
    return !!window.ethereum?.isImToken;
  } catch (error) {
    return false;
  }
};

export const isTrustProvider = (): boolean => {
  try {
    return !!window.ethereum?.isTrust;
  } catch (error) {
    return false;
  }
};

export const isDappBrowserProvider = (): boolean => {
  return isMobileOrTablet && hasInjected();
};

export const isIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch (error) {
    return false;
  }
};

export const isLedgerDappBrowserProvider = (): boolean => {
  try {
    const params = new URLSearchParams(window.self.location.search);
    const isEmbed = !!params.get('embed');

    return isIframe() && isEmbed;
  } catch (error) {
    return false;
  }
};
