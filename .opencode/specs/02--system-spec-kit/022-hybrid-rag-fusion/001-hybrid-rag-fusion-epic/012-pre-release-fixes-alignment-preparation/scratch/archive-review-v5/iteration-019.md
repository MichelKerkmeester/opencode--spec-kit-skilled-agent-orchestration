● skill(system-spec-kit)

I’m doing a repo-wide audit pass now: sampling spec links, checking catalog structure, and verifying README claims against actual files/directories.

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Cross-reference sweep across
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion, feature catalog structure audit, and
  │ system-spec-kit README accuracy review" --threshold 0.8
  └ 51 lines...

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/5aeecd74-d076-4529-98ba-ab0f152471b2/plan.md'
  │ <<'EOF'
  │ # Plan…
  └ 9 lines...

● skill(sk-code--review)

● skill(sk-code--opencode)

I’ve loaded the review standards. Next I’m sampling the 022 specs and extracting the actual link/status patterns so the verification is evidence-backed, not heuristic-only.

● Search (grep)
  │ "^(Parent spec|Parent|Predecessor|Successor|Status|State)" in **/spec.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion)
  └ 12 lines found

● Read README.md
  │ .opencode/skill/system-spec-kit/README.md
  └ L1:260 (259 lines read)

● List directory .opencode/skill/system-spec-kit/feature_catalog
  └ 24 files found

● Search (glob)
  │ ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/**/spec.md"
  └ 124 files found

I found the tree structure and the actual catalog layout. Now I’m narrowing in on the metadata conventions used inside `spec.md` so link checks reflect the real schema in this tree.

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md
  └ L1:220 (220 lines read)

● Search (grep)
  │ "(?i)^(status|state|parent|predecessor|successor|previous|next|depends on|blocked by)\s*[:|]" in
  │ **/spec.md (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion)
  └ 15 lines found

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/spe
  │ c.md
  └ L1:220 (220 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md
  └ L1:220 (219 lines read)

I’ve confirmed there are two metadata styles in this tree: YAML-frontmatter `status:` in some packets and a metadata table with `Parent Spec / Predecessor / Successor / Status` in others. I’m accounting for both in the sweep.

● Audit sampled specs, catalog structure, and README claims (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re, random, json
  │
  │ ROOT = Path('/Users/michelkerkmeester/MEGA/Development/Opencode …
  └ 338 lines...

● Read copilot-tool-output-1774423205489-l88hlu.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774423205489-l88hlu.txt
  └ L1:260 (260 lines read)

● List directory .opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation
  └ 1 file found

● List directory .opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecate…
  └ 1 file found

● Read copilot-tool-output-1774423205489-l88hlu.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774423205489-l88hlu.txt
  └ L260:360 (82 lines read)

● Read 01-category-stub.md
  │ .opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md
  └ L1:120 (10 lines read)

● Read 01-category-stub.md
  │ .opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-
  │ category-stub.md
  └ L1:120 (10 lines read)

A couple of the initial “broken” links look like parser edge cases caused by Markdown link syntax. I’m spot-checking the sampled files directly now so only real issues make it into the report.

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/012-qu
  │ ery-intelligence/spec.md
  └ L1:120 (119 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-sign
  │ al-extraction/spec.md
  └ L1:120 (120 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/018-rewrite-system-speckit-readme/spec
  │ .md
  └ L1:120 (120 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/006-sprint-
  │ 5-pipeline-refactor/spec.md
  └ L1:120 (120 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/spec.md
  └ L1:120 (120 lines read)

I’ve confirmed one real spec inconsistency already: the root `022` map marks phase `018` complete while the child `018` spec still says `In Progress`. I’m doing one more pass on README path references so the final report distinguishes count drift from broken links.

● Check README path references exist (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re, json
  │ ROOT = Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public')
  │ README = ROOT / '.opencode/skill/system-spec-kit/README.md'…
  └ 46 lines...

● Check README referenced paths exist (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re, json
  │ ROOT = Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public')
  │ README = ROOT / '.opencode/skill/system-spec-kit/README.md'…
  └ 258 lines...

I’ve filtered out the false positives from literal command names and generic filenames in the README. I’m now verifying the concrete repo paths it names as sources of truth and entrypoints.

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/spec/create.sh"
  └ 1 file found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/SKILL.md"
  └ 1 file found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/ARCHITECTURE.md"
  └ 1 file found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/spec/validate.sh"
  └ 1 file found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/memory/generate-context.ts"
  └ 1 file found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js"
  └ No matches found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/context-server.ts"
  └ 1 file found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md"
  └ 1 file found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/references/memory/memory_system.md"
  └ 1 file found

One README path claim is looking suspect: I can confirm the TypeScript source `scripts/memory/generate-context.ts` exists, but the documented compiled runtime path `scripts/dist/memory/generate-context.js` does not exist in this checkout. I’m checking whether it moved or if the README is just stale.

● Read README.md
  │ .opencode/skill/system-spec-kit/scripts/README.md
  └ L1:220 (148 lines read)

● Search (glob)
  │ ".opencode/skill/system-spec-kit/**/generate-context.js"
  └ No matches found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/**/generate-context.*"
  └ 1 file found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/scripts/dist/**"
  └ No matches found

I found why the script-count check drifted: the README is counting lifecycle/CLI scripts, not every file in those folders. I’m normalizing the counts against the script inventory README so I don’t over-report false mismatches.

● List directory .opencode/skill/system-spec-kit/scripts/spec
  └ 13 files found

● List directory .opencode/skill/system-spec-kit/scripts/memory
  └ 10 files found

● List directory .opencode/skill/system-spec-kit/manual_testing_playbook
  └ 20 files found

● List directory .opencode/command/memory
  └ 7 files found

● List directory .opencode/command/spec_kit
  └ 10 files found

I’ve isolated the real link formats now: plain relative paths, bare slugs, Markdown links, and comma-separated multi-target successors. I’m rerunning the sampled verification with that normalization so the table reflects actual breakage only.

● Re-run sampled spec verification with markdown-aware resolver (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re, random, json
  │
  │ ROOT = Path('/Users/michelkerkmeester/MEGA/Development/Opencode …
  └ 305 lines...

The manual-testing parent map uses a wider table, so my generic row parser grabbed the wrong column there. I’m pulling the exact parent rows for the five sampled specs to lock the status check to the real status column.

● Search (grep)
  │ "`012-command-alignment/`|`018-rewrite-system-speckit-readme/`|`015-manual-testing-per-playbook/
  │ `" (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md)
  └ 3 lines found

● Search (grep)
  │ "`006-sprint-5-pipeline-refactor/`"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md)
  └ 1 line found

● Search (grep)
  │ "`012-query-intelligence/`" (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manua
  │ l-testing-per-playbook/spec.md)
  └ 1 line found

● Search (grep)
  │ "`008-signal-extraction/`" (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfec
  │ t-session-capturing/spec.md)
  └ 1 line found

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/spec.m
  │ d
  └ L84:100 (17 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md
  └ L103:132 (29 lines read)

# Iteration 019: Cross-Reference Comprehensive Sweep

## Agent: copilot / gpt-5.4 / high

## Dimension: traceability + maintainability

## Files Reviewed

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/spec.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/spec.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-command-alignment/spec.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/006-sprint-5-pipeline-refactor/spec.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/012-query-intelligence/spec.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/018-rewrite-system-speckit-readme/spec.md`
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction/spec.md`
- `.opencode/skill/system-spec-kit/README.md`
- `.opencode/skill/system-spec-kit/scripts/README.md`
- `.opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md`
- `.opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-category-stub.md`

## Spec Link Verification

Random sample used seed `19`, excluding `scratch/`, `memory/`, and `z_archive/` packets.

| Spec | Parent Link | Predecessor | Status Consistent | Verified |
|------|------------|-------------|-------------------|----------|
| `012-command-alignment/spec.md` | OK | Pred OK / Succ OK | Yes | Yes |
| `001-hybrid-rag-fusion-epic/006-sprint-5-pipeline-refactor/spec.md` | OK | Pred OK / Succ OK | Yes | Yes |
| `015-manual-testing-per-playbook/012-query-intelligence/spec.md` | OK | Pred OK / Succ OK | Yes (parent umbrella is `In Progress`) | Yes |
| `018-rewrite-system-speckit-readme/spec.md` | OK | Pred OK / Succ OK | **No** | **No** |
| `009-perfect-session-capturing/008-signal-extraction/spec.md` | OK | Pred OK / Succ 2 OK | Yes | Yes |

## Feature Catalog Structure

- Categories with content: `21`
- Stub categories: `2`
- Orphaned files: `0`

Categories `20--remediation-revalidation` and `21--implement-and-remove-deprecated-features` are **still stubs**; each contains only `01-category-stub.md` and explicitly says it is “documentation stub only.”

## README Accuracy

- Claims checked: `11`
- Accurate: `8`, Inaccurate: `3`

Accurate checks included tool/command counts, validation-rule count, manual playbook category count, and key file references such as `SKILL.md`, `ARCHITECTURE.md`, `scripts/spec/create.sh`, `scripts/spec/validate.sh`, `mcp_server/context-server.ts`, `feature_catalog/FEATURE_CATALOG.md`, and `references/memory/memory_system.md`.

## Findings

### P1-001: Phase 018 status drift between root and child spec

`022-hybrid-rag-fusion/spec.md` marks `018-rewrite-system-speckit-readme/` as `Complete`, but `018-rewrite-system-speckit-readme/spec.md` still reports `Status: In Progress`.

### P1-002: README overstates feature catalog size

`.opencode/skill/system-spec-kit/README.md` claims `224` feature entries across `22` categories in both the Key Statistics and Structure sections. The actual catalog has `222` snippet files across `21` category folders.

### P2-003: README runtime entrypoint assumes generated build output is present

`README.md` references `scripts/dist/memory/generate-context.js`, but that path is not present in this checkout. The source entrypoint `scripts/memory/generate-context.ts` exists; the JS path appears to depend on a build step.

## Summary

- Cross-refs checked: `21`
- Valid: `20`, Broken: `1`
- Total findings: `3` (`P0: 0`, `P1: 2`, `P2: 1`)

All sampled parent/predecessor/successor links resolved successfully; the single failed cross-check was the `018` parent/child status mismatch.


Total usage est:        1 Premium request
API time spent:         5m 48s
Total session time:     6m 33s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.9m in, 22.3k out, 1.7m cached (Est. 1 Premium request)
