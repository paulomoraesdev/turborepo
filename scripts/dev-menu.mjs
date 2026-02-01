// scripts/dev-menu.mjs
import { select } from "@inquirer/prompts";
import { spawn } from "child_process";

// CONFIGURATION
const ENVIRONMENTS = {
  client: {
    label: "Client Environment",
    description: "Starts Client Portal + Auth API + Orders API",
    filters: ["webapp-client", "api-auth", "api-orders"],
  },
  admin: {
    label: "Admin Environment",
    description: "Starts Admin Portal + Auth + Orders + Analytics",
    filters: ["webapp-admin", "api-auth", "api-orders", "api-analytics"],
  },
  backend: {
    label: "Backend Only",
    description: "Starts all API services (No Frontend)",
    filters: ["api-auth", "api-orders", "api-analytics"],
  },
  full: {
    label: "Full Stack",
    description: "Starts EVERYTHING (High RAM usage warning)",
    filters: [],
  },
};

async function run() {
  console.clear();
  console.log("\x1b[36m%s\x1b[0m", "🚀 TURBOREPO CLI LAUNCHER\n");

  try {
    // 1. Prompt using the modern 'select' component
    const selectedKey = await select({
      message: "Which environment do you want to launch?",
      choices: Object.keys(ENVIRONMENTS).map((key) => ({
        name: ENVIRONMENTS[key].label,
        value: key,
        description: ENVIRONMENTS[key].description, // Native support!
      })),
    });

    const selectedEnv = ENVIRONMENTS[selectedKey];

    // 2. Build the Turbo command
    const args = ["dev"];

    if (selectedEnv.filters.length > 0) {
      selectedEnv.filters.forEach((pkg) => {
        args.push(`--filter=${pkg}`);
      });
    }

    console.log(`\n> Executing: \x1b[33mturbo ${args.join(" ")}\x1b[0m\n`);

    // 3. Spawn the child process
    const turboProcess = spawn("turbo", args, {
      stdio: "inherit",
      shell: true,
    });

    turboProcess.on("close", (code) => {
      console.log(`Process exited with code ${code}`);
    });
  } catch (error) {
    if (error.name === "ExitPromptError") {
      console.log("\n👋 Bye!");
    } else {
      console.error("Error:", error);
    }
  }
}

run();
