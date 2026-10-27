# Assignment Alignment

Exercise: **Turn a Segment Into a Reusable Block**.

| Requirement | Project implementation | Evidence status |
|---|---|---|
| Read structured records | n8n Data Tables, explicitly permitted instead of Google Sheets | Implementation described; final export pending |
| Use an AI Agent | Gemini-backed Travel Agent and read-only policy tool | Prompts and tool code included; live trace not attached |
| Multiple logical decisions | Selection, input/output validity and three response routes | Architecture and setup documented |
| Identify a reusable section | Normalize Input → Validate Input → Return Validation | Code and contract included |
| Use it as a sub-workflow | Main workflow calls Validate Request with typed fields | Refactoring documented; final export pending |
| Bonus: graceful errors | Shared classification/logging and verified failure-state path | DEMO-004 success owner-reported; further failures not confirmed |

## Optional demonstration

A second Validation Demo caller can prove reuse with padded source/text and a blank message. It is optional and is not claimed as completed here.

## Suggested presentation

Explain the tourism problem; show the extracted validation boundary; process an enquiry; show the invalid-input event and recovery state; distinguish executed checks from unverified scenarios. Add only synthetic screenshots and final sanitised exports.
