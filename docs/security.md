# Publication and privacy checklist

- Keep the private Italian guide outside this repository.
- Use fictional data in examples, screenshots, prompts and tests.
- Store the API key in n8n Credentials. Do not publish credential exports, n8n databases, Docker volumes or environment files.
- Export workflows to a private staging folder first. Inspect JSON node parameters, headers, URLs, expressions, notes, pinData and credential names/bindings.
- Remove personal credential bindings and pinned data from the publishable copy. Imported users select their own credentials, tables and sub-workflows.
- Review account names and email addresses in screenshots and Git author metadata.
- Run `node scripts/audit-exports.mjs` after adding the three required exports. It checks common publication mistakes, not all secrets or personal information.
- Use an independent secret scanner over files and Git history, and enable GitHub push protection where available. Manual review is still required.
- Review `git diff --cached` before each commit. .gitignore does not remove previously tracked secrets or protect sensitive values inside allowed files.
- If a secret is exposed, revoke/rotate it first. Removing a line in the next commit does not remove history or existing clones.

## Data sent to the model

The local workflow sends the selected message to Gemini. Minimise or remove unnecessary personal details before a real trial. Review the terms applicable to the account and region before business deployment. Safe error-event fields exclude provider payloads and customer text, but raw n8n execution traces may still contain them. Keep traces private and configure retention appropriately.

## GitHub publication

Initialise Git in the public project directory only. Stage explicit paths, review files/history, then create an empty GitHub repository and push. Do not publish the entire kit ZIP: it includes a private Italian guide. The README must retain its pending status until integration testing is complete.
