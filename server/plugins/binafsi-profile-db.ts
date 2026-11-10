import { runMigrations } from '@agent-native/core/db';

/** Isolated migration: no changes to Auth, decisions, goals or existing records. */
export default runMigrations([{
  version: 1,
  name: 'binafsi-account-profile-v1',
  sql: `
    CREATE TABLE IF NOT EXISTS binafsi_profiles (
      owner_email TEXT PRIMARY KEY,
      display_name TEXT NOT NULL DEFAULT '',
      timezone TEXT NOT NULL DEFAULT 'UTC',
      updated_at TEXT NOT NULL
    );
  `,
}], { table: 'binafsi_profile_migrations' });
