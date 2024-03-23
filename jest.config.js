const config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/src/test",
    "/src/index.ts",
    "/src/atoms.ts",
    "/src/render.ts",
    "/src/app.ts",
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
  setupFilesAfterEnv: ["./src/test/test.setup.ts"],
  testEnvironment: "jsdom",
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/", "\\.pnp\\.[^\\/]+$"],
};

module.exports = config;
