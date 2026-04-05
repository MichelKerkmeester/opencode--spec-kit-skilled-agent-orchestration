# Review: C09 Path Assumptions Audit Shard

## Review Summary

- Verdict: PASS_WITH_WARNINGS
- Quality Score: 82
- Confirmed Findings: 4
- Downgraded Findings: 1
- False Positives: 0
- Unverifiable: 7

The C09 context shard is thorough and well-structured, identifying 12 path-related
findings across scripts, MCP server, and test infrastructure. However, B09 build
verification only covered the top 5 findings (C09-001 through C09-005), leaving
C09-006 through C09-012 entirely unverified. Of the 5 verified findings, 4 were
confirmed and 1 (C09-003) was downgraded from CRITICAL to HIGH based on
counter-evidence showing partial mitigation already exists. All cross-platform
claims (Windows, WSL, Git Bash) are theoretical and untested.

---

## Finding-by-Finding Assessment

### C09-001: Fragile Relative Path Depth Assumptions (Hardcoded Traversals)
- Context Claim: Multiple locations use hardcoded 4-5 level `../` traversals for PROJECT_ROOT and DB path resolution; breaks on structure change.
- Build Evidence: CONFIRMED. `config.ts:203` contains `PROJECT_ROOT: path.resolve(..., '..', '..', '..', '..')`. `memory-indexer.ts:19` contains `path.join(__dirname, '../../../mcp_server/database/.db-updated')`.
- Verdict: CONFIRMED
- Severity: P0
- Evidence: `.opencode/skill/system-spec-kit/scripts/core/config.ts:203`, `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:19`
- Notes: Both patterns are structurally fragile. Any directory reorganization would silently break path resolution. This is the highest-impact finding in the shard.

### C09-002: Shell Scripts Use Unresolved CWD Pattern with Symlink Risk
- Context Claim: Shell scripts use `(cd $path && pwd)` pattern without resolving symlinks or handling non-standard CWD. Uses logical path, not physical.
- Build Evidence: CONFIRMED. `common.sh:24` uses `(cd "$script_dir/../../../.." && pwd)` fallback. `archive.sh:23` uses `PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../.." && pwd)"` fallback.
- Verdict: CONFIRMED
- Severity: P0
- Evidence: `.opencode/skill/system-spec-kit/scripts/common.sh:24`, `.opencode/skill/system-spec-kit/scripts/spec/archive.sh:23`
- Notes: Build confirms the non-git fallback path still depends on relative depth and logical `pwd` behavior. The archive.sh traversal is actually 5 levels deep (one more than C09 stated), which makes it even more fragile. The `-P` flag for `pwd` and `readlink -f` fixes are straightforward.

### C09-003: Database Path Validation Missing with Optional Env Var Override
- Context Claim: Database path resolution uses `__dirname`-relative path with optional env var override; neither path validated. No fallback if resolved path is invalid. Rated CRITICAL.
- Build Evidence: PARTIAL. Path fragility exists at `config.ts:31-33` and `vector-index.ts:152`. However, counter-evidence found: `vector-index-impl.ts:792-794` creates missing directories automatically, and `vector-index-impl.ts:797-817` throws explicit DB errors with informative messages.
- Verdict: DOWNGRADED (CRITICAL → HIGH)
- Severity: P1
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:31-33`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:792-817`
- Notes: The context shard's claim of "no validation" and "no fallback mechanism" is partially incorrect. The vector-index-impl does create missing directories and throws explicit errors. The path fragility concern remains valid (hence HIGH), but the CRITICAL framing overstated the risk by not examining the downstream handling code. This is the only severity overclaim in the shard.

### C09-004: Template Directory Resolved via REPO_ROOT + Hardcoded Path
- Context Claim: Template directory path uses `REPO_ROOT` + hardcoded relative path with no existence validation. Fails if skill path structure changes.
- Build Evidence: CONFIRMED. `create.sh:297` hardcodes `TEMPLATES_BASE="$REPO_ROOT/.opencode/skill/system-spec-kit/templates"`. `compose.sh:60` resolves templates via fixed relative traversal.
- Verdict: CONFIRMED
- Severity: P1
- Evidence: `.opencode/skill/system-spec-kit/scripts/spec/create.sh:297`, `.opencode/skill/system-spec-kit/scripts/templates/compose.sh:60`
- Notes: Template discovery is tightly coupled to current repository layout. While the structure is currently stable, any future reorganization of the skill directory would break spec folder creation and template composition simultaneously.

### C09-005: Path Sanitization Allows Hardcoded Base Paths but Uses process.cwd()
- Context Claim: Path sanitization uses `process.cwd()` for validation allow-list. When invoked from non-repo directory, sanitization fails or produces incorrect access control.
- Build Evidence: CONFIRMED. `data-loader.ts:85-87` anchors allow-list to `process.cwd()` and its subpaths.
- Verdict: CONFIRMED
- Severity: P1
- Evidence: `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:85-87`
- Notes: Validation behavior varies by invocation directory. This is a security-adjacent concern since path sanitization effectively becomes CWD-dependent, meaning the same file could be allowed or denied based on where the script was launched from.

### C09-006: process.cwd() Used Directly Without Validation or Fallback
- Context Claim: `process.cwd()` used directly in folder-detector.ts:57 and config.ts:70 without validation or fallback. No warning if CWD is external to project.
- Build Evidence: NOT VERIFIED (outside B09 scope)
- Verdict: UNVERIFIABLE
- Severity: P1 (if confirmed)
- Evidence: Cited `scripts/spec-folder/folder-detector.ts:57`, `mcp_server/core/config.ts:70`
- Notes: Code citations look plausible and the pattern is consistent with confirmed findings. High likelihood of confirmation if build verification is extended.

### C09-007: Config Path Resolved via __dirname + Relative Traverse Without Fallback
- Context Claim: Config path in content-filter.ts:122 resolved via `__dirname` + 3-level relative traverse with no error recovery or fallback.
- Build Evidence: NOT VERIFIED (outside B09 scope)
- Verdict: UNVERIFIABLE
- Severity: P1 (if confirmed)
- Evidence: Cited `scripts/lib/content-filter.ts:122`
- Notes: Pattern is identical to the confirmed C09-001 anti-pattern. Very likely to be confirmed.

### C09-008: Specs Directory Assumed at ./specs with Inconsistent Fallback Logic
- Context Claim: Specs directory assumed at `$repo_root/specs` without consistent fallback to `.opencode/specs/`. Branch detection may fail for alternate layouts.
- Build Evidence: NOT VERIFIED (outside B09 scope)
- Verdict: UNVERIFIABLE
- Severity: P2 (if confirmed)
- Evidence: Cited `scripts/common.sh:46-64`
- Notes: The dual-location concern (specs/ vs .opencode/specs/) is a known configuration pattern. Severity is appropriately MEDIUM since most deployments use a single consistent location.

### C09-009: Symlink Marker File Read Without Symlink Resolution
- Context Claim: Version marker file at vector-index.ts:806 read via `__dirname`-relative path without symlink resolution or existence validation.
- Build Evidence: NOT VERIFIED (outside B09 scope)
- Verdict: UNVERIFIABLE
- Severity: P2 (if confirmed)
- Evidence: Cited `mcp_server/lib/search/vector-index.ts:806`
- Notes: Given the C09-003 counter-evidence showing vector-index-impl has some defensive coding, this finding may also have downstream mitigations not captured in the context shard.

### C09-010: Test Fixtures Use __dirname-Relative Paths
- Context Claim: Test fixtures use `__dirname`-relative paths; tests fail when run from non-root directory.
- Build Evidence: NOT VERIFIED (outside B09 scope)
- Verdict: UNVERIFIABLE
- Severity: P2 (if confirmed)
- Evidence: Cited `scripts/tests/test-scripts-modules.js:16`, `test-utils.js:16-17`
- Notes: Common pattern in Node.js test suites. Impact is limited to test reliability rather than production behavior.

### C09-011: Template Path in Test Hardcoded with __dirname
- Context Claim: Anchor test template path assumes specific build structure (src/ vs dist/); breaks if compilation output changes.
- Build Evidence: NOT VERIFIED (outside B09 scope)
- Verdict: UNVERIFIABLE
- Severity: P2 (if confirmed)
- Evidence: Cited `mcp_server/tests/anchor-id-simplification.vitest.ts:14-15`
- Notes: Build structure coupling in tests is a known fragility pattern but low production impact.

### C09-012: Hash File Location Stored in Hardcoded Template Directory Path
- Context Claim: Template validation hash file location hardcoded as 2-level relative path from validation script. Brittle to script relocation.
- Build Evidence: NOT VERIFIED (outside B09 scope)
- Verdict: UNVERIFIABLE
- Severity: P2 (if confirmed)
- Evidence: Cited `scripts/spec/validate.sh:147`
- Notes: Performance optimization mechanism (caching). Low impact if broken - validation would simply re-run without cache.

---

## Cross-Platform Assessment

All cross-platform claims in C09 are theoretical and untested. B09 build verification
ran on the current platform only and did not test any of the following:

| Claim | Status | C09 Reference |
|-------|--------|---------------|
| Windows backslash path separators break `cd` commands | UNTESTED | C09-002, C09-005, C09-012 |
| macOS /tmp → /private/tmp symlink causes path confusion | UNTESTED | C09-002, C09-009 |
| Git Bash `cd` behavior differs from native bash | UNTESTED | C09-002 |
| WSL symlinks differ from native Windows symlinks | UNTESTED | C09-002 |
| `__dirname` resolves differently in compiled dist/ vs src/ | UNTESTED | C09-010, C09-011 |
| Environment variables may contain backslashes on Windows | UNTESTED | C09-006 |

The C09 shard correctly identifies these as risks but presents them with the same
confidence as verified findings. The remediation roadmap includes "Add Windows Testing
to CI Pipeline" (Phase 3), which is appropriate but should note that without such
testing, all Windows/WSL claims remain theoretical.

The macOS /tmp symlink issue is the most likely to affect current users since the
development environment is macOS, but no test case was provided to demonstrate actual
breakage.

---

## Build Coverage Gap

B09 verified only 5 of 12 findings (42% coverage). The unverified findings
(C09-006 through C09-012) represent:
- 3 HIGH-severity findings (C09-006, C09-007 and the unverified portion of cross-platform claims)
- 5 MEDIUM-severity findings (C09-008 through C09-012)

Given the 80% confirmation rate on verified findings (4 confirmed, 1 downgraded),
the unverified findings have reasonable credibility but cannot be accepted at
face value. The C09-003 downgrade demonstrates that context analysis alone
can overclaim severity when downstream mitigations exist.

---

## Recommendations

**P0 - Immediate (confirmed critical)**
1. Replace hardcoded `../` traversals in `config.ts:203` and `memory-indexer.ts:19` with marker-file-based PROJECT_ROOT detection (C09-001)
2. Add `-P` flag to `pwd` calls and consider `readlink -f` fallback in `common.sh:24` and `archive.sh:23` (C09-002)

**P1 - Next sprint (confirmed high + downgraded)**
3. Add path existence validation after DB path resolution in `config.ts:31-33` even though downstream handling exists - defense in depth (C09-003, downgraded)
4. Decouple template discovery from hardcoded skill path in `create.sh:297` and `compose.sh:60` (C09-004)
5. Replace `process.cwd()` allow-list in `data-loader.ts:85-87` with `CONFIG.PROJECT_ROOT`-anchored validation (C09-005)

**P1 - Extend build verification**
6. Run build verification on C09-006 through C09-012 to confirm or dismiss remaining 7 findings before scheduling remediation work

**P2 - Backlog**
7. Add cross-platform CI testing (Windows, Git Bash, WSL) to validate or dismiss theoretical portability claims
8. Migrate test fixture paths from `__dirname`-relative to CONFIG-based resolution (C09-010, C09-011)
9. Document all `process.cwd()` assumptions across the codebase

---

## Source References

- Context shard: context-agent-09-path-assumptions.md
- Build shard: build-agent-09-paths-verify.md
- Review date: 2026-02-15
- Review scope: Full C09 shard (12 findings) against B09 build evidence (top 5 verified)
