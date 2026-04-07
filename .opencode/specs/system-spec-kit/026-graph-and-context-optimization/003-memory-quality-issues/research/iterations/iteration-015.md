# Iteration 15: D3 Empirical Filter-list Build (Q12)

## Focus
Generation-2 Q12 converts the Gen-1 D3 diagnosis into an empirical filter design. The canonical research report freezes D3 as a paired defect: saved `trigger_phrases` are polluted by path/folder fragments, while topic extraction can emit stopword-collapsed bigrams [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:36-37] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-004.md:20-29].

Iteration 9 narrowed the safe remediation boundary: remove unconditional junk, but keep the guarded `ensureMinTriggerPhrases()` fallback instead of deleting all folder-derived recovery behavior [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:38-44]. This pass therefore does not revisit root cause. It mines the current repo-wide `memory/**/*.md` corpus and pressure-tests a concrete blocklist against real samples, exactly as queued for Q12 in strategy section 14 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:189-191].

## Approach
- Enumerated every `memory/**/*.md` path in the repo, then parsed frontmatter `trigger_phrases:` arrays from each file that actually contained them.
- Flattened all harvested phrases into one corpus, preserving first-seen source file and line for each unique phrase.
- Classified each phrase occurrence into one bucket: `PATH_FRAGMENT`, `STOPWORD`, `SINGLE_CHAR`, `SYNTHETIC_BIGRAM`, `LEGITIMATE_SHORT_NAME`, or `LEGITIMATE_PHRASE`.
- Simulated a candidate filter using regexes for path fragments, standalone stopwords, single-character tokens, stopword-bigrams, and narrow numbered/ID-style prefixes.
- Compared removals against observed legitimate short-name cases to measure false positives, then manually tagged the surviving generic singletons that still looked like junk.

## Corpus stats
- Memory files scanned: 140 markdown files under `memory/`; 134 contained a `trigger_phrases` array
- Total trigger_phrases harvested: 2,282
- Unique phrases: 1,908
- Average phrases per file: 17.03 across trigger-bearing files (16.30 across all 140 scanned files)

## Classification buckets (counts)
| Bucket | Count | % of total | Examples (up to 5) |
|--------|-------|-----------|--------------------|
| PATH_FRAGMENT | 174 | 7.63% | "anobel.com/036", "skills/022", "kit/022", "fusion/010", "commands and skills/024 sk deep research refinement" |
| STOPWORD | 16 | 0.70% | "and" |
| SINGLE_CHAR | 0 | 0.00% | none observed |
| SYNTHETIC_BIGRAM | 17 | 0.74% | "session for", "and testing", "with phases", "with research", "with timeout" |
| LEGITIMATE_SHORT_NAME | 2 | 0.09% | "mcp" |
| LEGITIMATE_PHRASE | 2,073 | 90.84% | "memory scripts", "generate context", "rank memories", "cleanup orphaned vectors", "memory" |

## Proposed blocklist
- Regex patterns:
  * Path fragment: `(?i)(?:/|\\|\b\d{3}-|\b[a-z0-9_-]+/\d{3}\b|\b\d{3}/[a-z0-9_-]+\b|\b[a-z0-9_-]+/[a-z0-9_-]+\b)`
  * Single char: `^.$`
  * Synthetic bigram: `(?i)^(?:(?:a|an|and|the|for|with|to|of|in|on|via)\s+\S+|\S+\s+(?:a|an|and|the|for|with|to|of|in|on|via))$`
  * Suspicious prefix: `(?i)^(?:(?:f|q)\d+|ac-?\d+|phase\s+\d+|iter(?:ation)?\s+\d+)\b`
- Stopword allowlist (do NOT filter even though short): `["mcp", "api", "ai", "ts", "js", "pr", "ci", "cd", "ui", "ux", "db", "qa", "llm", "rag", "sdk", "cli", "sql"]`
- English stopword blocklist (filter these when standalone): `["a", "an", "and", "as", "at", "be", "by", "for", "from", "in", "into", "is", "of", "on", "or", "the", "to", "with", "via"]`

## Filter simulation
- Phrases that would be removed: 230 (10.08% of corpus)
- Phrases that would remain: 2,052
- FALSE POSITIVES (legitimate phrases that would be wrongly dropped): 0
  Examples: none observed; the only current-corpus short-name hit was `"mcp"`, and the allowlist preserved it [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/18-03-26_19-06__portable-cocoindex-mcp-paths-applied.md:18-20]
- FALSE NEGATIVES (junk that would slip through): 14
  Examples: `"graph"` [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/007-external-graph-memory-research/memory/01-04-26_07-21__prepared-the-external-graph-memory-research-phase.md:36-40], `"research"` [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/007-external-graph-memory-research/memory/01-04-26_07-21__prepared-the-external-graph-memory-research-phase.md:36-40], `"phase"` [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/memory/29-03-26_10-05__planning-phase-for-merging-spec-kit-phase-into.md:27-32], `"memory"` [SOURCE: .opencode/skill/system-spec-kit/templates/memory/README.md:5]

## Findings
1. Path-like fragments are the largest removable junk class in the live corpus: 174 of 2,282 trigger occurrences (7.63%). The surviving examples still look exactly like D3's Gen-1 leak shape, including slash-bearing tokens such as `"skills/022"` and `"skills/037"` inside saved frontmatter arrays [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/18-03-26_19-06__portable-cocoindex-mcp-paths-applied.md:15-20] [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/memory/29-03-26_10-05__planning-phase-for-merging-spec-kit-phase-into.md:27-29].
2. Standalone English stopwords still appear literally in production memory files. `"and"` coexists next to path fragments and the valid short name `"mcp"` in the same trigger list, so a standalone stopword block is justified and low-risk [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/18-03-26_19-06__portable-cocoindex-mcp-paths-applied.md:15-20].
3. Stopword-collapsed bigram junk is present corpus-wide, not just in the original D3 samples: `"with phases"`, `"with research"`, and `"session for"` are all currently stored trigger phrases [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/memory/29-03-26_10-05__planning-phase-for-merging-spec-kit-phase-into.md:3-5] [SOURCE: .opencode/specs/00--anobel.com/036-notification-toast-button/memory/04-04-26_15-09__planning-session-for-cms-driven-button-in.md:6-9]. This matches iteration 4's root-cause model that D3 includes synthetic word-pair artifacts, not only path leaks [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-004.md:20-29].
4. Legitimate short product names are rare but real. Only one current-corpus short token matched the proposed allowlist (`"mcp"`, 2 occurrences), which means the keep-list can stay narrow without introducing false positives for short names [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/18-03-26_19-06__portable-cocoindex-mcp-paths-applied.md:18-20].
5. Prefix filtering needs to be narrow and shape-based, not word-based. Numbered/ID-prefixed phrases like `"phase 7 cocoindex"` and `"f21 arithmetic inconsistency"` are clear junk candidates, but a blanket `^phase\b` rule would also overreach into the standalone domain noun `"phase"` [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/21-03-26_07-41__next-steps.md:4-6] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/memory/06-04-26_13-47__extended-deep-research-run-13-iterations-total-8.md:12-17] [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/memory/29-03-26_10-05__planning-phase-for-merging-spec-kit-phase-into.md:30-32].
6. The tuned filter removes 230 trigger occurrences (10.08% of the corpus) while preserving all observed legitimate short names. That is consistent with Gen-1's narrowed D3 direction: clean unconditional junk first, but do not broaden the rule set enough to break fallback or valid short tokens [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:69-70] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:38-44].
7. The main false-negative residue is generic singletons, not path or stopword artifacts. `"graph"` and `"research"` survive because they are not path-shaped, not stopwords, and not ID-prefixed; they likely need either a separate frequency-based singleton suppressor or a reviewer assertion rather than more regex [SOURCE: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/007-external-graph-memory-research/memory/01-04-26_07-21__prepared-the-external-graph-memory-research-phase.md:36-40].

## Ruled out / not reproducible
- Broad prefix blocking such as `^phase\b` is not safe. It catches obvious junk like `"phase 7 cocoindex"` but also collides with the generic-but-not-obviously-broken singleton `"phase"` [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/21-03-26_07-41__next-steps.md:4-6] [SOURCE: .opencode/specs/skilled-agent-orchestration/037-cmd-merge-spec-kit-phase/memory/29-03-26_10-05__planning-phase-for-merging-spec-kit-phase-into.md:30-32].
- A blanket short-token filter would be over-broad. The observed short-name case `"mcp"` is legitimate, so the short-name allowlist is required even though the current corpus only needs one live entry from it [SOURCE: .opencode/specs/skilled-agent-orchestration/022-mcp-coco-integration/memory/18-03-26_19-06__portable-cocoindex-mcp-paths-applied.md:18-20].
- Single-character cleanup is necessary only as a guardrail, not as the main D3 payoff. The current corpus produced no single-character `trigger_phrases`, so that rule should remain defensive rather than driving design priority.

## New questions raised
- Should D3 add a second-stage generic-singleton suppressor (for tokens like `"graph"` and `"research"`) based on corpus frequency or source adjacency rather than regex alone?
- Should the same numbered/ID-prefix suppression be applied only to saved `trigger_phrases`, or also to `Key Topics` / semantic-topic outputs when they share the same surface form?

## Next focus recommendation
Iteration 16 should execute Q13 (AC-1..AC-8 fixture design). See strategy §14.
