---
title: "Feature Research: [YOUR_VALUE_HERE: feature-name] - Comprehensive Technical Investigation [template:research.md]"
description: "Complete research documentation providing in-depth technical analysis, architecture patterns, and implementation guidance."
trigger_phrases:
  - "feature"
  - "research"
  - "your"
  - "value"
  - "here"
  - "template"
importance_tier: "normal"
contextType: "general"
---
# Feature Research: [YOUR_VALUE_HERE: feature-name] - Comprehensive Technical Investigation

Complete research documentation providing in-depth technical analysis, architecture patterns, and implementation guidance.

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

**Use research.md when:**
- Complex features requiring deep technical investigation spanning multiple areas
- Research involving multiple integration points or technologies
- Documentation will serve as authoritative reference during implementation
- Research answers strategic technical questions requiring comprehensive analysis
- Investigation covers 3+ major technical domains (APIs, data models, integrations, etc.)

**Do NOT use when:**
- Simple feature specifications (use spec.md)
- Architecture decisions only (use decision-record.md or include in this doc)

**This template is designed for comprehensive feature research that will guide implementation.**
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Research ID**: RESEARCH-[FORMAT: ###]
- **Feature/Spec**: [YOUR_VALUE_HERE: link to related spec.md or feature name]
- **Status**: [FORMAT: Draft | In Progress | Review | Complete | Archived]
- **Date Started**: [FORMAT: YYYY-MM-DD]
- **Date Completed**: [FORMAT: YYYY-MM-DD] [OPTIONAL: empty if in progress]
- **Researcher(s)**: [YOUR_VALUE_HERE: names/roles]
- **Reviewers**: [YOUR_VALUE_HERE: names/roles]
- **Last Updated**: [FORMAT: YYYY-MM-DD]

**Related Documents**:
- Spec: [OPTIONAL: link to spec.md if applicable]
- Spike: [OPTIONAL: link to spike-*.md if applicable]
- ADR: [OPTIONAL: link to decision-record-*.md if applicable]
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:file-organization -->
## FILE ORGANIZATION

**During research, organize files as:**
- Research findings → This file (research.md)
- Experiments/code → `scratch/experiments/`
- Raw data/responses → `scratch/data/`
- Debug/logs → `scratch/logs/`

**After research:**
- Move valuable code to permanent location
- Summarize key data in research.md
- Delete scratch/ contents

> **OpenCode Users:** Clean up scratch/ manually before claiming completion.
<!-- /ANCHOR:file-organization -->

---

<!-- ANCHOR:investigation-report -->
## 2. INVESTIGATION REPORT

### Request Summary
[YOUR_VALUE_HERE: summarize the original request or problem - what question are we trying to answer? What feature are we investigating? - 2-4 sentences]

### Current Behavior
[YOUR_VALUE_HERE: describe the current state if applicable - what exists today? What are the current limitations or issues?] [OPTIONAL: N/A if greenfield feature]

### Key Findings
1. **[YOUR_VALUE_HERE: finding 1 title]**: [Description and significance]
2. **[YOUR_VALUE_HERE: finding 2 title]**: [Description and significance]
3. **[YOUR_VALUE_HERE: finding 3 title]**: [Description and significance]

### Recommendations
[YOUR_VALUE_HERE: based on research findings, what do we recommend? What is the proposed path forward?]

**Primary Recommendation**:
- [YOUR_VALUE_HERE: primary approach with rationale - example: Use GraphQL API because it reduces over-fetching and provides flexible queries]

**Alternative Approaches**:
- [YOUR_VALUE_HERE: alternative 1 with trade-offs - example: REST API - simpler but requires multiple endpoints]
- [YOUR_VALUE_HERE: alternative 2 with trade-offs - example: gRPC - faster but steeper learning curve]
<!-- /ANCHOR:investigation-report -->

---

<!-- ANCHOR:executive-overview -->
## 3. EXECUTIVE OVERVIEW

### Executive Summary
[YOUR_VALUE_HERE: 2-3 paragraph high-level summary of the research, findings, and recommendations - should be understandable by non-technical stakeholders]

### Architecture Diagram

```
[YOUR_VALUE_HERE: ASCII diagram showing high-level architecture, data flow, or system components]

Example:
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │─────▶│   Server    │─────▶│  Database   │
│  (Browser)  │◀─────│   (API)     │◀─────│ (Storage)   │
└─────────────┘      └─────────────┘      └─────────────┘
```

### Quick Reference Guide

**When to use this approach**:
- [YOUR_VALUE_HERE: use case 1]
- [YOUR_VALUE_HERE: use case 2]

**When NOT to use this approach**:
- [YOUR_VALUE_HERE: limitation 1]
- [YOUR_VALUE_HERE: limitation 2]

**Key considerations**:
- [YOUR_VALUE_HERE: consideration 1]
- [YOUR_VALUE_HERE: consideration 2]

### Research Sources

| Source Type | Description | Link/Reference | Credibility |
|-------------|-------------|----------------|-------------|
| Documentation | [Official docs title] | [URL] | High |
| Article/Tutorial | [Title] | [URL] | Medium |
| Example Implementation | [Description] | [URL] | High |
| Community Discussion | [Topic] | [URL] | Medium |
<!-- /ANCHOR:executive-overview -->

---

<!-- ANCHOR:core-architecture -->
## 4. CORE ARCHITECTURE

### System Components

#### Component 1: [YOUR_VALUE_HERE: component-name]
**Purpose**: [What this component does]

**Responsibilities**:
- [Responsibility 1]
- [Responsibility 2]

**Dependencies**:
- [Dependency 1]
- [Dependency 2]

**Key APIs/Interfaces**:
```[language]
[Code example or interface definition]
```

---

#### Component 2: [YOUR_VALUE_HERE: component-name]
**Purpose**: [What this component does]

**Responsibilities**:
- [Responsibility 1]
- [Responsibility 2]

---

### Data Flow

```
[YOUR_VALUE_HERE: ASCII diagram or description of how data flows through the system]

Example:
User Input → Validation → Processing → Storage → Response
     ↓                                              ↑
  [Error]                                      [Success]
```

**Flow Steps**:
1. [YOUR_VALUE_HERE: step 1]: [Description]
2. [YOUR_VALUE_HERE: step 2]: [Description]
3. [YOUR_VALUE_HERE: step 3]: [Description]

### Integration Points

**External Systems**:
- **[System 1]**: [How it integrates, what data is exchanged]
- **[System 2]**: [How it integrates, what data is exchanged]

**Internal Modules**:
- **[Module 1]**: [Integration approach]
- **[Module 2]**: [Integration approach]

### Dependencies

| Dependency | Version | Purpose | Critical? | Alternative |
|------------|---------|---------|-----------|-------------|
| [Library 1] | [v.X.X] | [Purpose] | Yes/No | [Alternative] |
| [Library 2] | [v.X.X] | [Purpose] | Yes/No | [Alternative] |
<!-- /ANCHOR:core-architecture -->

---

<!-- ANCHOR:technical-specifications -->
## 5. TECHNICAL SPECIFICATIONS

### API Documentation

#### Endpoint/Method 1: [YOUR_VALUE_HERE: name]

**Purpose**: [What this API does]

**Signature**:
```[language]
[Function signature, endpoint definition, or API contract]
```

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| [param1] | [type] | Yes/No | [value] | [Description] |
| [param2] | [type] | Yes/No | [value] | [Description] |

**Returns**:
```[language]
[Return type and structure]
```

**Example Usage**:
```[language]
[Code example showing usage]
```

---

### Attribute Reference

| Attribute | Type | Default | Description | Valid Values |
|-----------|------|---------|-------------|--------------|
| [attr1] | [type] | [default] | [Description] | [Valid values] |
| [attr2] | [type] | [default] | [Description] | [Valid values] |

### Event Contracts

#### Event 1: [YOUR_VALUE_HERE: EventName]

**Trigger**: [What causes this event]

**Payload**:
```[language]
{
  field1: type,
  field2: type
}
```

**Listeners**: [What listens to this event]

---

### State Management

**State Structure**:
```[language]
[Definition of state shape]
```

**State Transitions**:
```
[State A] → [Action] → [State B]
[State B] → [Action] → [State C]
```

**State Persistence**: [How and where state is persisted, if applicable]
<!-- /ANCHOR:technical-specifications -->

---

<!-- ANCHOR:constraints-limitations -->
## 6. CONSTRAINTS & LIMITATIONS

### Platform Limitations
- **[Limitation 1]**: [Description, impact, and workaround if available]
- **[Limitation 2]**: [Description, impact, and workaround if available]

### Security Restrictions
- **[Restriction 1]**: [Description and implications]
- **[Restriction 2]**: [Description and implications]

### Performance Boundaries
- **[Boundary 1]**: [example: Max 1000 requests/minute]
- **[Boundary 2]**: [example: Response time <200ms p95]

### Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge | Notes |
|---------|--------|---------|--------|------|-------|
| [Feature 1] | ✅ v90+ | ✅ v88+ | ⚠️ v14+ | ✅ v90+ | [Notes] |
| [Feature 2] | ✅ | ✅ | ❌ | ✅ | [Safari workaround] |

Legend: ✅ Supported | ⚠️ Partial support | ❌ Not supported

### Rate Limiting
- **API Rate Limits**: [Description of rate limits]
- **Throttling Strategy**: [How to handle rate limits]
- **Backoff Strategy**: [Exponential backoff, retry logic]
<!-- /ANCHOR:constraints-limitations -->

---

<!-- ANCHOR:integration-patterns -->
## 7. INTEGRATION PATTERNS

### Third-Party Service Integration

#### Service 1: [YOUR_VALUE_HERE: service-name]

**Purpose**: [What this service provides]

**Integration Approach**:
```[language]
[Code example showing integration pattern]
```

**Configuration**:
- [Config item 1]: [Value/description]
- [Config item 2]: [Value/description]

**Error Handling**: [How to handle service failures]

---

### Authentication Handling

**Authentication Method**: [example: OAuth2, JWT, API Key]

**Implementation**:
```[language]
[Code example showing auth implementation]
```

**Token Management**:
- Storage: [Where tokens are stored]
- Refresh: [How tokens are refreshed]
- Expiration: [How expiration is handled]

### Error Management

**Error Categories**:
| Category | HTTP Code | Handling Strategy | User Message |
|----------|-----------|-------------------|--------------|
| [Category 1] | [4xx/5xx] | [Strategy] | [Message] |
| [Category 2] | [4xx/5xx] | [Strategy] | [Message] |

**Error Handling Pattern**:
```[language]
[Code example showing error handling]
```

### Retry Strategies

**Retry Configuration**:
- Max Retries: [Number]
- Initial Delay: [Duration]
- Max Delay: [Duration]
- Backoff Factor: [Multiplier]

**Retry Logic**:
```[language]
[Code example showing retry implementation]
```
<!-- /ANCHOR:integration-patterns -->

---

<!-- ANCHOR:implementation-guide -->
## 8. IMPLEMENTATION GUIDE

### Markup Requirements

**HTML Structure**:
```html
[Required HTML markup for this feature]
```

**Required Attributes**:
- `[attribute1]`: [Purpose and usage]
- `[attribute2]`: [Purpose and usage]

**Accessibility Requirements**:
- [ARIA attributes needed]
- [Keyboard navigation requirements]
- [Screen reader considerations]

---

### JavaScript Implementation

**Initialization**:
```javascript
[Code example showing how to initialize the feature]
```

**Core Logic**:
```javascript
[Main implementation code]
```

**Event Handlers**:
```javascript
[Event handling code]
```

**Cleanup**:
```javascript
[Teardown/cleanup code for SPA compatibility]
```

---

### CSS Specifications

**Required Styles**:
```css
[Essential CSS for this feature]
```

**Responsive Breakpoints**:
```css
/* Mobile: < 768px */
[Mobile styles]

/* Tablet: 768px - 1024px */
[Tablet styles]

/* Desktop: > 1024px */
[Desktop styles]
```

**Dark Mode Support**:
```css
[Dark mode styles if applicable]
```

---

### Configuration Options

| Option | Type | Default | Description | Example |
|--------|------|---------|-------------|---------|
| [option1] | [type] | [default] | [Description] | [Example value] |
| [option2] | [type] | [default] | [Description] | [Example value] |

**Configuration Example**:
```[language]
[Complete configuration example]
```
<!-- /ANCHOR:implementation-guide -->

---

<!-- ANCHOR:code-examples -->
## 9. CODE EXAMPLES & SNIPPETS

### Initialization Patterns

#### Pattern 1: Basic Initialization
```[language]
[Basic initialization code]
```

#### Pattern 2: Advanced Initialization with Options
```[language]
[Advanced initialization with configuration]
```

---

### Helper Functions

#### Helper 1: [YOUR_VALUE_HERE: function-name]
**Purpose**: [What this helper does]

```[language]
[Function implementation]
```

**Usage**:
```[language]
[Example of using the helper]
```

---

### API Usage Examples

#### Example 1: [YOUR_VALUE_HERE: use-case]
```[language]
[Complete example showing common use case]
```

#### Example 2: [YOUR_VALUE_HERE: use-case]
```[language]
[Complete example showing another use case]
```

---

### Edge Case Handling

#### Edge Case 1: [YOUR_VALUE_HERE: scenario]
**Problem**: [Description of edge case]

**Solution**:
```[language]
[Code showing how to handle this edge case]
```
<!-- /ANCHOR:code-examples -->

#### Edge Case 2: [YOUR_VALUE_HERE: scenario]
**Problem**: [Description of edge case]

**Solution**:
```[language]
[Code showing how to handle this edge case]
```

---

<!-- ANCHOR:testing-debugging -->
## 10. TESTING & DEBUGGING

### Test Strategies

**Unit Testing**:
- [Test approach for component 1]
- [Test approach for component 2]

**Integration Testing**:
- [Integration test scenarios]
- [Test data requirements]

**End-to-End Testing**:
- [E2E test flows]
- [Critical user journeys to test]

### Debugging Approaches

**Common Issues**:
1. **[Issue 1]**: [How to identify and debug]
2. **[Issue 2]**: [How to identify and debug]

**Debugging Tools**:
- [Tool 1]: [How to use for debugging]
- [Tool 2]: [How to use for debugging]

**Logging Strategy**:
```[language]
[Example logging implementation]
```

---

### E2E Test Examples

#### Test 1: [YOUR_VALUE_HERE: test-name]
**Scenario**: [What this test validates]

```[language]
[Complete E2E test code]
```

**Expected Result**: [What should happen]

---

### Diagnostic Tools

**Built-in Diagnostics**:
```[language]
[Code for diagnostic/debug mode]
```

**Console Commands**:
- `[command1]`: [What it does]
- `[command2]`: [What it does]
<!-- /ANCHOR:testing-debugging -->

---

<!-- ANCHOR:performance-optimization -->
## 11. PERFORMANCE OPTIMIZATION

### Optimization Tactics

#### Tactic 1: [YOUR_VALUE_HERE: optimization-name]
**Problem**: [Performance issue being addressed]

**Solution**: [Description of optimization]

**Implementation**:
```[language]
[Code showing optimization]
```

**Impact**: [Measured improvement - example: Reduced load time by 40%]

---

### Benchmarks

| Metric | Before | After | Improvement | Target |
|--------|--------|-------|-------------|--------|
| [Metric 1] | [Value] | [Value] | [%] | [Target value] |
| [Metric 2] | [Value] | [Value] | [%] | [Target value] |

**Benchmark Environment**: [Description of test conditions]

### Rate Limiting Implementation

```[language]
[Code showing rate limiting implementation]
```

### Caching Strategies

**Cache Levels**:
1. **[Level 1]**: [What is cached, TTL, invalidation strategy]
2. **[Level 2]**: [What is cached, TTL, invalidation strategy]

**Cache Implementation**:
```[language]
[Code showing caching implementation]
```
<!-- /ANCHOR:performance-optimization -->

---

<!-- ANCHOR:security-considerations -->
## 12. SECURITY CONSIDERATIONS

### Validation Approach

**Input Validation**:
```[language]
[Code showing input validation]
```

**Validation Rules**:
| Field | Type | Required | Validation | Error Message |
|-------|------|----------|------------|---------------|
| [field1] | [type] | Yes/No | [Rules] | [Message] |
| [field2] | [type] | Yes/No | [Rules] | [Message] |

### Data Protection

**Sensitive Data Handling**:
- [How PII is handled]
- [Encryption requirements]
- [Storage security]

**Data Sanitization**:
```[language]
[Code showing sanitization approach]
```

### Spam Prevention

**Prevention Mechanisms**:
- [Mechanism 1]: [Implementation details]
- [Mechanism 2]: [Implementation details]

**Rate Limiting**: [How spam is rate-limited]

### Authentication & Authorization

**Authentication Flow**:
```
[Diagram or description of auth flow]
```

**Authorization Checks**:
```[language]
[Code showing authorization implementation]
```

**Security Headers**:
```
[Required security headers]
```
<!-- /ANCHOR:security-considerations -->

---

<!-- ANCHOR:future-proofing-maintenance -->
## 13. FUTURE-PROOFING & MAINTENANCE

### Upgrade Paths

**Version Migration**:
| From Version | To Version | Migration Steps | Breaking Changes |
|--------------|------------|-----------------|------------------|
| [v1.x] | [v2.x] | [Steps] | [Changes] |

**Backward Compatibility**: [How backward compatibility is maintained]

### Compatibility Matrix

| Feature Version | Platform Version | Compatibility | Notes |
|----------------|------------------|---------------|-------|
| [v1.0] | [Platform v1.x] | ✅ | [Notes] |
| [v2.0] | [Platform v2.x] | ⚠️ | [Migration required] |

### Decision Trees

#### Decision 1: [YOUR_VALUE_HERE: choice-to-make]
```
Should I use [Option A] or [Option B]?
├─ If [condition 1] → Use Option A
│   └─ Because: [Rationale]
└─ If [condition 2] → Use Option B
    └─ Because: [Rationale]
```

### SPA Support

**Single Page Application Compatibility**:
- [Requirement 1 for SPA support]
- [Requirement 2 for SPA support]

**SPA Initialization Pattern**:
```[language]
[Code showing SPA-compatible initialization]
```

**Cleanup for Route Changes**:
```[language]
[Code showing proper cleanup]
```
<!-- /ANCHOR:future-proofing-maintenance -->

---

<!-- ANCHOR:api-reference -->
## 14. API REFERENCE

### Attributes Table

| Attribute | Type | Default | Required | Description | Example |
|-----------|------|---------|----------|-------------|---------|
| [attr1] | [type] | [default] | Yes/No | [Description] | [Example] |
| [attr2] | [type] | [default] | Yes/No | [Description] | [Example] |

### JavaScript API

#### Method 1: `[YOUR_VALUE_HERE: methodName]`

**Description**: [What this method does]

**Signature**:
```[language]
[Method signature]
```

**Parameters**:
- `[param1]` ([type]): [Description]
- `[param2]` ([type], optional): [Description]

**Returns**: [Return type and description]

**Example**:
```[language]
[Usage example]
```

---

### Events Reference

| Event Name | When Triggered | Payload | Cancelable |
|------------|---------------|---------|------------|
| [event1] | [Trigger condition] | [Payload structure] | Yes/No |
| [event2] | [Trigger condition] | [Payload structure] | Yes/No |

**Event Listener Example**:
```[language]
[Code showing how to listen to events]
```

### Cleanup Methods

#### Method: `cleanup()` / `destroy()`

**Purpose**: [Proper cleanup for memory management and SPA support]

**Usage**:
```[language]
[Cleanup usage example]
```

**When to Call**:
- Before removing DOM elements
- On route changes in SPAs
- Before re-initialization
<!-- /ANCHOR:api-reference -->

---

<!-- ANCHOR:troubleshooting-guide -->
## 15. TROUBLESHOOTING GUIDE

### Common Issues

#### Issue 1: [YOUR_VALUE_HERE: problem-description]

**Symptoms**:
- [Symptom 1]
- [Symptom 2]

**Possible Causes**:
1. [Cause 1]
2. [Cause 2]

**Solutions**:
1. [Solution 1 with code example if applicable]
2. [Solution 2 with code example if applicable]

**Prevention**: [How to avoid this issue]

---

#### Issue 2: [YOUR_VALUE_HERE: problem-description]

**Symptoms**:
- [Symptom 1]
- [Symptom 2]

**Possible Causes**:
1. [Cause 1]
2. [Cause 2]

**Solutions**:
1. [Solution 1]
2. [Solution 2]

---

### Error Messages

| Error Code/Message | Meaning | Solution | Related Documentation |
|-------------------|---------|----------|----------------------|
| [ERROR_1] | [What it means] | [How to fix] | [Link to section] |
| [ERROR_2] | [What it means] | [How to fix] | [Link to section] |

### Solutions & Workarounds

#### Workaround 1: [YOUR_VALUE_HERE: scenario]
**Problem**: [Description of limitation or issue]

**Workaround**:
```[language]
[Code showing workaround]
```

**Trade-offs**: [What you lose with this workaround]
<!-- /ANCHOR:troubleshooting-guide -->

---

<!-- ANCHOR:acknowledgements -->
## 16. ACKNOWLEDGEMENTS

### Research Contributors
- [Name/Role]: [Contribution]
- [Name/Role]: [Contribution]

### Resources & References
- [Resource 1]: [How it helped]
- [Resource 2]: [How it helped]

### External Tools & Libraries Used
- [Tool/Library 1]: [Version, purpose]
- [Tool/Library 2]: [Version, purpose]
<!-- /ANCHOR:acknowledgements -->

---

<!-- ANCHOR:appendix -->
## APPENDIX

### Glossary
- **[Term 1]**: [Definition]
- **[Term 2]**: [Definition]

### Related Research
- [Link to related spike-*.md]
- [Link to related decision-record-*.md]

### Change Log Detail
[Detailed change history if needed beyond metadata section]
<!-- /ANCHOR:appendix -->

---

<!-- ANCHOR:changelog-updates -->
## CHANGELOG & UPDATES

### Version History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| [FORMAT: YYYY-MM-DD] | 1.0.0 | Initial research completed | [Name] |
| [FORMAT: YYYY-MM-DD] | 1.1.0 | Updated with [changes] | [Name] |

### Recent Updates
- [FORMAT: YYYY-MM-DD]: [Description of update]
<!-- /ANCHOR:changelog-updates -->
- [FORMAT: YYYY-MM-DD]: [Description of update]

---

<!--
  REPLACE SAMPLE CONTENT IN FINAL OUTPUT
  - This template contains placeholders and examples
  - Replace them with actual content
  - Remove sections that don't provide value (mark as N/A or delete)
  - Adjust language/code examples to match your tech stack
  - Maintain the SPECKIT_TEMPLATE_SOURCE marker at the top
-->
