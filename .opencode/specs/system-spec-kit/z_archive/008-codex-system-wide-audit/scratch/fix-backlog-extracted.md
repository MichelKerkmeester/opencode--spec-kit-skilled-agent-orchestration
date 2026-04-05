# System-Wide Backlog Extraction Report

**Date Generated:** 2026-02-15  
**Audit Scope:** Specs 121, 123, 124; Cross-Spec Lineage; Typo Path Resolution  
**Total Issues:** 14 (5 P0, 5 P1, 4 P2)  
**Code Files Affected:** 1  
**Documentation Files Affected:** 7+  

---

## Executive Summary

Comprehensive extraction from multi-spec audit revealing **5 critical path blockers (P0)**, **5 high-priority hardening items (P1)**, and **4 quality enhancements (P2)**. All evidence citations preserve original line numbers and file paths from source audit reports. Recommended execution order ensures fail-fast on critical sourcing and backup coverage gaps, followed by spec 123 verification closure.

---

## Section 1: P0 Critical Issues (Execution Blockers)

### P0-1: Fail-Fast on Missing `shell-common.sh` in Upgrade Script

**Priority:** CRITICAL  
**Category:** Fault Tolerance  
**Risk Level:** HIGH (silent failure potential)  

**Problem Statement:**  
The upgrade script sources `shell-common.sh` without guarded validation. If this file is missing or moved, the script continues with incomplete functionality instead of failing fast.

**Target File:**  
- `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh` (lines ~29)

**Change Required:**  
Add guarded source with explicit `error_exit` on failure.

**Evidence Citations:**
- `context-124-audit.md:151` - Sourcing statement analysis
- `context-124-audit.md:155` - Failure path identification
- `context-124-audit.md:557` - Risk assessment summary

**Verification Command:**
```bash
mv .opencode/skill/system-spec-kit/scripts/lib/shell-common.sh .opencode/skill/system-spec-kit/scripts/lib/shell-common.sh.bak && bash .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh .opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder L2 --json; test $? -eq 2; mv .opencode/skill/system-spec-kit/scripts/lib/shell-common.sh.bak .opencode/skill/system-spec-kit/scripts/lib/shell-common.sh
```

---

### P0-2: Backup Must Include Subdirectory Markdown Files (Memory Risk)

**Priority:** CRITICAL  
**Category:** Data Preservation  
**Risk Level:** HIGH (data loss potential)  

**Problem Statement:**  
Backup logic uses root-only glob pattern for `*.md` files, missing subdirectory content (especially `memory/` folder). This creates risk of losing session context and memory files during spec upgrades.

**Target File:**  
- `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh` (lines ~299-315)

**Change Required:**  
Implement recursive backup for `*.md` files preserving relative paths.

**Evidence Citations:**
- `context-124-audit.md:381` - Backup logic analysis
- `context-124-audit.md:389` - Glob pattern deficiency
- `context-124-audit.md:564` - Data loss scenario

**Verification Command:**
```bash
mkdir -p /tmp/spec-backup-test/memory && printf "x\n" > /tmp/spec-backup-test/spec.md && printf "y\n" > /tmp/spec-backup-test/memory/session.md && bash .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh /tmp/spec-backup-test L2 --dry-run
```

---

### P0-3: Resolve Spec 121 Orphaned Memory/Filesystem Mismatch

**Priority:** CRITICAL  
**Category:** Data Consistency  
**Risk Level:** MEDIUM (orphaned references)  

**Problem Statement:**  
Spec 121 (script-audit-comprehensive) exists in memory system but corresponding spec folder artifacts are missing from filesystem. Creates inconsistent state that could confuse future audits.

**Target Path(s):**  
- Either create missing directory: `.opencode/specs/system-spec-kit/z_archive/004-script-audit-comprehensive/` with documentation
- OR delete orphaned memory entry via: `memory_delete({ specFolder: "system-spec-kit/z_archive/004-script-audit-comprehensive" })`

**Change Required:**  
Strategic choice: Restore artifacts OR cleanup memory. Recommend restoration if work is incomplete, discard if completed.

**Evidence Citations:**
- `context-121-audit.md:13` - Orphan detection
- `context-121-audit.md:31` - Filesystem verification
- `context-121-audit.md:109` - Memory system verification

---

### P0-4: Close Spec 121 Open Blockers Before Relying on Findings

**Priority:** CRITICAL  
**Category:** Dependency Resolution  
**Risk Level:** HIGH (findings may be invalidated)  

**Problem Statement:**  
Spec 121 has unresolved P0 remediation items and deferred uncertainties (U07, U27, U28). Findings that depend on Spec 121 conclusions are potentially invalid until these blockers are resolved.

**Target Path(s):**  
- Spec 121 completion artifacts
- Related remediation outputs
- Deferred uncertainty resolution (U07, U27, U28)

**Change Required:**  
Complete Spec 121 P0 items and resolve all marked uncertainties before using its findings as dependencies.

**Evidence Citations:**
- `context-cross-spec-lineage.md:15` - Blocker identification
- `context-cross-spec-lineage.md:103` - Dependency graph
- `context-cross-spec-lineage.md:138` - Uncertainty tracking

---

### P0-5: Spec 123 Completion Gate - Verify and Mark All P0 Checklist Items

**Priority:** CRITICAL  
**Category:** Verification Closure  
**Risk Level:** MEDIUM (incomplete verification trail)  

**Problem Statement:**  
Spec 123 (generate-context-subfolder) has incomplete P0 verification evidence. Build/tests and manual format checks needed before marking checklist items as complete.

**Target File:**  
- `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/checklist.md`

**Change Required:**  
1. Run build verification
2. Run test suite
3. Run manual format checks
4. Update checklist with evidence citations
5. Add verification date

**Evidence Citations:**
- `context-123-audit.md:16` - Verification gap identification
- `context-123-audit.md:100` - Checklist item analysis
- `context-123-audit.md:178` - Completion criteria

**Verification Commands:**
```bash
bash -n .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh
```

```bash
cd .opencode/skill/system-spec-kit/scripts && tsc --build
```

```bash
cd .opencode/skill/system-spec-kit/scripts && node scripts/tests/test-subfolder-resolution.js
```

```bash
cd .opencode/skill/system-spec-kit/scripts && node scripts/dist/memory/generate-context.js system-spec-kit/z_archive/006-generate-context-subfolder && node scripts/dist/memory/generate-context.js 123-generate-context-subfolder && node scripts/dist/memory/generate-context.js specs/system-spec-kit/z_archive/006-generate-context-subfolder
```

---

## Section 2: P1 High-Priority Items (Hardening)

### P1-1: Add Warning Path When OPEN QUESTIONS Heading Not Found

**Priority:** HIGH  
**Category:** Error Handling  
**Target:** `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`  
**Evidence:** `context-124-audit.md:345`, `context-124-audit.md:672`

---

### P1-2: Tighten L2→L3 Multi-Agent Row Detection to Table Context Only

**Priority:** HIGH  
**Category:** Pattern Matching Precision  
**Target:** `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`  
**Evidence:** `context-124-audit.md:423`, `context-124-audit.md:702`

---

### P1-3: Add Safety Valve/Iteration Guard in Backward Comment Scan

**Priority:** HIGH  
**Category:** Loop Safety  
**Target:** `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`  
**Evidence:** `context-124-audit.md:735`

---

### P1-4: Reconcile Spec 123 Process/Documentation Contradictions

**Priority:** HIGH  
**Category:** Documentation Consistency  
**Targets:**
- `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/tasks.md`
- `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/checklist.md`
- `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/implementation-summary.md`

**Evidence:** `context-123-audit.md:128`, `context-123-audit.md:204`, `context-123-audit.md:190`

---

### P1-5: Populate Spec 123 scratch/ with Verification Evidence Logs

**Priority:** HIGH  
**Category:** Audit Trail Completion  
**Target Directory:** `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/scratch/`  
**Evidence:** `context-123-audit.md:159`, `context-123-audit.md:171`

---

## Section 3: P2 Quality Items (Enhancement)

### P2-1: Add `scripts/spec/README.md` for `upgrade-level.sh` Usage

**Priority:** LOW  
**Category:** Documentation  
**Target:** `.opencode/skill/system-spec-kit/scripts/spec/README.md`  
**Evidence:** `context-124-audit.md:758`

---

### P2-2: Optional Memory Auto-Save Post-Upgrade Enhancement

**Priority:** LOW  
**Category:** Feature Enhancement  
**Target:** `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`  
**Evidence:** `context-124-audit.md:763`

---

### P2-3: Minor TypeScript Clarity Enhancements for Subfolder Work

**Priority:** LOW  
**Category:** Code Clarity  
**Targets:**
- `.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts`
- `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`

**Enhancement Types:** Comments, @throws documentation, performance notes  
**Evidence:** `context-123-audit.md:275`, `context-123-audit.md:333`, `context-123-audit.md:336`

---

### P2-4: No Action for Typo-Path Report

**Priority:** CLOSED  
**Category:** Research Conclusion  
**Finding:** Confirmed non-propagated typo (no action required)  
**Target:** None  
**Evidence:** `context-typo-path-resolution.md:19`, `context-typo-path-resolution.md:120`, `context-typo-path-resolution.md:231`

---

## Section 4: Files Requiring Changes

### Code Changes Required (1 file)
1. `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`
   - P0-1: Add guarded source for shell-common.sh
   - P0-2: Implement recursive backup for memory/*.md
   - P1-1: Add warning path for OPEN QUESTIONS missing
   - P1-2: Tighten L2→L3 Multi-Agent row detection
   - P1-3: Add loop guard in backward comment scan
   - P2-2: Add optional memory auto-save (deferred)

### Documentation Updates Required (7 paths)
1. `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/checklist.md`
   - Update P0 evidence and verification date
2. `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/tasks.md`
   - Reconcile contradictions with checklist and summary
3. `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/implementation-summary.md`
   - Align with finalized task/checklist state
4. `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/scratch/build-output.txt` (NEW)
   - Evidence log from TypeScript build
5. `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/scratch/test-results.txt` (NEW)
   - Evidence log from test suite
6. `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/scratch/manual-verification.txt` (NEW)
   - Evidence log from manual format checks
7. `.opencode/specs/system-spec-kit/z_archive/004-script-audit-comprehensive/` (CONDITIONAL)
   - Restore spec folder artifacts if choosing restoration path

### Memory/Operations Actions (Non-code, Non-doc)
1. Spec 121 disposition decision:
   - Path A: Restore missing spec 121 artifacts (create directory + stub files)
   - Path B: Delete orphaned memory via `memory_delete({ specFolder: "system-spec-kit/z_archive/004-script-audit-comprehensive" })`

---

## Section 5: Recommended Execution Order

1. **Patch `upgrade-level.sh` P0s** (sourcing guard + recursive backup)
   - Fixes: P0-1, P0-2
   - Verification: Syntax check + targeted tests
   
2. **Run focused verification for P0 changes**
   - Verification commands from P0-1 and P0-2 sections
   - Ensure no regressions
   
3. **Complete Spec 123 P0 verification evidence loop**
   - Run: Build, tests, manual checks
   - Evidence: Store in scratch/ logs (P1-5)
   - Mark: Update checklist with evidence (P0-5)
   
4. **Reconcile Spec 123 task/summary consistency**
   - Resolve contradictions (P1-4)
   - Align checklist, tasks, implementation-summary
   
5. **Resolve Spec 121 disposition**
   - Decision: Restore vs. discard orphaned memory
   - Action: Execute chosen path (P0-3)
   - Close: Resolve open blockers (P0-4)
   
6. **Apply P1 hardening in `upgrade-level.sh`**
   - Add: Warning paths, table context detection, loop guards (P1-1, P1-2, P1-3)
   - Verify: Syntax + regression tests
   
7. **Queue P2 quality enhancements**
   - Timeline: After all P0/P1 are green
   - Scope: README.md, TypeScript clarity, optional auto-save (P2-1, P2-2, P2-3)

---

## Section 6: Summary Statistics Table

| Metric | Count | Details |
|--------|-------|---------|
| **Total Issues Extracted** | 14 | 5 P0 + 5 P1 + 4 P2 |
| **P0 (Critical)** | 5 | Fail-fast, backup coverage, orphan mismatch, open blockers, verification closure |
| **P1 (High)** | 5 | Error handling, pattern precision, loop safety, doc reconciliation, evidence logs |
| **P2 (Quality)** | 4 | README.md, optional auto-save, TypeScript clarity, no-action research |
| **Code Files Affected** | 1 | `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh` |
| **Documentation Files** | 7+ | 3 spec 123 files, 3 spec 123 scratch logs, 1 spec 121 restoration path |
| **Evidence Citations** | 28 | Preserved line numbers from source audit files |
| **Verification Commands** | 6 | Bash syntax, build, test, context generation |
| **Estimated Effort** | Medium | P0+P1 ~4-6 hours; P2 ~2 hours |
| **Critical Path** | P0-1 → P0-2 → P0-5 | Must complete in order before P1/P2 |

---

## Section 7: Source Audit Files Reference

All evidence citations reference original source audit reports:
- **context-121-audit.md** - Spec 121 script-audit-comprehensive analysis
- **context-123-audit.md** - Spec 123 generate-context-subfolder analysis  
- **context-124-audit.md** - Spec 124 upgrade-level.sh script analysis
- **context-cross-spec-lineage.md** - Cross-spec dependencies and blockers
- **context-typo-path-resolution.md** - Typo propagation analysis (research conclusion)

---

**Report Generated:** 2026-02-15 | **Status:** READY FOR EXECUTION | **Approval Required:** None (extraction only)
