'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var chains = require('./chains.js');

var _a, _b, _c, _d, _e, _f;
exports.TOKENS = void 0;
(function (TOKENS) {
  TOKENS['WSTETH'] = 'WSTETH';
  TOKENS['STETH'] = 'STETH';
  TOKENS['LDO'] = 'LDO';
})(exports.TOKENS || (exports.TOKENS = {}));
var TOKENS_BY_NETWORK =
  ((_a = {}),
  (_a[chains.CHAINS.Mainnet] =
    ((_b = {}),
    (_b[exports.TOKENS.WSTETH] = '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0'),
    (_b[exports.TOKENS.STETH] = '0xae7ab96520de3a18e5e111b5eaab095312d7fe84'),
    (_b[exports.TOKENS.LDO] = '0x5a98fcbea516cf06857215779fd812ca3bef1b32'),
    _b)),
  (_a[chains.CHAINS.Ropsten] =
    ((_c = {}),
    (_c[exports.TOKENS.WSTETH] = '0x0000000000000000000000000000000000000000'),
    (_c[exports.TOKENS.STETH] = '0x0000000000000000000000000000000000000000'),
    (_c[exports.TOKENS.LDO] = '0x0000000000000000000000000000000000000000'),
    _c)),
  (_a[chains.CHAINS.Rinkeby] =
    ((_d = {}),
    (_d[exports.TOKENS.WSTETH] = '0x2Ca788280fB10384946D3ECC838D94DeCa505CF4'),
    (_d[exports.TOKENS.STETH] = '0xbA453033d328bFdd7799a4643611b616D80ddd97'),
    (_d[exports.TOKENS.LDO] = '0xbfcb02cf3df4f36ab8185469834e0e00a5fc6053'),
    _d)),
  (_a[chains.CHAINS.Goerli] =
    ((_e = {}),
    (_e[exports.TOKENS.WSTETH] = '0x6320cD32aA674d2898A68ec82e869385Fc5f7E2f'),
    (_e[exports.TOKENS.STETH] = '0x1643e812ae58766192cf7d2cf9567df2c37e9b7f'),
    (_e[exports.TOKENS.LDO] = '0xc3e39834c92c90463fab675a99def1bdd195fb04'),
    _e)),
  (_a[chains.CHAINS.Kovan] =
    ((_f = {}),
    (_f[exports.TOKENS.WSTETH] = '0x0000000000000000000000000000000000000000'),
    (_f[exports.TOKENS.STETH] = '0x0000000000000000000000000000000000000000'),
    (_f[exports.TOKENS.LDO] = '0x0000000000000000000000000000000000000000'),
    _f)),
  _a);
var getTokenAddress = function (chainId, token) {
  return TOKENS_BY_NETWORK[chainId][token];
};

exports.TOKENS_BY_NETWORK = TOKENS_BY_NETWORK;
exports.getTokenAddress = getTokenAddress;
