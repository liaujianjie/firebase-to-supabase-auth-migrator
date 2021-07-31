import fs from "fs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("What is your Supabase Postgres connection string: ", (postgresConnectionString) => {
  // Write .env.local so that we can insert into Supabase's Postgres.
  fs.writeFileSync(".env.local", `POSTGRES_CONNECTION_STRING=${postgresConnectionString}`, {
    encoding: "utf-8",
  });

  // Close
  console.info("Supabase destination setup done.");
  rl.close();
});
