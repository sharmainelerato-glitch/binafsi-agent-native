import { pgTable, text, boolean } from 'drizzle-orm/pg-core';

/** Event and opportunity notes are owned by one signed-in account. */
export const binafsiEventNotes = pgTable('binafsi_event_notes', {
  id: text('id').primaryKey(),
  ownerEmail: text('owner_email').notNull(),
  eventName: text('event_name').notNull(),
  eventDate: text('event_date').notNull(),
  stage: text('stage').notNull(),
  observedOpportunity: text('observed_opportunity').notNull(),
  followup: text('followup').notNull(),
  missed: boolean('missed').notNull().default(false),
  createdAt: text('created_at').notNull(),
});
