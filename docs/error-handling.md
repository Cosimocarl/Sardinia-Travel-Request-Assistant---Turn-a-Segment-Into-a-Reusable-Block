# Error handling and recovery

The workflow is manually executed. An Error Trigger workflow does not run for manual tests, so the core solution uses node error outputs and a directly called failure sub-workflow.

## Error contract

`Record Failure` receives context (object), error (object), stage (string) and forced_code (string). It classifies the error with `src/06-classify-failure.js`, inserts safe metadata into `error_events`, then returns the classifier output. The main workflow writes the returned status/code/message to the selected row and verifies the saved state.

| Condition | Outcome | Recovery |
|---|---|---|
| Invalid input | invalid, VALIDATION_ERROR | Correct fields, then set new |
| Empty/malformed AI result | error, AI_EMPTY_OUTPUT or AI_INVALID_OUTPUT | Inspect prompt/model response; retry deliberately |
| Authentication issue | error, AUTH_ERROR | Repair credential |
| Quota or rate limit | error, QUOTA_OR_RATE_LIMIT | Check quota; retry later |
| Network or provider failure | error, TEMPORARY_PROVIDER_ERROR | Retry later after bounded attempts |
| Failed storage write | event + visible stop if state cannot be saved | Inspect actual row before retry |
| Failed error-log write | Visible workflow failure | Repair storage; do not swallow the error |

AI Agent Retry On Fail: maximum 2 tries, 5000 ms between tries. Disable retry on the attached model node where available to avoid stacked user-configured retries. This built-in retry is not status-selective; authentication and quota failures may also get one retry. Provider/SDK retries may vary. Count agent iterations separately from whole-node tries. Max Iterations: 3. No automatic requeue loop.

The classifier uses status fields where available and conservative text matching otherwise. Unknown formats remain UNEXPECTED_ERROR. `retryable` is advisory, not an instruction to retry automatically. A 429 is not proof that waiting five seconds will fix quota exhaustion.

## Secondary failures

Do not catch logger failures with the same logger recursively. Stop visibly. A database outage cannot be reliably recorded in that same database. Manual recovery uses execution details and the actual table state. Read-back checks reduce false success but do not make writes atomic or exactly-once.

## Operational discipline

Execute one request at a time and prevent overlapping manual runs. A request left processing after interruption must be inspected before resetting to new. AI errors leave no approved draft. Never replace an error with an invented customer reply.
