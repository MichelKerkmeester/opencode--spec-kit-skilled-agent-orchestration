# User Onboarding Flow Example - Complete Multi-Step Journey

Complete user onboarding journey with embedded multi-step processes.

---

## Use Case: Product Onboarding with Profile & Content Creation

Generic onboarding flow integrating value propositions, celebrations, and multi-step profile/content creation.

```
╭──────────────────────────────────────────────────────────────╮
│           PRODUCT ONBOARDING COMPLETE FLOW                   │
╰──────────────────────────────────────────────────────────────╯

┌──────────────────────────────────────────────────────────────┐
│  INITIAL SIGNUP FLOW (Standard Authentication)               │
└──────────────────────────────────────────────────────────────┘

┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Email/Phone  │──▶│     Auth     │──▶│   Welcome    │
│    Entry     │   │ Verification  │   │   Screen     │
└──────────────┘   └──────────────┘   └──────────────┘
                                              │
                                              ▼
                                      ┌──────────────┐
                                      │ Preferences  │
                                      │   Setup      │
                                      └──────────────┘
                                              │
                                              ▼
                                      ┌──────────────┐
                                      │ Subscription │
                                      │    Setup     │
                                      └──────────────┘
                                              │
                                              ▼
┌──────────────────────────────────────────────────────────────┐
│  ENHANCED ONBOARDING LAYER                                   │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  📱 VALUE PROPOSITION PRESENTATION                           │
│                                                              │
│  Purpose: Explain product benefits, set context for effort    │
│  Content:                                                    │
│    • What is the product?                                    │
│    • How the platform works                                  │
│    • Benefits of creating a profile                            │
│    • What you can accomplish                                 │
│                                                              │
│  Duration: 30-45 seconds reading                             │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  🏢 PROFILE CREATION - EMBEDDED FROM APP                     │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Step 1: Basic Info                                    │  │
│  │  ────────────────────                                  │  │
│  │  Fields: [Required]                                    │  │
│  │    • Profile Name/Title                                 │  │
│  │    • Description (brief overview)                      │  │
│  │    • Profile Picture                                    │  │
│  │    • Banner Image                                      │  │
│  │    • Category/Industry                                 │  │
│  │                                                        │  │
│  │  Validation: Name required, others optional            │  │
│  └────────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Step 2: Socials                                       │  │
│  │  ────────────────                                      │  │
│  │  Connect Social Media: [All Optional]                  │  │
│  │    • Instagram (@handle)                               │  │
│  │    • TikTok (@handle)                                  │  │
│  │    • YouTube (channel)                                 │  │
│  │    • Website (URL)                                     │  │
│  │                                                        │  │
│  │  Purpose: Build credibility, enable discovery          │  │
│  └────────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Step 3: Locations                                     │  │
│  │  ────────────────                                      │  │
│  │  Physical Presence:                                    │  │
│  │    • Address (street, city, postal)                    │  │
│  │    • HQ Designation (mark as headquarters)             │  │
│  │    • Privacy Settings (public/private)                 │  │
│  │                                                        │  │
│  │  Features:                                             │  │
│  │    • Multiple locations supported                      │  │
│  │    • Add another location [Button]                     │  │
│  │    • Map preview                                       │  │
│  └────────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Step 4: Review                                        │  │
│  │  ────────────────                                      │  │
│  │  Preview Profile:                                       │  │
│  │    • All entered information displayed                 │  │
│  │    • Visual preview of profile card                     │  │
│  │    • Edit buttons for each section                     │  │
│  │                                                        │  │
│  │  Actions:                                              │  │
│  │    [◀ Back] [Create Profile ✓]                          │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                     ╱──────────────╲
                    ╱  All Required  ╲
                   ╱   Fields Valid?  ╲
                   ╲                  ╱
                    ╲────────────────╱
                       │         │
                     Yes        No
                       │         │
                       │         ▼
                       │    ┌──────────────┐
                       │    │ Show Errors  │
                       │    │ Highlight    │
                       │    │ Required     │
                       │    └──────────────┘
                       │         │
                       │         │ Loop back
                       │         └──────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  🎉 CELEBRATION & CONTENT INTRODUCTION                       │
│                                                              │
│  Purpose: Celebrate success, introduce next step             │
│  Content:                                                    │
│    • "Congratulations! Your profile is created!"              │
│    • Profile card preview                                     │
│    • "Now let's create your first listing"                    │
│    • Explain what listings are and why they matter           │
│                                                              │
│  Duration: 30-45 seconds reading                             │
│  CTA: "Create Your First Listing" [Button]                   │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  📝 LISTING CREATION - EMBEDDED FROM APP                     │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Step 1: Category                                      │  │
│  │  ────────────────                                      │  │
│  │  Choose Listing Type:                                  │  │
│  │    ⚪ Digital (online delivery)                        │  │
│  │    ⚪ Physical (in-person)                             │  │
│  │    ⚪ Service (appointment-based)                      │  │
│  │                                                        │  │
│  │  Implications affect availability and requirements     │  │
│  └────────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Step 2: Profile                                        │  │
│  │  ───────────                                           │  │
│  │  Assign to Profile:                                     │  │
│  │    [Dropdown: Recently created profile selected]        │  │
│  │                                                        │  │
│  │  Note: Can select other profiles if user has multiple   │  │
│  └────────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Step 3: Pricing                                       │  │
│  │  ───────────                                           │  │
│  │  Define Your Pricing:                                   │  │
│  │    • Price ($amount or "Contact")                      │  │
│  │    • Product/Service description                       │  │
│  │    • Purchase/booking link                             │  │
│  │                                                        │  │
│  │  Examples provided for guidance                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Step 4: Details                                       │  │
│  │  ───────────                                           │  │
│  │  Listing Details:                                      │  │
│  │    • Title (catchy, brief)                             │  │
│  │    • Description (detailed)                            │  │
│  │    • Features & specifications                          │  │
│  │    • Hashtags/Tags                                     │  │
│  │    • Terms & Conditions                                │  │
│  └────────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Step 5: Media                                         │  │
│  │  ──────────                                            │  │
│  │  Visual Assets:                                        │  │
│  │    • Listing Images (gallery, 3-5 photos)              │  │
│  │    • Featured Image (hero/thumbnail)                   │  │
│  │    • Preview how listing card appears                  │  │
│  │                                                        │  │
│  │  Drag & drop upload supported                          │  │
│  └────────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Step 6: Availability                                  │  │
│  │  ────────────────                                      │  │
│  │  Schedule & Availability:                              │  │
│  │    • Start Date                                        │  │
│  │    • End Date (or ongoing)                             │  │
│  │    • Available Days (M T W T F S S)                    │  │
│  │    • Timezone                                          │  │
│  │    • Blackout dates (optional)                         │  │
│  └────────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Step 7: Review                                        │  │
│  │  ──────────                                            │  │
│  │  Preview Complete Listing:                             │  │
│  │    • All information displayed                         │  │
│  │    • Visual preview of listing card                    │  │
│  │    • Edit any section                                  │  │
│  │                                                        │  │
│  │  Actions:                                              │  │
│  │    [◀ Back] [Save Draft] [Publish Listing ✓]           │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                     ╱──────────────╲
                    ╱  Publish or    ╲
                   ╱   Save Draft?    ╲
                   ╲                  ╱
                    ╲────────────────╱
                       │         │
                   Publish     Draft
                       │         │
                       └────┬────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  ✅ SUCCESS CELEBRATION & NEXT STEPS                         │
│                                                              │
│  Purpose: Congratulate, explain what happens next            │
│  Content:                                                    │
│    • "Amazing! Your listing is live!" (or "saved as draft")  │
│    • Listing preview card                                    │
│    • "Users can now discover your listing"                   │
│    • Quick guide: What to expect                             │
│      - Inquiries will come to inbox                          │
│      - Respond to interested users                           │
│      - Track engagement metrics                              │
│      - Manage your listings                                  │
│                                                              │
│  Duration: 30-45 seconds reading                             │
│  CTA: "Go to My Dashboard" [Button]                          │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  📊 DASHBOARD ENTRY (Full Access)                            │
│                                                              │
│  Onboarding Status:                                          │
│    • Profile created ✅                                       │
│    • Listing created ✅ (published or draft)                 │
│    • User educated ✅                                        │
│    • Ready for engagement ✅                                 │
│                                                              │
│  Features Unlocked:                                          │
│    • Browse community                                        │
│    • Manage profile                                           │
│    • View/edit listings                                      │
│    • Review inquiries                                        │
│    • Analytics dashboard                                     │
│    • User messaging                                          │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
╭──────────────────────────────────────────────────────────────╮
│              ONBOARDING COMPLETE                             │
│              User is now active member                       │
╰──────────────────────────────────────────────────────────────╯
```

---

## Key Features Demonstrated

- **Layered onboarding** - Initial signup + enhanced onboarding layer
- **Value propositions** - Context before effort
- **Embedded multi-step processes** - Profile (4 steps) and Listing (7 steps) creation
- **Celebration moments** - Positive reinforcement between major milestones
- **Decision points** - Validation and publish/draft choices
- **Visual hierarchy** - Clear nesting of sub-processes within main flow
- **Context indicators** - Duration, purpose, and content notes
- **Progressive disclosure** - Information revealed at appropriate times
- **Success criteria** - Clear completion checklist

## When to Use This Pattern

- Multi-phase onboarding flows
- Progressive feature introduction
- Embedded sub-processes within main flow
- User journeys with education and action
- Flows requiring motivation and context
- Complex setup with celebrations
- Gradual feature unlock patterns

## Design Principles Applied

1. **Context Before Effort** - Explain why before asking for work
2. **Small Wins** - Celebrate each major milestone
3. **Progressive Complexity** - Start simple, build up
4. **Clear Navigation** - Always show where user is in process
5. **Validation Feedback** - Immediate error handling
6. **Flexibility** - Save draft vs publish options
7. **Education** - Explain features as they're introduced

## Estimated Time to Complete

- Initial signup: ~3 minutes
- Value proposition: 30-45 seconds
- Profile creation: 3-5 minutes
- Celebration: 30-45 seconds
- Listing creation: 5-7 minutes
- Success screen: 30-45 seconds

**Total**: ~12-15 minutes for complete onboarding

## 1. OVERVIEW

_TODO: populate this section_

---

## 1. OVERVIEW

_TODO: populate this section_

---
