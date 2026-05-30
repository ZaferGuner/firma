import React from "react";
import { db } from "@/lib/data";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await db.seedDatabase(); // ensure defaults exist
  
  // Since we have AdminEditProvider, it accepts initialData.
  // The context reads everything from db via /api/admin/edit GET which returns all db.contentSections.
  // Wait, AdminEditProvider's fetch in its useEffect overrides initialData.
  // Let's pass empty initialData, it will fetch from API on mount.
  
  return <SettingsClient initialData={{}} />;
}
