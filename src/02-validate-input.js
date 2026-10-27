// n8n Code node: Run Once for Each Item. Expected bad input is data, not an exception.
const r = $json;
const issues = [];
if (!/^[A-Za-z0-9_-]{1,64}$/.test(r.request_id)) issues.push('INVALID_REQUEST_ID');
if (!['manual','instagram','facebook'].includes(r.source)) issues.push('INVALID_SOURCE');
if (!r.message_text) issues.push('EMPTY_MESSAGE');
if (r.message_text.length > 6000) issues.push('MESSAGE_TOO_LONG');
if (r.received_at && !Number.isFinite(Date.parse(r.received_at))) issues.push('INVALID_TIMESTAMP');
return {json: {...r, is_valid: issues.length === 0, validation_issues: issues}};
