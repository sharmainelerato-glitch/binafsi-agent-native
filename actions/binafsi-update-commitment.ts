import { validateCommitment } from '../server/binafsi-planner.js';
import { defineAction } from '@agent-native/core/action';import { z } from 'zod';import { and,eq } from 'drizzle-orm';
import { getDb } from '../server/db/index.js';import { binafsiCommitments } from '../server/db/binafsi-schema.js';
export default defineAction({
 agentTool:false,description:'Edit one existing commitment with an optimistic version check. The user can protect it from automatic planning moves.',
 schema:z.object({id:z.string().uuid(),expectedVersion:z.number().int().min(0),title:z.string().trim().min(2).max(120),time:z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),durationMinutes:z.number().int().min(15).max(480),day:z.string().max(32),protected:z.boolean()}),
 run:async({id,expectedVersion,title,time,durationMinutes,day,protected:locked},ctx)=>{
  const owner=ctx?.userEmail;if(!owner)throw new Error('Authentication required');validateCommitment({id,title,time,durationMinutes,day});const db=getDb();
  const [current]=await db.select().from(binafsiCommitments).where(and(eq(binafsiCommitments.id,id),eq(binafsiCommitments.ownerEmail,owner)));
  if(!current)throw new Error('Commitment not found');if(current.version!==expectedVersion)throw new Error('Commitment changed in another tab. Refresh before editing.');
  const changed=await db.update(binafsiCommitments).set({title,time,durationMinutes,day,protected:locked,version:expectedVersion+1}).where(and(eq(binafsiCommitments.id,id),eq(binafsiCommitments.ownerEmail,owner),eq(binafsiCommitments.version,expectedVersion))).returning();
  if(changed.length!==1)throw new Error('Concurrent edit detected');return changed[0];
 }
});
