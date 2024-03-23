import { Timestamp } from "firebase/firestore";

export type PostDocument = {
  title: string;
  slug?: string;
  createdDate?: Date;
};
