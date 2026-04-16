# Iteration 7 — Python and Go AST extraction depth

> Engine: cli-codex (gpt-5.4 high), sandbox=read-only. The codex agent ran the full source trace and assembled the report inside a Python heredoc, but the read-only sandbox blocked both the heredoc temp file (`zsh:1: can't create temp file for here document`) and a fallback Python `open(...)` write. The orchestrator extracted the assembled report from the stdout reasoning trace and reformatted shell-escape artifacts back into clean markdown without altering the findings.

## Summary
Codesight's Python path is **partially real AST**: it spawns `python3 -c` or `python -c` and uses stdlib `ast.parse(...)` for route decorators and SQLAlchemy classes, but route fidelity is still well below the TypeScript extractor because it only keeps method/path/params and misses FastAPI router-prefix composition plus decorator metadata like `status_code` and `response_model`.

Go is **weaker on parser reality**: there is no `go/parser` or subprocess at all, only brace tracking plus regex, yet the emitted routes/models are still labeled `confidence: "ast"`. The label is misleading; a more honest tag would be `"structured"` or `"heuristic"`.

## Files Read
- external/src/ast/extract-python.ts:1-412
- external/src/ast/extract-go.ts:1-386
- external/src/detectors/routes.ts:79-93, 720-890 (non-TS dispatch)
- external/src/detectors/schema.ts:24-40, 298-385 (non-TS ORMs)
- external/eval/fixtures/fastapi-sqlalchemy/ground-truth.json:1-29, repo.json:1-16
- external/eval/fixtures/gin-gorm/ground-truth.json:1-25, repo.json:1-16
- external/tests/detectors.test.ts:202-234 (non-TS test cases)

## Findings

### Finding 1 — Python is truly AST-backed; Go is not
- Source: `external/src/ast/extract-python.ts:20-126, 128-290, 295-348, 354-395`; `external/src/detectors/routes.ts:729-748, 769-795, 816-834`; `external/src/detectors/schema.ts:312-360`; `external/src/ast/extract-go.ts:1-12, 86-158, 160-246, 254-349`
- What it does: Python route and schema extraction really does invoke a parser: `PYTHON_ROUTE_SCRIPT` and `PYTHON_SCHEMA_SCRIPT` call `ast.parse(...)`, and the Node wrapper spawns `python3`/`python` with `-c`, streams file contents on stdin, and returns parsed JSON on success. If Python is unavailable or parsing fails, the detectors fall back to regex. **Go does not do that.** The file explicitly says it uses "brace-tracking + regex" and "without needing the Go compiler," then implements group parsing, route matching, and struct parsing with regexes and brace extraction rather than `go/parser` or a subprocess.
- Why it matters for Code_Environment/Public: The Python pattern is genuinely transferable: real AST when the host has Python, regex fallback when it doesn't. The Go pattern is the wrong lesson — its "AST" label is dishonest. If we ever add Go support, either (a) actually shell out to `go run` with a `golang.org/x/tools/go/parser` helper, or (b) label it `"heuristic"` and never `"ast"`.
- Evidence type: source-confirmed
- Recommendation: adopt the Python pattern; reject the Go labeling
- Affected area: AST extraction architecture, confidence labeling discipline
- Risk/cost: low — labeling is free, real Go AST is medium effort

### Finding 2 — FastAPI, Flask, and Django route extraction is route-shape only
- Source: `external/src/ast/extract-python.ts:49-86, 354-371, 40-47, 88-113`; `external/src/detectors/routes.ts:722-749`; `external/eval/fixtures/fastapi-sqlalchemy/repo.json:8-13`; `external/eval/fixtures/fastapi-sqlalchemy/ground-truth.json:2-12`
- What it does: FastAPI/Flask parsing only reads the first positional path argument and, for `route`/`api_route`, the `methods` keyword. There is no handling for `status_code`, `response_model`, `dependencies`, `tags`, or other decorator kwargs; returned route objects only contain method, path, params, file, tags, framework, and confidence. Django support is even thinner: it looks for `urlpatterns` assignments that are either a list or list-plus-list, recognizes `path` / `re_path` / `url`, and assigns every match `method: "ALL"`. The biggest FastAPI gap is **prefix composition**: `detectFastAPIRoutes()` extracts decorators file-by-file and never combines them with `app.include_router(..., prefix="/api/...")` from the application entrypoint. The fixture proves this mismatch: `repo.json` mounts routers under `/api/users`, `/api/items`, and `/api/auth`, but `ground-truth.json` expects unprefixed `/`, `/{user_id}`, `/login`, and `/register` paths instead — the fixture has been normalized to the extractor's current limitation.
- Why it matters for Code_Environment/Public: This is a load-bearing example of how a fixture can hide a real bug by being authored against the extractor instead of the runtime behavior. If we adopt the F1 fixture pattern (iter 4), we have to write fixtures against actual runtime URLs, not against the extractor's current output. Otherwise the harness becomes a tautology.
- Evidence type: source-confirmed + fixture-confirmed
- Recommendation: adopt the lesson (write fixtures against runtime, not against the parser)
- Affected area: regression testing discipline, FastAPI extraction
- Risk/cost: low — discipline-only

### Finding 3 — Go does a decent job on group prefixes, but not on middleware or semantics
- Source: `external/src/ast/extract-go.ts:36-57, 86-158, 168-246, 18-22, 173-181, 188-196, 216-224, 233-241`; `external/eval/fixtures/gin-gorm/repo.json:7-14`; `external/eval/fixtures/gin-gorm/ground-truth.json:23-25`
- What it does: The Go extractor does more path composition than Python routes do. It resolves chained `Group("/prefix")` calls for Gin/Echo/Fiber, handles `chi.Route("/prefix", func(...) { ... })`, and then rewrites group-local route hits into full paths. It also supports uppercase Gin/Echo methods, PascalCase Fiber/Chi methods, `chi.Method(...)`, and `net/http` `HandleFunc`/`Handle` patterns including Go 1.22 `"GET /path"` strings. What it does **not** do is capture middleware or handler semantics. The route objects built in `extractRoutesFromBlock()` never set `middleware`, and group parsing only tracks `prefix`, `body`, and `varName`. The `gin-gorm` fixture includes `api.Use(middleware.Auth())` and even advertises `"middleware": ["auth"]` in ground truth, but this extractor alone cannot produce that field — meaning the middleware comes from a different detector path or the ground truth is unmet.
- Why it matters for Code_Environment/Public: Group-prefix resolution is genuinely useful and worth borrowing for any "compose path segments across nested constructs" feature. The middleware blind spot is a known limitation worth documenting if we port the structured-regex pattern.
- Evidence type: source-confirmed + fixture-confirmed
- Recommendation: adopt the prefix composition pattern; document the middleware gap
- Affected area: route extraction, structured-regex pattern reuse
- Risk/cost: low

### Finding 4 — SQLAlchemy is fairly rich AST extraction; GORM is heuristic best-effort
- Source: `external/src/ast/extract-python.ts:131-195, 197-250, 261-289`; `external/src/detectors/schema.ts:298-340`; `external/src/ast/extract-go.ts:260-277, 282-345`
- What it does: SQLAlchemy extraction is the strongest non-TS path in this pass. It uses Python AST to find model base classes, parses `Column(...)`, `mapped_column(...)`, `relationship(...)`, promotes `Mapped[...]` annotations into types, and records flags like `pk`, `unique`, `nullable`, `default`, `index`, and `fk`. The schema detector prefers this AST output and only falls back to regex if AST returns nothing. GORM is materially looser: a struct counts as a model if its body contains `gorm.Model`, `gorm.DeletedAt`, a ``gorm:`` tag, or even a plain ``json:`` tag, which can over-admit ordinary DTO structs. Field parsing is line-based regex, relations are inferred from `foreignKey` / `many2many` tags or pointer/slice type heuristics, and the result is still labeled `confidence: "ast"`.
- Why it matters for Code_Environment/Public: Note the asymmetry — the Python ORM gets `index` extraction (something Drizzle does NOT get per iter 5 finding 3), while the Go ORM gets a wide net that produces false positives. If we lift schema extraction logic, prefer the SQLAlchemy pattern, and explicitly label GORM-style heuristic extraction with low confidence.
- Evidence type: source-confirmed
- Recommendation: adopt the SQLAlchemy pattern; reject the GORM over-admission and false `"ast"` labeling
- Affected area: ORM/schema detector architecture
- Risk/cost: medium

### Finding 5 — "Supported" versus "best-effort" is mostly implicit, not explicitly labeled
- Source: `external/src/types.ts:54-75`; `external/src/detectors/routes.ts:741-747, 786-793, 827-833, 865-885`; `external/src/detectors/schema.ts:359-360`; `external/src/ast/extract-go.ts:1-12, 180-195, 223-240, 343-344`
- What it does: The shared type system only defines two confidence states, `"ast"` and `"regex"`. There is no richer label like `"structured"`, `"heuristic"`, `"partial"`, or framework-specific confidence score. In practice, Python AST results are accurately labeled `"ast"` and regex fallbacks are possible, but the non-TS fallbacks shown here often **omit `confidence` entirely** instead of marking `"regex"`. Go is the most misleading case: its structured regex parser emits `"ast"` despite not using a Go AST at all.
- Why it matters for Code_Environment/Public: This is a labeling discipline failure that we should explicitly fix on adoption. Add at least three confidence states (`ast`, `structured`, `regex`), default unmarked to `"regex"`, and never let a non-AST path emit `"ast"`. The cost is one type union and ~5 line-per-detector edits.
- Evidence type: source-confirmed
- Recommendation: adopt the labeling fix; reject the binary `ast|regex` enum
- Affected area: confidence labeling, downstream consumer trust
- Risk/cost: low

### Finding 6 — The eval fixtures and tests under-exercise the weakest areas
- Source: `external/eval/fixtures/fastapi-sqlalchemy/repo.json:8-14`; `external/eval/fixtures/fastapi-sqlalchemy/ground-truth.json:2-29`; `external/eval/fixtures/gin-gorm/repo.json:7-14`; `external/eval/fixtures/gin-gorm/ground-truth.json:2-25`; `external/tests/detectors.test.ts:202-234`
- What it does: The `fastapi-sqlalchemy` fixture does exercise decorator routes, path parameters, and SQLAlchemy relationships, but it does not test `status_code`, `response_model`, or router-prefix synthesis. In fact, its `ground-truth.json` is normalized to the extractor's current limitation by expecting router-local paths instead of runtime-prefixed paths. The `gin-gorm` fixture is better for path-prefix resolution because it includes nested route groups and GORM models with tags and relations. But the requested tests do not backstop most of this surface: `detectors.test.ts` only contains FastAPI and Django route smoke tests, with no Flask, Gin, Echo, Fiber, Chi, SQLAlchemy, or GORM cases in the requested test file.
- Why it matters for Code_Environment/Public: Iteration 4 finding 5 already established that ~14 frameworks have live route tests but only Drizzle/Prisma have schema tests. This iteration adds: even where fixtures *exist*, they can be authored to match the parser's current behavior rather than runtime truth. The fix is to require that every fixture includes at least one assertion that fails against a regex-only fallback — making the test sensitive to AST regression.
- Evidence type: test-confirmed (negative)
- Recommendation: adopt the fixture-discipline rule (assertions must distinguish AST from fallback)
- Affected area: regression testing discipline
- Risk/cost: low

## Language Extraction Parity Table
| Language | Frameworks claimed | AST? regex? structured? | TS-parity score (0-100) | Source proof |
|----------|-------------------|------------------------|------------------------|--------------|
| TypeScript | Hono, NestJS, Express, Fastify, Koa, Elysia, tRPC | Real TS AST via `parseSourceFile(...)`; extracts prefixes, params, NestJS guard metadata | 100 (baseline) | `external/src/ast/extract-routes.ts:1-50, 55-140, 157-238` |
| Python | FastAPI, Django, Flask | Real Python stdlib AST via subprocess (`python3 -c "ast.parse(...)"`), with regex fallback in detectors; route output is mostly method/path/params only | 60 | `external/src/ast/extract-python.ts:20-126, 128-290`; `external/src/detectors/routes.ts:720-838`; `external/src/detectors/schema.ts:298-360` |
| Go | Gin, Echo, Fiber, Chi, net/http, GORM | Structured regex + brace tracking; **no Go AST parser**; detector also has regex fallback; mislabels output as `"ast"` | 45 | `external/src/ast/extract-go.ts:1-12, 24-246, 254-349`; `external/src/detectors/routes.ts:840-890`; `external/src/detectors/schema.ts:368-385` |

## Open Questions / Next Focus
- Check whether any downstream enrichment step outside the requested files reconstructs FastAPI `include_router()` prefixes or Gin middleware after raw route extraction.
- Verify whether there are broader eval assertions outside `external/tests/detectors.test.ts` for Flask, Gin/Echo/Fiber/Chi, SQLAlchemy, and GORM, because the requested test surface is thin.
- Quantify how often Python falls back to regex in practice (would require running the harness against fixtures and capturing the confidence distribution).

## Cross-Phase Awareness
This iteration stayed inside phase 002-codesight by reading only Codesight's own Python/Go extractors, schema detectors, and fixtures. It did not analyze contextador's MCP query design (phase 003) or graphify's NetworkX/Leiden (phase 004). The language-parity finding has no overlap with either phase.

## Sandbox Note
The codex agent successfully completed the full source trace and assembled the report inside a Python heredoc, but the read-only sandbox blocked both the heredoc temp file and a fallback `Path.write_text` call. The full assembled report was preserved in the stdout reasoning trace before the failed write and was extracted verbatim into this iteration file.

## Metrics
- newInfoRatio: 0.88
- findingsCount: 6
- focus: "iteration 7: python and go AST extraction depth"
- status: insight
