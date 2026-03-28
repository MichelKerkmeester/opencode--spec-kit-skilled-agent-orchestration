# Iteration 010 — Portability & Lightweight Design (ARIS)

## Focus
Q10: What portability and lightweight design patterns from ARIS could make sk-deep-research work across more runtimes?

## Key Delta Findings

### Finding 1: ARIS treats Markdown as the portability layer, not just the documentation format
- **Source**: `README.md`, runtime adaptation guides, `skills/skills-codex/README_CN.md`
- **What is new vs Wave 1**: Our Wave 1 finding was runtime path resolution inside one skill. ARIS goes further by making the workflow itself a runtime-agnostic Markdown protocol: the skill body, file outputs, and MCP tool names are the stable interface, while each host only changes invocation style.
- **Why it matters**: This sharply lowers migration cost. Cursor uses `@skills/.../SKILL.md`, Trae uses natural-language or `#`/`@` triggers, Antigravity auto-discovers from `description`, and OpenClaw can ignore slash skills entirely and still run the same staged file workflow.
- **Pattern**: Keep the research logic in a host-neutral Markdown contract; keep runtime-specific behavior in thin adaptation docs or overlays.

### Finding 2: ARIS uses a base-plus-overlay packaging model for cross-model review, which is lighter than runtime-specific forks
- **Source**: `docs/CODEX_CLAUDE_REVIEW_GUIDE.md`, `docs/CODEX_GEMINI_REVIEW_GUIDE.md`, `skills/skills-codex-claude-review/README.md`
- **What is new vs Wave 1**: Wave 1 established fresh-context loops and JSONL recovery, but not a portability strategy for swapping reviewer models. ARIS keeps one base skill pack, then adds tiny reviewer-specific overlay packs that only replace review-heavy skills.
- **Why it matters**: This avoids duplicating the whole workflow per runtime or per model pair. The executor can stay constant while only the reviewer transport changes.
- **Pattern**: Define a stable reviewer contract, then ship thin overlays for `Claude`, `Gemini`, or other reviewer backends instead of rewriting the full skill tree.

### Finding 3: The real abstraction boundary is the reviewer transport contract, not the model brand
- **Source**: `docs/CODEX_GEMINI_REVIEW_GUIDE.md`, `docs/CODEX_CLAUDE_REVIEW_GUIDE.md`, `skills/skills-codex-claude-review/README.md`
- **What is new vs Wave 1**: ARIS standardizes async review primitives such as `review_start`, `review_reply_start`, and `review_status`, then swaps the backend behind that contract.
- **Why it matters**: This is a stronger portability primitive than "support N runtimes." It means the workflow can preserve threaded critique, follow-up rounds, and timeout handling even when the reviewer changes from Claude to Gemini or another OpenAI-compatible model.
- **Pattern**: Model-specific code should sit behind a narrow reviewer ABI. The workflow should depend on review semantics, not on a specific provider.

### Finding 4: ARIS keeps quality high in a zero-framework system by making files do governance work
- **Source**: `README.md`, `docs/PROJECT_FILES_GUIDE.md`, `docs/SESSION_RECOVERY_GUIDE.md`, `skills/auto-review-loop/SKILL.md`
- **What is new vs Wave 1**: ARIS shows how a Markdown-only system can still stay disciplined: it uses named state files, explicit file roles, required logs, and cumulative reviewer records instead of a hidden orchestrator database.
- **Why it matters**: The workflow remains inspectable and portable while still enforcing order: `AUTO_REVIEW.md`, `REVIEW_STATE.json`, `findings.md`, `EXPERIMENT_LOG.md`, and `docs/research_contract.md` each have a narrow job.
- **Pattern**: Prefer file-level contracts and append-only artifacts over framework-owned state. Quality comes from durable, inspectable outputs plus reviewer loops, not from infrastructure weight.

### Finding 5: ARIS's session recovery is broader than loop recovery because it stores project status in a runtime-neutral dashboard
- **Source**: `docs/SESSION_RECOVERY_GUIDE.md`, `docs/PROJECT_FILES_GUIDE.md`
- **What is new vs Wave 1**: Our skill already has JSONL state for the research loop. ARIS adds a higher-level recovery surface: `CLAUDE.md` holds `## Pipeline Status`, points to the active contract, lists running tasks, and gives the next action. Hooks are optional, not required.
- **Why it matters**: Recovery works even after compaction, manual restarts, or moving to a new host, because the recovery entrypoint is a plain project file, not a runtime-owned memory layer.
- **Pattern**: Add a small human-readable dashboard file above the JSONL loop log. Use optional hooks for convenience, but design the core recovery story to work without them.

### Finding 6: ARIS's "compact mode" is a portability feature, not just a context-saving trick
- **Source**: `README.md`, `docs/PROJECT_FILES_GUIDE.md`, `skills/auto-review-loop/SKILL.md`
- **What is new vs Wave 1**: ARIS explicitly emits lean summary files for short-context models and resumed sessions, for example `findings.md` and `EXPERIMENT_LOG.md`, and tells the runtime to prefer those during recovery.
- **Why it matters**: This is a practical bridge between strong and weak runtimes. A workflow can remain usable on smaller-context agents if it produces compact recovery artifacts by default.
- **Pattern**: Generate two layers of state: canonical full logs plus compact summaries optimized for resume and for lower-capability runtimes.

### Finding 7: ARIS draws a clean line between core portability and optional helpers
- **Source**: `README.md`, `tools/arxiv_fetch.py`, `docs/WATCHDOG_GUIDE.md`, `tools/watchdog.py`, `skills/skills-codex/arxiv/SKILL.md`
- **What is new vs Wave 1**: ARIS keeps the core workflow dependency-free, then adds tiny standard-library helpers only where automation has real leverage.
- **Why it matters**: `arxiv_fetch.py` is a standalone standard-library script with fallback instructions embedded directly in the skill. `watchdog.py` is an out-of-band Python daemon for remote health checks, not a requirement for core workflow execution. This preserves the "works anywhere" baseline while still enabling richer automation when available.
- **Pattern**: Keep helpers optional, local, and single-purpose. When possible, provide an inline fallback path in the Markdown skill itself.

## Implications for sk-deep-research

### Recommendation 1: Split sk-deep-research into a protocol layer and runtime adapters
- Keep one canonical Markdown protocol for loop behavior, state files, iteration output, convergence, and synthesis.
- Move runtime differences into thin adapters or companion docs that explain invocation, agent spawning, and tool mapping for each host.
- This is a stronger portability story than embedding runtime path tables inside the main skill.

### Recommendation 2: Introduce a reviewer/researcher contract for optional cross-model critique
- ARIS suggests a narrow ABI approach: the workflow should request "start critique", "continue critique", and "poll critique status", not a provider-specific tool name.
- For sk-deep-research, this could support optional adversarial review passes from a second model without hardwiring the host runtime.

### Recommendation 3: Add a compact recovery surface above JSONL
- Keep JSONL as the machine log, but add a small dashboard file with current question focus, answered questions, active risks, next step, and latest best findings.
- This would make resume easier across Codex, ChatGPT, Claude, Gemini, or weaker local agents.

### Recommendation 4: Make helper scripts explicitly optional
- ARIS's lightweight bar is useful: the loop should still function with Markdown plus local files alone.
- Only externalize into helper scripts when the task genuinely needs polling, network fetching, or server monitoring.

### Recommendation 5: Prefer overlay extension over full runtime forks
- If we add cross-model review or runtime-specific integrations, ship them as small overlays that replace only the parts that need different transports.
- Avoid cloning the full deep-research skill per runtime.

## Bottom Line
ARIS's biggest new contribution is not just "Markdown-only skills." It is the combination of:
- a protocol-first workflow encoded in plain files
- thin runtime and reviewer overlays instead of forks
- compact recovery artifacts for weaker or restarted sessions
- optional helper scripts that never become mandatory framework baggage

For sk-deep-research, the clearest lesson is that portability improves when the workflow is treated as a stable file-and-protocol contract, and runtime logic is demoted to a thin compatibility layer.

## Sources Consulted
- `/tmp/deep-research-029-wave2/ARIS/README.md`
- `/tmp/deep-research-029-wave2/ARIS/docs/CODEX_CLAUDE_REVIEW_GUIDE.md`
- `/tmp/deep-research-029-wave2/ARIS/docs/CODEX_GEMINI_REVIEW_GUIDE.md`
- `/tmp/deep-research-029-wave2/ARIS/docs/CURSOR_ADAPTATION.md`
- `/tmp/deep-research-029-wave2/ARIS/docs/OPENCLAW_ADAPTATION.md`
- `/tmp/deep-research-029-wave2/ARIS/docs/PROJECT_FILES_GUIDE.md`
- `/tmp/deep-research-029-wave2/ARIS/docs/SESSION_RECOVERY_GUIDE.md`
- `/tmp/deep-research-029-wave2/ARIS/docs/TRAE_ARIS_RUNBOOK_EN.md`
- `/tmp/deep-research-029-wave2/ARIS/docs/WATCHDOG_GUIDE.md`
- `/tmp/deep-research-029-wave2/ARIS/docs/ANTIGRAVITY_ADAPTATION.md`
- `/tmp/deep-research-029-wave2/ARIS/tools/arxiv_fetch.py`
- `/tmp/deep-research-029-wave2/ARIS/tools/watchdog.py`
- `/tmp/deep-research-029-wave2/ARIS/skills/auto-review-loop/SKILL.md`
- `/tmp/deep-research-029-wave2/ARIS/skills/skills-codex/arxiv/SKILL.md`
- `/tmp/deep-research-029-wave2/ARIS/skills/skills-codex/auto-review-loop/SKILL.md`
- `/tmp/deep-research-029-wave2/ARIS/skills/skills-codex-claude-review/README.md`
- `/tmp/deep-research-029-wave2/ARIS/skills/skills-codex/README_CN.md`
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/specs/03--commands-and-skills/029-sk-deep-research-first-upgrade/research/research/research.md`

## Assessment
- newInfoRatio: 0.81
- findingsCount: 7
- status: complete
- keyInsights: ARIS's real portability move is protocol-first Markdown plus thin runtime/reviewer overlays; compact summary artifacts make recovery work on weaker runtimes; optional helper scripts preserve a zero-framework baseline while still enabling automation where it matters

## Questions Answered
- Q10: ARIS contributes a stronger portability model than our current path-resolution approach by separating workflow protocol from host runtime, standardizing reviewer transport contracts, broadening session recovery beyond JSONL, and treating helper automation as optional rather than structural.

## New Questions Raised
- Should sk-deep-research define a small runtime-neutral "research review" contract before adding any cross-model critique feature?
- Do we want a `compact` mode that emits a dashboard plus low-token summaries on every iteration, or should those artifacts be always-on?
- Would runtime adaptation be easier to maintain as companion guides, or as tiny overlay skills that rewrite only invocation/tool bindings?
