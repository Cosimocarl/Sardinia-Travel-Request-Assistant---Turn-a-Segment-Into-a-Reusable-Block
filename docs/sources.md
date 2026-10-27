# Sources and version notes

Verified documentation during preparation, 27 October 2026. Record the installed n8n version before building; labels can vary.

- [Sub-workflows](https://docs.n8n.io/build/flow-logic/break-workflows-into-smaller-parts/)
- [Execute Sub-workflow](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executeworkflow/)
- [Execute Sub-workflow Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executeworkflowtrigger/)
- [Error Trigger: automatic executions only](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.errortrigger/)
- [Error handling](https://docs.n8n.io/build/flow-logic/handle-errors-gracefully/)
- [AI Agent](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/)
- [Structured output caveats](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.outputparserstructured/common-issues/)
- [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Removing sensitive data from GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

The first version requests JSON from the Agent and validates it deterministically, failing closed instead of using an automatic AI repair loop. n8n recommends a separate chain when agent output parsing is unreliable; that is a documented improvement if local tests show repeated format failures.
