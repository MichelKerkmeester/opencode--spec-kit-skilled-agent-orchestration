# Checklist — Memory Save Quality Root Cause Fixes

## P0: Correctness
- [x] Fix 1: CONTEXT ≠ RATIONALE for string-form decisions
- [x] Fix 2: JSON-mode sessions with nextSteps show COMPLETED status
- [x] Fix 3: Narratives mentioning "error"/"problem" no longer flagged as blockers
- [x] Fix 4: "Module Pattern" and "Functional Transforms" no longer emitted
- [x] Fix 5: Short generic bigrams ("and wrong", "not empty") filtered from triggers
- [x] Fix 6: Em dash and colon separators parsed correctly in filesModified
- [x] Fix 7: Files >150 tokens not auto-merged; max 3 children per merge group
- [x] Fix 8: JSON-mode conversations have >1 message when sessionSummary exists

## P1: No Regressions
- [x] 106/106 tests pass (runtime-memory-inputs, task-enrichment, generate-context-cli-authority, semantic-signal-golden)
- [x] CLI smoke test passes (`generate-context.js --help`)
- [x] shared/dist rebuilt after trigger-extractor changes
- [x] Golden test updated for intentional behavior change

## P2: Code Quality
- [x] Two independent ultra-think reviews: all fixes PASS
- [x] Review-identified issues (Fix 4 substring, Fix 5 allowlist) addressed
- [x] No scope creep — only files specified in plan were modified
- [x] Comments explain "why" for each fix (Fix 1-8 labels in code)
