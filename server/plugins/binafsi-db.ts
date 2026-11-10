import { runMigrations } from '@agent-native/core/db';
/** App-owned migrations only; never use drizzle push against framework tables. */
export default runMigrations([{version: 1, name:'binafsi-domain-full-v1',sql:`
CREATE TABLE IF NOT EXISTS binafsi_memories (id TEXT PRIMARY KEY, owner_email TEXT NOT NULL, content TEXT NOT NULL, protected BOOLEAN NOT NULL DEFAULT FALSE, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS binafsi_commitments (id TEXT PRIMARY KEY, owner_email TEXT NOT NULL, title TEXT NOT NULL, time TEXT NOT NULL, day TEXT NOT NULL DEFAULT 'today', duration_minutes INTEGER NOT NULL DEFAULT 60, version INTEGER NOT NULL DEFAULT 0, protected BOOLEAN NOT NULL DEFAULT FALSE);
CREATE TABLE IF NOT EXISTS binafsi_scenarios (id TEXT PRIMARY KEY, owner_email TEXT NOT NULL, description TEXT NOT NULL, options_json TEXT NOT NULL, base_snapshot TEXT NOT NULL DEFAULT '[]', applied_snapshot TEXT, status TEXT NOT NULL DEFAULT 'pending', chosen_option INTEGER, previous_snapshot TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS binafsi_goals (id TEXT PRIMARY KEY, owner_email TEXT NOT NULL, title TEXT NOT NULL, target INTEGER NOT NULL DEFAULT 100, progress INTEGER NOT NULL DEFAULT 0, category TEXT NOT NULL DEFAULT 'Personal', version INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS binafsi_money (id TEXT PRIMARY KEY, owner_email TEXT NOT NULL, label TEXT NOT NULL, amount_cents INTEGER NOT NULL, kind TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS binafsi_memories_owner_idx ON binafsi_memories(owner_email);
CREATE INDEX IF NOT EXISTS binafsi_commitments_owner_idx ON binafsi_commitments(owner_email);
CREATE INDEX IF NOT EXISTS binafsi_scenarios_owner_idx ON binafsi_scenarios(owner_email);
CREATE INDEX IF NOT EXISTS binafsi_goals_owner_idx ON binafsi_goals(owner_email);
CREATE INDEX IF NOT EXISTS binafsi_money_owner_idx ON binafsi_money(owner_email);
`}],{table:'binafsi_migrations'});
