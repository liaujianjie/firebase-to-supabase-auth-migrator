# firebase-to-supabase-auth-migrator

A bunch of simple scripts to help migrate your Firebase Auth users into Supabase Auth.

These scripts were pulled out from the migration scripts that was used to [migrate ~200k users for Mobbin](https://supabase.io/blog/2021/07/28/mobbin-supabase-200000-users).

## Notes

- The scripts do **NOT** migrate users from Firebase Auth who are using password sign-ins. If you wish to migrate users that are using password sign-ins, check out [this Discord thread](https://discord.com/channels/839993398554656828/871327728698269737/871386701640130620) for a possible solution.
- The scripts requires that your Firebase Auth users **must have an email**. It is possible for Firebase Auth to not retrieve email during sign-ins if you did not specify sufficient [scopes](https://firebase.google.com/docs/auth/web/google-signin) (e.g. the `email` scope for Facebook).

## Installation

### Install dependencies

1. `yarn` or `npm install`
2. [Ensure you have access](https://firebase.google.com/docs/cli#sign-in-test-cli) to the Firebase project you are about to export from.

## Usage

1. Ready your:
   1. Firebase project ID
   2. Supabase Postgres connection string — you can grab it from `https://app.supabase.io/project/<ref>/settings/database`
   3. Download Supabase Certificate
      - copy it to the root of the project
      - rename it to `supabase-ca-cert.crt`
1. `yarn setup`
1. `yarn export-users`
1. `yarn import-users`


### Permission denied error
- If you faced an error with permission denied, please do the below
   - execute this in Supabase sql query `alter user postgres with superuser;`
   - after your migration done, please revert the change above with `alter user postgres with nosuperuser;`
