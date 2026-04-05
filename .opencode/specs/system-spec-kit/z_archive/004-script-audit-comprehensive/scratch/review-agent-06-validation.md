# Review: Agent 06 — Validation/Quality Scripts

## Reliability Score: 77/100

**Rationale:** The context report (`context-agent-06-validation-quality.md`, 673 lines) presents 9 structured findings with file:line citations against the validation shell scripts. The build verification (`build-agent-06-validation-verify.md`, 102 lines) cross-checked all 9 against current source and confirmed only 2 as reported (C06-02, C06-04), 1 partially (C06-01 — risk shape changed from false-pass to false-fail), and found 6 stale/inaccurate/design-choice (C06-03, C06-05–C06-09). The context report's 3-CRITICAL executive summary is therefore inflated: only C06-02 is a confirmed validation bypass at the originally reported severity. Evidence quality is HIGH for confirmed findings; the build agent's citation-backed triage is rigorous. Score deducted primarily for the 67% non-confirmation rate on the context report's findings, which undermines trust in the audit's severity framing.

---

## P0 — BLOCKER (0)

No P0 blockers. The originally reported CRITICALs were either confirmed at lower severity or not confirmed by verification.

---

## P1 — REQUIRED (2)

### C06-02: Zero-file anchor validation false pass (CONFIRMED)

- **Source:** `build-agent-06-validation-verify.md` lines 17–23; `context-agent-06-validation-quality.md` lines 123–174
- **Evidence:**
  - `check-anchors.sh:28` scopes validation exclusively to `memory/*.md`.
  - `check-anchors.sh:45-48` returns `RULE_STATUS="pass"` when memory directory has zero files.
- **Impact:** Anchor format issues in `spec.md`, `plan.md`, or `decision-record.md` are invisible to the validation suite. A spec folder with broken anchors outside `memory/` silently passes. This is a real false-pass blind spot.
- **Severity justification:** Validation bypass with user-visible consequence (broken anchors ship undetected) — P1. Downgraded from context report's CRITICAL because the blast radius is limited to non-memory markdown files and does not cause data loss or security exposure.

### C06-04: Case-insensitive + non-exact section matching (CONFIRMED)

- **Source:** `build-agent-06-validation-verify.md` lines 25–31; `context-agent-06-validation-quality.md` lines 244–279
- **Evidence:**
  - `check-sections.sh:60` uses `grep -qi "$section"` — both case-insensitive (`-i`) and substring-matching (no anchored boundary).
  - `## problem statement` passes when `Problem Statement` is required.
  - Substring risk: `## Problem Statement Extended` would also match `Problem Statement`.
- **Impact:** Inconsistent header capitalization passes validation; substring false positives can mask missing sections. Documentation quality degrades silently.
- **Severity justification:** Quality enforcement gap, not a security or data-loss risk — P1.

---

## P2 — SUGGESTION (3)

### C06-01: Backtick placeholder handling is brittle (PARTIALLY CONFIRMED — risk shape changed)

- **Source:** `build-agent-06-validation-verify.md` lines 33–39; `context-agent-06-validation-quality.md` lines 69–119
- **Evidence:** `check-placeholders.sh:89-91` uses literal `grep -v` filters for backtick-brace patterns. The context report claimed a false-pass bypass; the build verification found the actual risk is inconsistent detection (false-fail potential, not false-pass).
- **Impact:** Edge-case inconsistency in placeholder detection. Not a validation bypass, but brittleness that could cause spurious failures or missed variants.
- **Severity justification:** Reduced from CRITICAL to P2 — risk shape changed per verification; inconsistency rather than bypass.

### Context report accuracy: 6/9 findings stale or unconfirmed

- **Source:** `build-agent-06-validation-verify.md` lines 41–95
- **Evidence:**
  - C06-03 (severity/status misalignment): Current orchestrator uses `RULE_STATUS` metadata, not shell exit codes — finding is stale.
  - C06-05 (Level 1 fallback): `check-files.sh:41` hard-fails on missing `spec.md` — mitigated in full validation path.
  - C06-06 (whitespace acceptance): Permissive by design for markdown indentation — not a defect.
  - C06-07 (awk portability): Simple toggle logic is portable — not confirmed.
  - C06-08 (realpath fallback): Current code does not use the reported pattern — not confirmed.
  - C06-09 (check-files regex): Uses direct `-f` checks, not regex — disproven.
- **Impact:** The context report's executive summary ("3 CRITICAL, 68% compliance") creates a misleading urgency profile. Anyone acting on the report without the build verification would over-prioritize non-issues.
- **Severity justification:** P2 — documentation quality issue; the build verification correctly resolves the discrepancies.

### Remediation roadmap should be reconciled with verification

- **Source:** `context-agent-06-validation-quality.md` lines 579–640
- **Evidence:** The 4-phase roadmap includes actions for all 9 findings. Phase 1 targets C06-01/C06-02/C06-03, but C06-03 is stale and C06-01's risk shape changed. Phases 2–3 include 4 unconfirmed items.
- **Impact:** Following the roadmap as-written wastes effort on non-issues and applies wrong fixes for C06-01.
- **Severity justification:** P2 — actionability improvement.

---

## Top Recommended Actions

1. **Fix C06-02 anchor scope** — Expand `check-anchors.sh` to validate anchor format in all `*.md` files (excluding `scratch/`), not just `memory/*.md`. This is the highest-confirmed-severity finding.
2. **Fix C06-04 section matching** — Replace `grep -qi` with `grep -q` (case-sensitive) and add word-boundary or exact-line matching (`^## ${section}$`) in `check-sections.sh:60` to prevent substring false positives.
3. **Reconcile context report with build verification** — Mark stale/unconfirmed findings (C06-03, C06-05–C06-09) with verification status annotations and revise the executive summary to reflect 2 confirmed + 1 partial finding. Update the remediation roadmap to focus only on confirmed issues.
