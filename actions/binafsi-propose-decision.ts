import { defineAction } from '@agent-native/core/action';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { getDb } from '../server/db/index.js';
import { binafsiCommitments,binafsiScenarios } from '../server/db/binafsi-schema.js';
import { buildOptions } from '../server/binafsi-planner.js';
export default defineAction({
 description:'Use saved BINAFSI commitments to calculate three honest scheduling alternatives. Return explicit conflicts, assumptions and trade-offs. Never apply changes. Ask the user to review and approve in the interface.',
 schema:z.object({description:z.string().trim().min(10).max(1000)}),
 run:async({description},ctx)=>{
  const owner=ctx?.userEmail;if(!owner)throw new Error('Authentication required');const db=getDb();
  const items=await db.select().from(binafsiCommitments).where(eq(binafsiCommitments.ownerEmail,owner));
  const options=buildOptions(description,items);
  const row={id:crypto.randomUUID(),ownerEmail:owner,description,optionsJson:JSON.stringify(options),baseSnapshot:JSON.stringify(items),status:'pending',createdAt:new Date().toISOString()};
  await db.insert(binafsiScenarios).values(row);
  return {id:row.id,description,options,baselineConflicts:options[0]?.impact?.beforeConflicts??0,disclaimer:'Rule-based comparisons use your saved times and durations. They are not predictions, and no changes were applied.'};
 }
});
