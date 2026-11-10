import { pgTable, text, integer, boolean } from 'drizzle-orm/pg-core';
export const binafsiMemories = pgTable('binafsi_memories', {
 id:text('id').primaryKey(), ownerEmail:text('owner_email').notNull(),content:text('content').notNull(),protected:boolean('protected').notNull().default(false), createdAt:text('created_at').notNull()
});
export const binafsiCommitments = pgTable('binafsi_commitments', {
 id:text('id').primaryKey(),ownerEmail:text('owner_email').notNull(),title:text('title').notNull(),time:text('time').notNull(),day:text('day').notNull().default('today'),durationMinutes:integer('duration_minutes').notNull().default(60),version:integer('version').notNull().default(0),protected:boolean('protected').notNull().default(false)
});
export const binafsiScenarios = pgTable('binafsi_scenarios', {
 id:text('id').primaryKey(),ownerEmail:text('owner_email').notNull(),description:text('description').notNull(),optionsJson:text('options_json').notNull(),baseSnapshot:text('base_snapshot').notNull().default('[]'),appliedSnapshot:text('applied_snapshot'),status:text('status').notNull().default('pending'),chosenOption:integer('chosen_option'),previousSnapshot:text('previous_snapshot'),createdAt:text('created_at').notNull()
});
export const binafsiGoals=pgTable('binafsi_goals',{
 id:text('id').primaryKey(),ownerEmail:text('owner_email').notNull(),title:text('title').notNull(),target:integer('target').notNull().default(100),progress:integer('progress').notNull().default(0),category:text('category').notNull().default('Personal'),version:integer('version').notNull().default(0)
});
export const binafsiMoney=pgTable('binafsi_money',{
 id:text('id').primaryKey(),ownerEmail:text('owner_email').notNull(),label:text('label').notNull(),amountCents:integer('amount_cents').notNull(),kind:text('kind').notNull(),createdAt:text('created_at').notNull()
});
