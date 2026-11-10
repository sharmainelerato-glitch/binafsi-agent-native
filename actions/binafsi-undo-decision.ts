import { defineAction } from '@agent-native/core/action';
import { z } from 'zod';import { and,eq } from 'drizzle-orm';
import { getDb } from '../server/db/index.js';import { binafsiCommitments,binafsiScenarios } from '../server/db/binafsi-schema.js';
import { canUndo } from '../server/binafsi-planner.js';
export default defineAction({
 description:'UI-only conflict-safe undo of an approved planning decision, requiring an explicit user confirmation. Never silently overwrite later edits.',agentTool:false,
 schema:z.object({scenarioId:z.string().uuid(),confirm:z.literal(true)}),
 run:async({scenarioId},ctx)=>{
  const owner=ctx?.userEmail;if(!owner)throw new Error('Authentication required');
  return getDb().transaction(async tx=>{
   const [s]=await tx.select().from(binafsiScenarios).where(and(eq(binafsiScenarios.id,scenarioId),eq(binafsiScenarios.ownerEmail,owner)));
   if(!s||s.status!=='approved'||!s.previousSnapshot||!s.appliedSnapshot)throw new Error('Approved decision is not available to undo');
   const before=JSON.parse(s.previousSnapshot);const after=JSON.parse(s.appliedSnapshot);
   const current=await tx.select().from(binafsiCommitments).where(eq(binafsiCommitments.ownerEmail,owner));
   const check=canUndo(before,after,current);if(!check.ok)throw new Error(check.reason||'Undo blocked by newer edits');
   for(const row of after){const prior=before.find((x:any)=>x.id===row.id);await tx.update(binafsiCommitments).set({time:prior.time,version:row.version+1}).where(and(eq(binafsiCommitments.id,row.id),eq(binafsiCommitments.ownerEmail,owner),eq(binafsiCommitments.version,row.version)));}
   await tx.update(binafsiScenarios).set({status:'undone'}).where(and(eq(binafsiScenarios.id,scenarioId),eq(binafsiScenarios.ownerEmail,owner)));
   return {undone:true,scenarioId};
  });
 }
});
