# Approval Workflow with Loops - Multiple Reviewers and Revision Cycles

Document approval flow with multiple reviewers, revision cycles, and escalation paths.

---

## Use Case: Marketing Content Approval Process

```
╭──────────────────────────────────────────────────────────────╮
│        MARKETING CONTENT APPROVAL WORKFLOW                   │
│        Multi-Stage Review with Revision Cycles               │
╰──────────────────────────────────────────────────────────────╯
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  Content Creation                                            │
│  • Writer drafts content                                     │
│  • Initial review by writer                                  │
│  • Self-edit pass                                            │
│  Duration: 2-4 hours                                         │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  Submit for Review                                           │
│  • Upload to system                                          │
│  • Assign reviewers                                          │
│  • Set deadline: 48 hours                                    │
│  • Notify team                                               │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  REVIEW STAGE 1: EDITORIAL                                   │
│  Editor Review & Quality Check                               │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  Editorial Review                                            │
│  • Grammar check                                             │
│  • Style consistency                                         │
│  • Brand voice alignment                                     │
│  • Fact verification                                          │
│  Reviewer: Senior Editor                                     │
│  Duration: 2-3 hours                                         │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                      ╱──────────────╲
                     ╱  Editorial     ╲
                    ╱   Approved?      ╲
                    ╲                  ╱
                     ╲────────────────╱
                       │           │
                   Approved    Needs Revision
                       │           │
                       │           ▼
                       │     ┌───────────────────────┐
                       │     │  Document Issues      │
                       │     │  • Grammar errors     │
                       │     │  • Style problems     │
                       │     │  • Factual issues     │
                       │     │  • Add comments       │
                       │     └───────────────────────┘
                       │           │
                       │           ▼
                       │     ┌───────────────────────┐
                       │     │  Return to Writer     │
                       │     │  • Email notification  │
                       │     │  • Deadline: 24h      │
                       │     └───────────────────────┘
                       │           │
                       │           ▼
                       │     ┌───────────────────────┐
                       │     │  Writer Revises       │
                       │     │  • Address feedback   │
                       │     │  • Update content     │
                       │     │  • Resubmit           │
                       │     └───────────────────────┘
                       │           │
                       │           │ Loop back
                       │           └────────────────┐
                       │                            │
                       │  ╭──────────────────────╮  │
                       │  │  Revision Count = 1  │  │
                       │  ╰──────────────────────╯  │
                       │                            │
                       │◀───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  REVIEW STAGE 2: MARKETING LEAD                              │
│  Strategic & Brand Alignment                                 │
└──────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  Marketing Lead Review                                       │
│  • Strategy alignment                                        │
│  • Campaign fit                                               │
│  • Audience appropriateness                                  │
│  • Call-to-action effectiveness                              │
│  Reviewer: Marketing Director                                │
│  Duration: 1-2 hours                                         │
└──────────────────────────────────────────────────────────────┘
                       │
                       ▼
                ╱──────────────╲
               ╱  Marketing     ╲
              ╱   Approved?      ╲
              ╲                  ╱
               ╲────────────────╱
                 │           │
             Approved    Major Changes
                 │           │
                 │           ▼
                 │     ╱──────────────╲
                 │    ╱  Changes       ╲
                 │   ╱   Scope?         ╲
                 │   ╲                  ╱
                 │    ╲────────────────╱
                 │      │           │
                 │    Minor       Major
                 │      │           │
                 │      │           ▼
                 │      │     ┌─────────────────┐
                 │      │     │  Escalate to    │
                 │      │     │  VP Marketing   │
                 │      │     │  • Review scope │
                 │      │     │  • Decide path  │
                 │      │     └─────────────────┘
                 │      │           │
                 │      │           ▼
                 │      │     ╱──────────────╲
                 │      │    ╱  Complete       ╲
                 │      │   ╱   Rewrite?        ╲
                 │      │   ╲                   ╱
                 │      │    ╲─────────────────╱
                 │      │      │           │
                 │      │     Yes          No
                 │      │      │           │
                 │      │      ▼           │
                 │      │ ┌─────────────┐  │
                 │      │ │  Start New  │  │
                 │      │ │  Document   │  │
                 │      │ │  Cycle      │  │
                 │      │ └─────────────┘  │
                 │      │      │           │
                 │      │      ▼           │
                 │      │ ╭─────────────╮  │
                 │      │ │  END        │  │
                 │      │ ╰─────────────╯  │
                 │      │                  │
                 │      ▼                  │
                 │ ┌───────────────────┐   │
                 │ │  Request Revisions│   │
                 │ │  • Detail changes │   │
                 │ │  • Set priority   │   │
                 │ └───────────────────┘   │
                 │      │                  │
                 │      │◀─────────────────┘
                 │      │
                 │      ▼
                 │ ┌───────────────────┐
                 │ │  Writer Updates   │
                 │ │  • Make changes   │
                 │ │  • Quick review   │
                 │ └───────────────────┘
                 │      │
                 │      │ Loop back to Marketing
                 │      └──────────────┐
                 │                     │
                 │  ╭──────────────────────╮
                 │  │  Revision Count = 2  │
                 │  ╰──────────────────────╯
                 │                     │
                 │◀────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│  REVIEW STAGE 3: LEGAL COMPLIANCE                            │
│  Risk Assessment & Legal Review                              │
└──────────────────────────────────────────────────────────────┘
                 │
                 ▼
          ╱──────────────╲
         ╱  Content Type   ╲
        ╱   Requires Legal? ╲
        ╲                   ╱
         ╲─────────────────╱
           │           │
         Yes           No (Skip)
           │           │
           │           └──────────┐
           ▼                      │
┌────────────────────────────┐    │
│  Legal Review              │    │
│  • Compliance check        │    │
│  • Claims verification      │    │
│  • Risk assessment         │    │
│  • Regulatory review       │    │
│  Reviewer: Legal Team      │    │
│  Duration: 1-3 hours       │    │
└────────────────────────────┘    │
           │                      │
           ▼                      │
    ╱──────────────╲              │
   ╱  Legal         ╲             │
  ╱   Approved?      ╲            │
  ╲                  ╱            │
   ╲────────────────╱             │
     │           │                │
  Approved   Changes Required     │
     │           │                │
     │           ▼                │
     │     ┌─────────────────┐    │
     │     │  Legal Issues   │    │
     │     │  • Non-compliant│    │
     │     │  • Risky claims │    │
     │     │  • Must fix      │    │
     │     └─────────────────┘    │
     │           │                │
     │           ▼                │
     │     ┌───────────────┐      │
     │     │  Return to    │      │
     │     │  Writer       │      │
     │     │  PRIORITY     │      │
     │     └───────────────┘      │
     │           │                │
     │           │ Loop back      │
     │           └──────────┐     │
     │                      │     │
     │  ╭──────────────────────╮  │
     │  │  Revision Count = 3  │  │
     │  ╰──────────────────────╯  │
     │                      │     │
     │◀─────────────────────┘     │
     │                            │
     └─────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│  FINAL APPROVAL GATE                                        │
│  All Reviews Complete                                       │
└─────────────────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│  Pre-Publication Checklist                                  │
│  ✓ Editorial approved                                       │
│  ✓ Marketing approved                                       │
│  ✓ Legal approved (if required)                             │
│  ✓ All revisions incorporated                               │
│  ✓ Final quality check                                      │
└─────────────────────────────────────────────────────────────┘
               │
               ▼
         ╱──────────────╲
        ╱  All Checklist  ╲
       ╱   Items Complete? ╲
       ╲                   ╱
        ╲─────────────────╱
          │           │
        Yes           No
          │           │
          │           ▼
          │     ┌─────────────┐
          │     │  Resolve    │
          │     │  Issues     │
          │     └─────────────┘
          │           │
          │           │ Loop back
          │           └──────┘
          │
          ▼
┌──────────────────────────────────────────────────────────────┐
│  Schedule Publication                                        │
│  • Set publish date/time                                     │
│  • Assign to publishing queue                                │
│  • Configure distribution channels                            │
│  • Set up tracking                                           │
└──────────────────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────┐
│  Publish Content                                             │
│  • Push to website                                           │
│  • Update social media                                       │
│  • Send to email list                                        │
│  • Enable analytics                                          │
└──────────────────────────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────┐
│  Post-Publication                                            │
│  • Archive approved version                                  │
│  • Track performance                                         │
│  • Notify stakeholders                                       │
│  • Update content calendar                                   │
└──────────────────────────────────────────────────────────────┘
               │
               ▼
╭──────────────────────────────────────────────────────────────╮
│               CONTENT PUBLISHED SUCCESSFULLY                 │
│               Total Revisions: 1-3 cycles                    │
│               Time to Publish: 2-5 days                      │
╰──────────────────────────────────────────────────────────────╯
```

---

## Key Features Demonstrated

- **Multi-stage approval** - 3 distinct review stages
- **Loop-back mechanisms** - Revision cycles with iteration tracking
- **Conditional routing** - Legal review only when required
- **Escalation paths** - Major issues go to VP level
- **Scope decisions** - Minor vs major changes
- **Revision tracking** - Count displayed at each loop
- **Priority handling** - Legal issues flagged as priority
- **Parallel skip paths** - Optional reviews can be bypassed
- **Final validation gate** - Comprehensive checklist before publish

## Review Stages

1. **Editorial (Stage 1)**
   - Grammar, style, brand voice
   - Can loop back to writer
   - Revision Count: 1

2. **Marketing Lead (Stage 2)**
   - Strategy and campaign alignment
   - Can escalate to VP for major changes
   - Can request minor or major revisions
   - Revision Count: 2

3. **Legal Compliance (Stage 3)**
   - Conditional (not always required)
   - High priority when issues found
   - Revision Count: 3

## Loop-Back Points

- **After Editorial** → Writer revises → Back to Editorial
- **After Marketing** → Writer updates → Back to Marketing
- **After Legal** → Writer fixes → Back to Legal (priority)

## Escalation Triggers

- Major scope changes → VP Marketing review
- Complete rewrite needed → New document cycle
- Legal non-compliance → Priority revision

## When to Use This Pattern

- Document approval workflows
- Content review processes
- Quality assurance flows
- Change request workflows
- Contract review processes
- Design approval flows
- Code review processes
- Multi-stakeholder approvals

## Design Principles Applied

1. **Clear Stage Separation** - Each review phase distinct
2. **Iteration Visibility** - Revision counts shown
3. **Smart Routing** - Skip unnecessary steps
4. **Escalation Clarity** - When and how to escalate
5. **Loop Prevention** - Maximum iteration counts implied
6. **Role Clarity** - Reviewer roles explicit
7. **Time Tracking** - Duration estimates per stage
8. **Complete Coverage** - All approval paths shown

## Typical Timeline

- **Fast Track** (no revisions): 2 days
- **Standard** (1-2 revisions): 3-4 days  
- **Complex** (3+ revisions): 5+ days

## 1. OVERVIEW

_TODO: populate this section_

---

## 1. OVERVIEW

_TODO: populate this section_

---
