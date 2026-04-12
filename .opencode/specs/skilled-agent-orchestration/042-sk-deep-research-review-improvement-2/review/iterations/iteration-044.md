---
iteration: 44
dimension: security
sessionId: rvw-2026-04-12T16-00-00Z
engine: copilot-gpt-5.4-high
phase: round-3-workflow-validation
startedAt: 2026-04-12T18:03:02Z
completedAt: 2026-04-12T18:09:46Z
---

# Deep Review Iteration 044 — security (Round 3)

**Focus:** CONTRACT: Verify optimizer security hardening. Check promote.cjs restricts output to audit directory. Check search.cjs derives space from manifest. Check replay-corpus.cjs constrains to approved roots. Verify no path traversal is possible.

---

● skill(sk-code-review)

I’m mapping the security review surface first so I can inspect the exact hardening paths and only report issues with line-level evidence.

● Run skill advisor for review task (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Deep review iteration 44 security validation
  │ for 042 Deep Research & Review Runtime Improvement Bundle. Verify optimizer security hardening
  │ in promote.cjs, search.cjs, replay-corpus.cjs and related manifests/workflows for path
  │ traversal/root escape issues." --threshold 0.8
  └ 27 lines...

● memory_match_triggers (MCP: spec_kit_memory) · prompt: "Deep review iteration 44 security validat…
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Read review_core.md
  │ .claude/skills/sk-code-review/references/review_core.md
  └ L1:240 (98 lines read)

● Read security_checklist.md
  │ .claude/skills/sk-code-review/references/security_checklist.md
  └ L1:240 (206 lines read)

● Read review_ux_single_pass.md
  │ .claude/skills/sk-code-review/references/review_ux_single_pass.md
  └ L1:220 (82 lines read)

● skill(sk-code-opencode)

I’ve got the review baseline loaded. Next I’m tracing the exact implementation files and the spec references that define the intended hardening so I can compare contract vs code.

● Read quality_standards.md
  │ .claude/skills/sk-code-opencode/references/javascript/quality_standards.md
  └ L1:220 (220 lines read)

● Search (glob)
  │ "**/{promote,search,replay-corpus}.cjs"
  └ 3 files found

● Search (grep)
  │ "promote\.cjs|search\.cjs|replay-corpus\.cjs|optimizer|audit directory|approved
  │ roots|manifest|path traversal" in **/*.md
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 6 lines found

● Read spec.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md
  └ L1:260 (260 lines read)

● Read implementation-summary.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementa
  │ tion-summary.md
  └ L1:260 (129 lines read)

● Read universal_patterns.md
  │ .claude/skills/sk-code-opencode/references/shared/universal_patterns.md
  └ L1:220 (220 lines read)

I’ve found the optimizer surface. Now I’m reading the Phase 4 contract and the three scripts end-to-end so I can test each containment guarantee against the spec, not just the filenames.

● Read spec.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offlin
  │ e-loop-optimizer/spec.md
  └ L1:280 (243 lines read)

● Read promote.cjs
  │ .opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs
  └ L1:320 (320 lines read)

● Read search.cjs
  │ .opencode/skill/system-spec-kit/scripts/optimizer/search.cjs
  └ L1:360 (360 lines read)

● Read replay-corpus.cjs
  │ .opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs
  └ L1:360 (360 lines read)

● Read implementation-summary.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/004-offlin
  │ e-loop-optimizer/implementation-summary.md
  └ L1:260 (108 lines read)

● Search (grep)
  │ "promote\.cjs|search\.cjs|replay-corpus\.cjs|audit|approved roots|manifest|path traversal|root"
  │ in **/*.md (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-
  │ 2/004-offline-loop-optimizer)
  └ 6 lines found

I’ve confirmed the intended security contract in Phase 4. I’m now checking the remaining code paths where these helpers are actually used, because most traversal bugs hide in the call sites rather than the helper itself.

● Read optimizer-manifest.json
  │ .opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json
  └ L1:260 (138 lines read)

● Read promote.cjs
  │ .opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs
  └ L320:520 (65 lines read)

● Read search.cjs
  │ .opencode/skill/system-spec-kit/scripts/optimizer/search.cjs
  └ L360:520 (104 lines read)

● Read replay-corpus.cjs
  │ .opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs
  └ L360:560 (150 lines read)

● Search (grep)
  │ "resolvePromotionAuditPath|PROMOTION_AUDIT_DIR|buildCorpus\(|resolveApprovedCorpusPath|APPROVED_
  │ CORPUS_ROOTS|deriveParamSpaceFromManifest|DEFAULT_PARAM_SPACE|loadCanonicalManifest" in
  │ scripts/optimizer/*.{cjs,ts} (.opencode/skill/system-spec-kit)
  └ No matches found

● Read review-report.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/arc
  │ hive-rvw-2026-04-11/review-report.md
  └ L1:260 (193 lines read)

I’ve reached the interesting edge now: the main guards look intentional, so I’m checking for unguarded side paths like helper exports and persistence utilities that could still read or write arbitrary paths.

● Read optimizer-promote.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "savePromotionReport\(|resolvePromotionAuditPath\(|buildCorpus\(|saveCorpus\(|loadCorpus\(|DEFAU
  │ LT_PARAM_SPACE|deriveParamSpaceFromManifest" in **/*.{cjs,ts,js}
  │ (.opencode/skill/system-spec-kit)
  └ 7 lines found

● Search (glob)
  │ "**/optimizer-*.vitest.ts" in .opencode/skill/system-spec-kit/scripts/tests
  └ 5 files found

● Read optimizer-search.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts
  └ L1:260 (259 lines read)

● Read optimizer-replay-corpus.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts
  └ L1:320 (320 lines read)

● Read optimizer-replay-corpus.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts
  └ L320:460 (113 lines read)

● Read optimizer-promote.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts
  └ L260:420 (161 lines read)

● Read optimizer-search.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts
  └ L260:420 (122 lines read)

● Search (grep)
  │ "saveCorpus\(" in **/*.{cjs,js,ts} (.opencode/skill/system-spec-kit)
  └ 11 lines found

● Search (grep)
  │ "loadCorpus\(" in **/*.{cjs,js,ts} (.opencode/skill/system-spec-kit)
  └ 17 lines found

● Search (grep)
  │ "savePromotionReport\(" in **/*.{cjs,js,ts} (.opencode/skill/system-spec-kit)
  └ 23 lines found

The static read points to one likely escape hatch, but I want to prove it before I call it out. I’m running a minimal temp-dir repro so the finding is based on observed behavior, not just suspicion.

✗ Reproduce promote symlink directory escape (shell)
  │ node <<'NODE'
  │ const fs = require('fs');
  │ const os = require('os');
  │ const path = require('path');…
  └ Command blocked: contains dangerous shell expansion patterns (e.g., parameter transformation,
    indirect expansion, or nested command substitution) that could enable arbitrary code execution.
    Please rewrite the command without these expansion patterns.

● Reproduce replay corpus unrestricted IO (shell)
  │ node <<'NODE'
  │ const fs = require('fs');
  │ const os = require('os');
  │ const path = require('path');
  │ const replayCorpus = require(path.join(process.cwd(), …
  └ 22 lines...

I confirmed one unguarded replay-corpus IO path already. I’m rerunning the promote repro with a safer snippet format because the shell blocker didn’t like JS template literals in the heredoc.

● Reproduce promote symlink directory escape (shell)
  │ node <<'NODE'
  │ const fs = require('fs');
  │ const os = require('os');
  │ const path = require('path');…
  └ 54 lines...

● Reproduce promote nested symlink behavior (shell)
  │ node <<'NODE'
  │ const fs = require('fs');
  │ const path = require('path');
  │
  │ const sessionFiles = path.join(process.env.HOME, '.copilot', 'session-state', …
  └ 55 lines...

I now have a clean reproduction of the nested-symlink side effect. I’m doing one last check against the real module, then I’ll synthesize the findings with exact severity and line references.

● Reproduce actual promote module symlink side effect (shell)
  │ node <<'NODE'
  │ const fs = require('fs');
  │ const path = require('path');
  │ const promote = require(path.join(process.cwd(),
  │ '.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs'));…
  └ 32 lines...

### F-044-001
- **Severity**: P1
- **Dimension**: security
- **File**: `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:467-493`
- **Title**: Replay-corpus persistence helpers bypass the approved-root boundary
- **Description**: `buildCorpus()` correctly constrains fixture intake to approved corpus roots, but the same module exports `saveCorpus()` and `loadCorpus()` helpers that accept arbitrary paths and perform unrestricted filesystem writes/reads. That means a caller can bypass the approved-root policy entirely by routing corpus persistence through these exported helpers, so the module does **not** currently satisfy the “no path traversal possible” goal end-to-end.
- **Evidence**: Approved-root enforcement exists in `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:53-98` and is used during fixture intake at `:373-389`. But `saveCorpus()` at `:467-474` writes directly to `outputPath` after `mkdirSync(path.dirname(outputPath), { recursive: true })`, and `loadCorpus()` at `:483-490` reads any existing `corpusPath` with no containment check. The tests also codify this unrestricted behavior by round-tripping through `TMPDIR` and reading an arbitrary absolute path in `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts:296-313`.
- **Recommendation**: Apply the same canonical containment policy to persistence helpers that `buildCorpus()` uses for input fixtures. If these helpers are meant to be internal-only, stop exporting raw path-based variants and replace them with APIs rooted to an approved optimizer corpus/audit directory.

### F-044-002
- **Severity**: P2
- **Dimension**: security
- **File**: `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:46-75,362-368`
- **Title**: Promotion report path check still mutates filesystem through nested symlink parents
- **Description**: `savePromotionReport()` is meant to restrict output to `PROMOTION_AUDIT_DIR`, but its parent-directory validation is ordered unsafely. `ensureCanonicalDirectory()` creates directories **before** verifying that the resolved path stayed canonical. If a symlinked subdirectory already exists under the audit tree, a nested output path can create directories in the symlink target outside the audit root and only then throw. The final file write is blocked, but filesystem mutation has already escaped the intended boundary.
- **Evidence**: `ensureCanonicalDirectory()` calls `fs.mkdirSync(dirPath, { recursive: true })` before `realpathSync()` validation at `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs:46-55`. `resolvePromotionAuditPath()` uses that helper on `path.dirname(candidatePath)` at `:68-75`, and `savePromotionReport()` trusts the result at `:362-368`. Reproducing against the real module with `PROMOTION_AUDIT_DIR/escape` symlinked outside the audit tree caused `savePromotionReport({ ok: true }, 'escape/nested/report.json')` to create the external `nested/` directory before throwing `Promotion audit parent directory must not traverse symlinks`.
- **Recommendation**: Validate parent path segments before any `mkdirSync`, or walk from the audit root one segment at a time with `lstat`/`realpath` checks that refuse symlink traversal before creating missing directories. Add a regression test for a nested symlink-parent path, not just a symlinked final file.

**ITERATION SUMMARY**: Found **2 security issues** in the optimizer hardening pass: **0 P0 / 1 P1 / 1 P2**. `search.cjs` looks clean for this focus area: it derives its parameter space from the canonical local manifest rather than caller-supplied path input (`.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs:33-70,73-150`). `buildCorpus()` also correctly constrains fixture intake to approved roots (`.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs:53-98,373-389`). The remaining gaps are in persistence/output helpers, not the manifest-derived search surface.

**COVERAGE ASSESSMENT**: Reviewed the Phase 4 contract in `004-offline-loop-optimizer/spec.md`, the shipped implementation in `promote.cjs`, `search.cjs`, `replay-corpus.cjs`, `optimizer-manifest.json`, and the targeted regression suites `optimizer-promote.vitest.ts`, `optimizer-search.vitest.ts`, and `optimizer-replay-corpus.vitest.ts`. I specifically checked the four requested claims: audit-directory restriction in `promote.cjs`, manifest-derived search space in `search.cjs`, approved-root enforcement in `replay-corpus.cjs`, and remaining traversal escape paths.

**CONFIDENCE**: **High**. The P1 is directly visible in shipped code and tests. The P2 was confirmed with a runtime repro against the real module.

**NEXT PRIORITIES**:
1. Lock `saveCorpus()` / `loadCorpus()` to approved optimizer roots or de-export them.
2. Fix the nested-symlink side effect in `promote.cjs` and add a regression for symlinked parent directories.
3. Re-run this security pass after those two fixes land; `search.cjs` does not need further hardening for this focus area.


Changes   +0 -0
Requests  1 Premium (6m 42s)
Tokens    ↑ 1.3m • ↓ 13.8k • 1.3m (cached) • 7.4k (reasoning)
