# SK Code Opencode Skill Delta (agent-5)

## Inline comment targets
- `references/shared/universal_patterns.md` already caps inline comments at 5 per 10 LOC and insists on WHY-focused wording, but no enforcement on minimal counts or AI-tailored phrasing.  We should add a stricter ratio (e.g., at most 3 comments per 10 LOC unless tagging a requirement/bug/security reference) and highlight that inline comments serve AI reasoning by prefacing with terms such as "AI INSIGHT" or "AI REASONING" to keep wording consistent for downstream assistants.
- Per-language style guides (`javascript/style_guide.md`, `typescript/style_guide.md`, `python/style_guide.md`, `shell/style_guide.md`, `config/style_guide.md`) inherit the loose ratio but keep WHAT/WHY focus; each needs a short call-out reminding authors to discard redundant comments, prefer helper functions or docstrings, and use the AI-prefixed phrasing when describing intent.

## Section header preservation
- `references/shared/code_organization.md` and the language-specific references describe numbered sections, but they sometimes mix case.  Establish an explicit mandate that the numbered dividers stay fully uppercase (e.g., "1. IMPORTS", "2. CONSTANTS") with the delimiter pattern intact to preserve the human-optimized ALL-CAPS look and ensure tooling still finds those anchors.
- Mirror that requirement in each `style_guide.md` (JS/TS/Python/Shell/Config) so every language keeps the same human-oriented header style rather than variations like "Core Logic" or lowercase words.

## AI-oriented comment wording
- Introduce a small subsection in the universal comment philosophy that distinguishes human-facing labels (ALL-CAPS headers, purpose statements) from inline comments meant for AI reasoning. Inline comments should be concise, reasoning-focused, and optionally tagged with a prefix such as "AI INSIGHT", "AI REASON", or "AI CHECK" before explaining the intent.
- Add a reference across JS/TS/Python/Shell and Config style guides so the pattern is consistent (e.g., use `// AI INSIGHT: ...`, `# AI REASON: ...`, `// AI CHECK:` in JSONC) and mention that these comments should still obey the existing WHY-not-WHAT rule.

## KISS/DRY/SOLID reinforcement
- `references/shared/code_organization.md` already references single-responsibility module structures, but neither universal patterns nor quality standards explicitly cite KISS/DRY/SOLID.  Add a new "Design principles" subsection (maybe in universal_patterns or quality_standards) that says: keep modules simple (KISS), avoid repeated logic across languages (DRY) by sharing helper functions or mapping layers, and respect SOLID boundaries when defining exported interfaces (SRP, OCP, DIP) for JS/TS modules, with analogues for procedural Python/Shell code.
- Ensure each language guide references the same principles where appropriate: mention, for example, that `shell` scripts should avoid mixing responsibilities (KISS), `python` helpers should avoid repeated validation logic (DRY), `typescript` interfaces should obey SOLID, and `config` files should mirror this by reusing shared sections instead of copy/pasting keys.

## Cross-language anchors
- While documenting the above, keep track of how the JS/TS/Python/Shell/JSONC references currently describe the patterns (see sections "Commenting Rules", "Section Organization", "Code Patterns", and "File Structure").  The new guidance should directly annotate each section so reviewers know where to verify compliance.
