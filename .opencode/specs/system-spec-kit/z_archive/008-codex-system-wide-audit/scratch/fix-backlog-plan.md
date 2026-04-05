# Fix Backlog Plan (Evidence-First)

## Scope
- Sources synthesized:
  - `.opencode/specs/system-spec-kit/z_archive/008-codex-system-wide-audit/scratch/context-121-audit.md`
  - `.opencode/specs/system-spec-kit/z_archive/008-codex-system-wide-audit/scratch/context-123-audit.md`
  - `.opencode/specs/system-spec-kit/z_archive/008-codex-system-wide-audit/scratch/context-124-audit.md`
  - `.opencode/specs/system-spec-kit/z_archive/008-codex-system-wide-audit/scratch/context-cross-spec-lineage.md`
  - `.opencode/specs/system-spec-kit/z_archive/008-codex-system-wide-audit/scratch/context-typo-path-resolution.md`

## 1) Prioritized Fix Backlog (P0/P1/P2)

### P0 (Critical)
1. **Fail-fast on missing `shell-common.sh` in upgrade script**
   - Change: add guarded source with explicit `error_exit`.
   - Target: `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh` (near source call at line 29 in report).
   - Evidence: `context-124-audit.md:151`, `context-124-audit.md:155`, `context-124-audit.md:557`.

2. **Backup must include subdirectory markdown files (`memory/` risk)**
   - Change: recursive backup for `*.md` (preserve relative paths), not root-only glob.
   - Target: `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh` (backup logic around lines 299-315 in report).
   - Evidence: `context-124-audit.md:381`, `context-124-audit.md:389`, `context-124-audit.md:564`.

3. **Resolve Spec 121 orphaned memory/filesystem mismatch**
   - Decision/fix: either restore missing spec folder artifacts or delete orphaned memory entry.
   - Targets: either create `.opencode/specs/system-spec-kit/z_archive/004-script-audit-comprehensive/` docs, or perform memory cleanup.
   - Evidence: `context-121-audit.md:13`, `context-121-audit.md:31`, `context-121-audit.md:109`.

4. **Close Spec 121 open blockers before relying on its findings**
   - Work: close unresolved P0 remediation and deferred uncertainties U07/U27/U28.
   - Targets: Spec 121 completion artifacts and related remediation outputs.
   - Evidence: `context-cross-spec-lineage.md:15`, `context-cross-spec-lineage.md:103`, `context-cross-spec-lineage.md:138`.

5. **Spec 123 completion gate: verify and mark all P0 checklist items**
   - Work: run build/tests + manual format checks; update checklist evidence + verification date.
   - Target: `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/checklist.md`.
   - Evidence: `context-123-audit.md:16`, `context-123-audit.md:100`, `context-123-audit.md:178`.

### P1 (High)
1. Add warning path when OPEN QUESTIONS heading is not found during insertion.
   - Target: `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`.
   - Evidence: `context-124-audit.md:345`, `context-124-audit.md:672`.

2. Tighten L2->L3 Multi-Agent row detection to table context only.
   - Target: `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`.
   - Evidence: `context-124-audit.md:423`, `context-124-audit.md:702`.

3. Add safety valve/iteration guard in backward comment scan.
   - Target: `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`.
   - Evidence: `context-124-audit.md:735`.

4. Reconcile Spec 123 process/documentation contradictions (tasks/checklist/summary).
   - Targets:
     - `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/tasks.md`
     - `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/checklist.md`
     - `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/implementation-summary.md`
   - Evidence: `context-123-audit.md:128`, `context-123-audit.md:204`, `context-123-audit.md:190`.

5. Populate Spec 123 `scratch/` with verification evidence logs.
   - Target directory: `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/scratch/`.
   - Evidence: `context-123-audit.md:159`, `context-123-audit.md:171`.

### P2 (Quality)
1. Add `scripts/spec/README.md` for `upgrade-level.sh` usage.
   - Target: `.opencode/skill/system-spec-kit/scripts/spec/README.md`.
   - Evidence: `context-124-audit.md:758`.

2. Optional memory auto-save post-upgrade enhancement.
   - Target: `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`.
   - Evidence: `context-124-audit.md:763`.

3. Minor TypeScript clarity enhancements for subfolder work (comments/@throws/perf notes).
   - Targets:
     - `.opencode/skill/system-spec-kit/scripts/core/subfolder-utils.ts`
     - `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`
   - Evidence: `context-123-audit.md:275`, `context-123-audit.md:333`, `context-123-audit.md:336`.

4. No action for typo-path report (confirmed non-propagated typo).
   - Target: none.
   - Evidence: `context-typo-path-resolution.md:19`, `context-typo-path-resolution.md:120`, `context-typo-path-resolution.md:231`.

## 2) Exact Paths: Code Changes vs Documentation-Only

### Code changes required
1. `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`

### Documentation-only updates required
1. `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/checklist.md`
2. `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/tasks.md`
3. `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/implementation-summary.md`
4. `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/scratch/build-output.txt` (new evidence log)
5. `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/scratch/test-results.txt` (new evidence log)
6. `.opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder/scratch/manual-verification.txt` (new evidence log)
7. `.opencode/specs/system-spec-kit/z_archive/004-script-audit-comprehensive/` (restore path, if restoration decision chosen)

### Memory/ops actions (non-code, non-doc source edits)
1. Remove orphaned memory entry for Spec 121 if discard path chosen (per report guidance).

## 3) Minimal Safe Implementation Order
1. **Patch `upgrade-level.sh` P0s first**: sourcing guard + recursive backup.
2. **Run focused verification for those P0s** before any wider documentation edits.
3. **Complete Spec 123 P0 verification evidence loop**: build/test/manual checks, then mark checklist/date.
4. **Reconcile Spec 123 task/summary consistency** and store scratch logs.
5. **Resolve Spec 121 disposition** (restore vs discard orphaned memory) and close open lineage blockers.
6. **Apply P1 hardening in `upgrade-level.sh`** (warnings, table-context detection, loop guard).
7. **Queue P2 quality enhancements** after all P0/P1 are green.

## 4) Verification Commands After Fixes

### For `upgrade-level.sh` P0/P1
```bash
bash -n .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh
```

```bash
# P0-1 fail-fast on missing shell-common.sh
mv .opencode/skill/system-spec-kit/scripts/lib/shell-common.sh .opencode/skill/system-spec-kit/scripts/lib/shell-common.sh.bak && bash .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh .opencode/specs/system-spec-kit/z_archive/006-generate-context-subfolder L2 --json; test $? -eq 2; mv .opencode/skill/system-spec-kit/scripts/lib/shell-common.sh.bak .opencode/skill/system-spec-kit/scripts/lib/shell-common.sh
```

```bash
# P0-2 recursive backup coverage for memory/*.md
mkdir -p /tmp/spec-backup-test/memory && printf "x\n" > /tmp/spec-backup-test/spec.md && printf "y\n" > /tmp/spec-backup-test/memory/session.md && bash .opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh /tmp/spec-backup-test L2 --dry-run
```

### For Spec 123 verification closure
```bash
cd .opencode/skill/system-spec-kit/scripts && tsc --build
```

```bash
cd .opencode/skill/system-spec-kit/scripts && node scripts/tests/test-subfolder-resolution.js
```

```bash
cd .opencode/skill/system-spec-kit/scripts && node scripts/dist/memory/generate-context.js system-spec-kit/z_archive/006-generate-context-subfolder && node scripts/dist/memory/generate-context.js 123-generate-context-subfolder && node scripts/dist/memory/generate-context.js specs/system-spec-kit/z_archive/006-generate-context-subfolder
```

## Counts
- P0: 5
- P1: 5
- P2: 4
- Files requiring code changes: 1
- Files requiring documentation-only updates: 7 paths (+ conditional Spec 121 restoration path)
