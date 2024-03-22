import { atom } from "@hungry-egg/rx-state";

import { User } from "./auth";

export const user$ = atom<User | null>(null);

export const userClaims$ = atom<Record<string, any> | undefined>(undefined);
