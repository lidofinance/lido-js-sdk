import { useWeb3 } from './useWeb3';
import { interceptLedgerError } from '../helpers';
import { useConnectorInfo } from './useConnectorInfo';

export const useConnectorError = (): Error | undefined => {
  const { error } = useWeb3();
  const { isLedger } = useConnectorInfo();

  if (!error) {
    return error;
  }

  if (isLedger) {
    return interceptLedgerError(error);
  }

  return error;
};
