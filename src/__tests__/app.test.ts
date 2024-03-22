import config from "./test.config";
import { initApp } from "../app";

jest.mock("firebase/app", () => ({
  __esModule: true,
  ...jest.requireActual("firebase/app"),
}));

describe("initApp", () => {
  test("inits app", () => {
    const app = initApp(config);
    expect(app).toBeDefined();
  });
});
