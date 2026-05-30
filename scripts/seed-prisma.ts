import { PrismaAdapter } from "../src/lib/data/adapters/prismaAdapter";

async function main() {
  const adapter = new PrismaAdapter();
  try {
    await adapter.seedDatabase();
    console.log("Seed script executed successfully.");
  } catch (error) {
    console.error("Seed script failed:", error);
    process.exit(1);
  }
}

main();
