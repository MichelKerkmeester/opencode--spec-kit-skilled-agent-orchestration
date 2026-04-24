# 009 Impact Analysis — 09 (009-skill-advisor-standards-alignment)

## Sub-packet Summary
- Sub-packet: `009-skill-advisor-standards-alignment`
- Spec docs read:
  `spec.md` (depth 0)
  `plan.md` (depth 0)
  `tasks.md` (depth 0)
  `implementation-summary.md` (depth 0)
- Work performed:
  Added `## 10. OPENCODE PLUGIN EXEMPTION TIER` to `sk-code-opencode` so OpenCode plugins and plugin helpers are explicitly exempt from the blanket `module.exports` rule because the loader requires ESM default export.
  Annotated the JavaScript checklist CommonJS P1 item to point at that new exemption tier.
  Brought `.opencode/plugins/spec-kit-skill-advisor.js` into standards parity with header `COMPONENT:` / `PURPOSE:` fields, 6 numbered ALL-CAPS section dividers, and 7 JSDoc blocks.
  Kept the packet behavior-neutral: no plugin logic edits, no hook/daemon/schema/wiring changes, and verification stayed green.
- Key surfaces touched: `standards docs`, `plugin documentation structure`, `OpenCode plugin module-format contract`

## Files Requiring Updates
| Path | Category | Reason | Severity | Suggested Change |
|---|---|---|---|---|
| `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | Skill | The packet explicitly documents that OpenCode plugins must use ESM default export, but this file still labels `.opencode/plugins/spec-kit-skill-advisor.js` as a "CommonJS entrypoint," which would now be incorrect for the plugin bridge contract. | HIGH | Update the OpenCode plugin bridge section to describe `spec-kit-skill-advisor.js` as an OpenCode plugin ESM entrypoint/default-export factory, not CommonJS. |
| `AGENTS.md` | AGENTS.md | The packet adds an OpenCode Plugin Exemption Tier because the blanket JavaScript `require`/`module.exports` rule conflicts with plugin loading. This file still summarizes JavaScript for "ALL OpenCode system code" as `require`/`module.exports`, which is now too broad and misleading for `.opencode/plugins/` and `.opencode/plugin-helpers/`. | HIGH | Amend the `sk-code-opencode` language table to note the OpenCode plugin ESM exemption, or narrow the row so plugin files are excluded from the blanket CommonJS guidance. |

## Files Not Requiring Updates (from audit)
- `README`, `Document`, `Command`, and `Agent` audit entries were checked and deemed orthogonal because this packet did not change command behavior, daemon lifecycle, cache policy, schema shape, hook wiring, or renderer output.
- Most `Skill` audit entries, including the hook references and skill-advisor operator docs, remain accurate because they describe runtime surfaces and fallback behavior that this packet did not alter.
- Audit entries that only cite `spec-kit-skill-advisor.js` by path do not need updates when they omit module-format claims; the packet changed standards alignment and file comments/JSDoc, not runtime paths or delegation order.

## Evidence
- `.opencode/skill/system-spec-kit/ARCHITECTURE.md`
  Source: [spec.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/009-skill-advisor-standards-alignment/spec.md:63) states the existing CommonJS rule conflicts with the OpenCode plugin loader and that plugins "MUST use ESM or the loader rejects them"; [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/009-skill-advisor-standards-alignment/implementation-summary.md:49) records the new exemption tier and [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/009-skill-advisor-standards-alignment/implementation-summary.md:50) says the loader requires ESM default export.
  Target: [ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/ARCHITECTURE.md:350) still says `.opencode/plugins/spec-kit-skill-advisor.js` is a "CommonJS entrypoint".
- `AGENTS.md`
  Source: [spec.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/009-skill-advisor-standards-alignment/spec.md:65) defines the conflict between the checklist's `module.exports` rule and the plugin loader's ESM requirement; [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/009-skill-advisor-standards-alignment/implementation-summary.md:49) and [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/009-skill-advisor-standards-alignment/implementation-summary.md:50) confirm the new exemption is specifically for OpenCode plugins and plugin helpers.
  Target: [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md:373) frames `sk-code-opencode` as the standards skill for "ALL OpenCode system code," and [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md:379) still gives JavaScript the blanket `require`/`module.exports` pattern.

## Uncertainty
- The audit inventory file is the user-designated canonical source, but its title and summary header still reference `005-release-cleanup-playbooks` rather than `009-hook-package`. I used its listed paths as authoritative for this analysis anyway.
