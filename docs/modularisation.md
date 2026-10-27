# Modularisation: From Segment to Reusable Block

## Before

The main workflow contained Normalize Input → Validate Input → Return Validation between request selection and Input Valid?.

## After

The three nodes move into `Sardinia | Validate Request v1`. The parent uses Call Validator, maps four String inputs and waits for completion. Agent Input then references the returned contract through Call Validator instead of the removed parent node.

| Input | Purpose |
|---|---|
| request_id | Stable readable enquiry code |
| source | manual, instagram or facebook |
| message_text | Customer enquiry text |
| received_at | Optional reference timestamp |

```json
{"contract_version":"1.0","is_valid":true,"validation_issues":[],"request":{"request_id":"DEMO-001","source":"instagram","message_text":"Example message","received_at":"2026-10-27T10:00:00Z"}}
```

## Why this boundary works

The module normalises and validates records without owning storage or AI behaviour. It has no Data Table dependency, no model call and no references to parent-node names. New sources can supply the same contract instead of copying the rules. Expected bad data returns is_valid=false; unexpected execution faults propagate to the parent's error branch.

## Verification

Compare the same valid, blank-message and unsupported-source inputs before and after extraction. Compare deterministic JSON, not generated reply wording. Preserve only fictional examples.

## Optional second caller

Manual Trigger → Demo Input → Execute Sub-workflow can call this same module without Gemini or storage updates. Use padded strings to demonstrate normalisation and an empty message to demonstrate validation. This optional caller is not required for the working assistant and is not claimed as completed in this publication.
