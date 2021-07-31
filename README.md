# firebase-to-supabase-auth-migrator

A bunch of simple scripts to help migrate your Firebase Auth users into Supabase Auth.

## Installation

### Install dependencies

1. `yarn` or `npm install`
2. [Ensure you have access](https://firebase.google.com/docs/cli#sign-in-test-cli) to the Firebase project you are about to export from.

## Usage

1. Ready your:
   1. Firebase project ID
   2. Supabase Postgres connection string — you can grab it from `https://app.supabase.io/project/<ref>/settings/database`
1. `yarn setup`
1. `yarn export`
1. `yarn import`
