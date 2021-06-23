var CHAINS;
(function (CHAINS) {
  CHAINS[(CHAINS['Mainnet'] = 1)] = 'Mainnet';
  CHAINS[(CHAINS['Ropsten'] = 3)] = 'Ropsten';
  CHAINS[(CHAINS['Rinkeby'] = 4)] = 'Rinkeby';
  CHAINS[(CHAINS['Goerli'] = 5)] = 'Goerli';
  CHAINS[(CHAINS['Kovan'] = 42)] = 'Kovan';
})(CHAINS || (CHAINS = {}));

export { CHAINS };
