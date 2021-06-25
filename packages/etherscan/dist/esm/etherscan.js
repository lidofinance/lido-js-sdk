import invariant from 'tiny-invariant';
import { CHAINS } from './chains.js';

var _a;
var ETHERSCAN_ENTITIES;
(function (ETHERSCAN_ENTITIES) {
  ETHERSCAN_ENTITIES['Tx'] = 'tx';
  ETHERSCAN_ENTITIES['Token'] = 'token';
  ETHERSCAN_ENTITIES['Address'] = 'address';
})(ETHERSCAN_ENTITIES || (ETHERSCAN_ENTITIES = {}));
var ETHERSCAN_PREFIX_BY_NETWORK =
  ((_a = {}),
  (_a[CHAINS.Mainnet] = ''),
  (_a[CHAINS.Ropsten] = 'ropsten.'),
  (_a[CHAINS.Rinkeby] = 'rinkeby.'),
  (_a[CHAINS.Goerli] = 'goerli.'),
  (_a[CHAINS.Kovan] = 'kovan.'),
  _a);
var getEtherscanPrefix = function (chainId) {
  var prefix = ETHERSCAN_PREFIX_BY_NETWORK[chainId];
  invariant(prefix != null, 'Chain is not supported');
  return prefix;
};
var getEtherscanLink = function (chainId, hash, entity) {
  var prefix = getEtherscanPrefix(chainId);
  invariant(hash && typeof hash === 'string', 'Hash should be a string');
  invariant(entity && typeof entity === 'string', 'Entity should be a string');
  return 'https://' + prefix + 'etherscan.io/' + entity + '/' + hash;
};
var getEtherscanTxLink = function (chainId, hash) {
  return getEtherscanLink(chainId, hash, ETHERSCAN_ENTITIES.Tx);
};
var getEtherscanTokenLink = function (chainId, hash) {
  return getEtherscanLink(chainId, hash, ETHERSCAN_ENTITIES.Token);
};
var getEtherscanAddressLink = function (chainId, hash) {
  return getEtherscanLink(chainId, hash, ETHERSCAN_ENTITIES.Address);
};

export {
  ETHERSCAN_ENTITIES,
  ETHERSCAN_PREFIX_BY_NETWORK,
  getEtherscanAddressLink,
  getEtherscanLink,
  getEtherscanPrefix,
  getEtherscanTokenLink,
  getEtherscanTxLink,
};
