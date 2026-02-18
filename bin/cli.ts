import { createInoxCli } from "../src/index.js";

createInoxCli().catch((err) => {
  console.error(err);
  process.exit(1);
});
