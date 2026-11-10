import { defineAction } from '@agent-native/core/action';
import { z } from 'zod';import { and,eq,ne } from 'drizzle-orm';
import { getDb } from '../server/db/index.js';
import { binafsiCommitments,binafsiScenarios } from '../server/db/binafsi-schema.js';
import { validateApproval } from '../server/binafsi-planner.js';
export default defineAction({
 description:'UI-only human-approved application of an already saved option. Never approve on behalf of a user or without an explicit confirmation.',
 agentTool:false,
 schema:z.object({scenarioId:z.string().uuid(),optionIndex:z.number().int().min(0).max(2),confirm:z.literal(true)}),
 run:async({scenarioId,optionIndex},ctx)=>{
  const owner=ctx?.userEmail;if(!owner)throw new Error('Authentication required');
  return getDb().transaction(async tx=>{
   const [scenario]=await tx.select().from(binafsiScenarios).where(and(eq(binafsiScenarios.id,scenarioId),eq(binafsiScenarios.ownerEmail,owner)));
   if(!scenario||scenario.status!=='pending')throw new Error('Only pending decisions can be approved');
   const rows=await tx.select().from(binafsiCommitments).where(eq(binafsiCommitments.ownerEmail,owner));
   const before=JSON.parse(scenario.baseSnapshot||'[]');
   if(JSON.stringify(rows.map(r=>({...r})).sort((a,b)=>a.id.localeCompare(b.id)))!==JSON.stringify(before.map((r:any)=>({...r})).sort((a:any,b:any)=>a.id.localeCompare(b.id))))throw new Error('Plan changed since proposal. Generate fresh options.');
   const options=JSON.parse(scenario.optionsJson);const option=options[optionIndex];
   if(!option)throw new Error('Selected option is missing');
   validateApproval(rows,option);
   const applied=[];
   for(const move of option.moves){const current=rows.find(r=>r.id===move.id);if(!current||current.protected||current.version!==move.version||current.time!==move.from)throw new Error('Commitment is protected or was edited');
    const updated={...current,time:move.to,version:current.version+1};
    const changed=await tx.update(binafsiCommitments).set({time:updated.time,version:updated.version}).where(and(eq(binafsiCommitments.id,current.id),eq(binafsiCommitments.ownerEmail,owner),eq(binafsiCommitments.version,current.version))).returning();
    if(changed.length!==1)throw new Error('Concurrent change detected; approval cancelled');
    applied.push(updated);
   }
   await tx.update(binafsiScenarios).set({status:'approved',chosenOption:optionIndex,previousSnapshot:JSON.stringify(rows),appliedSnapshot:JSON.stringify(applied)}).where(and(eq(binafsiScenarios.id,scenarioId),eq(binafsiScenarios.ownerEmail,owner)));
   // Previously pending alternatives are no longer valid against new plan state.
   await tx.update(binafsiScenarios).set({status:'superseded'}).where(and(eq(binafsiScenarios.ownerEmail,owner),eq(binafsiScenarios.status,'pending'),ne(binafsiScenarios.id,scenarioId)));
   return {approved:true,scenarioId,changedItems:applied.length,changes:option.moves};
  });
 }
});
