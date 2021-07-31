import cp from "child_process";
import fs from "fs";

import { isFirebasercObject } from "../typings";

// Check for .firebaserc
if (!fs.existsSync(".firebaserc")) {
  console.error('Missing ".firebaserc", run "yarn setup" before running this script.');
  process.exit(1);
}

// Validate .firebaserc
const firebaserc = fs.readFileSync(".firebaserc", "utf-8");
try {
  const firebasercObject = JSON.parse(firebaserc);
  if (isFirebasercObject(firebasercObject)) {
    throw new Error('Invalid ".firebaserc" content.');
  }
} catch (error) {
  console.error('Invalid ".firebaserc", run "yarn setup" before running this script.');
  process.exit(1);
}

// Expore Firebase Auth accounts.
const FIREBASE_BIN = "node ./node_modules/firebase-tools/lib/bin/firebase.js";
cp.execSync(`${FIREBASE_BIN} auth:export firebase_auth_export.json`, {
  encoding: "utf-8",
  stdio: "inherit",
});

console.log("Export from Firebase Auth complete.");
