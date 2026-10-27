// n8n Code node: Run Once for Each Item. Stable public contract.
return {json: {
  contract_version: '1.0',
  is_valid: $json.is_valid,
  validation_issues: $json.validation_issues,
  request: {
    request_id: $json.request_id,
    source: $json.source,
    message_text: $json.message_text,
    received_at: $json.received_at
  }
}};
