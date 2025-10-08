module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    "server.js"
  ],
  coverageThreshold: {
    global: {
      lines: 75,
      statements: 75,
      branches: 70,
      functions: 75
    }
  }
};
