import invariant from 'tiny-invariant';
import { getERC20Contract } from '@lido-sdk/contracts';
import { useContractSWR } from './useContractSWR';
import { SWRResponse } from './useLidoSWR';
import { useSDK } from './useSDK';

export const useDecimals = (token: string): SWRResponse<number> => {
  const { providerRpc } = useSDK();

  invariant(token != null, 'Token is required');

  const contract = getERC20Contract(token, providerRpc);
  const result = useContractSWR({ contract, method: 'decimals' });

  return result;
};
