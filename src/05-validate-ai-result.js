// n8n Code node: Run Once for Each Item. Fail closed on invalid model output.
const fail = code => ({json:{ok:false,error_code:code}});
let raw=$json.output;
if (typeof raw === 'string') {
  raw=raw.trim();
  if (!raw) return fail('AI_EMPTY_OUTPUT');
  if (raw.length>20000) return fail('AI_INVALID_OUTPUT');
  // Accept a single outer JSON fence, never arbitrary text around JSON.
  const fenced=raw.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if(fenced) raw=fenced[1];
  try { raw=JSON.parse(raw); } catch { return fail('AI_INVALID_OUTPUT'); }
}
if (!raw || typeof raw!=='object' || Array.isArray(raw)) return fail('AI_INVALID_OUTPUT');
const keys=['language','area','exact_date','date_text','group_size','service','requires_human_review','review_reason','summary','draft_reply'];
if(keys.some(k=>!Object.hasOwn(raw,k)) || Object.keys(raw).some(k=>!keys.includes(k))) return fail('AI_INVALID_OUTPUT');
for(const k of ['language','date_text','review_reason','summary','draft_reply']) if(typeof raw[k]!=='string') return fail('AI_INVALID_OUTPUT');
if(!/^[a-z]{2}$/.test(raw.language)) return fail('AI_INVALID_OUTPUT');
for(const k of ['area','service']) if(raw[k]!==null && (typeof raw[k]!=='string' || !raw[k].trim())) return fail('AI_INVALID_OUTPUT');
if(raw.group_size!==null && (!Number.isInteger(raw.group_size)||raw.group_size<1||raw.group_size>1000)) return fail('AI_INVALID_OUTPUT');
if(typeof raw.requires_human_review!=='boolean') return fail('AI_INVALID_OUTPUT');
if(raw.exact_date!==null) {
  if(typeof raw.exact_date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(raw.exact_date)) return fail('AI_INVALID_OUTPUT');
  const d=new Date(raw.exact_date+'T00:00:00Z');
  if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==raw.exact_date) return fail('AI_INVALID_OUTPUT');
}
if(!raw.summary.trim() || raw.summary.length>1200) return fail('AI_INVALID_OUTPUT');
if(!raw.draft_reply.trim()) return fail('AI_EMPTY_OUTPUT');
if(raw.draft_reply.length>4000||raw.review_reason.length>1000||raw.date_text.length>200) return fail('AI_INVALID_OUTPUT');
if(raw.requires_human_review&&!raw.review_reason.trim()) return fail('AI_INVALID_OUTPUT');
const missing=[];
if(!raw.area) missing.push('area');
if(!raw.exact_date) missing.push('exact_date');
if(raw.group_size===null) missing.push('group_size');
if(!raw.service) missing.push('service');
return {json:{ok:true,route:raw.requires_human_review?'human_review':missing.length?'clarification':'ready',
  missing_fields:missing,analysis:raw,draft_reply:raw.draft_reply.trim()}};
