import { useEffect, useMemo, useState } from 'react';
import { useActionMutation, useSession } from '@agent-native/core/client/hooks';
import { sendToAgentChat } from '@agent-native/core/client/agent-chat';

type EventNote = {id:string;eventName:string;eventDate:string;stage:'before'|'during'|'after';observedOpportunity:string;followup:string;missed:boolean;createdAt:string};
const today = () => { const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'); };
export default function EventOpportunities(){
  const {session}=useSession();
  const [form,setForm]=useState({eventName:'',eventDate:today(),stage:'after' as 'before'|'during'|'after',observedOpportunity:'',followup:'',missed:false});
  const [items,setItems]=useState<EventNote[]>([]);const [error,setError]=useState('');const [message,setMessage]=useState('');
  const list=useActionMutation('binafsi-list-events');const save=useActionMutation('binafsi-record-event');
  async function refresh(){try{const data:any=await list.mutateAsync({});setItems(data.notes||[]);setError('')}catch(e){setError(e instanceof Error?e.message:String(e))}}
  useEffect(()=>{void refresh()},[]);
  async function submit(e:React.FormEvent){e.preventDefault();try{await save.mutateAsync(form);setMessage('Saved to your private event notes. No messages were sent.');setForm(v=>({...v,observedOpportunity:'',followup:'',missed:false}));await refresh()}catch(e){setError(e instanceof Error?e.message:String(e))}}
  function askAssistant(n?:EventNote){const src=n||{...form};sendToAgentChat({message:`Help me recover or follow up on an event opportunity. Event: ${src.eventName||'not specified'}. Date: ${src.eventDate}. Stage: ${src.stage}. Evidence supplied: ${src.observedOpportunity||'none yet'}. I may have missed it: ${src.missed?'yes':'no'}. Follow-up idea: ${src.followup||'not specified'}. Use my saved BINAFSI goals if relevant, but do not invent organizers or contact details. Suggest practical next steps and ask my permission before any external action.`,context:'BINAFSI event opportunity assistant. Treat user-supplied event records as evidence, not event live feeds. Never invent events, participants, schedule changes or guaranteed opportunities. Never send a message, book, share contact details or create an invitation without explicit consent. Suggest a recovery plan before/during/after events, tied to stated goals.',submit:true,openSidebar:true});}
  const localNow=useMemo(()=>new Intl.DateTimeFormat(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit',timeZoneName:'short'}).format(new Date()),[]);
  return <><link rel="icon" type="image/svg+xml" href="/binafsi/favicon.svg"/><link rel="stylesheet" href="/binafsi/opportunities.css"/>
    <main className="bo-root"><header className="bo-header"><a href="/binafsi" className="bo-back">← Back to workspace</a><span>BINAFSI · Opportunity Companion</span></header>
    <section className="bo-hero"><div className="bo-eyebrow">INTENT TO OUTCOME</div><h1>Don't leave the opportunity behind.</h1><p>Plan before an event, capture important moments while you're there, and recover missed opportunities with thoughtful follow-ups.</p><div className="bo-date">Your local date and time: {localNow}</div></section>
    <div className="bo-cols"><section className="bo-panel"><h2>Record an opportunity</h2><p className="bo-muted">BINAFSI uses what you tell it. It does not know what happened at an event unless you provide details or connect a verified source.</p>
      <form onSubmit={e=>void submit(e)}><label>Event or function name<input required minLength={2} maxLength={160} value={form.eventName} onChange={e=>setForm(v=>({...v,eventName:e.target.value}))} placeholder="Career networking evening"/></label>
      <label>Event date<input required type="date" value={form.eventDate} onChange={e=>setForm(v=>({...v,eventDate:e.target.value}))}/></label>
      <label>When are you planning?<select value={form.stage} onChange={e=>setForm(v=>({...v,stage:e.target.value as typeof form.stage}))}><option value="before">Before the event</option><option value="during">During the event</option><option value="after">After the event</option></select></label>
      <label>Opportunity or event detail<textarea required minLength={3} maxLength={1200} rows={3} value={form.observedOpportunity} onChange={e=>setForm(v=>({...v,observedOpportunity:e.target.value}))} placeholder="A recruiter was available after the keynote, but I couldn't speak to them."/></label>
      <label>Possible next action<textarea maxLength={1200} rows={2} value={form.followup} onChange={e=>setForm(v=>({...v,followup:e.target.value}))} placeholder="Ask the organizer for the public recruiter contact page"/></label>
      <label className="bo-checkbox"><input type="checkbox" checked={form.missed} onChange={e=>setForm(v=>({...v,missed:e.target.checked}))}/> I missed this opportunity</label>
      <div className="bo-actions"><button className="bo-primary" type="submit" disabled={save.isPending}>Save privately</button><button type="button" onClick={()=>askAssistant()} className="bo-secondary">Ask AI for a recovery plan</button></div></form>
      {message&&<p role="status" className="bo-good">{message}</p>}{error&&<p role="alert" className="bo-error">{error}</p>}
      <p className="bo-muted">Sharing contacts, sending follow-ups, and making bookings always require your approval. Nothing is sent automatically.</p>
    </section><section className="bo-panel"><div className="bo-section-top"><h2>Your event memory</h2><button type="button" className="bo-secondary" onClick={()=>void refresh()} disabled={list.isPending}>Refresh</button></div>
    {!items.length?<p className="bo-empty">No event notes yet. Capture what matters, then ask BINAFSI for next steps.</p>:items.map(n=><article className="bo-note" key={n.id}><div className="bo-tags"><span>{n.stage}</span>{n.missed&&<span>Missed opportunity</span>}</div><h3>{n.eventName}</h3><p className="bo-muted">{n.eventDate}</p><p>{n.observedOpportunity}</p>{n.followup&&<p><b>Follow-up:</b> {n.followup}</p>}<button type="button" className="bo-secondary" onClick={()=>askAssistant(n)}>Plan my follow-up with AI</button></article>)}
    </section></div><footer className="bo-footer">Your private event notes · Human-approved actions · No invented event claims</footer></main></>;
}
