import {
  FirebaseAuthProviderInfo,
  isFirebaseAuthProviderInfo,
} from "./firebase-auth-provider-info";

export type FirebaseAuthUser = {
  localId: string;
  email?: string;
  emailVerified: boolean;
  displayName?: string;
  photoUrl?: string;
  lastSignedInAt: number;
  createdAt: number;
  // There may be more than one provider per user, but this migrator doesn't handle it. Hence, a
  // 1-tuple is used instead.
  providerUserInfo: [FirebaseAuthProviderInfo];
};

export function isFirebaseAuthUser(maybeUser: any): maybeUser is FirebaseAuthUser {
  if (typeof maybeUser !== "object") {
    return false;
  }

  if (!Array.isArray(maybeUser.providerUserInfo) || maybeUser.providerUserInfo.length === 0) {
    return false;
  }
  if (
    typeof maybeUser.localId !== "string" ||
    typeof maybeUser.lastSignedInAt !== "string" ||
    typeof maybeUser.createdAt !== "string"
  ) {
    return false;
  }

  if (!isFirebaseAuthProviderInfo(maybeUser.providerUserInfo[0])) {
    return false;
  }

  return true;
}
