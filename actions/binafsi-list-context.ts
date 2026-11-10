import { defineAction } from '@agent-native/core/action';import { z } from 'zod';import { eq } from 'drizzle-orm';
import { getDb } from '../server/db/index.js';import { binafsiMemories,binafsiCommitments,binafsiScenarios,binafsiGoals,binafsiMoney } from '../server/db/binafsi-schema.js';import { conflicts,scheduleInsights } from '../server/binafsi-planner.js';
export default defineAction({
 description:'Read the signed-in user’s saved commitments, explicit memories, detected timing overlaps and recent decisions before offering advice. Never infer missing facts.',readOnly:true,schema:z.object({}),
 run:async(_args,ctx)=>{const owner=ctx?.userEmail;if(!owner)throw new Error('Authentication required');const db=getDb();
  const [memories,commitments,scenarios,goals,money]=await Promise.all([db.select().from(binafsiMemories).where(eq(binafsiMemories.ownerEmail,owner)),db.select().from(binafsiCommitments).where(eq(binafsiCommitments.ownerEmail,owner)),db.select().from(binafsiScenarios).where(eq(binafsiScenarios.ownerEmail,owner)),db.select().from(binafsiGoals).where(eq(binafsiGoals.ownerEmail,owner)),db.select().from(binafsiMoney).where(eq(binafsiMoney.ownerEmail,owner))]);
  return {memories,commitments,goals,money,moneySummary:{incomeCents:money.filter(x=>x.kind==='income').reduce((s,x)=>s+x.amountCents,0),expenseCents:money.filter(x=>x.kind==='expense').reduce((s,x)=>s+x.amountCents,0),currency:'ZAR (manually entered, not linked to accounts)'},conflicts:conflicts(commitments),insights:scheduleInsights(commitments),scenarios:scenarios.map(x=>({id:x.id,description:x.description,status:x.status,createdAt:x.createdAt,chosenOption:x.chosenOption,options:x.status==='pending'?JSON.parse(x.optionsJson):undefined}))};
 }
});
