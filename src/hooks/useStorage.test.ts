import { renderHook, waitFor } from "@testing-library/react";
import * as storage from "firebase/storage";

import { mockUploadBytes, mockUseState } from "../test/test.utils";
import useStorage from "./useStorage";
import React from "react";

jest.mock("firebase/storage", () => ({
  __esModule: true,
  ...jest.requireActual("firebase/storage"),
}));

test("uploads a file with progress", async () => {
  mockUploadBytes();

  const { result } = renderHook(() =>
    useStorage({
      basePath: "",
    })
  );

  const { uploadFile } = result.current;

  const file = new File([""], "darthvader.png");

  waitFor(async () => {
    await uploadFile(file);
    expect(storage.uploadBytes).toHaveBeenCalled();
  });
});
