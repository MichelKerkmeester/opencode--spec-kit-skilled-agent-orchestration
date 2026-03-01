# Decision: [YOUR_VALUE_HERE: decision-title] - Architecture Decision Record

Architecture Decision Record (ADR) documenting a significant technical decision and its rationale.

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v1.0 -->

---

## 1. METADATA

- **Decision ID**: ADR-[FORMAT: ###]
- **Status**: [FORMAT: Proposed | Accepted | Deprecated | Superseded]
- **Date**: [FORMAT: YYYY-MM-DD]
- **Deciders**: [YOUR_VALUE_HERE: names of decision makers]
- **Related Feature**: [OPTIONAL: link to spec.md if applicable]
- **Supersedes**: [OPTIONAL: link to ADR this replaces, or N/A]
- **Superseded By**: [OPTIONAL: link to ADR that replaces this, or N/A]

---

## 2. CONTEXT

### Problem Statement
[YOUR_VALUE_HERE: what is the technical problem we are trying to solve? What forces are at play? Example: Need to choose authentication mechanism for API that supports both web and mobile clients with different security requirements]

### Current Situation
[YOUR_VALUE_HERE: describe the current state - what exists today that we're changing or building upon] [OPTIONAL: N/A if greenfield]

### Constraints
- [YOUR_VALUE_HERE: technical constraint 1 - example: Must support iOS 14+ and Android 10+]
- [YOUR_VALUE_HERE: technical constraint 2 - example: Backend team only familiar with Node.js]
- [YOUR_VALUE_HERE: business constraint 1 - example: Must launch within 6 weeks]
- [YOUR_VALUE_HERE: time/resource constraint - example: Single backend developer available]

### Assumptions
- [YOUR_VALUE_HERE: assumption 1 about environment/platform - example: Users will have stable internet connection]
- [YOUR_VALUE_HERE: assumption 2 about users/usage - example: Peak load will be <1000 concurrent users]
- [YOUR_VALUE_HERE: assumption 3 about future needs - example: Will need to add SSO within 6 months]

---

## 3. DECISION

### Summary
[YOUR_VALUE_HERE: one-sentence description of the decision made - example: We will use JWT tokens with refresh token rotation for API authentication]

### Detailed Description
[YOUR_VALUE_HERE: comprehensive description including:
- What will be implemented
- How it will be implemented
- Why this approach was chosen
- What changes from the current state

Example: Implement JWT-based authentication where access tokens expire after 15 minutes and refresh tokens expire after 7 days. Tokens will be stored in httpOnly cookies for web clients and secure storage for mobile clients. The auth service will handle token generation, validation, and rotation.]

### Technical Approach
```[language]
[Code example, architecture diagram, or technical specification]

Example:
POST /auth/login → Returns access token + refresh token
GET /api/* → Requires valid access token in Authorization header
POST /auth/refresh → Exchanges refresh token for new access + refresh tokens
```

---

## 4. ALTERNATIVES CONSIDERED

### Option 1: [CHOSEN] [YOUR_VALUE_HERE: option-name]

**Description**: [How this option works]

**Pros**:
- [Pro 1]
- [Pro 2]
- [Pro 3]

**Cons**:
- [Con 1]
- [Con 2]

**Score**: [X/10]

**Why Chosen**: [YOUR_VALUE_HERE: rationale for selecting this option - example: Best balance of security, ease of implementation, and mobile support]

---

### Option 2: [YOUR_VALUE_HERE: option-name]

**Description**: [How this option works]

**Pros**:
- [Pro 1]
- [Pro 2]

**Cons**:
- [Con 1]
- [Con 2]
- [Con 3]

**Score**: [X/10]

**Why Rejected**: [YOUR_VALUE_HERE: specific reasons this wasn't chosen - example: Session-based auth doesn't scale well with mobile apps and requires sticky sessions]

---

### Option 3: [YOUR_VALUE_HERE: option-name]

**Description**: [How this option works]

**Pros**:
- [Pro 1]
- [Pro 2]

**Cons**:
- [Con 1]
- [Con 2]

**Score**: [X/10]

**Why Rejected**: [YOUR_VALUE_HERE: specific reasons this wasn't chosen]

---

### Comparison Matrix

| Criterion | Weight | [YOUR_VALUE_HERE: Option A] | [YOUR_VALUE_HERE: Option B] | [YOUR_VALUE_HERE: Option C] |
|-----------|--------|----------|----------|----------|
| [YOUR_VALUE_HERE: Criterion 1] | [X/10] | [X/10] | [X/10] | [X/10] |
| [YOUR_VALUE_HERE: Criterion 2] | [X/10] | [X/10] | [X/10] | [X/10] |
| [YOUR_VALUE_HERE: Criterion 3] | [X/10] | [X/10] | [X/10] | [X/10] |
| [YOUR_VALUE_HERE: Criterion 4] | [X/10] | [X/10] | [X/10] | [X/10] |
| [YOUR_VALUE_HERE: Criterion 5] | [X/10] | [X/10] | [X/10] | [X/10] |
| **Weighted Score** | - | **[X/10]** | [Y/10] | [Z/10] |

---

## 5. CONSEQUENCES

### Positive Consequences
- [YOUR_VALUE_HERE: positive outcome 1 - example: Stateless auth scales horizontally without coordination]
- [YOUR_VALUE_HERE: positive outcome 2 - example: Mobile clients can cache tokens for offline validation]
- [YOUR_VALUE_HERE: positive outcome 3 - example: Standard JWT libraries available for all platforms]

### Negative Consequences
- [YOUR_VALUE_HERE: negative outcome 1 + mitigation strategy - example: Tokens cannot be instantly revoked - mitigate with short expiration times]
- [YOUR_VALUE_HERE: negative outcome 2 + mitigation strategy - example: Token size larger than session ID - acceptable trade-off for stateless benefits]
- [YOUR_VALUE_HERE: negative outcome 3 + mitigation strategy]

### Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| [Risk 1] | High/Med/Low | High/Med/Low | [How to mitigate] |
| [Risk 2] | High/Med/Low | High/Med/Low | [How to mitigate] |

### Technical Debt Introduced
- [YOUR_VALUE_HERE: technical debt item 1 + plan to address - example: Manual token rotation code - plan to migrate to OAuth2 library in 6 months]
- [YOUR_VALUE_HERE: technical debt item 2 + plan to address]

---

## 6. IMPLEMENTATION NOTES

> **Parallel Work:** Use `[P]` prefix for tasks that can be done in parallel:
> - [P] Task A - can run simultaneously with Task B
> - [P] Task B - can run simultaneously with Task A
> - Task C - depends on A and B (no [P] prefix)

---

## 7. IMPACT ASSESSMENT

### Systems Affected
- [System/component 1] - [How it's affected]
- [System/component 2] - [How it's affected]
- [System/component 3] - [How it's affected]

### Teams Impacted
- [Team 1] - [What they need to do]
- [Team 2] - [What they need to do]

### Migration Path
[OPTIONAL: If this changes existing systems, describe the migration approach:]
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Rollback Strategy
[YOUR_VALUE_HERE: how to revert this decision if needed - example: Feature flag allows instant rollback to session-based auth; database schema unchanged so no data migration required]

---

## 8. TIMELINE

- **Decision Made**: [FORMAT: YYYY-MM-DD]
- **Implementation Start**: [FORMAT: YYYY-MM-DD] [OPTIONAL: empty if not started]
- **Target Completion**: [FORMAT: YYYY-MM-DD] [OPTIONAL: empty if not planned]
- **Review Date**: [FORMAT: YYYY-MM-DD] [OPTIONAL: when we'll review if this decision still makes sense]

---

## 9. REFERENCES

### Related Documents
- **Feature Specification**: [OPTIONAL: link to spec.md]
- **Implementation Plan**: [OPTIONAL: link to plan.md]
- **Related ADRs**: [OPTIONAL: links to related decisions]
- **Research/Spikes**: [OPTIONAL: links to research that informed this decision]

### External References
- [Link to documentation]
- [Link to research paper]
- [Link to blog post/article]
- [Link to discussion/RFC]

### Discussion History
- [OPTIONAL: link to Slack thread]
- [OPTIONAL: link to meeting notes]
- [OPTIONAL: link to RFC document]

---

## 10. APPROVAL & SIGN-OFF

### Approvers

| Name | Role | Approved | Date | Comments |
|------|------|----------|------|----------|
| [Name] | [Role] | Yes / No | [Date] | [Comments] |
| [Name] | [Role] | Yes / No | [Date] | [Comments] |
| [Name] | [Role] | Yes / No | [Date] | [Comments] |

### Status Changes

| Date | Previous Status | New Status | Reason |
|------|----------------|------------|--------|
| [FORMAT: YYYY-MM-DD] | - | Proposed | [Initial proposal] |
| [FORMAT: YYYY-MM-DD] | Proposed | Accepted | [Approval rationale] |

---

## 11. UPDATES & AMENDMENTS

### Amendment History

| Date | Change | Reason | Updated By |
|------|--------|--------|------------|
| [FORMAT: YYYY-MM-DD] | [What changed] | [Why] | [Name] |

### Review Notes
[OPTIONAL: notes from periodic reviews of this decision]

---

**Review Schedule**: This decision should be reviewed on [FORMAT: YYYY-MM-DD] to assess if it still meets our needs.

---

## WHEN TO USE THIS TEMPLATE

**Use decision-record-*.md when:**
- Making significant architectural or technical decisions
- Decision affects multiple teams or systems
- Need to document rationale for future reference
- Decision involves trade-offs that should be explicit
- Multiple stakeholders need to approve decision
- Decision may be questioned in the future

**Do NOT use when:**
- Trivial technical choices (library versions, formatting rules)
- Decisions already documented in code/comments
- No alternatives considered (obvious choice)
- Decision scope is single function or file

**Common decision types:**
- Technology/framework selection
- Architecture patterns (microservices, monolith, etc.)
- Data storage approaches
- Authentication/authorization mechanisms
- API design patterns
- Deployment strategies
- Integration approaches

**Related templates:**
- Create ADR after spike-*.md if spike leads to decision
- Reference from spec.md or plan.md for feature-level decisions
- Update ADR status (deprecated/superseded) when decision changes
- Link related ADRs that build on or replace each other

---

<!--
  REPLACE SAMPLE CONTENT IN FINAL OUTPUT
  - This template contains placeholders and examples
  - Replace them with actual content
-->
