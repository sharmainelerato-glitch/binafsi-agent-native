import { defineAction } from '@agent-native/core/action';
import { z } from 'zod';
import { getDb } from '../server/db/index.js';
import { binafsiEventNotes } from '../server/db/binafsi-event-schema.js';

export default defineAction({
  description: 'Save an event/opportunity note only when the signed-in user explicitly asks. Event details must be supplied by the user; never invent attendees, recruiters, sessions or opportunities. No emails, invitations or bookings are sent by this action.',
  schema: z.object({
    eventName: z.string().trim().min(2).max(160),
    eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Calendar date in YYYY-MM-DD, not a guessed relative date'),
    stage: z.enum(['before','during','after']),
    observedOpportunity: z.string().trim().min(3).max(1200),
    followup: z.string().trim().max(1200).default(''),
    missed: z.boolean().default(false),
  }),
  run: async ({ eventName, eventDate, stage, observedOpportunity, followup, missed }, ctx) => {
    if (!ctx?.userEmail) throw new Error('Authentication required');
    if (Number.isNaN(Date.parse(`${eventDate}T12:00:00Z`))) throw new Error('Invalid event date');
    const row = { id: crypto.randomUUID(), ownerEmail: ctx.userEmail, eventName, eventDate, stage, observedOpportunity, followup, missed, createdAt: new Date().toISOString() };
    await getDb().insert(binafsiEventNotes).values(row);
    return { ...row, message: 'Event opportunity saved. No follow-ups or external messages were sent.' };
  },
});
