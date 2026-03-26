---
title: Human Voice Rules (HVR) - Writing Standards Reference
description: Linguistic standards that eliminate detectable AI patterns and enforce natural human writing across all documentation.
---

# Human Voice Rules (HVR) - Writing Standards Reference

Linguistic standards for all documentation output. These rules eliminate AI-detectable patterns and ensure every piece of writing reads as if a knowledgeable human wrote it.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

AI-generated text carries tells: em dashes everywhere, three-item lists, hedging language, the same 20 overused words. Readers spot these patterns and trust drops. HVR defines what to aim for and what to avoid.

### Usage

Apply to all AI-generated documentation: READMEs, implementation summaries, decision records, install guides and spec folder docs.

- Read the voice directives (Section 2) to understand the target voice
- Use word lists (Sections 6-8) as reference during writing
- Run the pre-publish checklist (Section 9) before finalizing
- **Scoring:** Hard blockers cost -5 points. Soft deductions cost -2 or -1. Clean document starts at 100.

### Scoring Weights

| Category | Weight | Sections |
|----------|--------|----------|
| **Punctuation** | 15% | Section 3 |
| **Structure** | 25% | Section 4 (structural patterns, copula avoidance, synonym cycling) |
| **Content** | 25% | Section 4 (metaphors, generalisations, significance inflation, conclusions) |
| **Words** | 20% | Sections 6, 7 |
| **Voice** | 15% | Section 2 |

A document starts at 100 points. Hard blockers (-5 each) and soft deductions (-2 or -1 each) reduce the score. Below 70 is a failing grade. Below 85 needs revision before publishing.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:voice-directives -->
## 2. VOICE DIRECTIVES

```yaml
voice_directives:
  active_voice:
    directive: "Use active voice. Subject before verb."
    wrong: "The meeting was cancelled by management."
    right: "Management cancelled the meeting."

  direct_address:
    directive: "Address the reader with 'you' and 'your'."
    wrong: "Users will find that the platform saves time."
    right: "You'll find the platform saves time."

  conciseness:
    directive: "Be direct. Cut fluff. Say it in fewer words."
    wrong: "It is important to note that the deadline is on Friday."
    right: "The deadline is Friday."

  simple_language:
    directive: "Use common words. If a simpler word exists, use it."
    wrong: "We need to facilitate the optimisation of our workflow processes."
    right: "We need to fix how we work."

  clarity:
    directive: "One idea per sentence when possible."
    wrong: "The platform, which was built last year by our engineering team who worked remotely, handles data processing and also does analytics while maintaining uptime."
    right: "The platform handles data processing and analytics. Our engineering team built it last year."

  conversational_tone:
    directive: "Write naturally. Read it aloud. If it sounds stiff, rewrite it."
    wrong: "One must consider the implications of such a decision."
    right: "Think about what this decision means."

  authenticity:
    directive: "Be honest. If something has problems, say so. No marketing spin."
    wrong: "Our revolutionary solution transforms every aspect of your workflow."
    right: "Our tool automates three manual steps in your invoicing process."

  practical_focus:
    directive: "Focus on actionable information. Back claims with data or examples."
    wrong: "Many companies have seen great success."
    right: "Acme Corp cut onboarding time from 3 weeks to 4 days."

  sentence_rhythm:
    directive: "Vary sentence lengths. Mix short (under 8 words) with medium (8-15) and long (15-25)."

  certainty:
    directive: "Prefer certainty when facts support it. Hedging weakens claims."
    wrong: "This approach might improve results."
    right: "This approach improves results."
    note: "Hedge only when genuine uncertainty exists."
```

---

<!-- /ANCHOR:voice-directives -->
<!-- ANCHOR:punctuation-standards -->
## 3. PUNCTUATION STANDARDS

| Rule | Symbol | Action | Replace With |
|------|--------|--------|--------------|
| **Em Dash Ban** | — | NEVER use | Comma, full stop or colon |
| **Semicolon Ban** | ; | NEVER use | Two sentences, or a conjunction |
| **Oxford Comma Ban** | , and | NEVER use | Drop the comma before "and"/"or" |
| **Asterisk Emphasis** | * | NEVER in output | Natural word weight (OK in Markdown source) |
| **Ellipsis** | ... | Max 1 per piece | Trailing thought only, never dramatic pauses |
| **Quotation Marks** | " " | Straight quotes only | Never curly quotes (" ") |
| **Emoji** | 🎯 | Max 1 per piece | Must add clarity or tone, not decoration |

**Examples:**
```
Em dash:    WRONG: "The platform — built for speed — handles millions."
            RIGHT: "The platform, built for speed, handles millions."

Semicolon:  WRONG: "The data was clear; the market was shifting."
            RIGHT: "The data was clear. The market was shifting."

Oxford:     WRONG: "revenue, retention, and churn"
            RIGHT: "revenue, retention and churn"
```

---

<!-- /ANCHOR:punctuation-standards -->
<!-- ANCHOR:ai-structural-patterns -->
## 4. AI STRUCTURAL PATTERNS TO AVOID

### "Not Just X, But Also Y" Ban

Never use this construction or variants: "not only X but Y", "it's not X, it's Y", "more than just X". Lead with the stronger point or use "and".

```
WRONG: "Not just a tool, but a complete platform."
RIGHT: "A complete platform."
```

### Three-Item Enumeration Fix

AI defaults to exactly three items. Use 2, 4 or 5 instead. If you naturally have 3, cut one or add a fourth.

### Triple-Header Pattern Fix

AI tends to use exactly three H3 subsections under each H2 section. Vary the count. Use 2, 4 or 5 subsections based on actual content needs. If you genuinely have three subsections, verify each one carries its weight.

### Setup Language Removal

Cut these filler phrases that signal what's coming instead of stating it:

- "In conclusion" / "In summary"
- "It's worth noting" / "It's important to note"
- "Let's explore" / "Let's dive in" / "Let's take a look"
- "When it comes to" / "In the world of"
- "In today's [X]" / "At its core"
- "At the end of the day" / "Without further ado"
- "As we all know" / "It goes without saying"
- "First and foremost" / "Last but not least"
- "With that in mind" / "On that note" / "That said"
- "In simple terms" / "Simply put" / "Put simply"

### Analogy Overuse Fix

Analogies help readers grasp technical concepts. Overusing them is an AI tell.

| Rule | Limit | Example |
|------|-------|---------|
| **One analogy per concept** | 1 max | Do not stack "like a librarian" and "like a filing cabinet" for the same feature |
| **"Think of it as/like"** | 2 per document max | Third occurrence signals AI pattern |
| **Placement** | After the technical statement | State the fact first, then the analogy. Never lead with the analogy. |
| **Drop when unnecessary** | If plain language is clear | "The script validates inputs" needs no analogy |

### Banned Metaphors

Replace with direct language:

| Banned | Use Instead |
|--------|-------------|
| "bridge the gap" | "connect" |
| "tip of the iceberg" | "one example" |
| "pave the way" | "enable" |
| "game-changer" | state the specific change |
| "move the needle" | state the specific metric |
| "low-hanging fruit" | "quick win" |
| "deep dive" | "detailed look" |
| "at the heart of" | "central to" |
| "a world where" | remove or rephrase |
| "raise the bar" | "improve" |
| "double-edged sword" | "trade-off" |
| "level the playing field" | "equalise access" |
| "perfect storm" | state the specific factors |
| "elephant in the room" | state the issue directly |
| "the bottom line" | state the conclusion |
| "food for thought" | remove entirely |
| "breath of fresh air" | state what's different |
| "light at the end of the tunnel" | state the positive outcome |

### Generalisation Fixes

Replace vague claims with specifics:

| Vague | Fix |
|-------|-----|
| "Many companies" | Name the company or give a number |
| "Studies show" | Name the study and year |
| "Experts agree" | Name the expert |
| "In recent years" | Give the specific year or date |
| "A growing number of" | State the number or percentage |
| "Research suggests" | Name the institution and year |
| "Industry leaders" | Name the companies or people |
| "Some people" | State who, or give a number |

### Unnecessary Modifiers

Cut these words. They add no meaning: very, really, truly, absolutely, incredibly, extremely, quite, rather, somewhat, fairly, just, actually, basically, literally, simply, obviously, clearly, certainly, definitely, undoubtedly, essentially.

### Copula Avoidance Ban

When "is" or "are" works, use it. Do not substitute elaborate constructions.

| Banned Substitute | Use Instead |
|-------------------|-------------|
| "serves as" | "is" |
| "stands as" | "is" |
| "functions as" | "is" |
| "acts as" | "is" (when not literal acting) |
| "boasts" | "has" |
| "features" | "has" or "includes" |
| "offers" | "has" or "provides" (when describing attributes) |

Acceptable when they add genuine meaning (e.g., "The firewall acts as a barrier").

### Synonym Cycling Fix

When referring to the same thing, use the same word. AI cycles through synonyms because of repetition penalties. If you write "the server" in one sentence, do not switch to "the system" and then "the platform" in the next two. Natural variation (e.g., a name and "she") is fine. The signal is 3+ different words for the same entity in one piece.

### False Ranges

Remove "from X to Y" constructions where the endpoints are not on a meaningful scale.

```
WRONG: "From startups to enterprises, everyone benefits."
RIGHT: "Startups and enterprises both benefit."

OK: "Temperatures range from -10C to 40C." (genuine measurable range)
```

### Generic Positive Conclusions

End with specifics, not sentiments. Never use these closers:

- "The future looks bright"
- "Exciting times lie ahead"
- "This represents a major step forward"
- "The possibilities are endless"
- "We look forward to what's next"
- "This is just the beginning"
- "The best is yet to come"

### Fragmented Headers

Remove generic sentences that restate the heading. Jump straight to substance.

```
WRONG:
### Error Handling
Error handling is an important part of any application.
[actual content follows]

RIGHT:
### Error Handling
The API returns structured JSON errors with HTTP status codes and machine-readable error types.
```

### Significance Inflation

State what happened without editorialising its importance. If something genuinely is a turning point, provide evidence instead of declaring it.

Banned phrases:
- "marks a pivotal moment in"
- "setting the stage for"
- "indelible mark"
- "is a testament to"
- "underscores the importance of"
- "reflects broader trends in"
- "represents a shift in"
- "shaping the future of"

### Output Warnings

Never include meta-commentary about the writing process. No disclaimers about tone. No references to these rules in output. No "I've kept this concise" or "I avoided jargon." No knowledge-cutoff disclaimers ("as of my last update", "based on available information"). No training-data hedging ("Up to my last training update").

---

<!-- /ANCHOR:ai-structural-patterns -->
<!-- ANCHOR:voice-personality -->
## 5. VOICE PERSONALITY

Avoiding AI patterns is only half the job. Sterile, voiceless writing that follows every rule can still read as AI-generated. Clean writing needs personality.

### Have Opinions

React to facts. Do not just report them neutrally.

```
FLAT:   "The results were mixed."
VOICED: "The results surprised us. Half the metrics improved while the others dropped."
```

### Acknowledge Complexity

Express mixed feelings. Real people do not sort everything into neat categories. When something has trade-offs, say so instead of presenting a clean conclusion.

### Controlled Imperfection

Perfect structure feels algorithmic. Allow occasional tangents and asides when they add authenticity. This does not override conciseness or clarity. It means choosing natural flow over mechanical symmetry.

### Emotional Specificity

Name specific feelings and images, not abstract labels.

```
ABSTRACT: "The results were disappointing."
SPECIFIC: "We expected at least a 10% lift. We got 2%."
```

### Rule Precedence

When a word or phrase appears in multiple categories, apply exactly one penalty using first-match-wins:

1. Phrase hard blocker (-5, Section 7)
2. Hard word blocker (-5, Section 6)
3. Context-dependent blocker (-5 metaphorical, 0 literal)
4. Soft deduction -2 (Section 8)
5. Soft deduction -1 (Section 8)
6. Context flag (0, advisory)

A term listed in both hard blocker and soft deduction is evaluated only as hard blocker. Context-dependent terms cleared as literal get no lower-tier penalty. Structural removal directives (cut_always modifiers in Section 4) are not scored penalties and apply independently.

---

<!-- /ANCHOR:voice-personality -->
<!-- ANCHOR:hard-blockers -->
## 6. HARD BLOCKER WORDS (-5 POINTS EACH)

Never use these. Each occurrence is automatic failure.

**Core blockers:**
`delve`, `embark`, `realm`, `tapestry`, `illuminate`, `unveil`, `elucidate`, `abyss`, `revolutionise`, `game-changer`, `groundbreaking`, `cutting-edge`, `ever-evolving`, `shed light`, `dive deep`

**Extended blockers:**
`leverage` (use "use"), `foster` (use "support"), `nurture` (use "develop"), `resonate` (use "connect with"), `empower` (use "enable"), `disrupt` (use "change"), `curate` (use "select"), `harness` (use "use"), `elevate` (use "improve"), `robust` (use "strong"), `seamless` (use "smooth"), `holistic` (use "complete"), `synergy` (use "combined effect"), `unpack` (use "explain"), `landscape` (as industry noun), `ecosystem` (as metaphor), `journey` (as process metaphor), `paradigm` (use "model"), `enlightening` (use "helpful"), `esteemed` (use "respected"), `remarkable` (use "notable"), `skyrocket/skyrocketing` (use "increase"), `utilize/utilizing` (use "use/using")

**Context-dependent** (-5 when metaphorical, OK when literal):
`navigating` (blocked: challenges | OK: website), `landscape` (blocked: competitive | OK: photography), `unlock` (blocked: potential | OK: door), `ecosystem` (blocked: startup | OK: biological), `journey` (blocked: customer | OK: actual travel)

---

<!-- /ANCHOR:hard-blockers -->
<!-- ANCHOR:phrase-hard-blockers -->
## 7. PHRASE HARD BLOCKERS (-5 POINTS EACH)

Never use any of these:

- "It's important to" / "It's worth noting"
- "It goes without saying" / "At the end of the day"
- "Moving forward" / "In today's world"
- "In today's digital landscape"
- "When it comes to" / "Dive into"
- "I'd love to" / "Navigating the [X]"
- "That being said" / "Having said that"
- "Let me be clear" / "The reality is"
- "Here's the thing" / "In a world where"
- "You're not alone"
- "The real question is" / "The truth is"
- "Here's what you need to know" / "What most people don't realise is"

---

<!-- /ANCHOR:phrase-hard-blockers -->
<!-- ANCHOR:soft-deductions -->
## 8. SOFT DEDUCTIONS

### -2 Points Each

| Word | Note |
|------|------|
| craft/crafting | As verb for "create". OK as noun (craft beer). |
| pivotal | Use "important" or "key" |
| intricate | Use "complex" or "detailed" |
| testament | Use "proof" or "evidence" |
| disruptive | Use "new" or describe the change |
| transformative | Use "significant" or describe the effect |
| innovative | Use "new" or describe what's different |
| impactful | Use "effective" or "significant" |
| scalable | When used as buzzword. OK in genuine technical contexts. |
| actionable | When used as buzzword. OK in genuine instruction contexts. |
| strategic | When used as filler adjective. OK in genuine strategy contexts. |
| remains to be seen | Use "we don't know yet" |
| glimpse into | Use "look at" or "overview of" |
| you're not alone | AI comfort phrase. State the specific commonality. |
| discover | When hype. OK in factual discovery contexts. |

### -1 Point Each

**Hedging:** "I think", "I believe", "perhaps", "maybe", "might", "could potentially", "probably"

**Filler:** "actually", "basically", "essentially", "literally", "honestly", "frankly"

**Transitions** (penalty on 3rd+ use): "however", "furthermore", "moreover", "additionally", "consequently"

**Weak adjectives:** "nice", "good", "great", "amazing", "awesome", "incredible", "fantastic", "wonderful", "stark" (use "clear"), "powerful" (when filler)

**Vague verbs:** "get" (use specific: obtain, receive), "do" (use: complete, execute), "make" (use: build, create), "put" (use: place, position), "take" (use: accept, adopt, require), "opened up" (use: created, enabled)

**AI phrases:** "I'd be happy to", "Great question", "That's a great point", "I appreciate you sharing", "Let me help you with that", "imagine" (as setup), "exciting" (as AI enthusiasm)

**Buzzwords:** "synergise", "operationalise", "incentivise", "circle back", "move the needle", "low-hanging fruit", "boost" (as hype filler), "inquiries" (use "questions")

### Context Flags (not penalised, but check)

- **"it"** - Does it have a clear antecedent? Replace with specific noun if ambiguous.
- **"this"** - Always follow with a noun: "This decline" not just "This".
- **"things"/"stuff"** - Replace with specific noun.
- **"solution"** - Overused in B2B. Say what it is: platform, tool, service.
- **"excited"** - AI-typical enthusiasm. State the specific reason for interest instead.

---

<!-- /ANCHOR:soft-deductions -->
<!-- ANCHOR:pre-publish-checklist -->
## 9. PRE-PUBLISH CHECKLIST

### Scoring

A clean document starts at 100 points. Apply the category weights below when evaluating overall quality.

| Category | Weight | What It Covers |
|----------|--------|----------------|
| **Punctuation** | 15% | Em dashes, semicolons, Oxford commas, ellipsis |
| **Structure** | 25% | Heading hierarchy, TOC format, section dividers, two-tier voice, subsection numbering |
| **Content** | 25% | Banned metaphors, generalisations, unnecessary modifiers, meta-commentary |
| **Words** | 20% | Hard blocker words, phrase hard blockers, context-dependent words |
| **Voice** | 15% | Active voice, direct address, sentence rhythm, hedging, certainty |

**Pass threshold:** 85+ (publish-ready). 70-84 (needs revision). Below 70 (failing, must rewrite).

### Checklist

```yaml
pre_publish_checklist:
  punctuation:
    - "No em dashes, semicolons or Oxford commas"
    - "No asterisks for emphasis. Max 1 ellipsis."

  structure:
    - "H2 sections numbered ALL CAPS with anchors"
    - "Numbered H3/H4 subsections use ALL CAPS"
    - "Unnumbered H3/H4 use Title Case"
    - "TOC entries match H2 headings with correct anchors"
    - "--- dividers between H2 sections"
    - "Blockquote tagline after H1 (if applicable)"
    - "No 'not just X, but also Y' patterns"
    - "No exactly 3-item inline enumerations"
    - "No exactly 3 H3 subsections under every H2"
    - "No setup language (Section 4)"
    - "No copula avoidance ('serves as', 'stands as' -- use 'is')"
    - "No synonym cycling (same entity = same word)"
    - "No false ranges ('from X to Y' without meaningful scale)"
    - "No fragmented headers (generic sentence restating heading)"
    - "Max 2 'Think of it as/like' per document"
    - "Max 1 analogy per concept, placed after technical statement"

  content:
    - "No banned metaphors or vague generalisations"
    - "No unnecessary modifiers"
    - "No meta-commentary, knowledge-cutoff disclaimers or training-data hedging"
    - "No significance inflation ('marks a pivotal moment', 'setting the stage')"
    - "No generic positive conclusions ('The future looks bright', 'Exciting times')"

  words:
    - "No hard blocker words (Section 6)"
    - "No phrase hard blockers (Section 7)"
    - "Context-dependent words checked"

  voice:
    - "Active voice throughout"
    - "Direct address where appropriate (you/your)"
    - "Varied sentence lengths"
    - "No hedging when certainty is possible"
    - "Claims backed by data or examples"
    - "Pronouns have clear antecedents"
    - "Writing has personality, not just correctness (Section 5)"
    - "Complexity acknowledged, not flattened into neat categories"
```

---

<!-- /ANCHOR:pre-publish-checklist -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

### Templates That Apply HVR

| Template | Location | Focus |
|----------|----------|-------|
| Implementation Summary | `.opencode/skill/system-spec-kit/templates/*/implementation-summary.md` | Narrative prose, explain "why", direct address |
| Decision Record | `.opencode/skill/system-spec-kit/templates/level_3*/decision-record.md` | Clear rationale, no hedging, active voice |
| README | `.opencode/skill/sk-doc/assets/documentation/readme_template.md` | Welcoming tone, practical focus |
| Install Guide | `.opencode/skill/sk-doc/assets/documentation/install_guide_template.md` | Direct instructions, imperative mood |

### Standards
- [core_standards.md](./core_standards.md) - Document formatting standards
- [sk-doc SKILL.md](../../SKILL.md) - Parent skill with HVR enforcement rules

### Creation Guides
- [readme_creation.md](../specific/readme_creation.md) - README creation workflow and standards
- [install_guide_creation.md](../specific/install_guide_creation.md) - Install guide creation workflow

<!-- /ANCHOR:related-resources -->
