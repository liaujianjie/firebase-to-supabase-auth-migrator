# firebase-to-supabase-auth-migrator

A bunch of simple scripts to help migrate your Firebase Auth users into Supabase Auth.

Note: This script does **NOT** migrate users from Firebase Auth who are using password sign-ins.

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
