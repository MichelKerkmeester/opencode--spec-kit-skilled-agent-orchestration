# Iteration 004 -- Audit methodology portability, JSONL fragility, and discrepancy handling

## Iteration metadata
- run: 4
- focus: audit methodology + portability + JSONL fragility + discrepancy
- timestamp: 2026-04-06T10:18:27Z
- toolCallsUsed: 12
- status: insight
- newInfoRatio: 0.48
- findingsCount: 5

## Current portability surface in this repo
- Verified CLI skill folders: `cli-claude-code`, `cli-codex`, `cli-copilot`, `cli-gemini`.
- This means the repo already treats Claude, Codex, Gemini, and Copilot as first-class runtime surfaces, but this iteration found no evidence that all four expose the same raw local transcript contract.

## Methodology decomposition
| Layer | What the post describes | Claude-specific vs transferable | Adoption note |
|---|---|---|---|
| Transcript discovery | "walks every JSONL file" under Claude's local session storage | **Claude-specific implementation**, **transferable concept** | Keep as per-agent adapter; do not generalize the Claude file path assumption. |
| JSONL parsing | "parses every turn" | **Claude-specific implementation**, **transferable abstraction** | Parser logic must be versioned and runtime-specific. |
| SQLite normalization | "loads everything into a SQLite database" | **Transferable** | Best shared substrate across CLI agents. |
| Waste classification | token counts, cache hit ratios, tool calls, idle gaps, edit failures, skill invocations | **Mostly transferable**, but some fields are runtime-specific | Generic categories port; cache-specific fields need per-runtime mapping. |
| Dollar estimation | "ranks waste categories by estimated dollar amount" | **Partly transferable** | Framework ports, but pricing inputs and subscription interpretation do not. |
| Dashboard rendering | "interactive dashboard with 19 charts" | **Transferable** | Safe to share once normalized tables exist. |

## Portability matrix
| Layer | Codex CLI | Gemini CLI | Copilot CLI | Why |
|---|---|---|---|---|
| Transcript discovery | prototype later | prototype later | prototype later | This iteration confirmed repo support for all three runtimes, but not a stable raw transcript file contract for any of them. |
| JSONL parsing | prototype later | prototype later | prototype later | Reusing a Claude-format parser would be wrong; each runtime needs its own adapter. |
| SQLite normalization | adopt now | adopt now | adopt now | A shared schema can normalize turns, tool calls, read events, edit failures, and pricing facts once adapters exist. |
| Waste classification | prototype later | prototype later | prototype later | The taxonomy ports, but fields like cache-read ratio and idle-gap semantics differ by runtime. |
| Dollar estimation | prototype later | prototype later | prototype later | Provider pricing, cache discounts, and subscription-to-API mapping are runtime-specific. |
| Dashboard rendering | adopt now | adopt now | adopt now | Charts and ranking views are downstream of normalized tables and do not care which CLI produced them. |

## Fragility lens: what breaks when Claude JSONL changes
| Format change | What breaks first | Failure mode | Defensive contract |
|---|---|---|---|
| File location / naming changes | Transcript discovery | Sessions silently disappear from coverage | Discovery layer must be adapter-based and report coverage counts per run. |
| Event shape / key rename | Turn parser | Tool calls, token fields, or timestamps become null or misread | Fail closed on unknown schema versions; count parse failures explicitly. |
| Timestamp semantics change | Idle-gap and cache-cliff logic | False cache-expiry warnings and wrong stale-session estimates | Validate monotonic timestamps before deriving idle gaps. |
| Tool payload structure changes | Bash/reread/retry classifiers | False positives or false negatives in waste categories | Separate raw ingest from derived classifiers and emit "unknown" instead of guessing. |
| Token field changes | Dollar ranking | Cost totals and category ordering drift | Keep pricing derivation as a second pass with field-presence guards. |
| Truncated / partial JSONL | Session counts and dashboard totals | Headline numbers look precise but coverage is incomplete | Surface ingest coverage, skipped files, and malformed-line counts in every report. |

## Discrepancy preservation
1. The post header says "audit of **926 sessions**," but the body repeatedly switches to "**858 sessions**" (`My stats: 858 sessions...`, cache cliffs across 858 sessions, 858-session cost math).
2. The body also reports **18,903 total turns**, but the cache-expiry numerator uses **6,152 out of 11,357 turns** without explaining why 11,357 rather than the full 18,903 is the denominator.
3. This does **not** materially weaken the post's architectural claims (JSONL -> SQLite -> insights -> dashboard) or the directional conclusion that cache expiry dominates waste.
4. It **does** weaken exact headline extrapolations tied to total dataset size: per-session averages, "across all sessions" totals, and any token/dollar math that assumes one stable denominator.

## Findings
### Finding F1: The post's audit stack cleanly separates into volatile ingest layers and portable analysis layers
- Source passage (anchor): "paragraph beginning 'So I built a token usage auditor.'" and "paragraph beginning 'One more thing. This auditor isn't only useful if you're a Claude Code user.'"
- Source quote: "It walks every JSONL file, parses every turn, loads everything into a SQLite database..." and "the underlying approach (parse the JSONL transcript, load into SQLite, surface patterns) generalizes to most CLI coding agents."
- What it documents: The post's portability claim is credible only after the architecture is decomposed. Transcript discovery and parsing are runtime adapters; normalization, ranking, and dashboarding are the reusable core.
- Why it matters for Code_Environment/Public: Because this repo already supports Claude, Codex, Gemini, and Copilot CLI surfaces, the right portability move is not "port the Claude parser everywhere." It is "share the middle and end of the pipeline, keep the ingest edge per-runtime."
- Recommendation label: adopt now
- Category: methodology portability
- Affected area in this repo: future research conclusions and any later audit implementation spanning `cli-claude-code`, `cli-codex`, `cli-gemini`, and `cli-copilot`
- Risk / ambiguity / validation cost: Moderate. The abstraction is strong, but only if the repo resists smuggling Claude-specific assumptions upward into the shared schema.
- Already implemented in this repo? no

### Finding F2: Undocumented Claude JSONL should be treated as a volatile adapter, not as stable repo infrastructure
- Source passage (anchor): "paragraph beginning 'limitations worth noting:'"
- Source quote: "the JSONL parsing depends on Claude Code's local file format, which isn't officially documented. works on the current format but could break if Anthropic changes it."
- What it documents: The post explicitly disclaims parser stability. That means the riskiest part of the architecture is not SQLite or dashboarding; it is the reverse-engineered ingest contract.
- Why it matters for Code_Environment/Public: Any auditor in this repo should reject direct, unguarded dependence on Claude JSONL as a canonical substrate. The defensive contract should be: versioned adapter boundary, fail-closed parsing, explicit coverage counters, raw-to-derived separation, and an `unknown/unclassified` bucket instead of silent best-effort guesses.
- Recommendation label: reject
- Category: parser fragility
- Affected area in this repo: any future local-transcript auditor under this spec or sibling CLI-observability work
- Risk / ambiguity / validation cost: High if ignored. A format drift could leave the dashboard looking healthy while its waste categories are wrong.
- Already implemented in this repo? no

### Finding F3: The 926-vs-858 session gap is real and should be preserved, but it weakens totals more than conclusions
- Source passage (anchor): "paragraph beginning 'anthropic isn't the only reason you're hitting claude code limits.'" and "paragraph beginning 'My stats: 858 sessions. 18,903 turns. $1,619 estimated spend across 33 days.'"
- Source quote: "i did audit of 926 sessions" and "My stats: 858 sessions. 18,903 turns."
- What it documents: The post contains a headline/body dataset mismatch, and the body then consistently reuses 858 as the working dataset size.
- Why it matters for Code_Environment/Public: This discrepancy should stay visible in any canonical synthesis. It does not undercut the existence of cache cliffs, redundant reads, or bash antipatterns, but it does mean the repo should not repeat the post's totals as if the sampling frame were settled. The unexplained "6,152 out of 11,357" denominator makes this especially important for any future cost or prevalence extrapolation.
- Recommendation label: adopt now
- Category: source discrepancy
- Affected area in this repo: `research/research.md` synthesis and any downstream decision record that cites the Reddit post quantitatively
- Risk / ambiguity / validation cost: Low cost to preserve; high credibility cost if future summaries smooth the mismatch away.
- Already implemented in this repo? partial

### Finding F4: Redundant reads should be reported as cache-amplified exposure, not just raw reread count
- Source passage (anchor): "paragraph beginning '1,122 extra file reads across all sessions where the same file was read 3 or more times.'"
- Source quote: "Each re-read isn't expensive on its own. But the output from every read sits in your conversation context for every subsequent turn. In a long session that's already cache-stressed, redundant reads pad the context that gets re-processed at full price every time the cache expires."
- What it documents: The post's real point is not merely "33 reads is bad." It is that rereads become more expensive when they enlarge the prefix that later gets rebuilt after cache expiry.
- Why it matters for Code_Environment/Public: This deepens Q6 in a way the earlier iterations did not exhaust. Prompt rules should still say "do not reread unchanged files without a reason," but hooks are the wrong main enforcement surface because one reread is not reliably bad in isolation. The better reporting model is severity-weighted: reread count x remaining-turn exposure x cache-cliff exposure. A single reread before a stale resume can cost more than several rereads inside one still-cached burst.
- Recommendation label: adopt now
- Category: reporting methodology
- Affected area in this repo: future waste-audit ranking logic and any prompt language added to `CLAUDE.md`
- Risk / ambiguity / validation cost: Medium. The weighting model is heuristic, but it is closer to the post's causal story than a flat reread counter.
- Already implemented in this repo? no

### Finding F5: Cross-agent rollout should start with shared schema and dashboard layers, while transcript adapters stay prototype-only
- Source passage (anchor): "paragraph beginning 'One more thing. This auditor isn't only useful if you're a Claude Code user.'"
- Source quote: "As long as the agent writes a raw session file, you can observe the same waste patterns... the architecture ports."
- What it documents: The portability claim is conditional, not universal. It depends on each agent exposing a usable raw session artifact.
- Why it matters for Code_Environment/Public: The repo's existing multi-CLI skill surface makes a cross-agent auditor tempting, but this iteration did not verify transcript availability for Codex CLI, Gemini CLI, or Copilot CLI. So adoption priority should be: share schema/dashboard design now, prototype per-agent discovery/parsing later, and do not promise a single immediate auditor across all four runtimes.
- Recommendation label: prototype later
- Category: rollout prioritization
- Affected area in this repo: future cross-CLI observability planning around `cli-codex`, `cli-gemini`, and `cli-copilot`
- Risk / ambiguity / validation cost: Moderate-high. The shared architecture is real, but the raw-session prerequisite may fail differently on each runtime.
- Already implemented in this repo? no

## Iteration answer summary
- **Q11:** Portable core = SQLite normalization, downstream waste ranking, dashboarding. Claude-specific edge = transcript discovery and current JSONL parsing. Cross-agent portability is therefore conditional, not immediate.
- **Q12:** Reverse-engineered Claude JSONL is the biggest operational fragility in the post's design. It should lower adoption priority for any repo auditor unless the ingest layer is versioned, fail-closed, and coverage-reporting.
- **Q6 (deepened):** Redundant reads should not just trigger generic "read less" rules. They should be ranked by cache-amplified exposure, because their real cost is proportional to how long they remain in a prefix that later gets rebuilt.
- **926 vs 858:** Preserve the mismatch explicitly. It weakens exact totals and prevalence math, but not the post's main directional and architectural findings.
