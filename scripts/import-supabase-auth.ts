import fs from "fs";
import createPgp from "pg-promise";
import dotenv from "dotenv";
import { v4 } from "uuid";
import { chunk } from "lodash";

import { FirebaseAuthExport, isFirebaseAuthExport } from "../typings/firebase-auth-export";

dotenv.config();

/**
 * Number of auth.users rows to insert per batch insert.
 */
const CHUNK_SIZE = 5000;

// Check for firebase_auth_export.json
if (!fs.existsSync("firebase_auth_export.json")) {
  console.error(
    'Missing "firebase_auth_export.json", run "yarn export" before running this script.'
  );
  process.exit(1);
}

// Validate firebase_auth_export.json
const firebaseAuthExportString = fs.readFileSync("firebase_auth_export.json", "utf-8");
let firebaseAuthExport: FirebaseAuthExport;
try {
  const firebaseAuthExportObject = JSON.parse(firebaseAuthExportString);
  if (!isFirebaseAuthExport(firebaseAuthExportString)) {
    throw new Error("Failed type guards.");
  }

  firebaseAuthExport = firebaseAuthExportObject;
} catch (error) {
  console.error(
    'Invalid "firebase_auth_export.json", run "yarn export" before running this script.'
  );
  process.exit(1);
}
console.info(`${firebaseAuthExport.users.length} Firebase Auth users found in the export.`);

// Import to Supabase via pg-promise
(async () => {
  // Create database connection.
  const pgp = createPgp({ capSQL: true });
  const database = pgp({
    application_name: "firebase_auth_migrator",
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
    ssl: { ca: fs.readFileSync("prod-ca-2021.crt").toString() },
  });

  // Prepare column set and default values for auth.users table.
  const authUsersColumnSet = new pgp.helpers.ColumnSet(
    [
      { name: "id" },
      { name: "instance_id", def: "00000000-0000-0000-0000-000000000000" },
      { name: "aud", def: "authenticated" },
      { name: "role", def: "authenticated" },
      { name: "email" },
      { name: "encrypted_password", def: "" },
      { name: "confirmed_at", cast: "timestamptz" },
      { name: "confirmation_token", def: "" },
      { name: "recovery_token", def: "" },
      { name: "email_change_token", def: "" },
      { name: "email_change", def: "" },
      { name: "last_sign_in_at", cast: "timestamptz" },
      { name: "raw_app_meta_data", cast: "jsonb" },
      { name: "raw_user_meta_data", cast: "jsonb" },
      { name: "is_super_admin", def: false },
      { name: "created_at", cast: "timestamptz" },
      { name: "updated_at" },
    ],
    { table: { schema: "auth", table: "users" } }
  );

  // Prepare auth.users rows.
  console.info("Preparing rows...");
  const userRows = firebaseAuthExport.users
    // uncomment for testing a limited number of rows to be inserted.
    // .filter((user, index) => index < 10000)
    .map((user) => {
      const provider = user.providerUserInfo[0];

      const newUserId = v4();
      const newAuthUserData = {
        id: newUserId,
        email: user.email,
        confirmed_at: new Date(Number(user.createdAt)),
        created_at: new Date(Number(user.createdAt)),
        updated_at: new Date(Number(user.createdAt)),
        last_sign_in_at: new Date(Number(user.lastSignedInAt)),
        raw_app_meta_data: { provider: provider.providerId.replace(".com", "") },
        raw_user_meta_data: { full_name: user.displayName, avatar_url: provider.photoUrl },
      };

      return { newAuthUserData };
    });
  console.info("Preparing rows... DONE");

  // Chunk rows.
  const userRowsChunks = chunk(userRows, CHUNK_SIZE);
  console.log(`${userRowsChunks.length} chunks prepared.`);

  // Insert chunk by chunk.
  let currentChunkNumber = 0;
  for (const userRowsChunk of userRowsChunks) {
    const logPrefix = `Chunk ${++currentChunkNumber}/${userRowsChunks.length + 1}`;
    console.info(`${logPrefix}: Creating insert statements...`);

    const authUserRows = userRowsChunk.map((row) => row.newAuthUserData);
    const insertAuthUser = pgp.helpers.insert(authUserRows, authUsersColumnSet);
    console.info(`${logPrefix}: Creating insert statements... DONE`);

    try {
      const startTime = Date.now();
      console.info(`${logPrefix}: Mass inserting...`);
      await database.none(insertAuthUser);
      console.info(`${logPrefix}: Mass inserting... DONE`);
      const secondsElapsed = (Date.now() - startTime) / 1000;
      console.info(
        `${logPrefix}: Completed ${authUserRows.length} rows insert in ${secondsElapsed}s.`
      );
    } catch (error) {
      console.info(`${logPrefix}: Failure!`);
      console.error(error);
    }
  }
  console.info("Import success!");
})();
