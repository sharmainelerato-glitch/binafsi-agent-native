import { runMigrations } from '@agent-native/core/db';
/** Independent app-owned event migration, without altering original BINAFSI tables. */
export default runMigrations([{
  version: 1,
  name: 'binafsi-event-opportunity-notes-v1',
  sql: `
    CREATE TABLE IF NOT EXISTS binafsi_event_notes (
      id TEXT PRIMARY KEY,
      owner_email TEXT NOT NULL,
      event_name TEXT NOT NULL,
      event_date TEXT NOT NULL,
      stage TEXT NOT NULL,
      observed_opportunity TEXT NOT NULL,
      followup TEXT NOT NULL,
      missed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS binafsi_event_notes_owner_idx
      ON binafsi_event_notes(owner_email);
  `,
}], { table: 'binafsi_event_migrations' });
