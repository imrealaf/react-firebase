import * as auth from "firebase/auth";

import { onAuthChange } from "../auth";
import { userClaims$ } from "../atoms";

jest.mock("firebase/auth", () => ({
  __esModule: true,
  ...jest.requireActual("firebase/auth"),
}));

describe("onAuthChange", () => {
  test("fires the callback", () => {
    jest.spyOn(auth, "onAuthStateChanged").mockReturnValue(() => () => null);
    onAuthChange(jest.fn());
    expect(auth.onAuthStateChanged).toHaveBeenCalled();
  });
  test("gets user claims if user", () => {
    const user = {
      getIdTokenResult: jest.fn(),
    };
    jest.spyOn(auth, "onAuthStateChanged").mockReturnValue(() => () => user);
    jest.spyOn(userClaims$, "set").mockImplementation();
    onAuthChange(jest.fn());
    expect(auth.onAuthStateChanged).toHaveBeenCalled();
    setTimeout(() => {
      expect(user.getIdTokenResult).toHaveBeenCalled();
      expect(userClaims$.set).toHaveBeenCalled();
    });
  });
});
