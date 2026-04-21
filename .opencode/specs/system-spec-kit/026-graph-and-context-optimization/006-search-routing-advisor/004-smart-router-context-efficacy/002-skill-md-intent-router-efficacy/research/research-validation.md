# Research Validation: V1-V10 Decisions

| V | Question | Evidence Strength | Decision | Validation |
|---|----------|-------------------|----------|------------|
| V1 | Inventory + shape variance | Strong | adopt-now | `rg` and AST parsing found 20 skills and concrete router aliases. |
| V2 | Resource budget | Strong | adopt-now | Byte counts are deterministic over local files; median ALWAYS resources are 15,296 bytes. |
| V3 | Behavioral signal | Moderate | prototype-later | 1,014 research iteration files scanned; artifact citations are useful but not live telemetry. |
| V4 | Intent accuracy | Moderate | prototype-later | 30-prompt sample scored 17/26 non-UNKNOWN, but labels are skill-level rather than route-level. |
| V5 | Compliance gap | Moderate | prototype-later | Broad resource citations exist, but exact compliance requires read telemetry. |
| V6 | ALWAYS bloat | Strong | adopt-now | Four skills exceed 50% of `SKILL.md + loadable resource tree`; denominator is documented. |
| V7 | ON_DEMAND coverage | Strong | adopt-now | Exact keyword matching over 200 prompts found 11 hits, or 5.5%. |
| V8 | UNKNOWN fallback | Strong | adopt-now | Direct router text shows CLI generation fallbacks and safer UNKNOWN checklist variants. |
| V9 | Enforcement | Strong | prototype-later | Runtime/config searches found no intra-skill read filter; Smart Routing is advisory. |
| V10 | Measurement plan | Design | adopt-now | Harness design is complete enough for implementation but not executed. |

## Key Decisions

- Treat Smart Routing as a manifest and measurement target, not as enforced behavior.
- Use loadable resource tree, not raw skill subtree, for primary savings and bloat interpretation.
- Report tier compliance as `needs-harness`.
- Prefer observe-only telemetry before warn/block enforcement.

## Validation Notes

- Deterministic commands used: `rg`, `find`, `wc -l`, Python AST parsing, and byte accumulation.
- MCP CocoIndex semantic search was attempted for V9 but cancelled by the MCP layer; exact `rg` and direct config reads were used instead.
- No files outside the pre-approved `002-skill-md-intent-router-efficacy` packet were modified.
