import { renderHook, waitFor } from "@testing-library/react";
import { Timestamp } from "firebase/firestore";
// import * as firestore from "firebase/firestore";

import { mockGetDocs, mockSetDoc } from "../test/test.utils";
import useCollection from "./useCollection";

jest.mock("firebase/firestore", () => ({
  __esModule: true,
  ...jest.requireActual("firebase/firestore"),
}));

const examplePost = {
  id: "example-post",
  title: "Example Post",
  slug: "example",
  createdDate: new Timestamp(0, 0),
};

test("gets documents from collection on mount", async () => {
  mockGetDocs({
    [examplePost.id]: examplePost,
  });

  const { result } = renderHook(() => useCollection("posts"));
  const { data } = result.current;

  waitFor(() => {
    expect(data?.length).toBe(1);
  });
});
