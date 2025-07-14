const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.js'],
  roots: ['<rootDir>/src'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/src/',
  }),
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
    '^.+\\.html$': '<rootDir>/htmlTransform.js'
  },
  collectCoverage: true,
  coverageReporters: ['html', 'text-summary'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json']
};
