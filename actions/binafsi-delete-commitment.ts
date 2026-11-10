import { defineAction } from '@agent-native/core/action';import { z } from 'zod';import { and,eq } from 'drizzle-orm';import { getDb } from '../server/db/index.js';import { binafsiCommitments } from '../server/db/binafsi-schema.js';
export default defineAction({
 description:'Delete a named commitment only with explicit user instruction. Do not delete protected commitments without manual confirmation.',agentTool:false,
 schema:z.object({id:z.string().uuid(),confirm:z.literal(true)}),
 run:async({id},ctx)=>{const owner=ctx?.userEmail;if(!owner)throw new Error('Authentication required');const deleted=await getDb().delete(binafsiCommitments).where(and(eq(binafsiCommitments.id,id),eq(binafsiCommitments.ownerEmail,owner))).returning();return {deleted:deleted.length===1};}
});
