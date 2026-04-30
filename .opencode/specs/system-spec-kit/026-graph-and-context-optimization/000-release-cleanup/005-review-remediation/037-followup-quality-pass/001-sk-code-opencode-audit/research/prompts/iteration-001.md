## Packet 037/001: sk-code-opencode-audit — Tier A audit

You are cli-codex (gpt-5.5 high fast) implementing **037/001-sk-code-opencode-audit**.

### Goal

Audit all newly-created code from packets 033, 034, and 036 against sk-code-opencode standards. For violations: apply minimal fixes. For patterns missing from sk-code-opencode itself: propose updates to the skill (not in this packet, but flag in audit-findings.md for follow-up).

### Read these first

- `.opencode/skill/sk-code-opencode/SKILL.md` (the skill standards)
- `.opencode/skill/sk-code-opencode/references/` (any embedded standard files — typescript.md, javascript.md, python.md, shell.md, jsonc.md if present)
- `.opencode/skill/sk-code-opencode/assets/` (any quality checklists)

### Files to audit (all NEW or MODIFIED by 033/034/036)

From 033 (memory-retention-sweep):
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts`
- Modifications to: `lib/session/session-manager.ts`, `lib/governance/scope-governance.ts`, `handlers/index.ts`, `schemas/tool-input-schemas.ts`, `tool-schemas.ts`, `tools/memory-tools.ts`, `tools/types.ts`

From 034 (half-auto upgrades):
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools/advisor-rebuild.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-rebuild.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/hooks-codex-freshness.vitest.ts`
- Modifications to: `hooks/codex/user-prompt-submit.ts`, `hooks/copilot/custom-instructions.ts`, `skill_advisor/handlers/advisor-status.ts`, `skill_advisor/handlers/index.ts`, `skill_advisor/tools/index.ts`, `tool-schemas.ts`, `tools/index.ts`

From 036 (CLI matrix adapter runners) — discover via git diff:
- `git --no-pager diff --name-only $(git --no-pager log --grep '036' --format='%H' -1)~1 HEAD -- .opencode/skill/system-spec-kit/mcp_server/`

If 036 hasn't merged yet at audit-time, audit only 033 + 034. Note 036 in audit-findings.md as "deferred to next audit cycle" if absent.

### Audit checklist (per sk-code-opencode SKILL.md)

For each TypeScript file, check:
- Strict mode (`"strict": true` in tsconfig — confirm not bypassed by `// @ts-ignore` etc.)
- No `any` leakage (allowed only at boundaries, with justification)
- Interfaces declared for all public surfaces
- Type guards used where dynamic narrowing happens
- `import type` for type-only imports where applicable
- Error handling: no swallowed exceptions, no broad catch-all without rationale
- No console.log in production paths (use logger/structured logs)
- File header / module-level JSDoc per skill standard
- Filename conventions (kebab-case for non-class files)
- Test files: `describe`/`it` structure; assertions use vitest; no skipped tests committed

For each test (.vitest.ts) file:
- Test names describe behavior, not implementation
- No `.only` left over
- Setup/teardown via `beforeEach`/`afterEach` where appropriate
- Mocks isolated; no global state pollution

### Implementation

#### Phase 1: Audit pass

Read every file in the audit list. Apply the checklist. Write `audit-findings.md` at packet root with:

```markdown
# sk-code-opencode Audit Findings

## Summary
- Files audited: N
- PASS: N
- VIOLATIONS (fixed): N
- VIOLATIONS (skill gap — not fixed in this packet): N

## Per-file results

### handlers/memory-retention-sweep.ts
- ✅ strict mode honored
- ✅ no any leak
- ✅ interfaces declared
- ⚠️ FIX APPLIED: missing JSDoc on exported function; added.
- ...

### lib/governance/memory-retention-sweep.ts
- ...

## Skill-gap findings (proposed sk-code-opencode updates)
- Pattern X is used in 4 files but not documented in sk-code-opencode SKILL.md. Suggested addition: ...
- ...
```

#### Phase 2: Apply fixes

For each VIOLATION in the findings: apply the minimal fix using Edit. Re-audit the file to confirm pass.

#### Phase 3: Verify

- `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` — must pass
- `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run memory-retention-sweep advisor-rebuild hooks-codex-freshness` — all tests must still pass

### Packet structure to create (Level 2)

7-file structure under `specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/001-sk-code-opencode-audit/`:
- spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json
- PLUS: audit-findings.md at packet root

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep","system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades","system-spec-kit/026-graph-and-context-optimization/036-cli-matrix-adapter-runners"]` (036 may not exist yet at audit-time — that's OK, audit what's present).

**Trigger phrases**: `["037-001-sk-code-opencode-audit","sk-code-opencode audit","audit 033 034 036","standards alignment audit"]`.

**Causal summary**: `"Audits new code from 033/034/036 against sk-code-opencode standards. PASS / fix-applied / skill-gap categories. Fixes applied in-packet; skill gaps deferred to follow-up. Build + tests verified post-fix."`.

**Frontmatter**: compact `recent_action` / `next_safe_action` rules. < 80 chars.

### Constraints

- Read-only on sk-code-opencode skill itself (only flag updates in audit-findings.md, don't write to skill).
- Strict validator MUST exit 0 on the packet.
- Build + tests MUST pass post-fix.
- DO NOT commit; orchestrator will commit.
- Cite file:line evidence in audit-findings.md.

When done, last action is strict validator + build + tests passing. No narration; just write files and exit.
