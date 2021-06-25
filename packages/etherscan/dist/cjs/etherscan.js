'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var invariant = require('tiny-invariant');
var chains = require('./chains.js');

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : { default: e };
}

var invariant__default = /*#__PURE__*/ _interopDefaultLegacy(invariant);

var _a;
exports.ETHERSCAN_ENTITIES = void 0;
(function (ETHERSCAN_ENTITIES) {
  ETHERSCAN_ENTITIES['Tx'] = 'tx';
  ETHERSCAN_ENTITIES['Token'] = 'token';
  ETHERSCAN_ENTITIES['Address'] = 'address';
})(exports.ETHERSCAN_ENTITIES || (exports.ETHERSCAN_ENTITIES = {}));
var ETHERSCAN_PREFIX_BY_NETWORK =
  ((_a = {}),
  (_a[chains.CHAINS.Mainnet] = ''),
  (_a[chains.CHAINS.Ropsten] = 'ropsten.'),
  (_a[chains.CHAINS.Rinkeby] = 'rinkeby.'),
  (_a[chains.CHAINS.Goerli] = 'goerli.'),
  (_a[chains.CHAINS.Kovan] = 'kovan.'),
  _a);
var getEtherscanPrefix = function (chainId) {
  var prefix = ETHERSCAN_PREFIX_BY_NETWORK[chainId];
  invariant__default['default'](prefix != null, 'Chain is not supported');
  return prefix;
};
var getEtherscanLink = function (chainId, hash, entity) {
  var prefix = getEtherscanPrefix(chainId);
  invariant__default['default'](
    hash && typeof hash === 'string',
    'Hash should be a string',
  );
  invariant__default['default'](
    entity && typeof entity === 'string',
    'Entity should be a string',
  );
  return 'https://' + prefix + 'etherscan.io/' + entity + '/' + hash;
};
var getEtherscanTxLink = function (chainId, hash) {
  return getEtherscanLink(chainId, hash, exports.ETHERSCAN_ENTITIES.Tx);
};
var getEtherscanTokenLink = function (chainId, hash) {
  return getEtherscanLink(chainId, hash, exports.ETHERSCAN_ENTITIES.Token);
};
var getEtherscanAddressLink = function (chainId, hash) {
  return getEtherscanLink(chainId, hash, exports.ETHERSCAN_ENTITIES.Address);
};

exports.ETHERSCAN_PREFIX_BY_NETWORK = ETHERSCAN_PREFIX_BY_NETWORK;
exports.getEtherscanAddressLink = getEtherscanAddressLink;
exports.getEtherscanLink = getEtherscanLink;
exports.getEtherscanPrefix = getEtherscanPrefix;
exports.getEtherscanTokenLink = getEtherscanTokenLink;
exports.getEtherscanTxLink = getEtherscanTxLink;
