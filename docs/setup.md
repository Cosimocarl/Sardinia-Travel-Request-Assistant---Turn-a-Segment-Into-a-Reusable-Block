# Build and import guide

Prerequisites: n8n already running with persistent storage, a working Gemini credential, Data Tables and node error outputs available. Record the actual n8n version. All UI node names below are significant because expressions reference them.

## Tables

Import data/sample-requests.csv as travel_requests. Use String for every custom column except attempt_count (Number). Add next_action as String. Do not create an id column: use n8n's native row id for writes. Create error_events with String fields event_id, request_id, stage, code, message, occurred_at, execution_id and Boolean retryable. The header CSV is a reference if empty imports are unsupported.

## Main workflow

Name: Sardinia | Travel Request Assistant. Manual Trigger → Select Request (Edit Fields: request_id=DEMO-001) → Get Request (Data Table, Get rows; ALL conditions request_id equals selected ID and status equals new; return all matching rows; Always Output Data ON) → Capture Request (Code, all items, src/04-capture-request.js) → Selection Switch.

Switch on selection: none → No Request (terminal Edit Fields notice); ambiguous → Stop And Error with a duplicate-ID message; one → inline validation segment. Get Request errors go to a failure-context node described below.

Inline segment: Normalize Input (src/01) → Validate Input (src/02) → Return Validation (src/03), all Code nodes in each-item mode. If is_valid is false, prepare failure context with forced_code=VALIDATION_ERROR. If true, claim the selected native row id by setting processing and incrementing attempt_count from Capture Request. Clear stale draft/analysis/error fields. Do not permit overlapping runs.

After claiming, read the native row id back with Always Output Data ON. Verify status=processing or route STATE_WRITE_FAILED to the failure handler. Restore the validation contract with an Agent Input Code node returning $('Return Validation').first().json. After refactoring, change this reference to $('Call Validator').first().json.

## Agent

Travel Agent: prompt defined manually from prompts/travel-agent-user.txt, System Message from prompts/travel-agent-system.txt. Attach Google Gemini Chat Model with the existing credential and selected model. Attach Code Tool named service_policy using src/07-service-policy-tool.js. No memory. Max Iterations 3; whole-Agent Retry On Fail 2 tries, 5000 ms wait. Use Continue (using error output) and connect its error output to failure preparation. Avoid stacked configurable model-node retries. Plain JSON is requested; Require Specific Output Format remains off.

Success → Validate AI Result (src/05, each item) → IF ok. False → failure preparation, forced_code from error_code. True → Route Switch on route: ready, clarification, human_review. Each branch adds next_action: REVIEW_AND_REPLY, ASK_MISSING_DETAILS or REVIEW_SPECIAL_REQUEST. Route fallback stops visibly.

Converge branches into Prepare Success. Save draft_ready, route, next_action, analysis_json containing the analysis plus missing_fields, draft_reply and processed_at, clearing error fields. Filter using Capture Request.row_id, never an AI-generated identifier. Read back the row and verify status and draft content before displaying success.

## Refactor

Extract the three validation nodes into Sardinia | Validate Request v1 with Execute Sub-workflow Trigger. Four String inputs: request_id, source, message_text, received_at. Replace the inline segment with Call Validator, mapping Capture Request fields. Run once per item, wait for completion. Connect both normal and error outputs. Update Agent Input's reference. Compare outputs with the inline version and create the second caller in modularisation.md.

## Failure sub-workflow

Sardinia | Record Failure v1: Execute Sub-workflow Trigger with context Object, error Object, stage String, forced_code String → Classify Failure (src/06) → Insert Error Event (map only the eight error_events columns) → Return Failure (Code returns $('Classify Failure').first().json). Storage errors are not swallowed or recursively logged.

For each main-stage error output create a Build Failure context node: context is Capture Request plus execution_id; error is the current error item; stage identifies the failed node; forced_code is blank unless specified. Before Capture Request exists, use Select Request's ID and row_id=0. All builders converge on Call Failure Handler, with explicit inputs and wait enabled.

After handler success, row_id=0 stops visibly because no row can be updated. Otherwise update the selected row with returned request_status, code, message and timestamp; clear draft/analysis. Read back and verify status/code. End with a safe notice. If the handler, error-state write or read-back fails, Stop And Error with a static safe diagnostic. Do not recursively invoke the handler.

## Portability and evidence

Build in the installed version, then export tested workflows. Re-import sanitised copies into a demo setup and rebind credentials, table references and child workflow IDs. Run the integration matrix before replacing pending claims. Detailed fault-injection and recovery expectations are in testing.md and error-handling.md.
