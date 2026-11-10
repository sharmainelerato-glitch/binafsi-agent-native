import { defineAction } from '@agent-native/core/action';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { getDb } from '../server/db/index.js';
import { binafsiProfiles } from '../server/db/binafsi-profile-schema.js';

export default defineAction({
  description: 'Read the signed-in person’s chosen BINAFSI display name and preferred IANA timezone. When answering about today, tomorrow or current time, use a fresh timestamp in the saved timezone rather than old conversation dates. Never infer their preferred name from someone else’s data.',
  readOnly: true,
  schema: z.object({}),
  run: async (_args, ctx) => {
    if (!ctx?.userEmail) throw new Error('Authentication required');
    const [profile] = await getDb().select().from(binafsiProfiles).where(eq(binafsiProfiles.ownerEmail, ctx.userEmail)).limit(1);
    // UTC is the safe default until a timezone preference is saved.
    const timezone = profile?.timezone ?? 'UTC';
    const now = new Date();
    return {
      profile: { displayName: profile?.displayName ?? '', timezone },
      currentTime: now.toLocaleString('en-GB', { timeZone: timezone, dateStyle: 'full', timeStyle: 'long' }),
      asOfUtc: now.toISOString(),
      configured: Boolean(profile),
    };
  },
});
