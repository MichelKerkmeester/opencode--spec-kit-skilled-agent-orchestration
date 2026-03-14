# Audit C-03: Manual Testing Playbook Completeness
## Summary
| Metric | Result |
|--------|--------|
| EX- scenarios | 34 |
| NEW- scenarios | 121 |
| Total scenarios | 155 |
| Complete scenarios | 40 |
| Incomplete scenarios | 115 |

## Incomplete Scenarios
| ID | Missing Fields |
|----|---------------|
| NEW-001..NEW-094 | Signals; Evidence; Pass/Fail criteria; Triage |
| NEW-095..NEW-102 | Signals |
| NEW-109..NEW-121 | Signals; Evidence; Pass/Fail criteria; Triage |

## Issues [ISS-C03-NNN]
### ISS-C03-001
- The EX table is structurally complete: all 34 `EX-` scenarios provide Prompt, Command, Signals, Evidence, Pass/Fail criteria, and Triage in a consistent 9-column matrix.
- The NEW table is not complete: `NEW-001..NEW-094` and `NEW-109..NEW-121` only provide Prompt and Command alongside ID/name/objective, so 107 scenarios are missing Signals, Evidence, Pass/Fail criteria, and Triage.

### ISS-C03-002
- `NEW-095..NEW-102` partially add verification content, but each row still omits the required Signals field.
- These eight scenarios therefore remain incomplete even though they include Evidence, Pass/Fail criteria, and Triage.

### ISS-C03-003
- NEW-scenario table formatting is inconsistent:
  - The header at line 78 defines only 5 columns (`Feature ID`, `Feature Name`, `Scenario + Objective`, `Exact Prompt`, `Exact Command Sequence`), but rows `NEW-095..NEW-108` append additional fields inline.
  - `NEW-106` contains unescaped pipe characters inside `rg` patterns (`mutation-feedback|response-hints|MutationHookResult|postMutationHooks`), which breaks the Markdown row into 13 cells instead of a stable scenario record.
- Heading ranges are also inconsistent with the actual content:
  - `## New Features (\`NEW-001..NEW-119\`)` includes `NEW-120` and `NEW-121`.
  - `### New Features (NEW-001..113)` in the cross-reference section still lists entries through `NEW-119`.

### ISS-C03-004
- Heading levels are otherwise consistent at the section level (`##` for major sections, `###` for subsections).
- No checkbox syntax appears in this playbook, so there is no checkbox-format defect to report.
