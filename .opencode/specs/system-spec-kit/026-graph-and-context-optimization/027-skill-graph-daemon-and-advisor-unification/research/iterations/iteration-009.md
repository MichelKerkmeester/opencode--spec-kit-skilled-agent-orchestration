# Iteration 009 — Track B: B1 — Extraction sources

## Question
Frontmatter (current), SKILL.md headings, SKILL.md body, references/**.md headings, assets/** filenames, examples in SKILL.md, commit messages touching the skill folder. Which signals are high-precision vs high-recall? Weighting?

## Evidence Collected
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/spec.md:98`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/spec.md:109` -> Track B's goal is fresh trigger phrases and keyword scoring tables; B1 asks which extraction sources are high precision vs high recall, and B5 later handles invalidation when B1 inputs change.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/research/deep-research-strategy.md:87`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/research/deep-research-strategy.md:88` -> The evidence map points B1 at `skill_advisor_runtime.py`, SKILL.md frontmatter schema, and `sk-doc` heading extraction patterns.
- `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:53`-`.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:105` -> The runtime parser only reads the SKILL.md frontmatter block plus immediately following HTML comments; it merges a `<!-- Keywords: ... -->` comment into `data["keywords"]` and returns as soon as body content begins.
- `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:135`-`.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:146` -> Keyword metadata is expanded into lowercase, hyphen-to-space, underscore-to-space, and hyphen-to-underscore phrase variants.
- `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:171`-`.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:204` -> Runtime skill records currently contain name, description, keywords, keyword variants, name terms, description-derived corpus terms, and explicit name variants.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2421`-`.opencode/skill/skill-advisor/scripts/skill_advisor.py:2449` -> Matching gives explicit skill-name variants a 2.5+ boost and keyword variants a 1.0+ boost when they match prompt phrase boundaries.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2463`-`.opencode/skill/skill-advisor/scripts/skill_advisor.py:2478` -> Description/name corpus matching is lower weight: name terms add 1.5, description terms add 1.0, and fuzzy containment adds 0.5.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:180`-`.opencode/skill/skill-advisor/scripts/skill_advisor.py:219` -> Graph metadata is already a routing source: the runtime loads `intent_signals` and schema-v2 `derived.trigger_phrases` from per-skill `graph-metadata.json`.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:281`-`.opencode/skill/skill-advisor/scripts/skill_advisor.py:394` -> SQLite skill-graph loading also extracts `intent_signals` and JSON `derived.trigger_phrases` into the runtime `signals` map.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:170`-`.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:177` -> The compiler validates `domains`, `intent_signals`, and schema-v2 derived metadata when compiling graph metadata.
- `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:182`-`.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py:267` -> Derived metadata requires non-empty `trigger_phrases`, `key_topics`, `key_files`, `entities`, and `source_docs`, validates timestamps, and checks referenced files stay inside the repo/skill folder.
- `.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:156`-`.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:166` -> Documented SKILL.md frontmatter requires `name`, `description`, and `allowed-tools`; `version` and `tags` are optional, but `trigger_phrases` is not listed in this schema.
- `.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:196`-`.opencode/skill/sk-doc/assets/documentation/frontmatter_templates.md:221` -> The description field must be a single line because parser support for YAML multiline strings is explicitly absent.
- `.opencode/skill/sk-doc/scripts/package_skill.py:37`-`.opencode/skill/sk-doc/scripts/package_skill.py:44` -> The packaging validator agrees that SKILL.md required fields are `name`, `description`, and `allowed-tools`, with `version` recommended/optional.
- `.opencode/skill/sk-doc/scripts/extract_structure.py:123`-`.opencode/skill/sk-doc/scripts/extract_structure.py:167` -> `sk-doc` already extracts all Markdown headings with level, text, line, emoji presence, and numbering while skipping headings inside code blocks.
- `.opencode/skill/sk-doc/scripts/extract_structure.py:170`-`.opencode/skill/sk-doc/scripts/extract_structure.py:205` -> It also extracts sections between headings with line ranges, word counts, code-block presence, and a content preview.
- `.opencode/skill/sk-doc/scripts/extract_structure.py:208`-`.opencode/skill/sk-doc/scripts/extract_structure.py:275` -> It extracts code blocks with language, start line, line count, and preview, preserving robustness for nested fence examples.
- `.opencode/skill/sk-doc/scripts/extract_structure.py:1152`-`.opencode/skill/sk-doc/scripts/extract_structure.py:1222` -> The main extraction result already returns frontmatter, headings, sections, code blocks, and metrics in one structured JSON object.
- `.opencode/skill/sk-doc/scripts/tests/test_extract_structure_regressions.py:19`-`.opencode/skill/sk-doc/scripts/tests/test_extract_structure_regressions.py:38` -> Regression coverage confirms headings after nested fenced examples remain visible to the parser and code blocks are still captured.
- `.opencode/skill/sk-doc/graph-metadata.json:27`-`.opencode/skill/sk-doc/graph-metadata.json:47` -> A current skill metadata file separates author-like `intent_signals` from `derived.trigger_phrases`, including name variants and domain-specific phrases.
- `.opencode/skill/sk-doc/graph-metadata.json:48`-`.opencode/skill/sk-doc/graph-metadata.json:71` -> The same derived block stores key topics and key files, including SKILL.md, README, references, assets, scripts, and agent files.
- `.opencode/skill/system-spec-kit/graph-metadata.json:37`-`.opencode/skill/system-spec-kit/graph-metadata.json:58` -> Another current metadata file shows the same pattern: explicit intent signals plus derived trigger phrases like skill-name variants and workflow phrases.
- `.opencode/skill/skill-advisor/graph-metadata.json:36`-`.opencode/skill/skill-advisor/graph-metadata.json:57` -> Skill-advisor metadata includes domains, intent signals, derived trigger phrases, key topics, and key files for routing/scoring.
- `rg -n '^trigger_phrases:' .opencode/skill/*/SKILL.md` -> No SKILL.md currently declares a `trigger_phrases:` YAML field, despite the phase problem statement describing trigger phrases as frontmatter-owned.
- `printf counts via rg/find` -> The repo currently has 20 top-level SKILL.md files, all 20 contain `<!-- Keywords: ... -->`, and 21 top-level skill folders have `graph-metadata.json` files.
- `git log --oneline --max-count=8 -- .opencode/skill/sk-doc .opencode/skill/system-spec-kit .opencode/skill/skill-advisor` -> Recent commit messages are broad packet/remediation summaries, such as Phase 023/024/025/026 work, not stable per-skill trigger phrases.

## Analysis
The extraction source hierarchy should be adopted now, but with a narrow first slice. The current runtime already treats explicit metadata as high-precision evidence: SKILL names and variants receive the strongest boost, keyword comments are phrase-boundary matched, and descriptions/name terms provide weaker corpus evidence. That means the safest tier is existing explicit author-maintained surfaces: SKILL.md `name`, `description`, the existing `<!-- Keywords: ... -->` comment, and graph-metadata `intent_signals`/`derived.trigger_phrases`.

The repo also already has enough deterministic parsing machinery to derive medium-weight signals from content without introducing a new parser. `sk-doc` can extract frontmatter, headings, sections, code blocks, and metrics as structured JSON, and it has regression coverage for headings after nested fenced examples. That supports adopting SKILL.md headings, `references/**/*.md` headings, code-example command phrases, and asset/reference filenames as derived candidates. These should be provenance-tagged and lower-weight than explicit metadata because headings and filenames are often descriptive rather than direct user prompt language.

Full body text and commit messages should not be first-tier trigger sources. Body terms are high recall but noisy, so they belong behind TF-IDF/IDF filtering in B2/B6 rather than direct phrase extraction. Commit messages are even weaker: the local history evidence shows packet-level summaries, not reliable per-skill intent language. They can be kept as a prototype-later telemetry experiment if B4/B7 precision safeguards need another recall source, but they should not feed initial advisor weights.

One important correction to the phase premise: current SKILL.md files do not appear to use a `trigger_phrases:` YAML field. The documented SKILL.md schema requires `name`, `description`, and `allowed-tools`, while all current top-level SKILL.md files use the HTML `Keywords` comment and graph metadata carries `intent_signals` plus `derived.trigger_phrases`. Phase 027 should therefore treat "frontmatter" as high precision for name/description only, not as the canonical trigger storage surface; B3 should decide whether derived triggers stay in graph metadata or a separate advisor index.

## Verdict
- **Call:** adopt now
- **Confidence:** high
- **Rationale:** Existing runtime weights and graph metadata already define a practical precision ladder, and `sk-doc` provides reusable structured extraction for headings, sections, and examples. Adopt explicit metadata + deterministic local content extraction now, while excluding commit messages from the first implementation slice.

## Dependencies
B2, B3, B4, B5, B6, B7, C4, C7

## Open follow-ups
B2 should define the exact extraction pipeline for body text and references beyond headings, likely TF-IDF or hybrid rather than raw phrase capture. B3 must settle the storage model because current evidence points to Keywords comments and graph metadata, not SKILL.md `trigger_phrases` frontmatter. B4/B7 should set caps, provenance weighting, and anti-stuffing rules before any derived body terms affect routing confidence.

## Metrics
- newInfoRatio: 0.83
- dimensions_advanced: [B]
