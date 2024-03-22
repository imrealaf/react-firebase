const config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/src/__tests__/test.config.ts",
    "/src/__tests__/test.setup.ts",
    "/src/__tests__/test.utils.ts",
    "/src/index.ts",
    "/src/atoms.ts",
    "/src/render.ts",
    "/src/types.ts",
    "/src/hooks/index.ts",
  ],
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      lines: 80,
      statements: 80,
      functions: 80,
      branch: 80,
    },
  },
  setupFilesAfterEnv: ["./src/__tests__/test.setup.ts"],
  testEnvironment: "jsdom",
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/", "\\.pnp\\.[^\\/]+$"],
};

module.exports = config;
