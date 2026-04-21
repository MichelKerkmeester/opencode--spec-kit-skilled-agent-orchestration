# PHASE 3 — Final validation pass (autopilot)

You are **GitHub Copilot CLI** (`gpt-5.4` / reasoning effort `high`), running phase 3 of 3 — the final validation. Phase 1 audited; phase 2 created/patched; this phase verifies and fixes any residual issues.

## Charter

Spec-documentation perfection task, final phase. Phase 2 reported "warnings only" after self-validating, but those warnings need to be enumerated and either fixed or explicitly justified. This phase produces the **final go/no-go verdict** and the user-facing change report.

## Spec folder (pre-approved, skip Gate 3)

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems`

Hereafter `<PARENT>`. Level 3 packet.

## Prior phase outputs (READ before starting)

- `<PARENT>/scratch/spec-doc-audit.md` — phase 1 audit (the original gap report)
- `<PARENT>/scratch/spec-doc-phase-2-summary.md` — phase 2 file delta + harder-than-expected items
- All 7 PARENT root docs created in phase 2: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, description.json
- All 5 sub-folders' patched docs

---

## Mission

### Step 1 — Run all canonical validators

Run each of these validators against `<PARENT>` (the parent packet) AND each child sub-folder (001-005). Capture exit codes + warning/error counts for each:

```bash
# Per-folder strict validation
.opencode/skill/system-spec-kit/scripts/validate.sh <folder> --strict

# Or via Python validator if shell wrapper isn't authoritative
python3 .opencode/skill/system-spec-kit/scripts/validate_document.py --spec-folder <folder>

# Alignment drift check
python3 .opencode/skill/sk-code-opencode/scripts/verify_alignment_drift.py --root <folder>
```

If a validator script doesn't exist at the path I listed, find the right one — search `.opencode/skill/system-spec-kit/scripts/` and `.opencode/skill/sk-code-opencode/scripts/`.

### Step 2 — Categorize remaining issues

For each warning/error from step 1:
- **P0 (must fix)** — broken links, malformed JSON, missing mandatory sections, citation grammar violations
- **P1 (should fix)** — drift from template structure, missing optional but conventional sections, weak section content
- **P2 (nice to fix)** — style/phrasing nits

### Step 3 — Fix all P0 + P1 issues

Apply fixes directly. For each fix:
- Read the file
- Apply the surgical Edit
- Re-run the relevant validator to confirm the fix worked

If a P0 issue cannot be fixed (e.g. validator bug, missing template, conflicting requirements), document it in the final report with rationale.

### Step 4 — Cross-link integrity check

For every Markdown file in PARENT root + all sub-folders, verify:
- Every relative link `[text](path)` resolves to an existing file
- Every cross-reference to research/iterations/ files actually exists
- Every reference to research-v2.md / findings-registry-v2.json / recommendations-v2.md uses literal paths (not `phase-N/` aliases)

Fix any broken links found.

### Step 5 — Description.json schema check

For every `description.json` (PARENT + all 5 sub-folders), verify:
- Valid JSON (parses with `python3 -c "import json; json.load(open('...'))"`)
- Has the schema fields from `mcp_server/lib/search/folder-discovery.ts`: `specFolder`, `description`, `keywords`, `lastUpdated`, `specId`, `folderSlug`, `parentChain`, `memorySequence`, `memoryNameHistory`
- Field values are non-empty (no placeholder text)

Fix any drift.

### Step 6 — Optional: re-run any post-fix validation to confirm clean state

---

## Output 1 — `<PARENT>/scratch/spec-doc-phase-3-validation.md`

```markdown
# Spec Doc Phase 3 — Final Validation Report

> Final go/no-go for the spec-doc perfection task. Run by cli-copilot/gpt-5.4/high.

## TL;DR (≤6 bullets)
- Final verdict: PASS | PASS-WITH-CAVEATS | FAIL
- P0 fixed: <int>
- P1 fixed: <int>
- P2 deferred: <int>
- Cross-link integrity: clean | <count> broken
- Description.json validity: 6/6 valid | <other>

## Validator results (post-fix)

| Folder | validate.sh exit | warnings | errors | alignment verifier | notes |
|---|---|---|---|---|---|
| PARENT | 0 | <int> | 0 | pass | ... |
| 001 | 0 | ... | 0 | pass | ... |
| 002 | 0 | ... | 0 | pass | ... |
| 003 | 0 | ... | 0 | pass | ... |
| 004 | 0 | ... | 0 | pass | ... |
| 005 | 0 | ... | 0 | pass | ... |

## P0 issues found and fixed
| File | Issue | Fix applied | Verified |
| ... | ... | ... | yes/no |

## P1 issues found and fixed
| File | Issue | Fix applied | Verified |

## P2 issues deferred
| File | Issue | Reason for defer |

## Cross-link audit
| File | Broken links found | Fixed | Notes |

## Description.json audit
| Folder | JSON parses | All required fields | Non-empty | Notes |
| PARENT | yes/no | yes/no | yes/no | ... |
| 001 | ... |
| ...

## Final verdict

PASS | PASS-WITH-CAVEATS | FAIL

≤300 word justification.

## Recommendations for the user

- Anything the user should review manually
- Anything that's still drift but acceptable for now
- Any follow-up spec-folder work suggested
```

---

## Constraints

- **DO NOT modify any file under `<PARENT>/research/`** (frozen)
- **DO NOT modify any file under `<PARENT>/memory/`** (frozen)
- **DO NOT modify the audit at `<PARENT>/scratch/spec-doc-audit.md`** or `<PARENT>/scratch/spec-doc-phase-2-summary.md` (history)
- DO NOT modify any template file
- DO NOT dispatch sub-agents (LEAF-only)
- Fix what you can; document what you can't
- Be specific in the report — no "looks good" vagueness
- If a validator complains about a section that's intentionally absent (e.g., research-only initiative skipping deployment readiness), document the N/A justification in the file itself

## When done

Exit. Claude orchestrator will:
1. Read your phase-3 report
2. Update memory with the spec-doc perfection summary
3. Final summary to user
