# Decision Tree Flow Example - Complex Branching and Conditional Logic

Complex decision tree with multiple branches and conditional logic.

---

## Use Case: E-commerce Order Processing System

```
╭──────────────────────────────────────────────────────────────╮
│           E-COMMERCE ORDER PROCESSING FLOW                   │
╰──────────────────────────────────────────────────────────────╯
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│  Order Received                                              │
│  • Order ID generated                                        │
│  • Timestamp recorded                                        │
│  • Customer notified                                          │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                      ╱──────────────╲
                     ╱  Payment       ╲
                    ╱   Method Valid?  ╲
                    ╲                  ╱
                     ╲────────────────╱
                       │           │
                     Valid      Invalid
                       │           │
                       │           ▼
                       │     ┌─────────────────┐
                       │     │  Reject Order   │
                       │     │  • Log error    │
                       │     │  • Notify user  │
                       │     │  • Refund init  │
                       │     └─────────────────┘
                       │           │
                       │           ▼
                       │     ╭─────────────────╮
                       │     │  Order Failed   │
                       │     ╰─────────────────╯
                       │
                       ▼
                ╱──────────────╲
               ╱  Inventory     ╲
              ╱   Available?     ╲
              ╲                  ╱
               ╲────────────────╱
                 │           │
              Available   Out of Stock
                 │           │
                 │           ▼
                 │     ╱──────────────╲
                 │    ╱  Alternative   ╲
                 │   ╱   Products?      ╲
                 │   ╲                  ╱
                 │    ╲────────────────╱
                 │      │           │
                 │     Yes          No
                 │      │           │
                 │      │           ▼
                 │      │     ┌─────────────────┐
                 │      │     │  Cancel Order   │
                 │      │     │  • Full refund  │
                 │      │     │  • Notify user  │
                 │      │     │  • Log reason   │
                 │      │     └─────────────────┘
                 │      │           │
                 │      │           ▼
                 │      │     ╭─────────────────╮
                 │      │     │  Order Canceled │
                 │      │     ╰─────────────────╯
                 │      │
                 │      ▼
                 │ ┌─────────────────┐
                 │ │  Suggest        │
                 │ │  Alternatives   │
                 │ │  • Similar items│
                 │ │  • Wait for user│
                 │ └─────────────────┘
                 │           │
                 │           ▼
                 │      ╱──────────────╲
                 │     ╱  User Accepts  ╲
                 │     ╱  Alternative?   ╲
                 │     ╲                 ╱
                 │      ╲──────────────╱
                 │        │         │
                 │      Accept   Decline
                 │        │         │
                 │        │         └──────────┐
                 │        │                    │
                 └────────┴────────────┐       │
                          │            │       │
                          ▼            │       │
                   ╱──────────────╲    │       │
                  ╱  Shipping      ╲   │       │
                 ╱   Address Valid? ╲  │       │
                 ╲                  ╱  │       │
                  ╲────────────────╱   │       │
                    │           │      │       │
                  Valid      Invalid   │       │
                    │           │      │       │
                    │           ▼      │       │
                    │     ┌─────────────┐      │
                    │     │  Request    │      │
                    │     │  Correction │      │
                    │     │  • Notify   │      │
                    │     │  • Allow    │      │
                    │     │    edit     │      │
                    │     └─────────────┘      │
                    │           │              │
                    │           │ Retry        │
                    │           └────────┘     │
                    │                          │
                    ▼                          │
          ╱──────────────╲                     │
         ╱  Delivery       ╲                   │
        ╱   Options?        ╲                  │
        ╲                   ╱                  │
         ╲─────────────────╱                   │
           │      │      │                     │
        Standard Express Int'l                 │
           │      │      │                     │
           │      │      └──────┐              │
           │      └────┐         │             │
           │           │         │             │
           ▼           ▼         ▼             │
     ┌─────────┐ ┌─────────┐ ┌─────────┐       │
     │ $5.99   │ │ $15.99  │ │ $29.99  │       │
     │ 5-7 days│ │ 2-3 days│ │ 7-14 day│  ┌────┘
     └─────────┘ └─────────┘ └─────────┘  │
           │           │         │        │
           └─────┬─────┴─────────┘        │
                 │                        │
                 ▼                        │
          ╱──────────────╲                │
         ╱  Gift Wrap     ╲               │
        ╱   Requested?     ╲              │
        ╲                  ╱              │
         ╲────────────────╱               │
           │           │                  │
          Yes          No                 │
           │           │                  │
           │           │                  │
           ▼           │                  │
     ┌─────────┐       │                  │
     │ Add $5  │       │                  │
     │ Gift box│       │                  │
     │ & card  │       │                  │
     └─────────┘       │                  │
           │           │                  │
           └─────┬─────┘                  │
                 │                        │
                 ▼                        │
┌──────────────────────────────────────┐  │
│  Calculate Final Total               │  │
│  • Subtotal                          │  │
│  • Shipping fee                      │  │
│  • Taxes                             │  │
│  • Gift wrap (if applicable)         │  │
└──────────────────────────────────────┘  │
                 │                        │
                 ▼                        │
          ╱──────────────╲                │
         ╱  Promo Code    ╲               │
        ╱   Applied?       ╲              │
        ╲                  ╱              │
         ╲────────────────╱               │
           │           │                  │
          Yes          No                 │
           │           │                  │
           ▼           │                  │
     ┌─────────┐       │                  │
     │ Validate│       │                  │
     │ & Apply │       │                  │
     │ Discount│       │                  │
     └─────────┘       │                  │
           │           │                  │
           └─────┬─────┘                  │
                 │                        │
                 ▼                        │
┌──────────────────────────────────────┐  │
│  Process Payment                     │  │
│  • Charge card                       │  │
│  • Generate receipt                  │  │
│  • Update inventory                  │  │
└──────────────────────────────────────┘  │
                 │                        │
                 ▼                        │
          ╱──────────────╲                │
         ╱  Payment       ╲               │
        ╱   Successful?    ╲              │
        ╲                  ╱              │
         ╲────────────────╱               │
           │           │                  │
         Success     Failed               │
           │           │                  │
           │           ▼                  │
           │     ┌─────────────┐          │
           │     │  Payment    │          │
           │     │  Failed     │          │
           │     │  • Retry 2x │          │
           │     │  • Log      │          │
           │     └─────────────┘          │
           │           │                  │
           │           ▼                  │
           │     ╱──────────────╲         │
           │    ╱  Retry Success?╲        │
           │    ╲                ╱        │
           │     ╲──────────────╱         │
           │       │         │            │
           │      Yes        No           │
           │       │         │            │
           │       └──────┐  └────────────┤
           │              │               │
           ▼              ▼               ▼
┌──────────────────────────────────────┐  │
│  Create Shipment                     │  │
│  • Generate tracking number          │  │
│  • Print shipping label              │  │
│  • Notify warehouse                  │  │
│  • Send confirmation email           │  │
└──────────────────────────────────────┘  │
                 │                        │
                 ▼                        │
┌──────────────────────────────────────┐  │
│  Update Order Status                 │  │
│  • Status: "Processing"              │  │
│  • ETA calculated                    │  │
│  • Customer notified                 │  │
└──────────────────────────────────────┘  │
                 │                        │
                 ▼                        │
╭──────────────────────────────────────╮  │
│      Order Successfully Placed       │  │
│      Tracking: #TRACK-12345          │  │
╰──────────────────────────────────────╯  │
                                          │
                                          │
                      All failures lead here
                                          │
                                          ▼
                                    ╭─────────────╮
                                    │  Order      │
                                    │  Failed     │
                                    ╰─────────────╯
```

---

## Key Features Demonstrated

- **Multiple decision points** - 8 different conditional branches
- **Nested decisions** - Decisions within decision outcomes
- **Recovery paths** - Retry logic and fallback options
- **Alternative flows** - Suggesting alternatives when out of stock
- **Optional features** - Gift wrap, promo codes
- **Error handling** - Multiple failure points with appropriate actions
- **Complex convergence** - Multiple paths merging back to main flow
- **Clear labeling** - All decision outcomes explicitly labeled

## Decision Points Covered

1. **Payment Method Validation** - Valid/Invalid
2. **Inventory Check** - Available/Out of Stock
3. **Alternative Products** - Yes/No/None
4. **User Acceptance** - Accept/Decline
5. **Address Validation** - Valid/Invalid
6. **Delivery Options** - Standard/Express/International
7. **Gift Wrap** - Yes/No
8. **Promo Code** - Applied/Not Applied
9. **Payment Processing** - Success/Failed
10. **Retry Logic** - Success/Final Failure

## When to Use This Pattern

- E-commerce order flows
- Multi-criteria evaluation systems
- Complex approval workflows
- Error handling with retry logic
- Customer service routing
- Product configuration flows
- Conditional business processes
- Risk assessment workflows

## Design Principles Applied

1. **Clear Decision Labels** - Every branch explicitly labeled
2. **Consistent Spacing** - Easy to follow visually
3. **Recovery Paths** - Failures have clear next steps
4. **User Experience** - Multiple chances to succeed
5. **Business Logic** - Real-world e-commerce rules
6. **Fallback Options** - Alternatives provided when possible
7. **Complete Coverage** - All possible paths considered

## 1. OVERVIEW

_TODO: populate this section_

---

## 1. OVERVIEW

_TODO: populate this section_

---
