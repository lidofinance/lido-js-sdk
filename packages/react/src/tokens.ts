import { TOKENS } from '@lido-sdk/constants';
import {
  useAllowance,
  useTokenAddress,
  useTokenBalance,
  useTotalSupply,
} from './hooks';

const hooksFactory = (token: TOKENS) => {
  return {
    useTokenBalance: () => {
      return useTokenBalance(useTokenAddress(token));
    },
    useTotalSupply: () => {
      return useTotalSupply(useTokenAddress(token));
    },
    useDecimals: () => {
      return useTotalSupply(useTokenAddress(token));
    },
    useAllowance: (spender: string) => {
      return useAllowance(useTokenAddress(token), spender);
    },
  };
};

const wsteth = hooksFactory(TOKENS.WSTETH);
export const useWSTETHBalance = wsteth.useTokenBalance;
export const useWSTETHTotalSupply = wsteth.useTotalSupply;
export const useWSTETHDecimals = wsteth.useDecimals;
export const useWSTETHAllowance = wsteth.useAllowance;

const steth = hooksFactory(TOKENS.STETH);
export const useSTETHBalance = steth.useTokenBalance;
export const useSTETHTotalSupply = steth.useTotalSupply;
export const useSTETHDecimals = steth.useDecimals;
export const useSTETHAllowance = steth.useAllowance;

const ldo = hooksFactory(TOKENS.LDO);
export const useLDOBalance = ldo.useTokenBalance;
export const useLDOTotalSupply = ldo.useTotalSupply;
export const useLDODecimals = ldo.useDecimals;
export const useLDOAllowance = ldo.useAllowance;
