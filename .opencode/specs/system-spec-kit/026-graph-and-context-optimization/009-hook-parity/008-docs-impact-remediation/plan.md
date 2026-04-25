---
title: "Implementat [system-spec-kit/026-graph-and-context-optimization/009-hook-parity/008-docs-impact-remediation/plan]"
description: "Phased plan to update 13 flagged documentation files in priority order. Canonical hook/runtime docs first, then package-level READMEs and supporting docs."
trigger_phrases:
  - "docs impact remediation plan"
  - "026/009/012 plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-parity/008-docs-impact-remediation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Documentation Impact Remediation for 009 Hook/Daemon Parity

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. APPROACH

Documentation-only phase. No code changes, no test harness, no schema migrations. Every edit must cite its driving sub-packet(s) from `../impact-analysis/merged-impact-report.md`. The merged report is the single source of truth for scope, severity, and flagging rationale — do not re-analyze sub-packets independently.

### Guiding Principles

1. **Truth over style.** A doc is updated only to the extent it is currently wrong or incomplete relative to shipped 009 behavior. Cosmetic polish is out of scope.
2. **Evidence preserved.** Every change carries a pointer back to the flagging sub-packet (e.g. `[009/001]`) in commit messages or inline change notes.
3. **Canonical-surface first.** `hook_system.md`, `SKILL.md`, `ARCHITECTURE.md`, and top-level `AGENTS.md` are consumed by operator docs downstream. Update them first so per-package READMEs can cross-link to fresh text.
4. **No scope creep.** If a file is accurate but could be improved, skip it. The impact analysis did not flag it — trust the analysis.
5. **Reconcile Codex carefully.** Sub-packets diverge on whether Codex has a native lifecycle hook: 03 and 04 predate the native-SessionStart reconciliation landed in 05. `hook_system.md` and `SKILL.md` must describe the *post-05* state (native `SessionStart` gated by `codex_hooks` + `~/.codex/hooks.json`). Earlier packet summaries that still say "Codex has no lifecycle hook" are superseded.

---

## 2. PHASES

### Phase 1 — Canonical Runtime Contracts (P0, sequential)

Goal: make the upstream truth documents correct before any package/README touches them.

1. **`references/config/hook_system.md`** (6 agents flagged — highest hotspot)
   - Rewrite runtime matrix: add Claude `UserPromptSubmit`, update Codex row to native `SessionStart` + prompt hook gated by `codex_hooks`, describe OpenCode prompt-hook availability via the skill-advisor plugin + `experimental.chat.system.transform`, document Copilot file-based parity via `.claude/settings.local.json` top-level wrapper fields.
   - Update cross-runtime fallback prose to match.
   - Add or refresh the four-event `.claude/settings.local.json` example.

2. **`AGENTS.md`** (repo root)
   - Gate 2 rule: hook brief primary, `skill_advisor.py` fallback, cite hook reference.
   - Runtime notes: Codex supports native `SessionStart` when `codex_hooks=true` and `~/.codex/hooks.json` wired.
   - `sk-code-opencode` language table: note OpenCode plugin ESM exemption so `.opencode/plugins/` and `.opencode/plugin-helpers/` are excluded from the blanket `require`/`module.exports` rule.

3. **`.opencode/skill/system-spec-kit/SKILL.md`**
   - Startup/recovery section: split prompt-hook vs lifecycle-hook per runtime.
   - Claude hook table: add `UserPromptSubmit` and clarify normalized four-event shape.
   - Codex: describe native `SessionStart` + prompt hook when enabled, with `/spec_kit:resume` as fallback (post-05 state).
   - Copilot: reference `.claude/settings.local.json` wrapper surface and writer wiring.

4. **`.opencode/skill/system-spec-kit/ARCHITECTURE.md`**
   - Copilot hook transport: describe `user-prompt-submit.ts`, `session-prime.ts`, `custom-instructions.ts` writing to `$HOME/.copilot/copilot-instructions.md`; hook stdout stays `{}`.
   - OpenCode plugin bridge: describe ESM default-export entrypoint (`spec-kit-skill-advisor.js`), per-instance state isolation, in-flight identical-request dedup, cap/eviction semantics.

### Phase 2 — Package-Level READMEs (P0, can parallelize)

5. **`.opencode/README.md`** — Gate 2 prose, directory-structure pointers, advisor path corrected to `mcp_server/skill-advisor/`.

6. **`.opencode/skill/system-spec-kit/README.md`** — hook-primary skill-advisor routing, `scripts/` ESM module profile (sub-packet 02's validator ESM flip), Copilot runtime-hooks summary, prompt-vs-lifecycle split.

7. **`.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md`** (and any sibling runtime hook READMEs whose Copilot examples are stale) — replace `.github/hooks/scripts/*.sh` registration example with `.claude/settings.local.json` wrapper contract; clarify Claude nested commands remain alongside top-level Copilot fields.

### Phase 3 — Install / Reference / Supporting Docs (P0 + P1)

8. **`.opencode/install_guides/SET-UP - AGENTS.md`** — Gate 2 hook-first path, script fallback, native-tool/bootstrap verification, `--force-native` / `--force-local` / disable-flag notes.

9. **`.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`** — add `advisor_recommend` / `advisor_status` / `advisor_validate` to verification; Copilot row → merged `.claude/settings.local.json` wrapper execution + top-level field contract + writer wiring.

10. **`feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md`** — Copilot fallback entry named and describes top-level writer commands on `UserPromptSubmit` + `SessionStart`.

### Phase 4 — MED Surfaces (P1, last)

11. **`manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md`** — Copilot scenario expanded to inspect `.claude/settings.local.json` top-level fields/commands and smoke managed-block refresh.

12. **`.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`** — add `SPECKIT_CODEX_HOOK_TIMEOUT_MS` entry.

13. **`.opencode/skill/system-spec-kit/mcp_server/README.md`** — short hook-surface summary + cross-links.

---

## 3. DEPENDENCIES

- **Upstream:** All 11 sibling sub-packets (001-011) implementation complete. Verified by merged impact report generation time (2026-04-23).
- **Downstream:** None within this packet. External dependants (operator runbooks, onboarding guides) are out of scope.
- **Parallel tracks:** Phase 2 files can be edited in parallel once Phase 1 lands, because they cross-link to Phase 1 text.

---

## 4. VERIFICATION STRATEGY

1. **Per-file:** After each edit, verify the change addresses the specific reason recorded in the merged report for that path (not a related-but-different observation).
2. **Cross-runtime consistency:** `hook_system.md`, `SKILL.md`, `ARCHITECTURE.md`, `AGENTS.md` must agree on the post-05 Codex capability, the four-event Claude shape, the OpenCode plugin bridge transport, and the Copilot wrapper surface. Read them end-to-end before claiming Phase 1 done.
3. **No stale references:**
   - `grep -rn "skill_advisor.py" .opencode/README.md .opencode/skill/system-spec-kit/README.md AGENTS.md` should show only *fallback* references, never primary.
   - `grep -rn ".github/hooks/scripts" .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md` should be empty.
   - `grep -rn "CommonJS entrypoint.*plugin" .opencode/skill/system-spec-kit/ARCHITECTURE.md` should be empty.
4. **Validator:** `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/008-docs-impact-remediation/ --strict` must exit 0 or 1.
5. **Parent graph metadata:** 009's `graph-metadata.json` must list 012 in `children_ids` after implementation.

---

## 5. EFFORT ESTIMATE

- Phase 1 (4 files): ~120–180 LOC of edits. Mostly structural rewrites of small sections (matrix rows, startup paragraphs).
- Phase 2 (3 files): ~60–100 LOC. Mostly prose + code-block example swaps.
- Phase 3 (3 files): ~40–80 LOC. Verification-step additions + row updates.
- Phase 4 (3 files): ~20–50 LOC. Additive only.

**Total estimate:** ~240–410 LOC. Level 2 sizing (100-499).

---

## 6. NON-FUNCTIONAL REQUIREMENTS

- **Reviewability:** Every change must map 1:1 to a row in the merged impact report so reviewers can cross-check without re-running the 10 agents.
- **Idempotence:** Edits should be safe to re-apply if a sub-packet reverts. No destructive deletes of content unrelated to the flagged reason.
- **Anchor stability:** Do not rename or remove existing section anchors in the canonical docs; downstream tooling (memory indexer, validator) relies on stable anchors.

---

## 7. EDGE CASES

- **Codex hook reconciliation conflict.** Sub-packets 03/04 say "Codex has no lifecycle hook"; sub-packet 05 ships native `SessionStart` parity. Resolution: document *post-05* state; earlier packet summaries remain in their own `implementation-summary.md` but do not leak into the canonical docs. Cross-check §2 Phase 1 tasks.
- **Glob paths in impact report.** `feature_catalog/**`, `mcp_server/**/README.md`, and `manual_testing_playbook/**/*.md` resolve to specific target files identified in the underlying sub-packet reports; see merged report `Contributing Reasons` column for exact target names. Do not expand the glob literally — only touch the named targets.
- **Duplicate reasons.** Some files were flagged by multiple sub-packets with partially overlapping reasons (e.g. `hook_system.md` by 6 sub-packets). Merge all reasons into one coherent rewrite; do not apply sequential edits that leave the doc inconsistent mid-phase.
