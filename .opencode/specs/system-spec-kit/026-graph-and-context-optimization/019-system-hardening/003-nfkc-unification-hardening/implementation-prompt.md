# Implementation Dispatch: NFKC Unification Hardening

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast` per autonomous-completion directive.

**Gate 3 pre-answered**: Option **E** (phase folder). All file writes pre-authorized. Autonomous run, no gates.

## SCOPE

Read first:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/019-system-hardening/003-nfkc-unification-hardening/{spec.md,plan.md,tasks.md}`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-02/research.md`

Implement 6 hardening proposals (HP1-HP6) in order:

**HP1 — Shared Unicode normalization utility:**
- Create `.opencode/skill/system-spec-kit/scripts/lib/unicode-normalization.ts` exporting `canonicalFold(s: string): string` (NFKC + hidden-char strip + combining-mark strip + confusable fold)
- Refactor `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts` to use shared utility
- Refactor `.opencode/skill/system-spec-kit/mcp_server/hooks/shared-provenance.ts` to use shared utility
- Migrate `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:110-179` from NFC to shared utility
- Parity tests: same input → same normalized output across 3 surfaces

**HP2 — Post-normalization instruction denylist:**
- Move contamination + suspicious-prefix regex eval post-canonicalization in trigger-phrase-sanitizer + shared-provenance

**HP3 — Expand confusable coverage:**
- Add Greek-omicron + adjacent high-risk lookalikes to fold table in shared utility
- RT5 `ignοre previous` test now blocked

**HP4 — Semantic recovered-payload contract:**
- Add semantic gate in `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` payload validation
- Wire gate into `claude/session-prime.ts`, `gemini/session-prime.ts`, `copilot/session-prime.ts`
- Implement quarantine path for suspicious payloads

**HP5 — Provenance contract enforcement:**
- Add provenance metadata + sanitizer-version fingerprint to compact-cache writers + readers

**HP6 — Shared adversarial round-trip corpus:**
- Create `.opencode/skill/system-spec-kit/mcp_server/tests/security/adversarial-unicode.vitest.ts` with RT1-RT10 + derived variants
- Run corpus through 4 surfaces: Gate 3, shared-provenance, trigger-phrase, hook-state
- Capture runtime fingerprint (Node, ICU, Unicode) in test output

## CONSTRAINTS

- Run tests after each HP: `cd .opencode/skill/system-spec-kit && npm test`
- Self-correct up to 3 attempts on failure, then HALT
- Mark `tasks.md` items `[x]` with evidence
- Update checklist.md + implementation-summary.md
- DO NOT git commit or git push (orchestrator commits at end)

## OUTPUT EXPECTATION

Tests green, spec docs updated, changes in working tree.
