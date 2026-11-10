import { defineAction } from '@agent-native/core/action';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';
import { getDb } from '../server/db/index.js';
import { binafsiEventNotes } from '../server/db/binafsi-event-schema.js';

export default defineAction({
  description: 'Read only event opportunities and follow-up notes actually recorded by the signed-in user; do not hallucinate event changes, participants or other data.',
  readOnly: true,
  schema: z.object({}),
  run: async (_args, ctx) => {
    if (!ctx?.userEmail) throw new Error('Authentication required');
    const notes = await getDb().select().from(binafsiEventNotes).where(eq(binafsiEventNotes.ownerEmail, ctx.userEmail)).orderBy(desc(binafsiEventNotes.createdAt));
    return { notes };
  },
});
