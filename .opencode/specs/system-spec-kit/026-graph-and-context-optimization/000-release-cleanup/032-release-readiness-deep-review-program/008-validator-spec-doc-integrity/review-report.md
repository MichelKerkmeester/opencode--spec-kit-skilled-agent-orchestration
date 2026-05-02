# Review Report: 045-008 Validator Spec Doc Integrity

## 1. Executive Summary

**Verdict: FAIL.** The phase-parent detector pair is consistent across the sampled repo, but the validator is not release-ready as a strict gate. I found one reproduced strict false negative where a malformed Level 2 spec with its required anchors and headers hidden inside a fenced code block passed strict validation, plus two reproduced strict false positives against valid phase-parent or documented template-extension shapes.

Active findings: P0=3, P1=1, P2=2. `hasAdvisories=true`.

Scope reviewed:
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skill/system-spec-kit/scripts/rules/*.sh`
- `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js`
- `.opencode/skill/system-spec-kit/scripts/lib/shell-common.sh`
- `.opencode/skill/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts`
- `.opencode/skill/system-spec-kit/scripts/dist/spec/is-phase-parent.js`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
- `.opencode/skill/system-spec-kit/templates/`
- Representative `specs/**/*.md` and `.opencode/specs/**/*.md`

## 2. Planning Trigger

Route to `/spec_kit:plan` before release. P0 findings affect the validator's two central release promises: strict mode can pass a broken spec, and strict mode can fail valid spec shapes. That combination makes it unsafe as a final release gate until the structural parser and spec-doc reference rules are tightened.

The remediation should be a validator-focused packet, not a broad docs cleanup. The broken behavior is in rule parsing and exception handling, and existing docs already show the intended phase-parent policy.

## 3. Active Finding Registry

### P0-001: Strict mode passes required spec structure hidden inside fenced code blocks

**Severity: P0.** This is a strict false negative: a broken spec can pass.

Evidence:
- `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js:190` extracts every `^##` header without tracking fenced code blocks.
- `.opencode/skill/system-spec-kit/scripts/utils/template-structure.js:549` loads anchors by regex from the full document body, again without fence awareness.
- `.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh:128` and `.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh:132` grep anchor tags from the whole file.
- Repro probe: copied a valid Level 2 packet to `/tmp/999-fenced-structure-probe`, replaced `spec.md` so all required `##` headers and `<!-- ANCHOR:* -->` pairs were inside a fenced `markdown` block, then ran `validate.sh --strict --quiet`. Result: `RESULT: PASSED (errors=0 warnings=0)`.

Why this matters: retrieval and merge workflows treat anchors and headers as document structure. If the validator accepts structure inside code fences, malicious or accidental content can satisfy the gate while the actual document has no usable sections.

Concrete fix:
- Move header and anchor extraction to one markdown-aware parser utility.
- Ignore fenced code blocks and inline code for structural validation.
- Keep real HTML comment anchors valid only outside fenced blocks.
- Add a regression fixture that must fail strict when template anchors and H2s appear only inside a code fence.

### P0-002: SPEC_DOC_INTEGRITY rejects valid phase-parent specs by treating prose mentions of `.md` files as required local links

**Severity: P0.** This is a strict false positive: valid phase-parent specs fail.

Evidence:
- `.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:82` extracts every backticked token matching `[A-Za-z0-9._/-]+\.md`.
- `.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh:89` requires each extracted token to resolve as a file.
- `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/014-phase-parent-documentation/spec.md:61` correctly explains that phase-parent heavy docs such as `plan.md`, `tasks.md`, `checklist.md`, decision record docs and `implementation-summary.md` drift and should not live at the parent level.
- `.opencode/skill/system-spec-kit/templates/phase_parent/spec.md:18` explicitly names those heavy docs as forbidden parent-level content.
- Repro sample: `validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/014-phase-parent-documentation --strict --no-recursive` failed with `SPEC_DOC_INTEGRITY: 13 spec documentation integrity issue(s) found`, including missing `plan.md`, `tasks.md`, `checklist.md`, decision record docs and `implementation-summary.md`.

Why this matters: the phase-parent policy requires the absence of those files, but the integrity rule turns explanatory prose and template comments into missing-file errors. That blocks valid lean phase parents.

Concrete fix:
- Validate only explicit Markdown links, table path fields or declared metadata references, not every backticked prose token.
- Strip fenced blocks and non-link comments before reference extraction.
- Add a phase-parent-specific allowance for heavy doc names when they appear in content-discipline prose.
- Add regression coverage using `014-phase-parent-documentation` and `.opencode/skill/system-spec-kit/templates/phase_parent/spec.md`.

### P0-003: TEMPLATE_HEADERS fails documented custom research sections under strict mode

**Severity: P0.** This is a strict false positive when custom sections are documented as valid extensions.

Evidence:
- `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh:73` records any extra header as a warning.
- `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh:125` returns `warn` when only extra headers exist.
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:959` exits non-zero for warnings in strict mode.
- Repro probe: copied the valid 037/004 packet, appended `## Research Context` to `spec.md`, and ran `SPECKIT_RULES=TEMPLATE_HEADERS validate.sh --strict`. Result: `TEMPLATE_HEADERS` warning and `RESULT: FAILED (strict)`.

Why this matters: the packet brief explicitly calls out documented exceptions such as extra "Research Context" sections in research packets. The rule has no exception registry for that class, so strict mode rejects them.

Concrete fix:
- Add an explicit allowed-extra-header registry keyed by packet type or frontmatter `contextType`.
- Prefer a documented `custom sections after required sections` policy over unqualified warnings.
- Add a regression where a research packet with `## Research Context` after required sections passes strict.

### P1-001: JSON output omits rule details, making strict failures less operator-actionable

**Severity: P1.** Human output includes details, but JSON mode drops them.

Evidence:
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:299` through `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:318` append only `rule`, `status` and `message` to `RESULTS`.
- Rule details are printed separately through `log_detail`, for example `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:574` and `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:660`, but they are not serialized into JSON.
- Probe: `validate.sh ... --strict --json` for the phase-parent sample reported only `SPEC_DOC_INTEGRITY: 13 issue(s) found`, while non-JSON output listed each missing markdown reference.

Why this matters: CI and automation normally consume JSON. Without details, operators get a failing rule but not the file/rule/reason payload needed to fix it.

Concrete fix:
- Extend JSON result objects with `details` and `remediation`.
- Preserve backwards compatibility by keeping existing keys.
- Add a JSON-mode test asserting details appear for at least one multi-detail rule.

### P2-001: The requested shell detector path is stale relative to the repo

**Severity: P2.** Traceability friction, not a detector bug.

Evidence:
- The packet target lists `.opencode/skill/system-spec-kit/shared/lib/shell-common.sh`.
- The actual sourced file is `.opencode/skill/system-spec-kit/scripts/lib/shell-common.sh`; `validate.sh` sources it at `.opencode/skill/system-spec-kit/scripts/spec/validate.sh:31`.
- The detector implementation lives at `.opencode/skill/system-spec-kit/scripts/lib/shell-common.sh:48`.

Concrete fix:
- Update release docs and future packet briefs to reference `scripts/lib/shell-common.sh`.
- Optionally add a compatibility note where older docs mention `shared/lib`.

### P2-002: LINKS_VALID should remain opt-in until scoped link validation exists

**Severity: P2.** Turning it on by default would create unrelated release noise.

Evidence:
- `.opencode/skill/system-spec-kit/scripts/rules/check-links.sh:86` defaults to `.opencode/skill`.
- `.opencode/skill/system-spec-kit/scripts/rules/check-links.sh:87` skips unless `SPECKIT_VALIDATE_LINKS=true`.
- `.opencode/skill/system-spec-kit/scripts/rules/check-links.sh:71` scans every skill markdown file, not the active packet or changed files.
- Probe: enabling `SPECKIT_VALIDATE_LINKS=true` while validating the otherwise passing 037/004 packet failed strict due unrelated broken links in `.opencode/skill/mcp-figma/nodes/*.md`.

Concrete fix:
- Keep default off for this release.
- Add a scoped mode before considering default-on behavior, such as changed files only, active skill only or packet-declared docs only.

## 4. Remediation Workstreams

1. Structural parser hardening: centralize markdown-aware parsing for headers, anchors and path references; ignore fenced code blocks consistently.

2. Phase-parent integrity exception: refine SPEC_DOC_INTEGRITY so prose mentions of intentionally absent heavy docs do not fail lean parents.

3. Template extension registry: define which custom sections are allowed, where they may appear and which packet contexts activate them.

4. Operator output quality: carry details and remediation into JSON output.

5. Link validation scoping: keep opt-in default and design scoped validation before default-on.

## 5. Spec Seed

Title: Validator Markdown-Aware Structural Integrity Remediation.

Problem: strict validation currently has both false negatives and false positives because several rules parse markdown with regexes over raw file text.

P0 requirements:
- Reject required template headers and anchors that occur only inside fenced code blocks.
- Allow valid lean phase-parent specs that explain absent heavy docs.
- Allow documented custom research sections after required template structure.
- Include rule details in JSON output.

Out of scope:
- Broad cleanup of historical `.opencode/specs` packets.
- Enabling `LINKS_VALID` by default.

## 6. Plan Seed

1. Add a shared markdown scanning helper that tracks fenced blocks and returns structural tokens with line numbers.
2. Port TEMPLATE_HEADERS, ANCHORS_VALID and SPEC_DOC_INTEGRITY to the helper.
3. Add a rule-level exception table for allowed custom headers and phase-parent prose references.
4. Extend `log_*` JSON result generation to include details and remediation.
5. Add fixtures:
   - fenced-only structure must fail strict
   - `014-phase-parent-documentation` must pass the relevant phase-parent rules
   - research packet with `## Research Context` after required sections must pass strict
   - JSON output must include details for a failing multi-detail rule
6. Leave `LINKS_VALID` default-off and add a design note for scoped link validation.

## 7. Traceability Status

Core protocols:
- `spec_code`: FAIL. Strict validator behavior contradicts documented phase-parent and template-extension expectations.
- `checklist_evidence`: PASS for this audit packet. All checked items include evidence.
- `phase_parent_detector_parity`: PASS. Shell and TypeScript detectors agreed on 1,550 candidate folders, with 94 phase parents and 0 divergences.

Question answers:
- Do `is_phase_parent` and `isPhaseParent` always agree? In the real-folder sample, yes: 1,550 checked, 0 divergences. The two implementations also share the same child regex and populated-child condition at `.opencode/skill/system-spec-kit/scripts/lib/shell-common.sh:57` and `.opencode/skill/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts:12`.
- Does the validator distinguish phase-parent lean folders from Level 2 full folders? Partially. FILE_EXISTS and LEVEL_MATCH branch correctly, but SPEC_DOC_INTEGRITY and strict warnings still fail valid phase-parent samples.
- Are any folders passing strict that should not? The `/tmp` fenced-structure probe passed strict and should fail.
- Are any folders failing strict that should pass? Yes: valid lean phase-parent samples and documented custom header extensions.
- Does FRONTMATTER_MEMORY_BLOCK reject narrative violations? Yes. The rule rejects `because`, multiple sentences, URLs, markdown bullets and values over 96 characters at `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:612`.
- Does TEMPLATE_HEADERS allow documented exceptions? No, not under strict. Extra headers become warnings, and strict mode treats warnings as failure.
- Should LINKS_VALID be default-on? No, not until it is scoped.

## 8. Deferred Items

- P2: Design scoped link validation for active packet or changed files.
- P2: Update stale references to `shared/lib/shell-common.sh`.
- P2: Consider line-specific diagnostics for TEMPLATE_HEADERS extra sections so operators know whether the custom section is before or after the required template structure.

## 9. Audit Appendix

Commands and results:
- Detector parity: Node imported `.opencode/skill/system-spec-kit/scripts/dist/spec/is-phase-parent.js` and shell-sourced `.opencode/skill/system-spec-kit/scripts/lib/shell-common.sh`; checked 1,550 candidates, found 94 phase parents, 0 divergences.
- Phase-parent strict sample: `validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/014-phase-parent-documentation --strict --no-recursive` failed with `SPEC_DOC_INTEGRITY` and warnings.
- 037/004 strict sample: `validate.sh specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/024-followup-quality-pass/004-sk-doc-template-alignment --strict --quiet` passed.
- `.opencode/specs` representative sample: `.opencode/specs/00--ai-systems/001-global-shared/001-hvr-refinement-repo-analysis` failed strict with anchor and sufficiency issues, showing legacy folders are not uniformly strict-clean.
- Frontmatter probe: narrative `recent_action` failed FRONTMATTER_MEMORY_BLOCK.
- Fenced structure probe: malformed Level 2 packet passed strict with 0 errors and 0 warnings.
- Link probe: `SPECKIT_VALIDATE_LINKS=true` failed strict on unrelated mcp-figma wikilinks.

Convergence: one synthesis pass covered correctness, security, traceability and maintainability. New P0 findings remain active, so release readiness is `release-blocking`.
