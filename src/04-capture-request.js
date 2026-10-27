// n8n Code node: Run Once for All Items.
// Get Request has Always Output Data ON, so no match can be an empty object.
const rows = $input.all().map(i => i.json).filter(r => r.id !== undefined && r.id !== null);
if (rows.length === 0) return [{json:{selection:'none',notice:'No new request matches the selected ID.'}}];
if (rows.length !== 1) return [{json:{selection:'ambiguous',notice:'Duplicate request IDs: fix the table before processing.'}}];
const r=rows[0];
return [{json:{selection:'one',row_id:r.id,request_id:r.request_id,source:r.source,
  message_text:r.message_text,received_at:r.received_at || '',
  attempt_count: (Number.isInteger(Number(r.attempt_count)) && Number(r.attempt_count)>=0 ? Number(r.attempt_count) : 0)+1}}];
