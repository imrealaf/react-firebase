import { renderHook, waitFor } from "@testing-library/react";
import * as firestore from "firebase/firestore";

import { mockGetDoc, mockSetDoc, mockAddDoc } from "../test/test.utils";
import useDoc from "./useDoc";

jest.mock("firebase/firestore", () => ({
  __esModule: true,
  ...jest.requireActual("firebase/firestore"),
}));

test("gets a document with the path provided", async () => {
  mockGetDoc("collection/example-doc", {
    title: "Something",
  });

  const { result } = renderHook(() => useDoc("collection/example-doc"));
  const { data, isLoading } = result.current;

  expect(isLoading).toBe(true);
  expect(data).not.toBeDefined();

  waitFor(() => {
    expect(isLoading).toBe(false);
    expect(data).not.toBe(null);
  });
});

test("updates a document", async () => {
  mockSetDoc();

  const { result } = renderHook(() => useDoc("collection/example-doc"));
  const { update } = result.current;

  update({
    title: "Something",
    something: "else",
  });

  waitFor(() => {
    expect(firestore.setDoc).toHaveBeenCalled();
  });
});

test("adds a document", async () => {
  mockAddDoc();

  const { result } = renderHook(() => useDoc());
  const { add } = result.current;

  add("collection", "some-id", {
    title: "Something",
    something: "else",
  });

  waitFor(() => {
    expect(firestore.addDoc).toHaveBeenCalled();
  });
});
