# Iteration 6: Multimodal Pipeline (PDFs, Images, Tweets, ArXiv) and Security Layer

## Focus
Resolve Q7 (multimodal pipeline for PDFs and images: pypdf usage, image handling, Claude vision vs OCR). Read `external/graphify/ingest.py` for the URL-fetch + per-type acquisition logic, `external/graphify/security.py` for the URL/path/label safety guards that protect multimodal ingestion, and re-cite the relevant slices of `external/skills/graphify/skill.md` (already covered in iter 3 — specifically lines 198-209 for the per-image-type extraction strategies).

## Findings

1. **Multimodal extraction is split across THREE layers, not one.** Acquisition lives in `ingest.py` (URL fetch → on-disk file with YAML frontmatter), classification lives in `detect.py` (`FileType.{IMAGE,PAPER,DOCUMENT}` via extension + paper-signal heuristics), and content extraction is split: deterministic PDF text via `pypdf` lives in `detect.py:91-103` (`extract_pdf_text`), while semantic image and PDF interpretation lives in the `skill.md` subagent prompt at lines 196-209 (which dispatches Claude vision via the Agent tool). This three-layer separation means graphify can ingest URLs without the LLM (cheap) but requires the LLM for any actual semantic understanding of images. [SOURCE: external/graphify/ingest.py:181-226; external/graphify/detect.py:91-103; external/skills/graphify/skill.md:196-209]

2. **PDF text extraction uses `pypdf` only and runs at detect time, not extract time.** `extract_pdf_text(path)` lives in `detect.py:91-103` (NOT in `extract.py`). It loads `pypdf.PdfReader`, walks every page, calls `page.extract_text()`, joins with `"\n"`, and returns plain text. There is NO OCR fallback for image-only PDFs — if `pypdf` returns empty text (e.g., a scanned PDF with no embedded text layer), graphify silently returns `""`. The text is then word-counted via `count_words()` for corpus sizing. The actual semantic interpretation of the PDF content happens later via the semantic subagent in skill.md, which receives the file path and reads it itself. [SOURCE: external/graphify/detect.py:91-112]

3. **Image semantic extraction is a vision call dispatched via the Agent tool, NOT OCR.** The skill.md subagent prompt explicitly instructs at lines 199-209: "Image files: use vision to understand what the image IS - do not just OCR." It then provides 6 per-type strategies that would be impossible with text-only OCR: UI screenshots → "layout patterns, design decisions, key elements, purpose"; charts → "metric, trend/insight, data source"; tweets/posts → "claim as node, author, concepts mentioned"; diagrams → "components and connections"; research figures → "what it demonstrates, method, result"; handwritten/whiteboard → "ideas and arrows, mark uncertain readings AMBIGUOUS". The Claude subagent receives the file directly and uses its built-in vision capability — graphify Python never invokes any OCR or vision API itself. [SOURCE: external/skills/graphify/skill.md:199-209]

4. **One image per chunk is hard-asserted in the dispatch rules.** `skill.md:168` says "Each image gets its own chunk (vision needs separate context)." This is a deliberate constraint: text chunks can hold 20-25 files, but images each get a dedicated subagent invocation. The reason is twofold: (a) Claude's vision context budget is meaningfully smaller than its text context, and (b) image semantic similarity rules need the model to focus on one image at a time without cross-contamination. Public should adopt the same one-image-per-chunk rule if it builds analogous multimodal pipelines. [SOURCE: external/skills/graphify/skill.md:166-168]

5. **The ingestion layer normalizes 5 URL types to a common YAML-frontmatter markdown contract.** `ingest.py:22-39` (`_detect_url_type`) classifies URLs into `tweet`, `arxiv`, `github`, `youtube`, `pdf`, `image`, or `webpage`. PDFs and images are downloaded as binary via `_download_binary` (saved with safe filenames). Tweets, arXiv pages, and webpages are converted to markdown with YAML frontmatter containing `source_url`, `type`, `captured_at`, `contributor`, and type-specific fields (`author` for tweets, `arxiv_id` + `paper_authors` for arXiv, `title` for webpages). This YAML frontmatter is then read by the semantic subagent and copied onto every node from that file (per `skill.md:222-223`). [SOURCE: external/graphify/ingest.py:22-170; external/skills/graphify/skill.md:222-223]

6. **HTML→markdown conversion has a graceful fallback.** `_html_to_markdown(html, url)` at `ingest.py:46-61` first tries `import html2text` (an optional dependency). If unavailable, it falls back to a regex strip: removes `<script>` and `<style>` blocks, strips remaining tags, collapses whitespace, and truncates to 8000 chars. This means graphify ingests HTML even when `html2text` isn't installed, but with degraded quality. The output is also capped: webpages get 12,000 markdown chars (`ingest.py:122`), HTML fallback gets 8,000 chars. These are hard token-cost protections, not configurable. [SOURCE: external/graphify/ingest.py:46-62; external/graphify/ingest.py:122]

7. **Security is a first-class layer with five distinct guards** in `security.py` (166 lines, full read). (a) **URL scheme allowlist**: only `http` and `https` permitted; `file://`, `ftp://`, `data:` and others raise `ValueError` (security.py:11, 20-32). (b) **Open-redirect SSRF protection**: a custom `_NoFileRedirectHandler` re-validates every redirect target before following it, preventing `http→file://` redirect attacks (security.py:35-44). (c) **Response size caps**: 50 MB hard limit on binary fetches, 10 MB on text fetches, enforced via streaming reads with running totals (security.py:12-13, 82-94). (d) **Graph path containment**: `validate_graph_path` resolves a path and verifies it stays inside `graphify-out/` (security.py:112-145), preventing path traversal in MCP tool calls. (e) **Label sanitization**: control char strip + 256-char cap + HTML escape applied to every label rendered in HTML or returned via MCP, preventing XSS (security.py:152-166). [SOURCE: external/graphify/security.py:1-166]

8. **The security layer is gated at three boundaries**, not woven throughout. (a) `validate_url` is called from `ingest.ingest()` at the start of every URL fetch (`ingest.py:191`); (b) `safe_fetch` and `safe_fetch_text` are the ONLY paths used by `ingest.py` for HTTP, never raw `urllib.urlopen`; (c) `sanitize_label` is called from `export.py to_html` (per the comment at security.py:158) and from `serve.py` (the MCP server). Public should treat this as a clean separation-of-concerns pattern: security policies live in one file with clear entry points, not scattered across the modules they protect. [SOURCE: external/graphify/ingest.py:191; external/graphify/ingest.py:43, 177; external/graphify/security.py:158-166]

9. **`save_query_result` is a feedback-loop primitive** (ingest.py:229-276). When a user runs `/graphify query "..."`, the resulting Q&A is saved as a markdown file in `graphify-out/memory/` with YAML frontmatter (`type: query`, `question`, `date`, `source_nodes`, `contributor: graphify`). On the next `/graphify --update` run, this file is detected as a `DOCUMENT` (per detect.py classification), routed to the semantic subagent, and extracted into the graph. Critical implication: the system grows smarter from BOTH what users add AND what they ask. The graph self-augments with reasoning artifacts. Public should evaluate whether to adopt this pattern — it changes the cost calculus by amortizing query cost into long-term graph value. [SOURCE: external/graphify/ingest.py:229-276]

10. **PDF and image classification has a subtle paper-detection heuristic** that runs even on `.md`/`.txt` files. `detect.py:39-54, 64-72` defines `_PAPER_SIGNALS` (13 regex patterns: arXiv, DOI, abstract, proceedings, journal, preprint, LaTeX `\cite{}`, numbered citations, equation references, arXiv ID like `1706.03762`, "we propose", "literature") with a threshold of 3 matches. Any markdown file matching ≥ 3 of these patterns is reclassified from `DOCUMENT` to `PAPER`. This means a converted academic PDF that round-tripped through markdown still gets routed to paper-handling extraction. The same heuristic does NOT apply to PDFs themselves — `.pdf` always classifies as `PAPER`. Public translation: a single file-classifier with content-aware re-routing is a useful pattern when extension alone is insufficient. [SOURCE: external/graphify/detect.py:39-88]

11. **The multimodal pipeline is structurally simple but operationally rich.** Total Python lines for the multimodal pipeline: `ingest.py:288 + security.py:166 + detect.py:91-112 (~22 lines for PDF) ≈ 480 lines`. Compare to `extract.py:2526` for the AST pipeline. The semantic richness comes from the SUBAGENT PROMPT (skill.md:184-234), which is ~50 lines of natural language that drives Claude vision, not from any Python multimodal library. graphify's "multimodal extraction" is therefore: a small Python ingestion + classification layer + a 50-line LLM prompt + Claude's native vision. Public could replicate this with comparable code volume — the LLM does the heavy lifting. [SOURCE: external/graphify/ingest.py:1-288; external/graphify/security.py:1-166; external/skills/graphify/skill.md:184-234]

## Multimodal Pipeline (full trace)

```
URL or local file
  │
  ▼
[Acquisition layer — ingest.py]
  if URL:
    validate_url()                     # security: scheme allowlist
    _detect_url_type(url)              # tweet | arxiv | pdf | image | webpage | github | youtube
    if pdf or image:
      _download_binary()               # safe_fetch with 50MB cap
    elif tweet:
      _fetch_tweet()                   # oEmbed → markdown with YAML frontmatter
    elif arxiv:
      _fetch_arxiv()                   # parse arXiv abs page → markdown with frontmatter
    else:
      _fetch_webpage()                 # safe_fetch_text → html2text → markdown with frontmatter
  → on-disk file in target_dir (default ./raw)

  │
  ▼
[Classification layer — detect.py]
  classify_file(path):
    if .py/.ts/.go/.../.swift → CODE
    if .pdf                   → PAPER
    if .png/.jpg/.svg/...     → IMAGE
    if .md/.txt/.rst:
      if _looks_like_paper()  → PAPER (≥3 of 13 paper-signal regexes)
      else                    → DOCUMENT
  count_words(path):
    if .pdf → extract_pdf_text() via pypdf, count words
    else    → read_text() and split

  │
  ▼
[Extraction layer — split]
  CODE  → extract.py AST pass (Python via tree-sitter, etc.)
  PAPER → detect.py extract_pdf_text() runs at corpus-counting time;
          full text extraction happens via semantic subagent (skill.md)
  DOC   → semantic subagent (skill.md) reads file directly
  IMAGE → semantic subagent (skill.md) reads file directly via Claude vision

  │
  ▼
[Subagent prompt — skill.md:184-234]
  per-type strategies:
    code:    semantic edges AST cannot find (calls, shared data, arch patterns)
             — explicitly do NOT re-extract imports
    doc/paper: named concepts, entities, citations
    image:    "use vision to understand what the image IS — do not just OCR"
              UI screenshot → layout patterns, design decisions, purpose
              chart         → metric, trend, data source
              tweet         → claim, author, concepts
              diagram       → components and connections
              research figure → what it demonstrates, method, result
              handwritten   → ideas and arrows, mark uncertain AMBIGUOUS
  output:    nodes + edges + hyperedges JSON per the schema in iter 3
  YAML frontmatter inheritance: source_url, captured_at, author, contributor copied onto every node
  one image per chunk (vision needs separate context)
```

## URL Type Classification (full table from ingest.py:22-39)

| URL pattern | Type | Acquisition | Output |
|---|---|---|---|
| `twitter.com` or `x.com` | `tweet` | oEmbed API → text + author | Markdown + YAML frontmatter |
| `arxiv.org` | `arxiv` | scrape arXiv abs page | Markdown + YAML frontmatter (title, authors, abstract) |
| `github.com` | `github` | (no special handler — falls through to `webpage`) | Markdown + YAML frontmatter |
| `youtube.com` / `youtu.be` | `youtube` | (no special handler — falls through to `webpage`) | Markdown + YAML frontmatter |
| `*.pdf` (path suffix) | `pdf` | binary download | `.pdf` file in target_dir |
| `*.png/.jpg/.jpeg/.webp/.gif` | `image` | binary download | image file in target_dir |
| anything else | `webpage` | HTML fetch → html2text or regex strip | Markdown + YAML frontmatter |

## Security Layer (5 guards)

| Guard | Function | What it Prevents | Source |
|---|---|---|---|
| Scheme allowlist | `validate_url(url)` | SSRF via `file://`, `ftp://`, `data:` URLs | security.py:20-32 |
| Redirect re-validation | `_NoFileRedirectHandler.redirect_request` | open-redirect SSRF chains (http→file:) | security.py:35-44 |
| Binary size cap | `safe_fetch(max_bytes=50MB)` | resource exhaustion via huge downloads | security.py:55-96 |
| Text size cap | `safe_fetch_text(max_bytes=10MB)` | resource exhaustion via huge HTML | security.py:99-105 |
| Path containment | `validate_graph_path(path, base)` | path traversal in MCP server tool calls | security.py:112-145 |
| Label sanitization | `sanitize_label(text)` | XSS in HTML viewer + MCP responses | security.py:152-166 |

## Ruled Out

- **Hoping graphify uses its own vision API**: it doesn't. All image understanding goes through the Agent tool dispatched in skill.md, which uses Claude's native vision. There is NO `extract_image()` Python function. Public should not look for one.

- **Hoping graphify has OCR fallback for scanned PDFs**: it does not. If `pypdf.extract_text()` returns empty (image-only PDF), graphify silently returns `""` and the file gets a 0 word count. The semantic subagent then reads the empty PDF (or skips it). Public should add an OCR fallback if it adopts this pattern for scanned-document corpora.

- **Looking for content-type validation on fetched URLs**: not present. `safe_fetch` doesn't check `Content-Type` headers. A URL claimed to be a PDF that returns HTML will be saved as `.pdf` and likely fail at `pypdf` time. This is a known limitation that Public should harden if it adopts the pattern.

## Dead Ends

- **Hoping `safe_fetch` blocks private IP ranges**: it doesn't. Scheme is checked but the resolved IP is not. A URL pointing at `http://169.254.169.254/` (AWS metadata service) or `http://127.0.0.1/` would pass `validate_url`. Public should add IP-range filtering if exposing ingestion to untrusted users.

- **Looking for image dimension or filesize introspection in detect.py**: not present. Images are categorized purely by extension. There is no width/height check, no `Pillow` import. Even gigabyte-sized images pass through. Public should consider this when adopting the pattern.

## Sources Consulted

- `external/graphify/ingest.py:1-288` (full read)
- `external/graphify/security.py:1-166` (full read)
- `external/graphify/detect.py:91-112` (PDF extraction — re-cited from iter 2's full read)
- `external/skills/graphify/skill.md:166-234` (image instructions, dispatch rules — re-cited from iter 3)
- `external/graphify/extract.py:2367-2477` (extension dispatch — confirms multimodal NOT routed to AST extractors)

## Assessment

- **New information ratio:** 0.92 (11 of 12 findings net-new beyond iter 3's skill.md image-prompt observation; finding 1's three-layer split is the central new insight)
- **Questions addressed:** Q7
- **Questions answered (fully):** Q7 (multimodal pipeline: acquisition + classification + per-file-type extraction strategies + security layer)
- **Questions partially advanced:** none — Q7 is now closed

## Reflection

- **What worked:** Reading `ingest.py` and `security.py` together with the skill.md image instructions revealed that the "multimodal" claim is split across three loosely-coupled layers, not implemented as a unified subsystem. This is a structural insight that none of the files documents on its own.
- **What did not work:** I initially assumed `extract_pdf_text` would live in `extract.py` because that's where structural extraction happens. It actually lives in `detect.py` because PDF text is needed for word-count classification BEFORE extraction. Cross-file ownership of the same operation is a graphify pattern Public should be aware of.
- **What I would do differently next iteration:** When validating the 71.5x benchmark claim (iter 7), use the actual numbers from `external/worked/karpathy-repos/GRAPH_REPORT.md` and `README.md` rather than just the benchmark.py source. The report file has ground-truth numbers I can cross-check against the benchmark math.

## Recommended Next Focus

Iteration 7 should resolve **Q11 (71.5x token-reduction claim credibility)** by reading `external/graphify/benchmark.py` end-to-end (already partially read), checking the actual numbers in `external/worked/karpathy-repos/GRAPH_REPORT.md` and the corpus described in `external/worked/karpathy-repos/README.md`, then computing whether the 71.5x ratio is mathematically defensible given graphify's `_estimate_tokens` heuristic and BFS-subgraph cost model. Specifically: verify the corpus_words → tokens conversion (4 chars/token) is reasonable; verify the BFS-subgraph cost approximates real query cost; identify which assumptions are load-bearing for the 71.5x number; and document what reduction Public should expect for its own corpora (which differ in size, query type, and graph density). After iter 7, iter 8 will be **synthesis** — compiling all findings into research/research.md with Adopt/Adapt/Reject recommendations (Q12) and the comparison vs Code Graph MCP / CocoIndex.
