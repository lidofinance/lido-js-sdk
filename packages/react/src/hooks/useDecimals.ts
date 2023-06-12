import invariant from 'tiny-invariant';
import { getERC20Contract } from '@lido-sdk/contracts';
import { useContractSWR } from './useContractSWR';
import { SWRResponse } from './useLidoSWR';
import { useSDK } from './useSDK';
import { SWRConfiguration } from 'swr';

export const useDecimals = (
  token: string,
  config?: SWRConfiguration<number>,
): SWRResponse<number> => {
  const { providerRpc } = useSDK();

  invariant(token != null, 'Token address is required');

  const contract = getERC20Contract(token, providerRpc);
  const result = useContractSWR({ contract, method: 'decimals', config });

  return result;
};
