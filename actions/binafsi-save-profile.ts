import { defineAction } from '@agent-native/core/action';
import { z } from 'zod';
import { getDb } from '../server/db/index.js';
import { binafsiProfiles } from '../server/db/binafsi-profile-schema.js';

export default defineAction({
  description: 'Change the signed-in user’s BINAFSI display name and preferred timezone only when explicitly requested by them. No other account details or data are changed.',
  agentTool: false,
  schema: z.object({
    displayName: z.string().trim().min(1).max(80),
    timezone: z.string().trim().min(3).max(80),
  }),
  run: async ({ displayName, timezone }, ctx) => {
    if (!ctx?.userEmail) throw new Error('Authentication required');
    try { new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format(new Date()); }
    catch { throw new Error('Invalid IANA timezone. Example: Africa/Johannesburg.'); }
    const now = new Date().toISOString();
    await getDb().insert(binafsiProfiles).values({ ownerEmail: ctx.userEmail, displayName, timezone, updatedAt: now }).onConflictDoUpdate({
      target: binafsiProfiles.ownerEmail,
      set: { displayName, timezone, updatedAt: now },
    });
    return { saved: true, profile: { displayName, timezone }, updatedAt: now };
  },
});
