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
- Use word lists (Sections 5-7) as reference during writing
- Run the pre-publish checklist (Section 8) before finalizing
- **Scoring:** Hard blockers cost -5 points. Soft deductions cost -2 or -1. Clean document starts at 100.

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

Cut these words. They add no meaning: very, really, truly, absolutely, incredibly, extremely, quite, rather, somewhat, fairly, just, actually, basically, literally, simply, obviously, clearly, certainly, definitely, essentially.

### Output Warnings

Never include meta-commentary about the writing process. No disclaimers about tone. No references to these rules in output. No "I've kept this concise" or "I avoided jargon."

---

<!-- /ANCHOR:ai-structural-patterns -->
<!-- ANCHOR:hard-blockers -->
## 5. HARD BLOCKER WORDS (-5 POINTS EACH)

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
## 6. PHRASE HARD BLOCKERS (-5 POINTS EACH)

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

---

<!-- /ANCHOR:phrase-hard-blockers -->
<!-- ANCHOR:soft-deductions -->
## 7. SOFT DEDUCTIONS

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

### -1 Point Each

**Hedging:** "I think", "I believe", "perhaps", "maybe", "might", "could potentially", "probably"

**Filler:** "actually", "basically", "essentially", "literally", "honestly", "frankly"

**Transitions** (penalty on 3rd+ use): "however", "furthermore", "moreover", "additionally", "consequently"

**Weak adjectives:** "nice", "good", "great", "amazing", "awesome", "incredible", "fantastic", "wonderful", "stark" (use "clear"), "powerful" (when filler)

**Vague verbs:** "get" (use specific: obtain, receive), "do" (use: complete, execute), "make" (use: build, create), "opened up" (use: created, enabled)

**AI phrases:** "I'd be happy to", "Great question", "That's a great point", "I appreciate you sharing", "imagine" (as setup), "exciting" (as AI enthusiasm)

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
## 8. PRE-PUBLISH CHECKLIST

```yaml
pre_publish_checklist:
  punctuation:
    - "No em dashes, semicolons or Oxford commas"
    - "No asterisks for emphasis. Max 1 ellipsis."

  structure:
    - "No 'not just X, but also Y' patterns"
    - "No exactly 3-item enumerations"
    - "No setup language (Section 4)"

  content:
    - "No banned metaphors or vague generalisations"
    - "No unnecessary modifiers"
    - "No meta-commentary about writing process"

  words:
    - "No hard blocker words (Section 5)"
    - "No phrase hard blockers (Section 6)"
    - "Context-dependent words checked"

  voice:
    - "Active voice throughout"
    - "Direct address where appropriate (you/your)"
    - "Varied sentence lengths"
    - "No hedging when certainty is possible"
    - "Claims backed by data or examples"
    - "Pronouns have clear antecedents"
```

---

<!-- /ANCHOR:pre-publish-checklist -->
<!-- ANCHOR:related-resources -->
## 9. RELATED RESOURCES

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

<!-- /ANCHOR:related-resources -->
