import { defineAction } from '@agent-native/core/action';
import { z } from 'zod';
import { and,eq } from 'drizzle-orm';
import { getDb } from '../server/db/index.js';
import { binafsiScenarios } from '../server/db/binafsi-schema.js';
import { applyOption,conflicts } from '../server/binafsi-planner.js';
export default defineAction({
 description:'Read-only before-and-after evidence for a saved BINAFSI decision. Do not claim simulations predict personal outcomes.',
 readOnly:true,
 schema:z.object({scenarioId:z.string().uuid(),optionIndex:z.number().int().min(0).max(2)}),
 run:async({scenarioId,optionIndex},ctx)=>{
  const owner=ctx?.userEmail;if(!owner)throw new Error('Authentication required');
  const [s]=await getDb().select().from(binafsiScenarios).where(and(eq(binafsiScenarios.id,scenarioId),eq(binafsiScenarios.ownerEmail,owner)));
  if(!s)throw new Error('Scenario not found');
  const option=JSON.parse(s.optionsJson)[optionIndex];if(!option)throw new Error('Option not found');
  const before=JSON.parse(s.baseSnapshot||'[]');const after=applyOption(before,option);
  return {scenarioId,optionIndex,status:s.status,verified:'Saved scheduling snapshot only',before:before.map((c:any)=>({id:c.id,title:c.title,day:c.day,time:c.time,durationMinutes:c.durationMinutes,protected:c.protected})),after:after.map((c:any)=>({id:c.id,title:c.title,day:c.day,time:c.time,durationMinutes:c.durationMinutes,protected:c.protected})),beforeConflicts:conflicts(before),afterConflicts:conflicts(after),moves:option.moves,assumptions:option.assumptions};
 }
});
