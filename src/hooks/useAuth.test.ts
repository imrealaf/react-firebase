import { renderHook, waitFor } from "@testing-library/react";
import { Timestamp } from "firebase/firestore";
import * as auth from "firebase/auth";

import { mockGetDocs, mockSetDoc } from "../test/test.utils";
import useAuth from "./useAuth";

jest.mock("firebase/auth", () => ({
  __esModule: true,
  ...jest.requireActual("firebase/auth"),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));

const examplePost = {
  id: "example-post",
  title: "Example Post",
  slug: "example",
  createdDate: new Timestamp(0, 0),
};

test("signs in with email", async () => {
  const { result } = renderHook(() => useAuth());
  const { signIn } = result.current;

  waitFor(async () => {
    await signIn.withEmail("some@email.com", "12334");
    expect(auth.signInWithEmailAndPassword).toHaveBeenCalled();
  });
});

test("signs up with email", async () => {
  const { result } = renderHook(() => useAuth());
  const { signUp } = result.current;

  waitFor(async () => {
    await signUp.withEmail("some@email.com", "12334");
    expect(auth.createUserWithEmailAndPassword).toHaveBeenCalled();
  });
});
