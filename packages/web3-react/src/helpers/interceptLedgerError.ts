export const errorDict: { [k: string]: string | undefined } = {
  TransportOpenUserCancelled: 'The connection attempt has been rejected.',
  TransportStatusError:
    'Make sure the device is connected and the Ethereum app is open on the device.',
  InvalidStateError:
    'Make sure the device is connected and the Ethereum app is open on the device.',
  TransportError: undefined,
};

export default function (error?: Error): Error | undefined {
  if (!error) return error;
  if (error.name in errorDict) {
    return new Error(errorDict[error.name]);
  }

  return error;
}
