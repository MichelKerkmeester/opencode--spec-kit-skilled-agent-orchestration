---
# SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2
title: "Implementation Summary: cli-copilot Dispatch Test Parity"
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
description: "Updates mcp_server/tests/deep-loop/cli-matrix.vitest.ts so the cli-copilot section models buildCopilotPromptArg's built.argv + promptFileBody shape (the contract packet 012 actually ships) instead of the legacy resolveCopilotPromptArg / -p \"$(cat ...)\" form. Closes F-004 P2 from the 011 deep-review and satisfies the §7 Packet B PASS gate. Test-only — no production code touched."
trigger_phrases:
  - "017 implementation summary"
  - "cli-copilot dispatch test parity summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/017-cli-copilot-dispatch-test-parity"
    last_updated_at: "2026-04-27T18:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Rewrote cli-matrix cli-copilot section + smoke test; authored packet docs"
    next_safe_action: "Operator review; commit packet alongside the test rewrite"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: null
      session_id: "017-cli-copilot-dispatch-test-parity-impl-2026-04-27"
      parent_session_id: "011-mcp-runtime-stress-remediation-deep-review-2026-04-27"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Test-only scope confirmed: production buildCopilotPromptArg + YAML wire-ins unchanged"
      - "Branches covered: kind:'approved' small + large; kind:'missing'+writeIntent:false; kind:'missing'+writeIntent:true; YAML write-then-dispatch ordering"
      - "Smoke test now models the approved-large-prompt happy path (with promptFileBody written to disk before dispatch)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

# Implementation Summary: cli-copilot Dispatch Test Parity

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-cli-copilot-dispatch-test-parity |
| **Completed** | 2026-04-27 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 011 deep-review's F-004 [P2] flagged that `mcp_server/tests/deep-loop/cli-matrix.vitest.ts` claimed to mirror the YAML cli-copilot dispatch shape but actually still asserted the legacy `resolveCopilotPromptArg` command-string form (`-p "$(cat ...)"` and `Read the instructions in @path`). Packet 026/011/012 had already moved the production dispatch onto `buildCopilotPromptArg` returning a typed `{ argv, promptBody, promptFileBody?, enforcedPlanOnly }` and onto a YAML flow that writes `built.promptFileBody` to disk before invoking copilot. The legacy test passed today because `resolveCopilotPromptArg` is still exported, but a future refactor of the helper's argv layout, preamble emission, or `promptFileBody` discriminator would silently break the dispatch contract without failing this test.

This packet closes that gap. It rewrites the cli-copilot section of the test to exercise `buildCopilotPromptArg` directly across all three `targetAuthority` branches, asserts `built.promptFileBody` is set on the approved-large-prompt path, and adds a static-grep ordering check on both `_auto.yaml` files to pin the write-then-dispatch invariant. Production code is unchanged.

### New describe block: `cli-matrix cli-copilot dispatch shape (buildCopilotPromptArg)`

Five test cases cover the full contract:

1. **`kind:"approved"` + small prompt** — argv carries the preamble inline at `argv[1]`; `promptFileBody` is undefined; `--allow-all-tools` retained.
2. **`kind:"approved"` + large prompt** — `argv[1]` is the bare `@PROMPT_PATH` reference (NOT the legacy `Read the instructions in @path` wrapper); `promptFileBody` is defined and ordered preamble → divider → original body.
3. **`kind:"missing"+writeIntent:false`** — argv prompt slot equals the raw prompt; no preamble; no `promptFileBody`; `--allow-all-tools` retained; argv length unchanged.
4. **`kind:"missing"+writeIntent:true`** — argv prompt slot becomes the Gate-3 question; `--allow-all-tools` stripped; `enforcedPlanOnly === true`; argv length shrinks by 1; original write-intent prompt absent from rendered body.
5. **YAML auto-loop sites write `built.promptFileBody` before invoking copilot** — for both `spec_kit_deep-research_auto.yaml` and `spec_kit_deep-review_auto.yaml`: `if (built.promptFileBody !== undefined)` and `writeFileSync(promptPath, built.promptFileBody, ...)` are present, AND a copilot dispatch (`spawnSync('copilot'` for deep-review or `command: 'copilot'` for deep-research) appears at a later byte offset.

### Smoke test rewrite

The `cli-matrix smoke coverage` block's "exercises the large-prompt ... with a real subprocess" case now models the approved-authority happy path end-to-end:

1. Call `buildCopilotPromptArg({ ..., targetAuthority: { kind: 'approved', specFolder: APPROVED_FOLDER } })`.
2. Assert `built.promptFileBody` is defined and `built.argv[1] === \`@${promptPath}\``.
3. Write `built.promptFileBody` to `promptPath` (modeling the YAML's writeFileSync step).
4. Dispatch a Node subprocess via `runAuditedExecutorCommand` with `built.argv[1]` as the prompt slot.
5. Subprocess reads `promptPath` and confirms it opens with `## TARGET AUTHORITY` followed by `Approved spec folder: <APPROVED_FOLDER>` followed by the original prompt body.
6. Outer test re-reads the file the subprocess wrote back and re-confirms the preamble + folder + body invariant.

### `buildDispatchCommand` cli-copilot branch fails loud

The shared helper's `cli-copilot` switch case now throws:

```
buildDispatchCommand does not model cli-copilot. Use buildCopilotPromptArg + the dedicated describe block in this file.
```

This is anti-regression dead code. If a future test adds a `cli-copilot` case to the dispatch-shape block by accident, it fails loud immediately instead of silently asserting an obsolete shape.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts` | Modified | Rewrite cli-copilot dispatch tests + smoke test against `buildCopilotPromptArg`; ~+150 / -55 LOC |
| `.opencode/specs/.../017-cli-copilot-dispatch-test-parity/{spec,plan,tasks,checklist,implementation-summary}.md` | Created | Standard Level 1 packet docs |
| `.opencode/specs/.../017-cli-copilot-dispatch-test-parity/{description,graph-metadata}.json` | Created | Required spec metadata |

Production code is byte-stable: `executor-config.ts`, `spec_kit_deep-research_auto.yaml`, and `spec_kit_deep-review_auto.yaml` are NOT in the diff.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The rewrite landed in a single test-file edit. Pre-rewrite baseline was 11/11 cli-matrix tests passing; post-rewrite is 13/13 (3 cli-copilot dispatch tests dropped, 5 new ones added; smoke test rewritten in place).

The static-grep ordering test required one design fix during implementation. The initial regex anchored on `runAuditedExecutorCommand\s*\(\s*\{[\s\S]*?command:\s*'copilot'` matched the FIRST `runAuditedExecutorCommand` call frame in `spec_kit_deep-research_auto.yaml` (line 568, the `if_native` block), not the cli-copilot one (line 651). The non-greedy match still resolved to the right `command: 'copilot'` literal, but the match's start byte-offset was earlier than the writeFileSync. Fix: anchor on the literal `command: 'copilot'` line (which only appears inside the cli-copilot block) for deep-research, and `spawnSync('copilot'` for deep-review.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Throw in `buildDispatchCommand`'s cli-copilot branch instead of mirroring the new shape | The dispatch-shape helper builds command STRINGS for non-cli-copilot kinds. cli-copilot's contract is now an argv array + optional `promptFileBody`, which doesn't fit a string-based helper. Forcing all cli-copilot tests through the dedicated `buildCopilotPromptArg` helper keeps a single source of truth and prevents future drift. |
| Static-grep both YAML files for write-then-dispatch ordering instead of parsing the YAML | The contract is a single byte-offset invariant ("writeFileSync before copilot dispatch"). YAML parsing + AST walking would be over-engineered for one assertion. Loose-whitespace regexes catch the discriminator + writeFileSync independently; byte-offset compare pins the ordering. |
| Anchor the deep-research dispatch-index lookup on `command: 'copilot'` literal | The file has multiple `runAuditedExecutorCommand({...})` call frames (one per executor kind). A non-greedy regex from the first call frame matches the right `command: 'copilot'` literal but reports its start at the wrong frame. The literal-line anchor is unambiguous because only the cli-copilot block contains it. |
| Update the smoke test to the approved-authority + large-prompt path (not read-only) | Approved authority is the YAML's primary happy path. Read-only behavior is already covered by the dispatch-shape `kind:"missing"+writeIntent:false` case. Smoke testing the rarer path would not exercise the `promptFileBody` write-then-dispatch dance, which is the whole point of the rewrite. |
| Keep production code byte-stable (executor-config.ts + both _auto.yaml) | F-004 is a P2 test-shape issue, not a production bug. Touching production would expand blast radius and conflate test hardening with helper changes. The directive explicitly forbids production edits. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Updated cli-matrix vitest (`tests/deep-loop/cli-matrix.vitest.ts`) | PASS — Tests 13 passed (13); exit 0; 1.22s |
| Full deep-loop suite (`tests/deep-loop/`) | PASS — Tests 73 passed (73); 6 test files pass; exit 0; 1.70s |
| 012 helper test suite (`tests/executor-config-copilot-target-authority.vitest.ts`) | PASS — Tests 29 passed (29); exit 0; 122ms |
| Legacy `resolveCopilotPromptArg` reference removed from cli-matrix imports | PASS — `grep` confirms 0 hits in import lists |
| Legacy `-p "$(cat ...)"` and `Read the instructions in @path` strings removed from test bodies | PASS — `grep` confirms 0 hits in describe-block bodies (one comment in `buildDispatchCommand` describes the historical context but does not assert) |
| `buildCopilotPromptArg` exercised directly in test bodies | PASS — `grep` returns 5+ hits (1 import + 4+ helper invocations) |
| YAML write-then-dispatch ordering pinned for both `_auto.yaml` files | PASS — vitest case asserts `writeIdx >= 0`, `dispatchIdx > writeIdx`, on both files |
| Production code byte-stable | PASS — `git status` shows only `cli-matrix.vitest.ts` and packet docs in the diff |
| `validate.sh --strict` on packet | PASS (structural) — see Phase 3 verification table; SPEC_DOC_INTEGRITY false-positives accepted as known noise |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live-dispatch verification deferred.** The vitest exercises `buildCopilotPromptArg` directly and statically greps the YAML for the write-then-dispatch ordering. End-to-end live verification (Copilot actually receiving a file that opens with the TARGET AUTHORITY block) is gated by the next deep-research or deep-review run that exercises cli-copilot. Tracked as a P2 item in `checklist.md` and as a deferred follow-up at the 011 phase-parent level.
2. **Static-grep regex is whitespace-tolerant but not formatter-immune.** If a future YAML formatter mangles `if (built.promptFileBody !== undefined)` into a multi-line shape with comments interleaved, the regex could miss it. The fix would be a 5-minute regex tweak. The current shape is stable in both `_auto.yaml` files and the directive's "test-only" scope forbids modifying YAML to make the test more resilient.
3. **Sibling packets 016 + 018 are independent.** This packet does not unblock the 011 deep-review's CONDITIONAL → PASS conversion on its own. Packet 016 (degraded-readiness envelope parity) is the P1 required gate. Packet 017 (this one) and Packet 018 (catalog/playbook degraded alignment) are P2 follow-ups. Each packet ships independently and the 011 PASS gate flips only after Packet A lands.
4. **`buildDispatchCommand` cli-copilot branch is dead code.** No test invokes it. It exists as fail-loud anti-regression; if a future test forgets to use `buildCopilotPromptArg`, the throw signals immediately. Not directly tested because invoking the function with `kind:"cli-copilot"` would intentionally fail — that's the design.
<!-- /ANCHOR:limitations -->

---

### Next Steps

1. **Operator review** of test rewrite + packet docs. Tracked as T301 in `tasks.md`.
2. **Commit packet + test changes** as a single atomic change. Parent session handles git per the user's directive ("Do NOT commit").
3. **Sibling packets** ship independently:
   - Packet 016 (Degraded-readiness envelope parity, P1 required)
   - Packet 018 (Catalog/playbook degraded alignment, P2 docs)
4. **Live cli-copilot dispatch verification** on the next deep-research or deep-review run. Tracked as a P2 item in `checklist.md` (same item that 012 deferred).
