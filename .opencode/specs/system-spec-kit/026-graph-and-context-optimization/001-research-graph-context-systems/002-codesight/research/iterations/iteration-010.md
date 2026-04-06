# Iteration 10 — Components, telemetry, cumulative risk inventory

> Engine: cli-codex (gpt-5.4 high), sandbox=read-only. The codex agent ran the full source trace and assembled the report. The read-only sandbox blocked both heredoc and direct file writes (`zsh:1: can't create temp file for here document` and `zsh:1: operation not permitted: /tmp/codex-write-probe.txt`), proving `/tmp` is fully outside the sandbox. The orchestrator extracted the assembled report from the stdout reasoning trace and reformatted shell-escape artifacts back into clean markdown without altering the findings.

## Summary
Codesight's component extraction is **limited and asymmetric**: React gets modest AST-backed extraction of exported function/const components plus prop-name harvesting, while Vue/Svelte are filename-and-pattern scans and Solid/Qwik are unsupported. `telemetry.ts` is **local, opt-in token accounting** rather than phone-home analytics: no HTTP, no identity reads, and no install hook surfaced in source. For `Code_Environment/Public`, the safest adoption path remains selective pattern-lifting, with the real risk concentrated in misleading token claims, unsafe assistant-profile emission, and heuristic graph overlays — **not** telemetry.

## Files Read
- external/src/telemetry.ts:1-339
- external/src/detectors/components.ts:1-309
- external/src/ast/extract-components.ts:1-216
- external/src/index.ts:44, 60, 357-358, 415-421
- external/package.json:1-15
- external/tests/detectors.test.ts:24, 328-343, 497
- external/src/formatter.ts:1-59, 126-143
- external/src/scanner.ts:332-338
- external/src/types.ts:34-45, 83-89
- research/research.md:182-203, 191-198, 226-257, 292-321, 338-345, 463-511 (the prior synthesis from iters 1-5)

## Findings

### Finding 1 — Component extraction depth is shallow and React-biased
- Source: `external/src/detectors/components.ts:72-85, 88-209, 211-309`; `external/src/ast/extract-components.ts:1-216`; `external/src/scanner.ts:332-338`; `external/src/types.ts:34-45, 83-89`
- What it does: Codesight only recognizes three component frameworks at all: `react`, `vue`, and `svelte`. React tries AST first, but the 216-line AST helper is entirely React-specific and only recognizes exported uppercase function declarations or exported const/function expressions, plus `forwardRef`/`memo` wrappers; it emits just `name`, `file`, `props`, `isClient`, `isServer`, and optional `confidence`. Vue and Svelte do not use AST here; they derive the component name from the filename and scrape prop names from `defineProps` / `props: {}` / `export let` / `$props()`.
- Why it matters for Code_Environment/Public: This is **much shallower** than the route extractor from earlier iterations, which captures prefixes, params, middleware, decorators, and confidence-backed structural detail. There is no React class-component handling, no Solid/Qwik branch, no render-tree/composition extraction, and no framework-specific semantic model.
- Evidence type: source-confirmed
- Recommendation: prototype later only if Code_Environment/Public wants a shallow assistant index; do not present this as deep component understanding
- Affected area: component detection, assistant context surface
- Risk/cost: medium — cheap to port, easy to oversell

### Finding 2 — `.codesight/components.md` is a breadcrumb index, not a deep assistant artifact
- Source: `external/src/formatter.ts:25-29, 126-143`; `external/src/types.ts:83-89`; `external/tests/detectors.test.ts:328-343`
- What it does: `components.md` is a flat bullet list: component name, optional `[client/server]` marker, comma-joined prop names, and file path. The only component-specific test in `detectors.test.ts` is a React spot-check that ensures at least two components are found and one prop name (`name`) is present.
- Why it matters for Code_Environment/Public: This is useful as a lightweight map that tells an assistant which UI file to open next, but it is surface-level compared with `routes.md`, which carries method/path/params/request/response/tag detail. It does not preserve prop types, default values, emitted events, slot/children behavior, framework composition, or hierarchy.
- Evidence type: source-confirmed
- Recommendation: keep low-authority if adopted; pair with richer AST or symbol extraction before treating it as a first-class context source
- Affected area: static artifact usefulness
- Risk/cost: low-medium

### Finding 3 — Telemetry posture is local-only, opt-in, and NOT a phone-home blocker
- Source: `external/src/telemetry.ts:14-16, 44-54, 62-127, 135-185, 193-245, 248-339`; `external/src/index.ts:357-358, 415-421`; `external/package.json:10-15`
- What it does: `--telemetry` imports `runTelemetry`, reads the local project files and generated `CODESIGHT.md`, estimates tokens via `Math.ceil(text.length / 4)`, and writes a local `telemetry.md` report. The module imports only `node:fs/promises` and `node:path`, and the package scripts contain only `build`, `dev`, `test`, and `prepublishOnly`.
- Why it matters for Code_Environment/Public: As shipped in this checkout, **there is no HTTP client, no `fetch`, no `net` usage, no identity or machine reads, no env-based telemetry init path, and no `postinstall`/`preinstall` hook**. The control surface is opt-in CLI usage, not opt-out analytics. That means telemetry is not a hard blocker for adoption in its current source form. This is the most reassuring finding of the entire 10-iteration session: Codesight has not buried surveillance in a "telemetry" name.
- Evidence type: source-confirmed
- Recommendation: low-risk to borrow only as a local, explicitly-invoked measurement mode; if Public ports anything like this, keep it opt-in and ban external sinks by policy
- Affected area: governance, measurement tooling
- Risk/cost: low

### Finding 4 — The final adoption risk surface is mostly about honesty and integration boundaries
- Source: `research/research.md:191-198, 232-257, 292-321, 338-345, 463-511`; `external/src/telemetry.ts:248-339`
- What it does: Prior iterations already established that Codesight's strongest portable patterns are orchestration shape, AST-first confidence-label discipline, conditional static artifact emission, honest hot-file ranking, and the F1 fixture harness. The recurring failure modes are different: misleading token-savings claims (iter 4 + iter 8), unsafe root-level assistant file emission (iter 4 finding 1), heuristic graph overlays (iter 3 blast-radius), and over-trusting starter graph math (iter 3 hot-file ranking).
- Why it matters for Code_Environment/Public: For Public, the right move is **not to port Codesight wholesale**. It is to lift the low-risk architectural patterns, put guardrails around medium-risk features, and reject any user-facing claim or integration behavior that exceeds what the source can actually prove.
- Evidence type: source-confirmed plus phase synthesis
- Recommendation: adopt low-risk patterns now; gate medium-risk items behind namespacing, honesty labels, and bug fixes; reject unverified claims outright
- Affected area: adoption strategy
- Risk/cost: mixed

## Component Extraction Coverage
| Framework | Component file types | Props extracted? | AST depth | Source proof |
|-----------|---------------------|-----------------|-----------|--------------|
| React | `.tsx`, `.jsx` | Prop names only from destructuring, `FooProps` interface/type, or inline type literals; output does not include prop types/defaults, and class components are not handled | Medium: exported function/const components plus `forwardRef`/`memo` wrappers only | `external/src/detectors/components.ts:93-205`; `external/src/ast/extract-components.ts:35-160, 167-215` |
| Vue | `.vue` | Prop names only from `defineProps<{...}>` / `defineProps({...})` or `props: {}` scraping | Low: no AST, filename + regex/string matching | `external/src/detectors/components.ts:216-259` |
| Svelte | `.svelte` | Prop names only from `export let` and `$props()` destructuring | Low: no AST, filename + regex/string matching | `external/src/detectors/components.ts:263-309` |
| Solid | none | No dedicated extraction path | None | `external/src/types.ts:34`; `external/src/scanner.ts:332-338`; `external/src/detectors/components.ts:76-85` |
| Qwik | none | No dedicated extraction path | None | `external/src/types.ts:34`; `external/src/scanner.ts:332-338`; `external/src/detectors/components.ts:76-85` |

## Telemetry Audit
| Question | Answer | Source |
|----------|--------|--------|
| Network calls? | no | `external/src/telemetry.ts:14-16, 248-339`; `external/src/index.ts:357-358, 415-421` |
| Opt-out? | no env var or config flag surfaced; telemetry is explicit opt-in via `--telemetry`, so default behavior is already off | `external/src/index.ts:357-358, 415-421` |
| postinstall hook? | no | `external/package.json:10-15` |
| Identity collected? | no; the module reads project files and `CODESIGHT.md` only | `external/src/telemetry.ts:48-54, 67-115, 162-168, 222-227, 253-255` |
| Adoption blocker? | **no** for this source snapshot; only conditional if a future port adds external sinks or hidden auto-init | `external/src/telemetry.ts:248-339`; `external/src/index.ts:357-358, 415-421` |

## Cumulative Risk Inventory (Iters 1-10)
| Adoption candidate | Iter source | Risk tier | Reason |
|--------------------|------------|-----------|--------|
| Orchestration shape (one canonical scan, late-bound projections) | iter 5 | low | Strong pattern with late-bound projections; the real issue is duplicated helper code, not the architecture itself |
| Per-tool profile overlay (CLAUDE/Cursor/Codex/Copilot/Windsurf) | iter 4 | medium | High-value pattern, but Public must avoid hardcoded tool names and root-level file clobbering |
| F1 fixture harness | iter 4 | low | Small, zero-dependency regression pattern with clear ground-truth semantics |
| Blast-radius reverse BFS | iter 3 | medium | Traversal direction is useful, but the as-shipped implementation leaks nodes past `maxDepth` (off-by-one bug) |
| Hot-file ranking | iter 3 | low | Fine if named honestly as depended-on count rather than centrality |
| Static `.codesight/` artifact emission (conditional) | iter 5 | low | Clean static-first / MCP-overlay split and conditional file emission rules are directly portable |
| AST-first / regex-fallback pattern with `confidence` label | iter 1-2 | low | High leverage if confidence labels stay explicit; iter 7 found Go mislabels itself, fix on adoption |
| Token stats math | iter 8 | high if marketed / low if disclosed | Heuristic linear formula with zero tests; any externally-facing savings claim is risky |
| Contract enrichment via regex post-mutation | iter 6 | medium | Useful as best-effort backfill, but cannot recover structure missing from regex fallback; tRPC totally ignored |
| Telemetry surface | iter 10 | low | Local-only, opt-in markdown reporting with no network or install hook surface |
| Monorepo/config/plugin contract | iter 9 | medium | Monorepo aggregation is useful, but missing turbo/nx/lerna detection; plugin contract real but untested |
| Python AST + subprocess pattern | iter 7 | low | Spawn `python3 -c "ast.parse(...)"` is genuinely portable; adopt as the cross-language AST template |
| Go structured-regex pattern (with honest labeling) | iter 7 | medium | Useful for prefix composition; mislabels confidence as `"ast"` — must fix |
| SQLAlchemy AST schema extraction | iter 7 | low | Strongest non-TS schema path; includes index/fk extraction (richer than Drizzle path per iter 5) |
| GORM heuristic schema extraction | iter 7 | high | Over-admits non-model structs; mislabels as `"ast"`; reject |
| Component detection | iter 10 | medium | Shallow; React-biased; useful only as breadcrumb index, not as deep context |
| Drizzle index extraction (gap) | iter 2 + iter 5 | known gap | Not adoptable because not implemented; document as a hole in any port |

## Open Questions / Next Focus
none — ready for synthesis

## Cross-Phase Awareness
This iteration stayed inside phase 002-codesight by reading only Codesight's own components, telemetry, formatter, scanner, types, and the prior research synthesis. It did not analyze contextador's MCP query design (phase 003) or graphify's NetworkX/Leiden (phase 004). The component-extraction and telemetry findings have no overlap with either phase. The cumulative risk inventory references prior iteration findings only.

## Sandbox Note
The codex agent successfully completed the source trace and assembled the report inside a heredoc. The read-only sandbox blocked both the heredoc temp file and a direct `printf > /tmp/codex-write-probe.txt` probe, confirming `/tmp` is fully outside the sandbox boundary. The full assembled report was preserved in the stdout reasoning trace and was extracted verbatim into this iteration file.

## Metrics
- newInfoRatio: 0.44 (lower because half of the iteration is rolling up prior findings into a risk inventory)
- findingsCount: 4
- focus: "iteration 10: components + telemetry + cumulative risk"
- status: insight
