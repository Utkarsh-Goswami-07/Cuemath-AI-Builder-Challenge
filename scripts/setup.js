#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const ask = (q) => new Promise((res) => rl.question(q, res));

async function setup() {
  console.log("\n🎨 Cuemath Social Studio — Setup\n" + "=".repeat(40));

  const envPath = path.join(__dirname, "..", "backend", ".env");
  if (fs.existsSync(envPath)) {
    const overwrite = await ask("\n.env already exists. Overwrite? (y/N): ");
    if (overwrite.toLowerCase() !== "y") {
      console.log("Setup skipped.\n");
      rl.close();
      return;
    }
  }

  console.log("\nYou'll need:");
  console.log("  1. Anthropic API key → https://console.anthropic.com");
  console.log("  2. Stability AI key  → https://platform.stability.ai (optional, for real image gen)\n");

  const anthropicKey = await ask("Anthropic API Key (required): ");
  const stabilityKey = await ask("Stability AI Key (optional, press Enter to skip): ");
  const port = (await ask("Backend port (default 3001): ")) || "3001";

  const envContent = `ANTHROPIC_API_KEY=${anthropicKey.trim()}
STABILITY_API_KEY=${stabilityKey.trim()}
PORT=${port.trim()}
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
`;

  fs.writeFileSync(envPath, envContent);

  console.log("\n✅ .env file created!");
  console.log("\nNext steps:");
  console.log("  npm run install:all   — install all dependencies");
  console.log("  npm run dev           — start both backend and frontend\n");
  console.log("Then open: http://localhost:3000\n");

  rl.close();
}

setup().catch(console.error);
