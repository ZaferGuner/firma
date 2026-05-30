import { IDataLayer } from "./IDataLayer";
import { JsonAdapter } from "./adapters/jsonAdapter";
import { PrismaAdapter } from "./adapters/prismaAdapter";

/**
 * Unified Database Access Client
 * Under Phase 1 local development, this utilizes the JsonAdapter.
 * To transition to a production PostgreSQL database in Phase 4, simply import PrismaAdapter 
 * and replace the instantiation below.
 */

// Dynamically select adapter based on environment variable
const adapterType = process.env.DATA_ADAPTER;

// Default to JSON adapter if empty or explicitly "json"
export const db: IDataLayer = 
  adapterType === "prisma" ? new PrismaAdapter() : new JsonAdapter();

export type { IDataLayer };
export { JsonAdapter };
