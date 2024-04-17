import * as firestore from "firebase/firestore";
import * as storage from "firebase/storage";

export function mockUseState(setState: () => void) {
  const mock: any = (state: any) => [state, setState];
  return mock;
}

export function mockDoc(id: string, data?: Record<string, any>) {
  return {
    id,
    exists: () => (data ? true : false),
    data: () =>
      data
        ? {
            ...data,
          }
        : null,
  } as firestore.DocumentSnapshot<unknown, firestore.DocumentData>;
}

export function mockGetDoc(path: string, data?: Record<string, any>) {
  const id = path.split("/")[1];
  jest
    .spyOn(firestore, "getDoc")
    .mockReturnValue(Promise.resolve(mockDoc(id, data)));
}

export function mockSetDoc() {
  jest.spyOn(firestore, "setDoc").mockReturnValue(Promise.resolve());
}

export function mockAddDoc() {
  jest.spyOn(firestore, "addDoc").mockImplementation();
}

export function mockGetDocs(data?: Record<string, Record<string, any>>) {
  let items = data
    ? Object.keys(data).map((key) => {
        const docData = mockDoc(key, data[key]);
        return docData;
      })
    : [];

  jest
    .spyOn(firestore, "getDocs")
    .mockReturnValue(
      Promise.resolve(
        items as unknown as firestore.QuerySnapshot<
          unknown,
          firestore.DocumentData
        >
      )
    );
}

export function mockUploadBytes() {
  jest.spyOn(storage, "uploadBytes").mockImplementation();
}
