import { getDatabase, ref, get as getFromDb } from "firebase/database";

export async function get<Data>(path: string): Promise<Data | null> {
  if (!path) return null;
  const dbRef = ref(getDatabase(), path);
  const snapshot = await getFromDb(dbRef);
  if (snapshot.exists()) {
    const data: Data = snapshot.val();
    return data;
  } else {
    return null;
  }
}
