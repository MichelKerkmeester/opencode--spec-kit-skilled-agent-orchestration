# Iteration 10: Per-Language Extractor Inventory + Final Adopt/Adapt/Reject Grounding

## Focus
This final iteration closes two remaining gaps for Q12: first, it inventories what each non-Python extractor in `graphify/extract.py` actually emits so Public can judge transferability by language instead of by marketing shorthand; second, it grounds the final Adopt/Adapt/Reject recommendation set in line-level evidence rather than earlier high-level iteration summaries. The key question is not whether graphify is "multi-language" in the abstract, but which concrete extractor patterns are portable, which need reshaping around Public's existing graph surfaces, and which should be rejected because graphify only implements them narrowly or inconsistently (`external/graphify/extract.py:301-2206`, `external/graphify/extract.py:2209-2496`, `external/graphify/validate.py:4-7,45-57`).

## Part A: Per-Language Extractor Inventory

### Language Extractor Matrix
| Language | Entry Function (file:line) | Emitted Node Types | Emitted Edge Types | Supports rationale? | Confidence tags used? | Cross-file inference? | Public's existing equivalent |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JavaScript / TypeScript / TSX | `extract_js` (`external/graphify/extract.py:301-485`), dispatched for `.js/.ts/.tsx` (`external/graphify/extract.py:2367-2387`) | File node plus class, function, and method nodes (`external/graphify/extract.py:352-424`) | `contains`, `method`, `imports_from`, `calls` (`external/graphify/extract.py:366-467`) | No. Only Python defines rationale extraction (`external/graphify/extract.py:152-236`) | `EXTRACTED` by default, `INFERRED` for call edges (`external/graphify/extract.py:340-345,466-467`; `external/graphify/validate.py:4-7,50-57`) | No. Second-pass cross-file resolution is Python-only (`external/graphify/extract.py:2209-2339,2485-2489`) | Existing Code Graph MCP structural surface (language parity not re-verified in this iteration) |
| Go | `extract_go` (`external/graphify/extract.py:488-671`) | File node plus function, method, and named type nodes (`external/graphify/extract.py:534-593`) | `contains`, `method`, `imports_from`, `calls` (`external/graphify/extract.py:548-653`) | No (`external/graphify/extract.py:488-671`) | `EXTRACTED` and `INFERRED` (`external/graphify/extract.py:522-527,652-653`; `external/graphify/validate.py:4-7,50-57`) | No (`external/graphify/extract.py:2209-2339,2485-2489`) | Existing Code Graph MCP structural surface (language parity not re-verified in this iteration) |
| Rust | `extract_rust` (`external/graphify/extract.py:674-838`) | File node plus free functions, impl methods, and declaration nodes for `struct`, `enum`, `trait`, and impl targets (`external/graphify/extract.py:720-776`) | `contains`, `method`, `imports_from`, `calls` (`external/graphify/extract.py:735-820`) | No (`external/graphify/extract.py:674-838`) | `EXTRACTED` and `INFERRED` (`external/graphify/extract.py:708-713,819-820`; `external/graphify/validate.py:4-7,50-57`) | No (`external/graphify/extract.py:2209-2339,2485-2489`) | Existing Code Graph MCP structural surface (language parity not re-verified in this iteration) |
| Java | `extract_java` (`external/graphify/extract.py:841-1008`) | File node plus class or interface nodes and method or constructor nodes (`external/graphify/extract.py:887-952`) | `contains`, `method`, `imports`, `calls` (`external/graphify/extract.py:915-920,932-990`) | No (`external/graphify/extract.py:841-1008`) | `EXTRACTED` and `INFERRED` (`external/graphify/extract.py:875-880,989-990`; `external/graphify/validate.py:4-7,50-57`) | No (`external/graphify/extract.py:2209-2339,2485-2489`) | Existing Code Graph MCP structural surface (language parity not re-verified in this iteration) |
| C / headers | `extract_c` (`external/graphify/extract.py:1011-1159`), dispatched for `.c/.h` (`external/graphify/extract.py:2415-2423`) | File node plus function nodes (`external/graphify/extract.py:1057-1098`) | `contains`, `imports`, `calls` (`external/graphify/extract.py:1080-1141`) | No (`external/graphify/extract.py:1011-1159`) | `EXTRACTED` and `INFERRED` (`external/graphify/extract.py:1045-1050,1140-1141`; `external/graphify/validate.py:4-7,50-57`) | No (`external/graphify/extract.py:2209-2339,2485-2489`) | Existing Code Graph MCP structural surface (language parity not re-verified in this iteration) |
| C++ | `extract_cpp` (`external/graphify/extract.py:1162-1332`), dispatched for `.cpp/.cc/.cxx/.hpp` (`external/graphify/extract.py:2424-2432`) | File node plus class nodes and function or method nodes (`external/graphify/extract.py:1208-1271`) | `contains`, `method`, `imports`, `calls` (`external/graphify/extract.py:1233-1314`) | No (`external/graphify/extract.py:1162-1332`) | `EXTRACTED` and `INFERRED` (`external/graphify/extract.py:1196-1201,1313-1314`; `external/graphify/validate.py:4-7,50-57`) | No (`external/graphify/extract.py:2209-2339,2485-2489`) | Existing Code Graph MCP structural surface (language parity not re-verified in this iteration) |
| Ruby | `extract_ruby` (`external/graphify/extract.py:1335-1494`) | File node plus class nodes and method nodes (`external/graphify/extract.py:1381-1433`) | `contains`, `method`, `calls` (`external/graphify/extract.py:1401-1476`) | No (`external/graphify/extract.py:1335-1494`) | `EXTRACTED` and `INFERRED` (`external/graphify/extract.py:1369-1374,1475-1476`; `external/graphify/validate.py:4-7,50-57`) | No (`external/graphify/extract.py:2209-2339,2485-2489`) | Existing Code Graph MCP structural surface (language parity not re-verified in this iteration) |
| C# | `extract_csharp` (`external/graphify/extract.py:1497-1671`) | File node plus namespace nodes, class or interface nodes, and method nodes (`external/graphify/extract.py:1543-1604`) | `contains`, `imports`, `method`, `calls` (`external/graphify/extract.py:1551-1653`) | No (`external/graphify/extract.py:1497-1671`) | `EXTRACTED` and `INFERRED` (`external/graphify/extract.py:1531-1536,1652-1653`; `external/graphify/validate.py:4-7,50-57`) | No (`external/graphify/extract.py:2209-2339,2485-2489`) | Existing Code Graph MCP structural surface (language parity not re-verified in this iteration) |
| Kotlin | `extract_kotlin` (`external/graphify/extract.py:1674-1848`), dispatched for `.kt/.kts` (`external/graphify/extract.py:2451-2459`) | File node plus class nodes and function or method nodes (`external/graphify/extract.py:1720-1779`) | `contains`, `imports`, `method`, `calls` (`external/graphify/extract.py:1729-1830`) | No (`external/graphify/extract.py:1674-1848`) | `EXTRACTED` and `INFERRED` (`external/graphify/extract.py:1708-1713,1829-1830`; `external/graphify/validate.py:4-7,50-57`) | No (`external/graphify/extract.py:2209-2339,2485-2489`) | Existing Code Graph MCP structural surface (language parity not re-verified in this iteration) |
| Scala | `extract_scala` (`external/graphify/extract.py:1851-2025`) | File node plus class-like declaration nodes and function or method nodes (`external/graphify/extract.py:1897-1958`) | `contains`, `imports`, `method`, `calls` (`external/graphify/extract.py:1906-2007`) | No (`external/graphify/extract.py:1851-2025`) | `EXTRACTED` and `INFERRED` (`external/graphify/extract.py:1885-1890,2006-2007`; `external/graphify/validate.py:4-7,50-57`) | No (`external/graphify/extract.py:2209-2339,2485-2489`) | Existing Code Graph MCP structural surface (language parity not re-verified in this iteration) |
| PHP | `extract_php` (`external/graphify/extract.py:2028-2206`) | File node plus class nodes and function or method nodes (`external/graphify/extract.py:2078-2139`) | `contains`, `imports`, `method`, `calls` (`external/graphify/extract.py:2085-2188`) | No (`external/graphify/extract.py:2028-2206`) | `EXTRACTED` and `INFERRED` (`external/graphify/extract.py:2066-2071,2187-2188`; `external/graphify/validate.py:4-7,50-57`) | No (`external/graphify/extract.py:2209-2339,2485-2489`) | Existing Code Graph MCP structural surface (language parity not re-verified in this iteration) |
| Lua | No extractor entry point and no `.lua` collector suffix are present (`external/graphify/extract.py:2367-2505`) | None | None | No | None | No | N/A |

### Per-Language Findings

#### JavaScript / TypeScript / TSX
- `extract_js` is a shared path for `.js`, `.ts`, and `.tsx`, so graphify does not distinguish JavaScript from TypeScript at the extractor-dispatch level (`external/graphify/extract.py:2367-2387`).
- The extractor emits file, class, function, and method nodes, then adds file-local `contains` / `method` edges plus `imports_from` edges to `_make_id(import_name)` targets instead of creating dedicated import nodes (`external/graphify/extract.py:352-424`).
- Call edges are the only non-default-confidence edges in this extractor, and they are marked `INFERRED` rather than `EXTRACTED` (`external/graphify/extract.py:444-467`).

#### Go
- The Go path adds more than just functions: it emits receiver methods and named `type_spec` nodes, which makes it slightly richer than the C and Ruby extractors (`external/graphify/extract.py:547-593`).
- Imports are normalized to `imports_from` edges, but still only at file scope; there is no Go-specific second pass to connect importing types or methods to imported declarations (`external/graphify/extract.py:598-613`, `external/graphify/extract.py:2485-2489`).
- Like JS, Go marks discovered calls as `INFERRED` (`external/graphify/extract.py:630-653`).

#### Rust
- Rust is the richest non-Python extractor in declaration coverage: it emits nodes for `struct`, `enum`, `trait`, impl targets, free functions, and impl methods (`external/graphify/extract.py:734-776`).
- Even with that richer declaration inventory, imports remain file-level `imports_from` edges and calls remain `INFERRED`, so semantic depth is still mostly local-structure plus heuristic call capture (`external/graphify/extract.py:776-820`).

#### Java
- Java reconstructs dotted import paths, then emits file-level `imports` edges instead of `imports_from`, which means relation naming already diverges across languages inside the same module (`external/graphify/extract.py:892-920`).
- It treats both classes and interfaces as the same node category in practice, and constructors fall into the same method/contains pattern as normal methods (`external/graphify/extract.py:924-952`).
- Method invocations again become `INFERRED` call edges (`external/graphify/extract.py:972-990`).

#### C / headers
- The C extractor is intentionally narrow: file node, function nodes, `#include`-driven `imports` edges, and `INFERRED` call edges (`external/graphify/extract.py:1057-1141`).
- There is no declaration path for structs, typedefs, enums, or macros in this extractor body, so C coverage is materially shallower than Rust, Go, C#, or even C++ (`external/graphify/extract.py:1011-1159`).

#### C++
- C++ extends the C baseline with class nodes plus method-vs-function separation, but still models includes as file-level `imports` edges and calls as `INFERRED` (`external/graphify/extract.py:1233-1314`).
- This means the extractor is useful for local structural outlines, but not for declaration-rich or cross-file semantics on its own (`external/graphify/extract.py:1249-1271`, `external/graphify/extract.py:2485-2489`).

#### Ruby
- Ruby emits class and method structure plus `INFERRED` calls, but no import-like edges at all in the emitted relation set, making it one of the thinnest non-Python extractors (`external/graphify/extract.py:1401-1476`).
- That absence matters for transferability: graphify does not offer a reusable Ruby cross-file dependency pattern the way JS, Go, Java, C-family, or PHP at least attempt file-level import edges (`external/graphify/extract.py:1335-1494`).

#### C#
- C# adds namespace nodes on top of class/interface and method nodes, so its local hierarchy is deeper than Java/Kotlin/Scala/PHP (`external/graphify/extract.py:1562-1604`).
- Usings are still reduced to file-level `imports` edges, and invocation edges remain `INFERRED` (`external/graphify/extract.py:1551-1558`, `external/graphify/extract.py:1624-1653`).

#### Kotlin
- Kotlin follows the same general pattern as Java/C#: file node, class nodes, top-level functions or class methods, file-level imports, and `INFERRED` call edges (`external/graphify/extract.py:1720-1830`).
- The important transfer point is consistency of shape, not sophistication: Kotlin does not add a separate second-pass resolver or rationale layer (`external/graphify/extract.py:1674-1848`, `external/graphify/extract.py:2485-2489`).

#### Scala
- Scala likewise emits a file node, class-like declarations, function or method nodes, file-level imports, and `INFERRED` call edges (`external/graphify/extract.py:1897-2007`).
- It is therefore another example of graphify's "structural outline + heuristic call edges" template rather than a fully language-specific semantic model (`external/graphify/extract.py:1851-2025`).

#### PHP
- PHP handles namespace-use clauses as file-level `imports` edges, then adds class nodes and function/method nodes with the familiar `contains` / `method` pattern (`external/graphify/extract.py:2085-2139`).
- Calls are still `INFERRED`, so PHP lands in the same transfer bucket as Java/Kotlin/Scala/C#: useful as a reference template, but not a drop-in replacement for a richer graph surface (`external/graphify/extract.py:2164-2188`).

## Part B: Final Adopt/Adapt/Reject Table for Public

### Adopt (direct integration into existing Public surfaces)
| Pattern | Evidence (file:line) | Target Public Surface | Effort | Why adopt |
| --- | --- | --- | --- | --- |
| Keep explicit extraction-schema validation for node and edge payloads, especially the required `confidence` field and bounded confidence enum | `external/graphify/validate.py:4-7,21-37,45-61` | Compact Code Graph ingestion boundaries and any graph-export interchange layer | S | This is small, composable, and orthogonal to Public's existing graph engine. It does not compete with Code Graph MCP; it hardens interfaces around it. |
| Keep a language inventory table instead of a single "multi-language" claim when evaluating external graph systems | `external/graphify/extract.py:2367-2505` plus per-language bodies at `external/graphify/extract.py:301-2206` | Research packet evaluation rubric for graph/context systems | S | Graphify's extractors are materially uneven by language, so the evaluation pattern itself is worth adopting directly for future repository studies. |

### Adapt (integrate with modification)
| Pattern | Evidence (file:line) | Target Public Surface | Effort | Why adopt |
| --- | --- | --- | --- | --- |
| Reuse graphify's per-language extractor shapes only as adapter references for gap-filling or external graph imports, not as a replacement extractor stack | JS/TS: `external/graphify/extract.py:352-467`; Go: `external/graphify/extract.py:534-653`; Rust: `external/graphify/extract.py:720-820`; Java: `external/graphify/extract.py:887-990`; C/C++: `external/graphify/extract.py:1057-1141,1208-1314`; Ruby/PHP/C#/Kotlin/Scala: `external/graphify/extract.py:1381-1476,1543-1653,1720-1830,1897-2007,2078-2188` | Code Graph MCP fallback or import-normalization adapters | M | The extractor bodies are useful as language-specific reference templates, but they are shallow, relation names drift across languages, and many edges target inferred IDs rather than locally emitted nodes. |
| Adapt the Python-only second pass into an optional post-processing layer over existing Public graph output, rather than copying graphify's extractor architecture wholesale | `external/graphify/extract.py:2209-2339,2485-2489` | Code Graph MCP enrichment or post-scan graph augmentation | M | The interesting transferable idea is the post-pass that converts file-level imports into class-level `uses` edges. The implementation is explicitly Python-only, so the pattern transfers better than the code. |
| Adapt language-specific hierarchy enrichments where they add signal: Go type nodes, Rust declaration nodes, C# namespaces | Go: `external/graphify/extract.py:586-593`; Rust: `external/graphify/extract.py:745-761`; C#: `external/graphify/extract.py:1562-1584` | Code Graph MCP node taxonomy extensions | M | These are the clearest places where graphify goes beyond a generic file/function outline, but they should be merged into Public's existing graph model rather than copied as separate extractors. |
| Normalize relation naming if any graphify-derived adapter is used | `imports_from` in JS/Go/Rust at `external/graphify/extract.py:366,606-613,776`; `imports` in Java/C/C++/C#/Kotlin/Scala/PHP at `external/graphify/extract.py:920,1085,1238,1558,1732,1911,2092` | Any graphify-to-Public import bridge | S | Graphify already proves that language-local extractors drift in relation naming. Public should only borrow the underlying pattern after mapping these to a consistent contract. |

### Reject (not applicable or covered)
| Pattern | Evidence (file:line) | Target Public Surface | Effort | Why reject |
| --- | --- | --- | --- | --- |
| Reject adopting graphify as a direct replacement for Public's existing graph surfaces | `external/graphify/extract.py:2342-2496` plus Python-only enrichment at `external/graphify/extract.py:2209-2339,2485-2489` | Code Graph MCP and CocoIndex in core runtime paths | L | Graphify's architecture is a bag of per-language functions with a single Python-only enrichment pass. That is useful as reference material, but too uneven to replace Public's existing graph and semantic retrieval surfaces directly. |
| Reject any plan to borrow non-Python rationale extraction, because it does not exist | Rationale builder exists only in Python at `external/graphify/extract.py:152-236`; non-Python extractor bodies span `external/graphify/extract.py:301-2206` without analogous rationale handling | Rationale/comment capture features outside Python | M | There is nothing to transfer here for non-Python languages. Any Public rationale work would need a fresh design. |
| Reject confidence-based prioritization as a major differentiator of graphify's non-Python extractors | Allowed values live in `external/graphify/validate.py:4-7,50-57`, but non-Python extractors only use `EXTRACTED` defaults plus `INFERRED` calls at `external/graphify/extract.py:340-345,466-467,522-527,652-653,708-713,819-820,875-880,989-990,1045-1050,1140-1141,1196-1201,1313-1314,1369-1374,1475-1476,1531-1536,1652-1653,1708-1713,1829-1830,1885-1890,2006-2007,2066-2071,2187-2188` | Search scoring or trust ranking | S | The schema supports `AMBIGUOUS`, but the non-Python emitters do not use it. Public should not treat graphify's confidence field as a mature ranking signal. |
| Reject Lua transfer work for this repository study | No `.lua` suffix in the dispatcher or collector list (`external/graphify/extract.py:2367-2505`) | Lua graph extraction | S | Graphify simply does not implement a Lua extractor. |

## Cross-Phase Overlap Handling
- This iteration stayed below the pipeline / caching / orchestration layer already covered in iterations 1, 5, 8, and 9 by focusing only on per-language extractor bodies, dispatch coverage, and schema constraints (`external/graphify/extract.py:301-2505`, `external/graphify/validate.py:4-7,45-57`).
- It did not re-open benchmark credibility, export surfaces, or mixed-corpus validation; those topics were already exhausted in iterations 7 through 9 and are not needed to answer the per-language transfer question.
- It avoided codesight and contextador overlap by grounding only graphify's extractor inventory and Q12 recommendation table, not broader graph-system comparisons.

## Exhausted / Ruled-Out Directions
- I looked for a separate TypeScript extractor and did not find one; `.ts` and `.tsx` are routed through `extract_js` (`external/graphify/extract.py:2367-2387`).
- I looked for a Lua extractor and did not find one in either the dispatcher or file collector (`external/graphify/extract.py:2367-2505`).
- I looked for non-Python rationale capture and found it only in the Python extractor (`external/graphify/extract.py:152-236`).
- I looked for non-Python cross-file inference and found the only second pass is `_resolve_cross_file_imports`, which is Python-specific and only applied to `.py` paths (`external/graphify/extract.py:2209-2339,2485-2489`).
- I looked for meaningful non-Python use of `AMBIGUOUS` confidence and found only `EXTRACTED` defaults plus `INFERRED` call edges in the extractor bodies (`external/graphify/validate.py:4-7`, `external/graphify/extract.py:340-345,466-467,522-527,652-653,708-713,819-820,875-880,989-990,1045-1050,1140-1141,1196-1201,1313-1314,1369-1374,1475-1476,1531-1536,1652-1653,1708-1713,1829-1830,1885-1890,2006-2007,2066-2071,2187-2188`).

## Final Verdict on Q12
Graphify should not be adopted as a replacement for Public's existing graph surfaces. The repository does implement many per-language extractors, but the implementation pattern is uneven: every non-Python extractor emits `code` nodes and a small set of local structural edges, while the only explicit second-pass enrichment is `_resolve_cross_file_imports`, which is both Python-specific and only invoked for `.py` files (`external/graphify/extract.py:2209-2339,2485-2489`). That makes graphify a useful reference library, not a unified cross-language graph engine.

The parts worth adopting directly are the lightweight ones around boundaries and evaluation discipline. The validator is concrete, cheap, and portable: it requires stable node and edge fields and enforces bounded confidence values before assembly (`external/graphify/validate.py:4-7,21-37,45-61`). Likewise, this iteration's language-by-language inventory method is itself the right evaluation frame for future external graph-system studies, because graphify's coverage claims only become trustworthy when broken down by extractor body and suffix dispatch (`external/graphify/extract.py:2367-2505`).

The bulk of graphify belongs in the Adapt bucket. Its per-language extractors are best read as adapter templates: JS/TS, Go, Rust, Java, C/C++, C#, Kotlin, Scala, PHP, and Ruby all follow a recognizable "file node + declarations + file-level imports + inferred calls" recipe, with occasional richer local structure such as Rust declaration nodes, Go type nodes, and C# namespaces (`external/graphify/extract.py:352-467,534-653,720-820,887-990,1057-1141,1208-1314,1543-1653`). Public can reuse those language-specific ideas when building import bridges, interoperability layers, or node-taxonomy extensions around Code Graph MCP, but only after normalizing relation names and fitting them into an existing graph contract.

The clearest Rejects are the missing or misleading differentiators. There is no non-Python rationale support to transfer, no Lua extractor, and no mature non-Python confidence model beyond `EXTRACTED` vs `INFERRED` (`external/graphify/extract.py:152-236,2367-2505`; `external/graphify/validate.py:4-7`). So Q12 resolves to: adopt schema-boundary validation and evaluation discipline directly, adapt selected language-local extraction patterns into Public's current MCP surfaces, and reject graphify as a drop-in graph subsystem or as a source of non-Python rationale/confidence sophistication.

## Tools Used
- `python3 .opencode/skill/scripts/skill_advisor.py "...iteration 10..." --threshold 0.8`
- `rg -n "^def extract_|confidence|rationale|..." external/graphify/extract.py external/graphify/validate.py`
- `sed -n '1,160p' external/graphify/validate.py`
- `python3` one-off AST-assisted summaries over `external/graphify/extract.py`
- `sed` / `nl -ba` range reads for `external/graphify/extract.py` and `external/graphify/validate.py`

## Sources Queried
- `external/graphify/extract.py:152-236`
- `external/graphify/extract.py:301-2206`
- `external/graphify/extract.py:2209-2513`
- `external/graphify/validate.py:1-71`
