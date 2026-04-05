export default {
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "node",
  transform: {},
  extensionsToTreatAsEsm: [".js"],
  testMatch: ["**/tests/**/*.test.js"],
  moduleNameMapper: {
    "^(\.{1,2}/.*)\.js$": "$1",
  },
};
