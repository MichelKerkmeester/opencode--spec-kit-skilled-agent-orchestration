# Simple Workflow Example - Linear Sequential Process

A basic linear workflow demonstrating sequential steps without branching.

---

## Use Case: New User Registration

```
╭──────────────────────────────────────────╮
│      USER REGISTRATION FLOW              │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│  Step 1: Landing Page                    │
│  • User clicks "Sign Up"                 │
│  • Form displayed                        │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│  Step 2: Enter Information               │
│  • Email address                         │
│  • Password (min 8 chars)                │
│  • Username                              │
│  Duration: ~30 seconds                   │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│  Step 3: Validation                      │
│  • Check email format                    │
│  • Verify password strength              │
│  • Check username availability           │
│  Duration: < 1 second                    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│  Step 4: Create Account                  │
│  • Store credentials (hashed)            │
│  • Generate user ID                      │
│  • Create profile entry                   │
│  Duration: < 1 second                    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│  Step 5: Send Verification Email          │
│  • Generate verification token            │
│  • Send email with link                  │
│  • Token expires in 24 hours             │
│  Duration: 2-5 seconds                   │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│  Step 6: Confirmation Screen              │
│  • Display success message               │
│  • Prompt to check email                 │
│  • Provide resend option                 │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│      Registration Complete               │
│      (Pending Email Verification)         │
╰──────────────────────────────────────────╯
```

---

## Key Features Demonstrated

- **Terminal nodes**: Rounded boxes for start/end states
- **Sequential flow**: Clear top-to-bottom progression
- **Context annotations**: Duration and details in each box
- **Consistent spacing**: Single blank line between steps
- **Role indicators**: User actions vs system actions
- **Timing information**: Expected duration for each step

## When to Use This Pattern

- Onboarding flows
- Setup wizards
- Linear processes without branches
- Step-by-step tutorials
- Installation procedures
- Simple form submissions

## 1. OVERVIEW

_TODO: populate this section_

---

## 1. OVERVIEW

_TODO: populate this section_

---
