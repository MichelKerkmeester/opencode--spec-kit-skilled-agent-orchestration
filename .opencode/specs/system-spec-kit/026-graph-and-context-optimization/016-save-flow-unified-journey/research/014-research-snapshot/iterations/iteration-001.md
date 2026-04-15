<!-- SNAPSHOT: copied from 014-save-flow-backend-relevance-review/research/iterations/iteration-001.md on 2026-04-15. Authoritative source at original packet. -->

---
iteration: 1
focus: "Wrapper and workflow call graph"
dimension: "runtime-flow"
timestamp: "2026-04-15T08:00:00Z"
tool_call_count: 8
---

# Iteration 001

## Findings

- `NEUTRAL` `generate-context.js` is a CLI adapter that validates structured input, preserves explicit target precedence, and hands execution to the workflow, so it is not the canonical write engine itself. [SOURCE: .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:48] [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:55]
- `NEUTRAL` `workflow.ts` no longer writes or indexes `[spec]/memory/*.md`; Step 9 skips legacy writes, Step 11 skips legacy indexing, and the remaining script-side responsibilities are graph refresh plus touched-doc reindex. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1242] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1253] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1361] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1381]

## Ruled-out directions explored this iteration

- The post-v3.4.1.0 script path does not still own the retired memory-file artifact flow. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1253]

## newInfoRatio

- `0.35` — This pass replaced the pre-retirement mental model with the live post-cutover call graph.
