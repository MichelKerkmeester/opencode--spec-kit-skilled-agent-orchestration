# Applied: .opencode/skill/system-spec-kit/ARCHITECTURE.md

## Source Flagging
- Sub-packets: 04,08,09
- Severity (from merged report): HIGH

## Changes Applied
- Clarified the Copilot hook matrix and surrounding narrative to describe the shipped file-based transport.
  Before: `user-prompt-submit.ts` "writes managed custom instructions" and the prose only said Copilot refreshed a managed block because hook output is not a prompt-mutation channel.
  After: the Copilot row now says `user-prompt-submit.ts` refreshes `$HOME/.copilot/copilot-instructions.md` via `custom-instructions.ts`, `session-prime.ts` refreshes the same managed file, and the prose now states those hooks call `custom-instructions.ts` while responses stay informational or empty instead of mutating prompts.
  Sub-packet(s): 04
- Corrected the OpenCode skill-advisor bridge entrypoint wording from CommonJS to the shipped plugin-loader contract.
  Before: `- **Bridge entry**: .opencode/plugins/spec-kit-skill-advisor.js (CommonJS entrypoint)`
  After: `- **Bridge entry**: .opencode/plugins/spec-kit-skill-advisor.js (OpenCode plugin ESM entrypoint with a default-export factory)`
  Sub-packet(s): 09
- Added the missing plugin-bridge guarantees paragraph under the existing delegation-order list.
  Before: the subsection stopped after the three-step delegation order.
  After: a new paragraph states that the bridge keeps per-instance runtime state, dedups concurrent identical in-flight requests, caps prompt stdin / rendered brief / cache entry sizes, and evicts the oldest cached entry when the configured cap is exceeded.
  Sub-packet(s): 08

## Evidence Links
- Merged report row: `impact-analysis/merged-impact-report.md:36`
- 04 impact row and evidence: `impact-analysis/04-impact.md:17`, `impact-analysis/04-impact.md:27-30`
- 08 impact row and evidence: `impact-analysis/08-impact.md:23`, `impact-analysis/08-impact.md:33-36`
- 09 impact row and evidence: `impact-analysis/09-impact.md:20`, `impact-analysis/09-impact.md:28-31`
- Implementation detail support:
  `004-copilot-hook-parity-remediation/implementation-summary.md:61-91`
  `008-skill-advisor-plugin-hardening/implementation-summary.md:48-53`
  `009-skill-advisor-standards-alignment/implementation-summary.md:49-50`

## Verification
- Confirmed frontmatter parses: file still has a valid opening frontmatter block delimited by `---`.
- Confirmed anchors are still paired: checked `<!-- ANCHOR:* -->` and `<!-- /ANCHOR:* -->` markers after the edit with no unmatched pairs.
- Confirmed no unrelated content was deleted: `git diff -- .opencode/skill/system-spec-kit/ARCHITECTURE.md` shows only the targeted hook-matrix and plugin-bridge edits.

## Deferred / Unchanged
- None. All merged-report Suggested Changes for this target were applied.
