import { useCallback, useState } from "react";
import {
  getAuth,
  signOut as signOutFirebase,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useUnwrap } from "@hungry-egg/rx-react";

import { AuthError, AuthErrorMessages } from "../types";
import { user$, userClaims$ } from "../atoms";
import { defaultAuthErrorMessages } from "../auth";

export interface UseAuthOptions {
  /** Map of error messages corresponding to auth error code */
  errorMessages?: Partial<AuthErrorMessages>;
}

/**
 * useAuth
 */
function useAuth(options: UseAuthOptions = {}) {
  // Get the user
  const user = useUnwrap(user$);
  const userClaims = useUnwrap(userClaims$);

  // Sign in states
  const [signInPending, setSignInPending] = useState<boolean>(false);
  const [signInSuccess, setSignInSuccess] = useState<boolean>(false);
  const [signInError, setSignInError] = useState<AuthError | undefined>();

  // Sign up states
  const [signUpPending, setSignUpPending] = useState<boolean>(false);
  const [signUpSuccess, setSignUpSuccess] = useState<boolean>(false);
  const [signUpError, setSignUpError] = useState<AuthError | undefined>();

  /**
   * Error messages
   */
  const errorMessages: AuthErrorMessages = {
    ...defaultAuthErrorMessages,
    ...options?.errorMessages,
  };

  /**
   * resetSignIn
   */
  const resetSignIn = useCallback(() => {
    setSignInPending(false);
    setSignInError(undefined);
    setSignInSuccess(false);
  }, []);

  /**
   * signInWithEmail
   */
  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      if (email && password) {
        resetSignIn();
        setSignInPending(true);
        try {
          const res = await signInWithEmailAndPassword(
            getAuth(),
            email,
            password
          );
          setSignInSuccess(true);
          return res.user;
        } catch (error) {
          const errorDetails = error as AuthError;
          setSignInError({
            code: errorDetails.code,
            message:
              errorMessages && errorMessages[errorDetails.code]
                ? errorMessages[errorDetails.code]
                : errorDetails.message,
          } as AuthError);
        } finally {
          setSignInPending(false);
        }
      }
    },
    [getAuth, signInWithEmailAndPassword]
  );

  /**
   * signIn api
   */
  const signIn = {
    withEmail: signInWithEmail,
    pending: signInPending,
    success: signInSuccess,
    error: signInError,
    reset: resetSignIn,
  };

  /**
   * resetSignUp
   */
  const resetSignUp = useCallback(() => {
    setSignUpPending(false);
    setSignUpError(undefined);
    setSignUpSuccess(false);
  }, []);

  /**
   * signUpWithEmail
   */
  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      if (email && password) {
        setSignUpPending(true);
        try {
          const res = await createUserWithEmailAndPassword(
            getAuth(),
            email,
            password
          );
          setSignUpSuccess(true);
          return res.user;
        } catch (error) {
          const errorDetails = error as AuthError;
          setSignUpError(errorDetails);
        } finally {
          setSignUpPending(false);
        }
      }
    },
    [getAuth, createUserWithEmailAndPassword]
  );

  /**
   * signUp api
   */
  const signUp = {
    withEmail: signUpWithEmail,
    pending: signUpPending,
    success: signUpSuccess,
    error: signUpError,
    reset: resetSignUp,
  };

  /**
   * signOut
   */
  const signOut = useCallback(async () => {
    await signOutFirebase(getAuth());
  }, [getAuth, signOutFirebase]);

  return {
    user,
    userClaims,
    signIn,
    signUp,
    signOut,
  };
}

export default useAuth;
