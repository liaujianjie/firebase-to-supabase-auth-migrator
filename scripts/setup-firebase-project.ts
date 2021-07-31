import fs from "fs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("What is your Firebase/Google Cloud project id: ", (projectId) => {
  // Write .firebaserc so that we can use Firebase CLI
  const firebasercContent = { projects: { default: projectId } };
  fs.writeFileSync(".firebaserc", JSON.stringify(firebasercContent, null, 2), {
    encoding: "utf-8",
  });

  // Close
  console.info("Firebase source setup done.");
  rl.close();
});
