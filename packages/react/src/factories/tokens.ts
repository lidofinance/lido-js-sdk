import { BigNumber } from '@ethersproject/bignumber';
import { TOKENS, CHAINS, getTokenAddress } from '@lido-sdk/constants';
import {
  SWRResponse,
  UseApproveResponse,
  UseApproveWrapper,
  useAllowance,
  useDecimals,
  useSDK,
  useTokenBalance,
  useTotalSupply,
  useApprove,
} from '../hooks';

export const hooksFactory = (
  getTokenAddress: (chainId: CHAINS) => string,
): {
  useTokenBalance: () => SWRResponse<BigNumber>;
  useTotalSupply: () => SWRResponse<BigNumber>;
  useDecimals: () => SWRResponse<number>;
  useAllowance: (spender: string) => SWRResponse<BigNumber>;
  useApprove: (
    amount: BigNumber,
    spender: string,
    wrapper: UseApproveWrapper,
  ) => UseApproveResponse;
} => {
  return {
    useTokenBalance: () => {
      const { chainId } = useSDK();
      const tokenAddress = getTokenAddress(chainId);
      return useTokenBalance(tokenAddress);
    },
    useTotalSupply: () => {
      const { chainId } = useSDK();
      const tokenAddress = getTokenAddress(chainId);
      return useTotalSupply(tokenAddress);
    },
    useDecimals: () => {
      const { chainId } = useSDK();
      const tokenAddress = getTokenAddress(chainId);
      return useDecimals(tokenAddress);
    },
    useAllowance: (spender: string) => {
      const { chainId } = useSDK();
      const tokenAddress = getTokenAddress(chainId);
      return useAllowance(tokenAddress, spender);
    },
    useApprove: (
      amount: BigNumber,
      spender: string,
      wrapper?: UseApproveWrapper,
    ) => {
      const { chainId, account } = useSDK();
      const tokenAddress = getTokenAddress(chainId);
      return useApprove(amount, tokenAddress, spender, account, wrapper);
    },
  };
};

const wsteth = hooksFactory((chainId) =>
  getTokenAddress(chainId, TOKENS.WSTETH),
);
export const useWSTETHBalance = wsteth.useTokenBalance;
export const useWSTETHTotalSupply = wsteth.useTotalSupply;
export const useWSTETHDecimals = wsteth.useDecimals;
export const useWSTETHAllowance = wsteth.useAllowance;
export const useWSTETHApprove = wsteth.useApprove;

const steth = hooksFactory((chainId) => getTokenAddress(chainId, TOKENS.STETH));
export const useSTETHBalance = steth.useTokenBalance;
export const useSTETHTotalSupply = steth.useTotalSupply;
export const useSTETHDecimals = steth.useDecimals;
export const useSTETHAllowance = steth.useAllowance;
export const useSTETHApprove = steth.useApprove;

const ldo = hooksFactory((chainId) => getTokenAddress(chainId, TOKENS.LDO));
export const useLDOBalance = ldo.useTokenBalance;
export const useLDOTotalSupply = ldo.useTotalSupply;
export const useLDODecimals = ldo.useDecimals;
export const useLDOAllowance = ldo.useAllowance;
export const useLDOApprove = ldo.useApprove;
