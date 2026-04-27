---
_memory:
  continuity:
    next_safe_action: "Iteration 002 should stay on 010/002 and stress diff-parser/path canonicalization with mixed old/new paths, control characters, and platform path separators."
---
# Iteration 001 — 010/001 + 010/002 review

**Focus:** Review 010/001 clean-room posture and 010/002 phase-runner plus detect_changes preflight for correctness, security, and adversarial bypasses.
**Iteration:** 1 of 10
**Convergence score:** 0.42

## Findings

### F1: detect_changes only validates one side of a two-path file header
- **Severity:** P1
- **Remediation type:** code-fix
- **Maps to:** RQ3
- **Evidence:**
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:118-124` — comments define diff paths as untrusted and say `../../etc/passwd` or absolute `/etc/passwd` must be refused explicitly.
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:141-156` — `resolveCandidatePath` chooses `newPath` unless it is `/dev/null`; it never validates the unused `oldPath` when the post-image path is present.
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts:185-196` — the path escape test uses escaping old and new paths together, so it does not cover `--- a/../../etc/passwd` paired with `+++ b/src/safe.ts`.
  - **Mismatch / risk:** A reachable adversarial diff can smuggle an out-of-root pre-image header while using an in-root post-image path, and the handler will proceed as if the file section is valid. That is weaker than the stated canonical-root containment invariant.
- **Suggested action:** Validate both `oldPath` and `newPath` independently, ignoring only `/dev/null`, before choosing the attribution path. Add mixed-header tests for escaping old/in-root new and in-root old/escaping new.

### F2: diff paths accept NUL/control characters and platform-surprising separators
- **Severity:** P2
- **Remediation type:** code-fix
- **Maps to:** RQ3
- **Evidence:**
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:143-156` — path validation normalizes and checks containment, but has no allowlist for NUL bytes, newlines, other control characters, or ambiguous separator forms.
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:171-182` — header paths are trimmed and stored as-is after git prefix stripping; no path-character validation occurs in the parser.
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts:175-230` — adversarial path tests cover `../../`, an `a/etc/passwd` case, and a legitimate path; no NUL/control/backslash cases are asserted.
  - **Mismatch / risk:** A fresh graph can return `status: "ok"` with `affectedFiles` containing control characters or NUL-embedded names. This does not escape the workspace by itself, but it is below the hardening standard implied by the untrusted-input comments and the prompt's adversarial path list.
- **Suggested action:** Add a small `isSafeDiffPathSegment` allowlist for printable, slash-separated git paths; reject NUL, C0 controls, DEL, and platform separator ambiguity with `status: "parse_error"`.

### F3: runPhases has no runtime guard for empty or non-string output keys
- **Severity:** P2
- **Remediation type:** code-fix
- **Maps to:** RQ3
- **Evidence:**
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:31-35` — TypeScript declares `name`, `inputs`, and `output` as strings, but this is erased at runtime.
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:69-71` — `outputKey` returns `phase.output ?? phase.name` without checking type, emptiness, or control characters.
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:103-115` — duplicate-output validation compares whatever key is returned, but does not reject `""` or non-string values supplied through untyped JavaScript or casts.
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:233-235` — the final output map is written with `outputs[outputKey(phase)]`, so malformed keys can become empty properties, coerced object keys, or symbol-keyed properties depending on the runtime value.
  - **Mismatch / risk:** The shipped `buildIndexPhases()` call site uses safe literal names, but the exported runner is not fail-closed for adversarial phase definitions.
- **Suggested action:** Add runtime validation that phase names, inputs, and output keys are non-empty strings matching the same grammar. Throw `PhaseRunnerError` before DAG construction.

### F4: duplicate output-key behavior is implemented but not regression-tested
- **Severity:** P2
- **Remediation type:** test-add
- **Maps to:** RQ5
- **Evidence:**
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:97-115` — duplicate published output keys are rejected with `PhaseRunnerError('duplicate-output')`.
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:117-134` — an output key colliding with a different phase name is also rejected.
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/phase-runner.test.ts:38-54` — duplicate phase names are tested.
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/phase-runner.test.ts:98-105` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/phase-runner.test.ts:172-180` — custom output keys are tested only on the accepted path.
  - **Mismatch / risk:** 010/007/T-D/R-007-P2-1 is closed in code, but the claimed test surface does not pin the new rejection modes.
- **Suggested action:** Add tests for two phases publishing the same custom output key and for `phase.output` colliding with another phase's `name`.

### F5: 010/001 license docs still carry stale quote-era claims after the scrub decision
- **Severity:** P2
- **Remediation type:** doc-fix
- **Maps to:** RQ4
- **Evidence:**
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/007-review-remediation/spec.md:95` — remediation says the LICENSE verbatim quote is resolved because the External Project name was scrubbed and no quote is needed.
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/001-clean-room-license-audit/spec.md:85-88` — the original sub-phase spec still requires reading and quoting `external/LICENSE` in full.
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/001-clean-room-license-audit/decision-record.md:45-85` — the ADR still labels a canonical PolyForm block as verbatim and includes the example Yoyodyne notice, while the actual baseline license has a real Required Notice.
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-external-project/external/LICENSE:17-22` — the actual license notice line names the upstream project owner.
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/001-clean-room-license-audit/implementation-summary.md:46-48` — the implementation summary adds a post-scrub caveat that the quote is historical and no longer gating.
  - **Mismatch / risk:** The clean-room posture is defensible if the scrub is the controlling mitigation, but the packet still contains stale "verbatim quote" truth claims that contradict the post-scrub resolution.
- **Suggested action:** Update 010/001 spec/checklist/ADR language to make the scrub-based mitigation authoritative, demote the canonical license block to historical context, and stop calling it an actual-file verbatim quote.

## Negative findings (ruled out)
- Shipped Code Graph code and docs under `.opencode/skill/system-spec-kit/` had zero `GitNexus`, `gitnexus`, or `git-nexus` hits in the scanned paths, so the runtime code scrub looks clean for 010/001.
- Root `LICENSE` is MIT-only at `LICENSE:1-21`; it does not quote or embed the external PolyForm license.
- There is no root-level `external/` directory in the workspace. The external source tree still exists under `.opencode/specs/.../001-research-and-baseline/007-external-project/external/`, which appears to be legitimate research/source evidence rather than shipped runtime code.
- `runPhases` rejects duplicate phase names at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:84-95`.
- `runPhases` rejects duplicate output keys and output-name collisions at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:97-134`.
- The topological sort detects cycles by comparing emitted order length to phase count and reporting stuck phases at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/phase-runner.ts:184-193`; direct and indirect cycle tests exist at `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/phase-runner.test.ts:73-96`.
- `indexFiles()` wraps `runPhases` in `try/catch`; the catch path records `spec_kit.graph.scan_duration_ms` with `outcome: "error"` before rethrowing at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1517-1547`.
- `detect_changes` probes readiness before diff parsing or DB lookup at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:193-226`, passes `allowInlineIndex: false` and `allowInlineFullScan: false` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:201-204`, and blocks every non-`fresh` state at `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:104-106` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:207-212`.
- Stale, empty, and error readiness states are covered by tests at `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts:56-132`.
- The diff parser tracks `remainingOldLines` and `remainingNewLines` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:123-130` and reprocesses out-of-budget lines at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/diff-parser.ts:215-221`, preventing the next file header from being eaten as hunk body. A multi-file boundary test exists at `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts:360-378`.
- Normal `../../` containment is rejected for both-header escapes by `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:143-156`, with a test at `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts:185-196`.
- Symlink escape through normal recursive scanning looks bounded: `findFiles()` only descends `entry.isDirectory()` and indexes `entry.isFile()` from `readdirSync(..., { withFileTypes: true })` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1248-1287`; `collectSpecificFiles()` canonicalizes realpaths and drops paths outside the root at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1294-1305`.

## RQ coverage this iteration
- RQ1: partial
- RQ2: partial
- RQ3: covered
- RQ4: partial
- RQ5: partial

## Next iteration recommendation
Iteration 002 should continue on 010/002 with executable adversarial tests for mixed old/new diff path escapes, NUL/control characters, Windows-style separators, `/dev/null` combinations, and multi-file hunk boundaries. It should also decide whether path validation belongs in `diff-parser.ts` or only in `detect-changes.ts`.
