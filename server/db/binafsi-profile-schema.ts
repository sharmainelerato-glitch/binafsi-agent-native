import { pgTable, text } from 'drizzle-orm/pg-core';

/** Per-account settings. Existing Better Auth identity remains authoritative. */
export const binafsiProfiles = pgTable('binafsi_profiles', {
  ownerEmail: text('owner_email').primaryKey(),
  displayName: text('display_name').notNull().default(''),
  timezone: text('timezone').notNull().default('UTC'),
  updatedAt: text('updated_at').notNull(),
});
