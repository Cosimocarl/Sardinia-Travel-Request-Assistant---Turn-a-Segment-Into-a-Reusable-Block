// n8n Code node: Run Once for Each Item. Error sub-workflow input: context, error, stage, forced_code.
const c=$json.context || {};
const e=$json.error || {};
const stage=String($json.stage || 'unknown');
const detail=typeof e==='string'?e:JSON.stringify(e);
const status=Number(e.statusCode??e.httpCode??e.status??e.error?.statusCode);
let code='UNEXPECTED_ERROR';
const allowed=['VALIDATION_ERROR','AI_EMPTY_OUTPUT','AI_INVALID_OUTPUT','STATE_WRITE_FAILED','DATA_READ_FAILED','VALIDATOR_FAILED'];
if(allowed.includes($json.forced_code)) code=$json.forced_code;
else if(status===401||status===403||/\b(401|403)\b|API_KEY_INVALID|invalid api key|permission.denied/i.test(detail)) code='AUTH_ERROR';
else if(status===429||/\b429\b|RESOURCE_EXHAUSTED|quota|rate.limit/i.test(detail)) code='QUOTA_OR_RATE_LIMIT';
else if([500,502,503,504].includes(status)||/\b(500|502|503|504)\b|ECONNRESET|ECONNREFUSED|ETIMEDOUT|timeout|fetch failed|ENOTFOUND/i.test(detail)) code='TEMPORARY_PROVIDER_ERROR';
const messages={
 VALIDATION_ERROR:'Correct the request fields before resetting its status to new.',
 AI_EMPTY_OUTPUT:'No usable draft was produced. Inspect the model output and retry deliberately.',
 AI_INVALID_OUTPUT:'The model response failed the contract. Review the prompt/output before retrying.',
 STATE_WRITE_FAILED:'Storage could not confirm the update. Inspect the row before any retry.',
 DATA_READ_FAILED:'The request table could not be read. Check its selection and permissions.',
 VALIDATOR_FAILED:'The validation workflow failed unexpectedly. Inspect its mapping and execution.',
 AUTH_ERROR:'Check the selected Gemini credential. Do not keep retrying.',
 QUOTA_OR_RATE_LIMIT:'Check the project quota and retry later; do not enable billing automatically.',
 TEMPORARY_PROVIDER_ERROR:'A temporary service/network issue remains after bounded attempts. Retry later.',
 UNEXPECTED_ERROR:'Inspect the local execution and correct the cause before retrying.'
};
// Only safe metadata leaves this classifier; provider payloads and customer text do not.
return {json:{
 event_id:String(c.execution_id||'manual')+':'+stage,
 request_id:String(c.request_id||'unknown'),row_id:c.row_id??0,
 stage,code,message:messages[code],
 retryable:code==='TEMPORARY_PROVIDER_ERROR'||code==='QUOTA_OR_RATE_LIMIT',
 request_status:code==='VALIDATION_ERROR'?'invalid':'error',
 occurred_at:new Date().toISOString(),execution_id:String(c.execution_id||'manual')
}};
