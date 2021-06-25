'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var chains = require('./chains.js');
var etherscan = require('./etherscan.js');
var tokens = require('./tokens.js');

Object.defineProperty(exports, 'CHAINS', {
  enumerable: true,
  get: function () {
    return chains.CHAINS;
  },
});
Object.defineProperty(exports, 'ETHERSCAN_ENTITIES', {
  enumerable: true,
  get: function () {
    return etherscan.ETHERSCAN_ENTITIES;
  },
});
exports.ETHERSCAN_PREFIX_BY_NETWORK = etherscan.ETHERSCAN_PREFIX_BY_NETWORK;
exports.getEtherscanAddressLink = etherscan.getEtherscanAddressLink;
exports.getEtherscanLink = etherscan.getEtherscanLink;
exports.getEtherscanPrefix = etherscan.getEtherscanPrefix;
exports.getEtherscanTokenLink = etherscan.getEtherscanTokenLink;
exports.getEtherscanTxLink = etherscan.getEtherscanTxLink;
Object.defineProperty(exports, 'TOKENS', {
  enumerable: true,
  get: function () {
    return tokens.TOKENS;
  },
});
exports.TOKENS_BY_NETWORK = tokens.TOKENS_BY_NETWORK;
exports.getTokenAddress = tokens.getTokenAddress;
