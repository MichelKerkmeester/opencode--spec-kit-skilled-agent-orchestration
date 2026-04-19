# Implementation Dispatch: Description Regen Contract

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast` per autonomous-completion directive.

**Gate 3 pre-answered**: Option **E** (phase folder). All file writes pre-authorized. Autonomous run, no gates.

## SCOPE

Read first:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/019-system-hardening/005-description-regen-contract/{spec.md,plan.md,tasks.md}`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-pt-01/research.md`

Implement field-level merge policy:

**Phase 1 — Shared description schema:**
- Create `.opencode/skill/system-spec-kit/scripts/lib/description-schema.ts`
- Define Zod schema + TypeScript types for 5 field classes:
  - `canonical_derived`: [specFolder, specId, folderSlug, parentChain, lastUpdated] — always regenerated
  - `canonical_authored`: [description, keywords] — regenerated from canonical inputs
  - `tracking`: [memorySequence, memoryNameHistory] — preserved, system-owned
  - `known_authored_optional`: [title, type, trigger_phrases, path] — preserved via allowlist
  - `unknown_passthrough`: any non-reserved top-level key — preserved

**Phase 2 — Unified merge helper:**
- Create `.opencode/skill/system-spec-kit/scripts/lib/description-merge.ts`
- Implement `mergeDescription(existing, canonical, incoming): merged` per field-class rules
- Route `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-discovery.ts` `getDescriptionWritePayload()` through helper
- Route 018 R4 `mergePreserveRepair()` helper through new merge
- Unit tests per field class × per lane (schema-valid + schema-invalid-parseable)

**Phase 3 — Regression sweep:**
- Enumerate 28 rich description.json files in the tree (as identified in 019/001/004 research)
- Run regen on each, verify `title`, `type`, `trigger_phrases`, `path` preserved
- Add synthetic unknown-key fixture, verify passthrough
- Sample test: add synthetic custom key to one description.json, run regen, verify preserved

**Phase 4 — Verification:**
- Full mcp_server test suite green
- Update `checklist.md` evidence + `implementation-summary.md`

## CONSTRAINTS

- Self-correct up to 3 attempts on failure, then HALT
- Mark `tasks.md` items `[x]` with evidence (file:line + test status)
- DO NOT git commit or git push (orchestrator commits at end)

## OUTPUT EXPECTATION

Shared schema + unified merge helper land. All 28 rich files regen without field loss. Tests green.
