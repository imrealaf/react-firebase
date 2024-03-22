import { User } from "firebase/auth";
import { FieldPath, OrderByDirection, WhereFilterOp } from "firebase/firestore";

/**
 * Document
 */

export type Document<T = {}> = T & {
  id: string;
};

export type AllowType<O extends object, Allowed> = {
  [K in keyof O]: O[K] | Allowed;
};

export type DocumentOptions<Doc extends Document = Document> = {
  parseDates?: (string | keyof Omit<Doc, "id">)[];
};

/**
 * Collections
 */

export type WhereItem<Doc extends object = {}, Key = keyof Doc> = [
  Key | FieldPath | string,
  WhereFilterOp,
  unknown
];
export type WhereArray<Doc extends object = {}> = WhereItem<Doc>[];
export type WhereQuery<Doc extends object = {}> =
  | WhereItem<Doc>
  | WhereArray<Doc>;

export type OrderByArray<Doc extends object = {}, Key = keyof Doc> = [
  Key | FieldPath | string,
  OrderByDirection
];

export type OrderByItem<Doc extends object = {}, Key = keyof Doc> =
  | OrderByArray<Doc>
  | Key
  | string;

export type OrderByQuery<Doc extends object = {}> =
  | OrderByItem<Doc>
  | OrderByArray<Doc>[];

export type CollectionQuery<Doc extends object = {}> = {
  limit?: number;
  orderBy?: OrderByQuery<Doc>;
  where?: WhereQuery<Doc>;
};

/**
 * Auth
 */

export type AuthHandler = (user: User | null) => void;

export type AuthErrorCode =
  | "auth/invalid-email"
  | "auth/user-not-found"
  | "auth/wrong-password"
  | "auth/too-many-requests";

export type AuthError = {
  code: AuthErrorCode;
  message: string;
};

export type AuthErrorMessages = Record<AuthErrorCode, string>;

/**
 * App
 */

export type EmulatorOption =
  | boolean
  | {
      port: number;
    };

export type Emulator =
  | "auth"
  | "firestore"
  | "functions"
  | "storage"
  | "database";

export type EmulatorOptions = {
  [key in Emulator]?: EmulatorOption;
};
