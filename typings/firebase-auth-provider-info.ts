// Expand this list as needed.
const SUPPORTED_AUTH_PROVIDERS = ["google.com", "facebook.com", "twitter.com"] as const;
const SUPPORTED_AUTH_PROVIDERS_SET = new Set(SUPPORTED_AUTH_PROVIDERS);

type SupportedAuthProviders = typeof SUPPORTED_AUTH_PROVIDERS[number];

export type FirebaseAuthProviderInfo = {
  providerId: SupportedAuthProviders;
  rawId: string;
  email?: string;
  displayName?: string;
  photoUrl: string;
};

export function isFirebaseAuthProviderInfo(
  maybeProviderInfo: any
): maybeProviderInfo is FirebaseAuthProviderInfo {
  if (!SUPPORTED_AUTH_PROVIDERS_SET.has(maybeProviderInfo.providerId)) {
    console.warn(
      `Unsupported Firebase Auth provider: ${maybeProviderInfo.providerId}. Add to the SUPPORTED_AUTH_PROVIDERS list if needed.`
    );
    return false;
  }

  if (
    // Check compulsary properties.
    typeof maybeProviderInfo.rawId !== "string" ||
    typeof maybeProviderInfo.displayName !== "string" ||
    typeof maybeProviderInfo.photoUrl !== "string" ||
    typeof maybeProviderInfo.email !== "string"
  ) {
    return false;
  }

  return true;
}
