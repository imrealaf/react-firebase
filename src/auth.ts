import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { user$, userClaims$ } from "./atoms";
import { AuthHandler, AuthErrorMessages } from "./types";

/**
 * onAuthChange
 * @description when auth state changes, update state and optionally fire callback
 */
export function onAuthChange(callback?: AuthHandler) {
  onAuthStateChanged(getAuth(), async (user) => {
    if (user) {
      const res = await user.getIdTokenResult();
      userClaims$.set(res.claims);
    } else {
      userClaims$.set(undefined);
    }
    user$.set(user);
    if (callback) callback(user);
  });
}

export const defaultAuthErrorMessages: AuthErrorMessages = {
  "auth/invalid-email": "Invalid email (auth/invalid-email)",
  "auth/user-not-found": "User not found (auth/user-not-found)",
  "auth/wrong-password": "Wrong password (auth/wrong-password)",
  "auth/too-many-requests":
    "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.",
};

/** Export some Firebase types for convienience */
export type {
  User,
  Auth,
  UserCredential,
  UserInfo,
  UserMetadata,
  UserProfile,
} from "firebase/auth";
