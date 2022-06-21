module.exports = {
  setupFiles: ['<rootDir>/jest-shim.js'],
  cacheDirectory: '.jest/cache',
  coverageDirectory: '.jest/coverage',
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  collectCoverageFrom: ['packages/**/src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: ['src/generated'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  testEnvironment: 'jest-environment-jsdom',
};
