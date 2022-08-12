import { isMobileOrTablet } from './ua';

declare global {
  interface Window {
    coin98?: boolean;
    ethereum?: {
      isMetaMask?: boolean;
      isTrust?: boolean;
      isImToken?: boolean;
      isCoin98?: boolean;
      isMathWallet?: boolean;
      isCoinbaseWallet?: boolean;
      isTally?: boolean;
      isBraveWallet?: boolean;
      isExodus?: boolean;
      isOpera?: boolean;
      isGamestop?: boolean;
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

export const isCoin98Provider = (): boolean => {
  try {
    return !!window.coin98 || !!window.ethereum?.isCoin98;
  } catch (error) {
    return false;
  }
};

export const isMathWalletProvider = (): boolean => {
  try {
    return !!window.ethereum?.isMathWallet;
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

export const isCoinbaseProvider = (): boolean => {
  try {
    return !!window.ethereum?.isCoinbaseWallet;
  } catch (error) {
    return false;
  }
};

export const isTallyProvider = (): boolean => {
  try {
    return !!window.ethereum?.isTally;
  } catch (error) {
    return false;
  }
};

export const isBraveWalletProvider = (): boolean => {
  try {
    return !!window.ethereum?.isBraveWallet;
  } catch (error) {
    return false;
  }
};

export const isOperaWalletProvider = (): boolean => {
  try {
    return !!window.ethereum?.isOpera;
  } catch (error) {
    return false;
  }
};

export const isExodusProvider = (): boolean => {
  try {
    return !!window.ethereum?.isExodus;
  } catch (error) {
    return false;
  }
};

export const isGamestopProvider = (): boolean => {
  try {
    return !!window.ethereum?.isGamestop;
  } catch (error) {
    return false;
  }
};
