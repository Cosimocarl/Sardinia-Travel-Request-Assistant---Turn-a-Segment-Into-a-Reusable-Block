# Tests and Evidence

## Evidence boundary

Two kinds of evidence are kept separate:

- **Executed code checks:** 26 deterministic JavaScript checks passed in the authoring environment. They exercise the supplied functions independently of n8n and Gemini.
- **Owner-reported integration:** the project owner explicitly confirmed that DEMO-004 completed the invalid-input error path successfully. The raw execution export and final workflow JSON are not included, so this is reported evidence rather than an independently reproduced integration test.

No other integration case is marked passed merely because it was described in the guide.

## Code checks

```bash
node tests/test-code.mjs
```

No dependencies or API calls are needed. The recorded output is in [code-test-results.txt](code-test-results.txt).

## Integration matrix

| Scenario | Expected | Current evidence |
|---|---|---|
| Empty message, DEMO-004 | invalid; VALIDATION_ERROR; event recorded; no AI call | Passed — owner reported |
| Complete enquiry, DEMO-001 | Accurate draft saved as draft_ready | Awaiting explicit result |
| Incomplete enquiry, DEMO-002 | Clarification questions, no invented details | Awaiting explicit result |
| German enquiry, DEMO-003 | German draft with correct facts | Not confirmed |
| Unsupported source, DEMO-007 | invalid and event, no AI call | Not confirmed |
| Repeat completed row | No Request; no new AI call | Not confirmed |
| Malformed/empty model output | Controlled error and no successful draft | Simulation documented, not confirmed |
| Throwing Code node | Error output reaches failure handler | Simulation documented, not confirmed |
| Provider authentication/quota failure | Safe diagnostic and recoverable state | Not confirmed |
| Failed storage update | No false saved confirmation | Not confirmed |
| Failed event logger | Visible stop, no recursive logging | Not confirmed |
| Before/after validator comparison | Same deterministic contract | Procedure documented; results not attached |
| Sanitised workflow import | Works after rebinding dependencies | Pending final workflow exports |

## Evaluation

Check facts, language, missing questions, no invented commercial claims, correct routing and storage state. Do not compare AI text character-for-character. Record the actual n8n version, configured model and date for each future integration run.

## Fast failure checks (optional laboratory copy)

Duplicate the main workflow and name it Failure Lab. Replace the Agent path with a Set node output="not JSON" to test AI_INVALID_OUTPUT without an API call. A Code node throwing a synthetic timeout, connected through its error output to the agent-stage failure builder, tests the actual node-error connection. Run against synthetic requests only, one run at a time. Do not label simulations as live provider failures.
