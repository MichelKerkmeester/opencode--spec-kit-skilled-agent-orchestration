# Iteration 12 — Middleware detector precision and test depth

## Summary
`detectMiddleware()` is one of Codesight's clearest "good enough, not structural" subsystems. It works by filename hints plus regex classification over names and the first 500 characters of file content, then adds a second pass that looks for `.use(fn(` call shapes inside route files. The result is helpful for assistant breadcrumbs but too heuristic to present as reliable middleware topology.

## Files Read
- `external/src/detectors/middleware.ts:1-138`
- `external/tests/detectors.test.ts:414-430`

## Findings

### Finding 1 — Middleware discovery is path-driven before it is semantic
- Source: `external/src/detectors/middleware.ts:86-109`
- What it does: the detector starts by selecting files whose paths include `middleware`, `guard`, `interceptor`, or whose basename starts with `auth` / includes `rate` / `cors`. Only those files are classified as first-class middleware files.
- Why it matters for Code_Environment/Public: This is fast and cheap, but it misses middleware implemented under neutral names or framework-specific folders. It is a naming heuristic, not a code-model.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: middleware surfacing
- Risk/cost: medium

### Finding 2 — Classification is regex over names plus the first 500 content characters
- Source: `external/src/detectors/middleware.ts:5-78`
- What it does: `classifyMiddleware()` concatenates the filename and only the first 500 chars of content, then matches against regex buckets for `auth`, `rate-limit`, `cors`, `validation`, `logging`, and `error-handler`. Anything else becomes `custom`.
- Why it matters for Code_Environment/Public: This is appropriate for lightweight tagging, but it is easy to false-positive on imported names and easy to miss meaning that appears later in the file.
- Evidence type: source-confirmed
- Recommendation: adopt now
- Affected area: low-authority tagging
- Risk/cost: low

### Finding 3 — Inline middleware detection only recognizes `.use(fn(` call shapes
- Source: `external/src/detectors/middleware.ts:111-136`
- What it does: route files are rescanned with `/\\.use\\s*\\(\\s*(\\w+)\\s*\\(/g`, which only catches direct identifier calls such as `app.use(cors())` or `app.use(rateLimit(...))`. Anonymous wrappers, arrays, decorator-based middleware, and method chaining outside `.use(...)` are invisible.
- Why it matters for Code_Environment/Public: This confirms the surface is a convenience index, not a framework-accurate middleware graph.
- Evidence type: source-confirmed
- Recommendation: prototype later
- Affected area: middleware graphing
- Risk/cost: medium

### Finding 4 — Test coverage proves presence, not precision
- Source: `external/tests/detectors.test.ts:414-430`
- What it does: the only explicit middleware fixture asserts that at least two middleware entries are detected from `src/middleware/auth.ts` and `src/middleware/rate-limit.ts`. It does not assert the inferred types, inline `.use(...)` coverage, or false-positive behavior.
- Why it matters for Code_Environment/Public: This is enough to prevent the detector from disappearing, but not enough to trust the classification quality.
- Evidence type: test-confirmed
- Recommendation: adopt now
- Affected area: regression strategy
- Risk/cost: low

## Recommended Next Focus
Stay in the shallow-detector layer and inspect `detectLibs()`, which looks like a helper-index analogue rather than a semantic module map.

## Metrics
- newInfoRatio: 0.71
- findingsCount: 4
- focus: "iteration 12: middleware detector precision and test depth"
- status: insight
