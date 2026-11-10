import { validateCommitment } from '../server/binafsi-planner.js';
import { defineAction } from '@agent-native/core/action';
import { z } from 'zod';
import { getDb } from '../server/db/index.js';import { binafsiCommitments } from '../server/db/binafsi-schema.js';
export default defineAction({
 description:'Add a commitment to the signed-in user’s schedule only at their request. Include its time, duration, day and protected state.',
 schema:z.object({title:z.string().trim().min(2).max(120),time:z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),durationMinutes:z.number().int().min(15).max(480).default(60),day:z.string().max(32).default('today'),protected:z.boolean().default(false)}),
 run:async({title,time,durationMinutes,day,protected:locked},ctx)=>{
  const owner=ctx?.userEmail;if(!owner)throw new Error('Authentication required');
  validateCommitment({id:'new',title,time,durationMinutes,day});
  const row={id:crypto.randomUUID(),ownerEmail:owner,title,time,durationMinutes,day,protected:locked,version:0};
  await getDb().insert(binafsiCommitments).values(row);return row;
 }
});
