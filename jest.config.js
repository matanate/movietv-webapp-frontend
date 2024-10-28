// jest.config.js

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // Path to your Next.js app directory
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // For additional Jest setup
  testEnvironment: 'jest-environment-jsdom', // Simulates DOM for testing
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest', // Use babel-jest to transform TypeScript and JSX
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Map @/ to ./src/
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transformIgnorePatterns: ['/node_modules/'],
};

module.exports = createJestConfig(customJestConfig);
