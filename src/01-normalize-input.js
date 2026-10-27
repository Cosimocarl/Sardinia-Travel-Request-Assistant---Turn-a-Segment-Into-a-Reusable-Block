// n8n Code node: Run Once for Each Item. Pure input transformation.
const r = $json;
return {json: {
  request_id: typeof r.request_id === 'string' ? r.request_id.trim() : '',
  source: typeof r.source === 'string' ? r.source.trim().toLowerCase() : '',
  message_text: typeof r.message_text === 'string' ? r.message_text.trim() : '',
  received_at: typeof r.received_at === 'string' ? r.received_at.trim() : ''
}};
