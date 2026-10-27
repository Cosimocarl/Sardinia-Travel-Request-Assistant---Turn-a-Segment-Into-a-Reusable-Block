# Final Workflow Exports — Pending

The final JSON exports from the owner's local n8n installation have not been supplied. This directory therefore does not contain generated or guessed replacements for the actual workflows.

Expected exports:

1. `main.json` — Sardinia | Travel Request Assistant
2. `validate-request.json` — Sardinia | Validate Request v1
3. `record-failure.json` — Sardinia | Record Failure v1

An optional Validation Demo or Failure Lab may be added separately with clear labelling.

## Before adding exports

Export to private staging first. Remove pinned data, personal credential bindings, real messages and hard-coded secrets. Inspect notes, headers, URL/query parameters and instance metadata. Keep the private Italian guide and execution dumps out of Git.

Re-import sanitised copies, reconnect credentials, tables and child workflows, and run a happy path and error case. Only then mark the importable release complete.

## Import order once files are available

Import the two child workflows first. Create the request/event tables and your own Gemini credential. Import the parent and reselect the child workflows, table references and credential bindings. Data Table native IDs and child workflow IDs are installation-specific.
