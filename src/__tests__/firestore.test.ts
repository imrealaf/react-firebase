import { Timestamp } from "firebase/firestore";

import { mockGetDoc, mockGetDocs } from "./test.utils";
import {
  withDocumentDatesParsed,
  getDocument,
  getCollection,
  hasMultipleWhereConditions,
  hasMultipleOrderByConditions,
  createQuery,
} from "../firestore";

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

describe("withDocumentDatesParsed", () => {
  test("parses dates", async () => {
    const doc = withDocumentDatesParsed(examplePost, ["createdDate"]);
    expect(doc.createdDate).toBeInstanceOf(Date);
  });
  test("does nothing if field is not a date", async () => {
    const doc = withDocumentDatesParsed(examplePost, ["doesntExist"]);
    expect(doc).toStrictEqual(examplePost);
  });
  test("returns out of loop if field key is not a string", async () => {
    const doc = withDocumentDatesParsed(examplePost, [23 as any]);
    expect(doc).toStrictEqual(examplePost);
  });
});

describe("hasMultipleWhereConditions", () => {
  test("returns true if multiple where conditions", async () => {
    const res = hasMultipleWhereConditions([
      ["title", "==", "something"],
      ["slug", "==", "example"],
    ]);
    expect(res).toBe(true);
  });
});

describe("hasMultipleOrderByConditions", () => {
  test("returns true if multiple order by conditions", async () => {
    const res = hasMultipleOrderByConditions([
      ["title", "asc"],
      ["slug", "desc"],
    ]);
    expect(res).toBe(true);
  });
});

describe("createQuery", () => {
  test("adds multiple contraints to query", async () => {
    createQuery("posts", {
      where: [
        ["title", "==", "something"],
        ["slug", "==", "example"],
      ],
      orderBy: [
        ["title", "asc"],
        ["slug", "desc"],
      ],
      limit: 9,
    });
  });
  test("adds single contraints to query", async () => {
    createQuery("posts", {
      where: ["title", "==", "something"],
      orderBy: ["title", "asc"],
      limit: 9,
    });
  });
  test("adds order by contraint to query with string", async () => {
    createQuery("posts", {
      orderBy: "title",
    });
  });
});

describe("getDocument", () => {
  test("returns doc when found", async () => {
    const path = `posts/${examplePost.id}`;
    mockGetDoc(path, examplePost);
    const doc = await getDocument(path);
    expect(doc).toStrictEqual(examplePost);
  });

  test("returns null when not found", async () => {
    mockGetDoc("posts/not-found");
    const doc = await getDocument("posts/not-found");
    expect(doc).toBe(null);
  });
});

describe("getCollection", () => {
  test("gets a collection", async () => {
    mockGetDocs({
      [examplePost.id]: examplePost,
    });
    const items = await getCollection("posts");
    expect(items).toHaveLength(1);
  });
});
