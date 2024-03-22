import {
  initializeApp,
  getApp,
  FirebaseOptions,
  getApps,
  FirebaseApp,
} from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getStorage, connectStorageEmulator } from "firebase/storage";

import { Emulator, EmulatorOptions } from "./types";

export type InitAppOptions = {
  emulators?: EmulatorOptions;
  analytics?: boolean;
};

/**
 * initApp
 * @returns FirebaseApp
 */
export function initApp(
  config: FirebaseOptions,
  options: InitAppOptions = {}
): FirebaseApp {
  let app: FirebaseApp;

  // Resolve app
  if (getApps.length === 0) {
    app = initializeApp(config);
  } else {
    app = getApp();
  }

  if (app && process.env.NODE_ENV === "development") {
    console.log(`Firebase app [${config.projectId}] initialized`);
  }

  // Init emulators if specified
  if (options.emulators) {
    initEmulators(app, options.emulators);
  }

  return app;
}

/**
 * initEmulators
 * @param app
 * @param options
 */
export function initEmulators(app: FirebaseApp, options: EmulatorOptions) {
  const emulators = Object.keys(options).filter((key) => {
    (options || {})[key as Emulator] !== false;
  });

  // Auth emulator
  if (options.auth) {
    const port =
      typeof options.auth === "object" && options.auth !== null
        ? options.auth.port
        : 9099;
    connectAuthEmulator(getAuth(), `http://localhost:${port}`);
  }

  // Firestore emulator
  if (options.firestore) {
    const port =
      typeof options.firestore === "object" && options.firestore !== null
        ? options.firestore.port
        : 8080;
    connectFirestoreEmulator(getFirestore(), "localhost", port);
  }

  // Functions emulator
  if (options.functions) {
    const port =
      typeof options.functions === "object" && options.functions !== null
        ? options.functions.port
        : 5001;
    const functions = getFunctions(app);
    connectFunctionsEmulator(functions, "localhost", port);
  }

  // Database emulator
  if (options.database) {
    const port =
      typeof options.database === "object" && options.database !== null
        ? options.database.port
        : 9099;
    connectDatabaseEmulator(getDatabase(), "localhost", port);
  }

  // Storage emulator
  if (options.storage) {
    const port =
      typeof options.storage === "object" && options.storage !== null
        ? options.storage.port
        : 9099;
    connectStorageEmulator(getStorage(), "localhost", port);
  }

  // Log emulators in use in dev
  if (emulators.length && process.env.NODE_ENV === "development") {
    console.log("Using Emulators:", ...emulators.map((e) => `[${e}]`));
  }
}

// Firebase types
export type { FirebaseApp, FirebaseOptions } from "firebase/app";
