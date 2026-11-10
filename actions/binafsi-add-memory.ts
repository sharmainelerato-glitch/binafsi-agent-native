import { defineAction } from '@agent-native/core/action';
import { z } from 'zod';
import { getDb } from '../server/db/index.js';
import { binafsiMemories } from '../server/db/binafsi-schema.js';
export default defineAction({
 description: 'Save a user-provided goal, preference, context, or protected rule to BINAFSI Living Memory. Only save when the user explicitly requests it.',
 schema: z.object({ content: z.string().trim().min(3).max(500), protected: z.boolean().default(false) }),
 run: async ({content,protected:locked},ctx)=>{
  if(!ctx?.userEmail) throw new Error('Authentication required');
  const item={id:crypto.randomUUID(),ownerEmail:ctx.userEmail,content,protected:locked,createdAt:new Date().toISOString()};
  await getDb().insert(binafsiMemories).values(item);return {id:item.id,content:item.content,protected:item.protected};
 }
});
