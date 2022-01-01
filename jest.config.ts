export default {
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["**/test/**/*.spec.ts", "**/test/**/*.test.ts"],
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
};
