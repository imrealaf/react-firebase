import { renderHook, waitFor } from "@testing-library/react";
import * as firestore from "firebase/firestore";

import { mockGetDoc, mockSetDoc } from "../test/test.utils";
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
  mockSetDoc("collection/example-doc", {
    title: "Something",
  });

  const { result } = renderHook(() => useDoc("collection/example-doc"));
  const { set } = result.current;

  set({
    title: "Something",
    something: "else",
  });

  waitFor(() => {
    expect(firestore.setDoc).toHaveBeenCalled();
  });
});
