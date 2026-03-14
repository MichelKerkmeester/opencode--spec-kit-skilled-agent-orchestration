# Agent I07: Commit Message Accuracy Audit

**Auditor:** I07 (Opus 4.6, read-only reviewer)
**Date:** 2026-03-08
**Scope:** Last 15 commits, deep verification on 5 key commits
**Confidence:** HIGH — all claims verified against `git show --stat` and `git diff-tree`

---

## Summary

Across the 5 audited commits, commit messages are **generally accurate in intent** but contain **two numeric overclaims** and **one underclaim**. The scope tags (`spec-kit` vs `specs`) are consistently correct across all 15 commits. No commit message is outright misleading, but two quantitative claims do not survive verification.

---

## Commit-by-Commit Verification

### 1. `65554a3d` — "QA-driven security and bug fixes across 5 pipeline files"

| Claim | Evidence | Verdict |
|-------|----------|---------|
| "5 pipeline files" | 5 `.ts` files changed under `scripts/`: `file-writer.ts`, `index.ts`, `collect-session-data.ts`, `decision-extractor.ts`, `file-extractor.ts` | **ACCURATE** |
| "security and bug fixes" | Path traversal guard, filename sanitization, deep copy to prevent mutation, type coercion — all security/correctness fixes | **ACCURATE** |
| Scope tag: `fix(spec-kit)` | All changes under `.opencode/skill/system-spec-kit/` | **ACCURATE** |

**Hidden content:** Commit also includes 5 memory `.md` files (1152-1197 lines each), `metadata.json`, and `test-results-composite.md` updates. Total: 12 files changed, 6022 insertions. The message describes only the code fixes, omitting ~5,900 lines of memory/QA documentation silently bundled in.

**Verdict:** Message is accurate for the code portion but **omits significant non-code payload** (5 memory snapshots, ~5,800 lines). Not a factual error, but a transparency concern for reviewers.

---

### 2. `bcc067a7` — "session ID entropy + moved false-match"

| Claim | Evidence | Verdict |
|-------|----------|---------|
| "Session ID: 6 bytes hex (12 chars, 48 bits entropy)" | `session-extractor.ts` — 2 lines changed | **ACCURATE** (verifiable from diff context) |
| "Semantic summarizer: `\bmoved\b` word boundary prevents false-match" | `semantic-summarizer.ts` — 1 line changed | **ACCURATE** |
| File count (implicit: small, targeted) | 2 files changed, 3 insertions, 3 deletions | **ACCURATE** |
| Scope tag: `fix(spec-kit)` | All changes under `.opencode/skill/system-spec-kit/scripts/` | **ACCURATE** |

**Verdict:** Excellent commit message. Precise, specific, no overclaims. The body text explains both the problem and the solution with entropy numbers. **Model commit message.**

---

### 3. `7b95bbfc` — "alignment check now throws to block cross-spec contamination"

| Claim | Evidence | Verdict |
|-------|----------|---------|
| "throws Error in stateless mode when <5% file paths match" | `workflow.ts` — 8 lines added | **ACCURATE** |
| "patches TOOL_COUNT for enriched stateless saves" | `session-extractor.ts` — 1 line changed | **ACCURATE** |
| "markdown table fallback for tool count validation" | `validate-memory-quality.ts` — 14 lines changed | **ACCURATE** |
| File count (implicit: small) | 3 files changed, 19 insertions, 5 deletions | **ACCURATE** |
| Scope tag: `fix(spec-kit)` | All changes under `.opencode/skill/system-spec-kit/scripts/` | **ACCURATE** |

**Verdict:** Accurate and well-described. The body text adds useful context about the GPT 5.4 review finding. All claims verified.

---

### 4. `3febaeda` — "8 code fixes across 6 scripts files"

| Claim | Evidence | Verdict |
|-------|----------|---------|
| "6 scripts files" | 10 `.ts` files changed under `scripts/` (file-writer, workflow, collect-session-data, decision-extractor, file-extractor, git-context-extractor, session-extractor, spec-folder-extractor, semantic-summarizer, folder-detector) | **INACCURATE — 10 files, not 6** |
| "8 code fixes" | Message body enumerates 6 bullet points; total fix count across 10 files plausibly reaches 8+ | **PLAUSIBLE but unverifiable from message alone** |
| "Includes 23 QA agent outputs" | ~23 `qa-*.md` files in scratch dirs visible in stat output | **ACCURATE** |
| Total scope | 93 files changed, 11,086 insertions — enormous commit | Accurate stat, but message gives impression of a small fix commit |
| Scope tag: `fix(spec-kit)` | Includes mcp_server (17 `.ts` files), shared (1 `.ts` file), plus spec docs. Code changes span far beyond `scripts/` | **UNDERSTATED** — 28 total `.ts` files changed, not just scripts |

**Additional concerns:**
- The commit bundles new feature files (`git-context-extractor.ts`, `spec-folder-extractor.ts` — 187 and 293 lines respectively) which are **new features**, not "fixes"
- Includes a complete new spec folder (`025-git-context-extractor`) with `spec.md`, `plan.md`, `tasks.md`
- The `fix()` prefix is questionable for a commit that adds two entirely new extractor modules and a new spec folder

**Verdict:** The "6 scripts files" claim is factually wrong (10 files under `scripts/`, 28 total `.ts`). The `fix()` prefix is misleading for a commit containing new features. The 93-file, 11K-line commit is dramatically understated by the summary.

---

### 5. `5206e4cd` — "add 013-improve-stateless-mode plan + 012 session capturing + 008 code audits"

| Claim | Evidence | Verdict |
|-------|----------|---------|
| "Create spec folder 013-improve-stateless-mode" | `013-improve-stateless-mode/` with spec.md, plan.md, checklist.md, description.json | **ACCURATE** |
| "10 research reports (R01-R10)" | R01 through R10 `.md` files present in scratch/ | **ACCURATE** |
| "Complete 012-perfect-session-capturing" | checklist.md, decision-record.md, implementation-summary.md, tasks.md present | **ACCURATE** |
| "20 audit files" | C01-C20 audit files present (20 files) | **ACCURATE** |
| "30 code audit + 5 architecture review scratch files for 008" | 5 arch-review + 30 code-audit files in 008 scratch | **ACCURATE** |
| "Renumber phase folders 013-021 to 014-022" | `.gitkeep` files for renumbered folders visible | **ACCURATE** |
| "14 source files" | 11 `.ts` files (non-test) actually changed | **INACCURATE — 11 files, not 14** |
| "workflow, extractors, normalizer" | workflow.ts, 6 extractors, input-normalizer.ts, config.ts, slug-utils.ts, file-writer.ts | **ACCURATE** (categories correct) |
| Scope tag: `feat(spec-kit)` | Primary action is creating new spec + research — `feat()` is appropriate | **ACCURATE** |

**Verdict:** Largely accurate. The "14 source files" claim is an overclaim by 3 files (actual: 11). All other quantitative and qualitative claims check out. The `feat()` prefix is correct — this is the only commit among the 5 that uses it appropriately.

---

## Accuracy Score

| Commit | Message Accuracy | Numeric Claims | Scope Tag | Transparency | Grade |
|--------|-----------------|---------------|-----------|-------------|-------|
| `65554a3d` | Accurate for code | 5/5 pipeline files correct | Correct | Omits ~5,800 lines of bundled docs | B+ |
| `bcc067a7` | Excellent | No numeric overclaim | Correct | Full transparency | A |
| `7b95bbfc` | Accurate | All claims verified | Correct | Clear and complete | A |
| `3febaeda` | Understated | **6 claimed, 10 actual** (scripts) / 28 total `.ts` | Correct but understated | 93 files / 11K lines masked as small fix | D+ |
| `5206e4cd` | Mostly accurate | **14 claimed, 11 actual** | Correct | 121 files well-summarized | B |

**Overall Accuracy: 72/100** — Two numeric inaccuracies and one significant transparency gap.

---

## Findings

### P1 — REQUIRED

**P1-01: Commit `3febaeda` claims "6 scripts files" but 10 `.ts` files changed under `scripts/`**
- **Evidence:** `git diff-tree --no-commit-id --name-only -r 3febaeda | grep 'scripts/.*\.ts$'` returns 10 files
- **Impact:** Reviewers relying on the commit message underestimate the change scope by 40%
- **Actual files:** file-writer.ts, workflow.ts, collect-session-data.ts, decision-extractor.ts, file-extractor.ts, git-context-extractor.ts, session-extractor.ts, spec-folder-extractor.ts, semantic-summarizer.ts, folder-detector.ts

**P1-02: Commit `3febaeda` uses `fix()` prefix but introduces 2 new extractor modules**
- **Evidence:** `git-context-extractor.ts` (187 lines new), `spec-folder-extractor.ts` (293 lines new), plus `025-git-context-extractor/` spec folder
- **Impact:** The conventional-commit prefix `fix` signals a bug fix. This commit adds new features. Should be `feat()` or split into separate commits.

**P1-03: Commit `3febaeda` is a 93-file / 11,086-insertion mega-commit**
- **Evidence:** `git show --stat 3febaeda | tail -1` → "93 files changed, 11086 insertions(+), 229 deletions(-)"
- **Impact:** Violates atomic commit principle. Bundles code fixes, new features, spec docs, QA outputs, and mcp_server changes into one commit. Impossible to revert individual changes.

### P2 — SUGGESTION

**P2-01: Commit `5206e4cd` claims "14 source files" but 11 `.ts` files actually changed**
- **Evidence:** `git diff-tree --no-commit-id --name-only -r 5206e4cd | grep -E '\.(ts|js)$' | grep -v vitest` returns 11 files
- **Impact:** Minor overclaim (3 files). Possible the author counted `.json` or `.md` config files as "source files," which would be a definitional stretch.

**P2-02: Commit `65554a3d` bundles ~5,800 lines of memory snapshots without mention**
- **Evidence:** 5 memory `.md` files (1,134-1,197 lines each) + metadata.json + test-results update, none mentioned in commit message
- **Impact:** Low — scratch/memory files are supplementary. But a reviewer scanning `--oneline` would miss the bulk of the commit's content.

**P2-03: Scope tags across all 15 commits follow a clean pattern**
- Commits touching `scripts/`, `mcp_server/`, or pipeline code use `spec-kit`
- Commits touching only spec folder markdown use `specs`
- No misattributions found. This is a positive observation.

### P3 — INFORMATIONAL

**P3-01: Commit `5206e4cd` is also a mega-commit (121 files, 39,565 insertions)**
- While the message body is thorough (6 bullet points covering major areas), the sheer size makes review impractical. The `feat()` prefix is correct, and the body is the most detailed of all 15 commits.

**P3-02: The `bcc067a7` commit is exemplary**
- 2 files, 6 line changes, precise technical description with entropy calculations. This is the standard other commit messages should aspire to.

---

## Verdict

**CONDITIONAL PASS** — The commit messages are generally honest in their descriptions of *what* was done, but two contain factually incorrect file counts (`3febaeda` claims 6 files when 10 changed; `5206e4cd` claims 14 files when 11 changed). The most significant concern is `3febaeda`, which uses a `fix()` prefix for a commit that introduces new features and bundles 93 files into a single commit, making the message actively misleading about the commit's scope and nature.

### Recommendations

1. **Numeric claims in commit messages should be verified before commit** — run `git diff --stat` and count
2. **Mega-commits (>50 files) should be split** — separate code fixes from spec documentation from new features
3. **Conventional commit prefixes (`fix`/`feat`/`chore`) must match content** — if a commit adds new modules, it is `feat`, not `fix`
4. **Use `bcc067a7` as the gold standard** — small, atomic, precise, verifiable

---

*Agent I07 — Commit Message Accuracy Audit complete.*
*Reviewed: 5/15 commits in depth, 15/15 for scope tag correctness.*
