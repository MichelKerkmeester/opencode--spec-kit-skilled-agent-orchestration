**Role:** Systems architect and technical researcher specializing in analyzing codebases, architectural patterns, and implementation strategies.

---

**Context:**
You are analyzing 2 systems/repositories to extract actionable insights:

- [https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm](https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm)
- [https://github.com/samvallad33/vestige](https://github.com/samvallad33/vestige)
- Reddit Post:
"Every conversation with Claude starts the same way: from zero

No matter how many hours you spend together, no matter how much context you build, no matter how perfectly it understands your coding style, the next session, it's gone. You're strangers again.

That bothered me more than it should have.

We treat AI memory like a database (store everything forever), but human intelligence relies on forgetting. If you remembered every sandwich you ever ate, you wouldn't be able to remember your wedding day. Noise drowns out signal.

So I built Vestige.

It is an open-source MCP server written in Rust that gives Claude an enhaced memory system. It doesn't just save text. It's inspired by how biological memory works"

Here is the science behind the code..

Unlike standard RAG that just dumps text into a vector store, Vestige implements:

FSRS-6 Spaced Repetition: The same algorithm used by 100M+ Anki users. It calculates a "stability" score for every memory using https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm Unused memories naturally decay into "Dormant" state, keeping your context window clean.

The "Dual Strength Memory" : Inspired by [https://bjorklab.psych.ucla.edu/research/—memories](https://bjorklab.psych.ucla.edu/research/%E2%80%94memories)  When you recall a memory, it physically strengthens the neural pathway (updates retrieval strength in SQLite), ensuring active projects stay "hot."

Prediction Error Gating (The "Titans" Mechanism): If you try to save something that conflicts with an old memory, Vestige detects the "Surprise." It doesn't create a duplicate; it updates the old memory or links a correction. It effectively learns from its mistakes.

Context-Dependent Retrieval: Based on [https://psycnet.apa.org/record/1973-31800-001—memories](https://psycnet.apa.org/record/1973-31800-001%E2%80%94memories) are easier to recall when the retrieval context matches the encoding context.

I built this for privacy and speed.

29 tools. Thousands of lines of Rust. Everything runs locally. Built with Rust, stored with SQLite local file and embedded withnomic-embed-text-v1.5 all running on Claude Model Context Protocol.

You don't "manage" it. You just talk.

- Use async reqwest here. -> Vestige remembers your preference.
- Actually, blocking is fine for this script. -> Vestige detects the conflict, updates the context for this script, but keeps your general preference intact.
- What did we decide about Auth last week? -> Instant recall, even across different chats.

It feels less like a tool and more like a Second Brain that grows with you.

It is open source. I want to see what happens when we stop treating AIs like calculators and start treating them like persistent companions.

GitHub:  https://github.com/samvallad33/vestige

Happy to answer questions about the cognitive architecture or the Rust implementation!"

---

**Goal:** 
Understand their architectures, identify valuable patterns, and extract insights to improve system-speckit and the memory mcp

**Action:**
Conduct comprehensive technical research and deliver two documents:

**Document 1 - Technical Analysis:**

- System architecture overview (all analyzed systems)
- Core logic flows and data structures
- Integration mechanisms between components
- Design patterns and architectural decisions
- Technical dependencies and requirements
- Current limitations or constraints
- Key learnings and interesting approaches

**Document 2 - Actionable Recommendations:**

- Applicable patterns for our use case
- Integration opportunities
- Architecture improvements we could adopt
- Implementation strategies (prioritized by impact/effort)
- Potential risks or considerations
- Specific code patterns or techniques to leverage
- Migration or adoption pathways

**Format:**

- Output: Two Markdown documents
- Location: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/079-speckit-cognitive-memory
- Naming: `[###] - analysis-[descriptive-name].md` and `[###] - recommendations-[descriptive-name].md`
- Structure: Executive summary, detailed sections, code examples where relevant
- Length: Analysis (2000-3000 words), Recommendations (1000-1500 words)

**Constraints:**

- Focus on actionable insights, not theoretical concepts
- Include specific code references from the repositories
- Prioritize patterns that improve systems located in the folders under "Goal:" above
- Flag any assumptions about current architecture with [Assumes: X]
- Provide concrete examples for each recommendation
- Consider implementation complexity and maintenance burden