import { get, set } from "lodash";
import {
  getFirestore,
  doc,
  getDoc,
  Timestamp,
  FieldPath,
  QueryConstraint,
  collection,
  query,
  where as whereConstraint,
  orderBy as orderByConstraint,
  limit as limitConstraint,
  getDocs,
} from "firebase/firestore";

import {
  CollectionQuery,
  Document,
  DocumentOptions,
  OrderByArray,
  OrderByQuery,
  WhereArray,
  WhereItem,
  WhereQuery,
} from "./types";

/**
 * withDocumentDatesParsed
 * @description loops through keys of of dates to parse and converts from Firestore Timestamp to Javascript Date
 * @returns The document parsed
 */
export function withDocumentDatesParsed<Data extends object>(
  data: Data,
  parseDates?: (keyof Data | string)[]
) {
  const doc = { ...data };
  parseDates?.forEach((dateField) => {
    if (typeof dateField !== "string") return;

    const unparsedDate = get(doc, dateField) as Timestamp;
    if (unparsedDate) {
      const parsedDate: Date | undefined = unparsedDate.toDate?.();
      if (parsedDate) {
        set(doc, dateField, parsedDate);
      }
    }
  });

  return doc;
}

/**
 * getDocument
 * @description get a firestore doc based on path provided
 * @returns A document or null
 */
export async function getDocument<Doc extends Document = Document>(
  path: string,
  { parseDates }: DocumentOptions<Doc> = {}
): Promise<Doc | null> {
  const ref = doc(getFirestore(), path);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    const docData = {
      id: snapshot.id,
      ...snapshot.data(),
    } as Doc;
    return withDocumentDatesParsed({ ...docData }, parseDates);
  } else {
    return null;
  }
}

/**
 * hasMultipleWhereConditions
 * @description check if param has more than one where condition
 */
function hasMultipleWhereConditions<Doc extends object = {}>(
  w: WhereQuery<Doc>
): w is WhereArray<Doc> {
  return !!(w as WhereArray) && Array.isArray(w[0]);
}

/**
 * hasMultipleOrderByConditions
 * @description check if param has more than one orderBy condition
 */
function hasMultipleOrderByConditions<Doc extends object = {}>(
  o: OrderByQuery<Doc>
): o is OrderByArray<Doc>[] {
  return Array.isArray((o as OrderByArray<Doc>[])[0]);
}

/**
 * createQuery
 * @description assemble a Firestore query based on the passed CollectionQuery object
 */
export const createQuery = <Doc extends object = {}>(
  path: string,
  { where, orderBy, limit }: CollectionQuery<Doc>
) => {
  const constraints: QueryConstraint[] = [];

  /**
   * Where conditions
   */
  if (where) {
    if (hasMultipleWhereConditions<Doc>(where)) {
      constraints.push(
        ...where.map((constraint) =>
          whereConstraint(...(constraint as WhereItem))
        )
      );
    } else if (typeof where[0] === "string" && typeof where[1] === "string") {
      constraints.push(whereConstraint(...(where as WhereItem)));
    }
  }

  /**
   * Order by conditions
   */
  if (orderBy) {
    if (typeof orderBy === "string") {
      constraints.push(orderByConstraint(orderBy));
    } else if (Array.isArray(orderBy)) {
      if (hasMultipleOrderByConditions<Doc>(orderBy)) {
        orderBy.forEach(([order, direction]) => {
          constraints.push(
            orderByConstraint(order as string | FieldPath, direction)
          );
        });
      } else {
        const [order, direction] = orderBy;
        constraints.push(
          orderByConstraint(order as string | FieldPath, direction)
        );
      }
    }
  }

  /**
   * Limit condition
   */
  if (limit) {
    constraints.push(limitConstraint(limit));
  }

  return query(collection(getFirestore(), path), ...constraints);
};

/**
 * getCollection
 * @description get a collection of firestore documents based on path provided
 * @returns an array of documents
 */
export async function getCollection<Doc extends Document = Document>(
  path: string,
  query: CollectionQuery<Doc> = {},
  { parseDates }: DocumentOptions<Doc>
) {
  const q = createQuery(path, query);
  const res = await getDocs(q);
  const items: Doc[] = [];

  res.forEach((doc) => {
    const docData = {
      id: doc.id,
      ...doc.data(),
    } as Doc;
    items.push(withDocumentDatesParsed({ ...docData }, parseDates));
  });

  return items;
}
