import { FirebaseAuthUser, isFirebaseAuthUser } from "./firebase-auth-user";

export type FirebaseAuthExport = {
  users: FirebaseAuthUser[];
};

export function isFirebaseAuthExport(
  maybeFirebaseAuthExport: any
): maybeFirebaseAuthExport is FirebaseAuthExport {
  if (typeof maybeFirebaseAuthExport !== "object") {
    return false;
  }

  if (!Array.isArray(maybeFirebaseAuthExport.users)) {
    return false;
  }

  for (const user of maybeFirebaseAuthExport.users) {
    if (!isFirebaseAuthUser(user)) {
      return false;
    }
  }

  return true;
}
