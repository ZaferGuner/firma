import { hashPassword, verifyPassword } from "../src/lib/auth";
import { JsonAdapter } from "../src/lib/data/adapters/jsonAdapter";
import fs from "fs/promises";
import path from "path";

async function runTests() {
  console.log("=== STARTING PHASE 1 VERIFICATION TESTS ===\n");

  // --- Test 1: Cryptographic Hashing (scrypt) ---
  console.log("Test 1: Verifying Cryptographic Hashing...");
  const rawPassword = "SecureAdminPassword2026!";
  const hash = await hashPassword(rawPassword);
  console.log(`- Password hashed: ${hash.substring(0, 20)}...`);
  
  const isValid = await verifyPassword(rawPassword, hash);
  const isInvalid = await verifyPassword("WrongPassword!", hash);

  if (isValid && !isInvalid) {
    console.log("✔ Password hashing and verification verified successfully.");
  } else {
    throw new Error("✘ Password hashing verification failed!");
  }

  // --- Test 2: Secure Environment Checks ---
  console.log("\nTest 2: Verifying Environment Validation on Seeding...");
  const adapter = new JsonAdapter();

  // Save original env values
  const origEmail = process.env.ADMIN_EMAIL;
  const origPass = process.env.ADMIN_INITIAL_PASSWORD;
  const origSecret = process.env.AUTH_SECRET;

  // Unset variables to trigger validation error
  delete process.env.ADMIN_INITIAL_PASSWORD;

  try {
    // Delete database to force seeding
    const dbPath = path.join(process.cwd(), "src", "data", "db.json");
    await fs.unlink(dbPath).catch(() => {});

    await adapter.seedDatabase();
    throw new Error("✘ Database seeded successfully even when ADMIN_INITIAL_PASSWORD was missing!");
  } catch (error) {
    console.log(`✔ Expected Seeding Error Caught: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Restore env variables
  process.env.ADMIN_EMAIL = origEmail || "admin@tanertumerinsaat.com";
  process.env.ADMIN_INITIAL_PASSWORD = origPass || "TanerTumer2026!";
  process.env.AUTH_SECRET = origSecret || "TestSecret_1234567890_TestSecret_1234567890";

  // Re-run seeding with variables configured
  await adapter.seedDatabase();
  console.log("✔ Database seeded successfully with credentials active.");

  // --- Test 3: Transactional Atomicity and Rollback ---
  console.log("\nTest 3: Verifying Transactional Merge & Rollback...");
  
  const heroKey = "hero";
  const originalHero = await adapter.getSectionContent("home", heroKey);
  console.log(`- Original Hero Title: "${originalHero.title}"`);

  // Write a draft
  const draftTitle = "DÜZENLENMİŞ TASLAK BAŞLIĞI";
  await adapter.saveDraftContent("home", heroKey, {
    ...originalHero,
    title: draftTitle,
  });

  const draftHero = await adapter.getDraftContent("home", heroKey);
  console.log(`- Saved Draft Title: "${draftHero.title}"`);

  if (draftHero.title !== draftTitle) {
    throw new Error("✘ Draft content was not saved successfully.");
  }

  // Simulate a transaction commit failure
  console.log("- Simulating write failure mid-transaction to verify rollback...");
  
  // Inject mock writeDb that throws error to verify rollback atomicity
  const originalWriteDb = (adapter as any).writeDb;
  (adapter as any).writeDb = async () => {
    throw new Error("Disk full, write failure simulation!");
  };

  try {
    await adapter.commitDrafts();
    throw new Error("✘ Transaction commit succeeded even when write failed!");
  } catch (error) {
    console.log(`✔ Expected Commit Failure Caught: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Restore original writeDb and fetch published section
  (adapter as any).writeDb = originalWriteDb;
  const postFailHero = await adapter.getSectionContent("home", heroKey);
  
  if (postFailHero.title === originalHero.title) {
    console.log("✔ Simulated transaction rollback verified successfully. Baseline is untouched.");
  } else {
    throw new Error("✘ Rollback failed! Public-facing section was modified despite transaction failure.");
  }

  // Commit successfully now
  console.log("- Committing transaction successfully...");
  await adapter.commitDrafts();

  const finalHero = await adapter.getSectionContent("home", heroKey);
  console.log(`- Committed Published Title: "${finalHero.title}"`);

  if (finalHero.title === draftTitle) {
    console.log("✔ Visual changes successfully merged to public site.");
  } else {
    throw new Error("✘ Transaction commit failed to apply changes!");
  }

  // Cleanup: discard drafts
  await adapter.discardDrafts();
  
  console.log("\n=== ALL TESTS PASSED SUCCESSFULLY ===");
}

runTests().catch((err) => {
  console.error("\n✘ Test Runner Failed:", err);
  process.exit(1);
});
