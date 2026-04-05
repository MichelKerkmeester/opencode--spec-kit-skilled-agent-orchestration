---
title: API Design Guidelines - HTTP Controllers and Endpoint Patterns
description: Standards for designing HTTP controllers and endpoints in backend systems, covering Fiber/Gofiber implementation patterns, request/response handling, authentication, and authorization.
---

# API Design Guidelines - HTTP Controllers and Endpoint Patterns

Standards for designing HTTP controllers and endpoints in backend systems, covering Fiber/Gofiber implementation patterns, request/response handling, authentication, and authorization.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

- **Controller structure** - Thin controllers delegating to business layer
- **Request handling** - Deserialization, validation, and parameter parsing
- **Response patterns** - Consistent response formatting and status codes
- **Auth integration** - JWT extraction and authorization gates

### Progressive Disclosure

```
Level 1: This file (api_design.md)
         └─ Controller patterns, request/response, auth
            ↓
Level 2: Related knowledge files
         ├─ go_standards.md → Project structure, naming
         ├─ domain_layers.md → Business layer patterns
         └─ models_vs_entities_and_adapters.md → Model boundaries
```

### When to Use This File

- Creating new HTTP controllers
- Implementing API endpoints
- Handling request validation
- Integrating authentication/authorization

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:http-controllers-structure -->
## 2. HTTP CONTROLLERS STRUCTURE

### How Do I Define a Controller?

Controllers are defined as structs containing dependencies and implement a `SetupHTTP()` method:

```go
type httpControllers struct {
    server                     http.Server
    gates                      *bundles.AuthorizationGatesBundle
    businessLayer              *payments_business_layer.PaymentsBusinessLayer
    couponsBusinessLayer       *payments_business_layer.CouponsBusinessLayer
    billableItemsBusinessLayer *payments_business_layer.BillableItemsBusinessLayer
}

func (c httpControllers) SetupHTTP() error {
    // Define routes and handlers
    return nil
}
```

**Key Principles**:
- Controllers coordinate between HTTP layer and business logic
- Dependencies are injected via struct fields
- All route setup happens in `SetupHTTP()`
- Controllers should be thin - delegate business logic to business layers

---

<!-- /ANCHOR:http-controllers-structure -->
<!-- ANCHOR:route-definition-patterns -->
## 3. ROUTE DEFINITION PATTERNS

### How Do I Define Route Groups?

Organize routes using Fiber groups with middleware:

```go
func (c httpControllers) SetupHTTP() error {
    // Public routes (no auth)
    publicGroup := c.server.Group("/webhooks")
    publicGroup.Post("/payment-provider", c.paymentProviderWebhookHandler)

    // Authenticated routes with authorization
    hasPermission := c.gates.IsAuthenticated.AllFeaturesOf
    vendorGroup := c.server.Group("/vendor", c.gates.IsAuthenticated.Authenticated())
    vendorGroup.Get("/invoices", hasPermission("Vendor"), c.listVendorInvoices)
    vendorGroup.Post("/provide-payment-info", hasPermission("Vendor"), c.postVendorProvidePaymentInfo)

    return nil
}
```

**Route Patterns**:
- Group related endpoints by resource/feature
- Apply middleware at group or individual route level
- Use authorization gates for permission checks
- Public routes should be explicitly separated

---

<!-- /ANCHOR:route-definition-patterns -->
<!-- ANCHOR:route-precedence-critical -->
## 4. ROUTE PRECEDENCE (CRITICAL)

### Why Does Route Order Matter?

Fiber (and most HTTP routers) match routes in **registration order**. When a parameterized route like `/:id` is registered before a static route like `/statistics`, the router will match `/statistics` as `id = "statistics"` instead of the intended static endpoint.

### The Rule

**Static routes MUST be declared BEFORE parameterized routes within the same route group.**

### WRONG - Parameterized Before Static

```go
// BAD: /:order_id will capture "activity-logs" as order_id
ordersGroup.Get("/:order_id", controller.GetOrderByID)
ordersGroup.Get("/:order_id/applications", controller.GetOrderApplications)
ordersGroup.Get("/activity-logs", controller.GetOrdersActivityLogs)        // Never reached!
ordersGroup.Get("/applications/collaborations", controller.GetAllCollaborations)  // Never reached!
```

**What happens**: Request to `/activity-logs` matches `/:order_id` with `order_id = "activity-logs"`.

### CORRECT - Static Before Parameterized

```go
// GOOD: Static routes first, then parameterized
ordersGroup.Get("/", controller.GetAllOrders)
ordersGroup.Get("/activity-logs", controller.GetOrdersActivityLogs)
ordersGroup.Get("/applications/collaborations", controller.GetAllCollaborations)
ordersGroup.Post("/debug-visibility", controller.DebugOrderVisibility)
// Parameterized routes last
ordersGroup.Get("/:order_id", controller.GetOrderByID)
ordersGroup.Get("/:order_id/applications", controller.GetOrderApplications)
ordersGroup.Put("/:order_id/status", controller.UpdateOrderStatus)
ordersGroup.Put("/:order_id/tags", controller.AddTags)
ordersGroup.Delete("/:order_id/tags", controller.RemoveTags)
```

### Real-World Example Pattern

```go
func (c httpControllers) SetupHTTP() error {
    organizationsGroup := c.server.Group("/organizations", isVendor)

    // 1. Root routes
    organizationsGroup.Get("/", controller.getAll)

    // 2. Static sub-paths (alphabetically for readability)
    organizationsGroup.Post("/draft", controller.createDraft)
    organizationsGroup.Post("/live", controller.createLive)
    organizationsGroup.Post("/merge", controller.merge)
    organizationsGroup.Get("/stats/home", controller.getStats)
    organizationsGroup.Post("/upload-process", controller.uploadProcess)

    // 3. Parameterized routes LAST
    organizationsGroup.Get("/:organizationID", controller.getByID)
    organizationsGroup.Put("/:organizationID", controller.update)
    organizationsGroup.Delete("/:organizationID", controller.delete)
    organizationsGroup.Post("/:organizationID/clone", controller.clone)
    organizationsGroup.Put("/:organizationID/state", controller.updateState)
    organizationsGroup.Get("/:organizationID/stats/computed", controller.getComputed)

    return nil
}
```

### Route Group Ordering Checklist

When defining routes in a group, follow this order:

1. **Root path** (`/`) - GET, POST operations on the collection
2. **Static sub-paths** - Routes with fixed segments like `/statistics`, `/count`, `/activity-logs`
3. **Sub-groups with static prefixes** - Groups like `/enums/...`, `/applications/...`
4. **Parameterized routes** - Routes starting with `/:param` (e.g., `/:id`, `/:order_id`)
5. **Parameterized with sub-paths** - Routes like `/:id/applications`, `/:id/status`

### Common Violations to Watch For

| Violation Pattern | Fix |
|-------------------|-----|
| `/:id` before `/count` | Move `/count` above `/:id` |
| `/:id` before `/statistics` | Move `/statistics` above `/:id` |
| `/:id` before `/activity-logs` | Move `/activity-logs` above `/:id` |
| `/:id` before `/upload-process` | Move `/upload-process` above `/:id` |
| `/templates/:id` before `/templates/helpers` | Move `/templates/helpers` above `/templates/:id` |

### Review Handoff (sk-code-review baseline)

For formal findings-first review output, run `sk-code-review` and use this section as Go overlay evidence. Validate:

- [ ] All static routes appear before parameterized routes in each group
- [ ] Sub-groups with static prefixes are defined before parameterized routes
- [ ] Comments separate "static routes" from "parameterized routes" sections

---

<!-- /ANCHOR:route-precedence-critical -->
<!-- ANCHOR:handler-implementation -->
## 5. HANDLER IMPLEMENTATION

### What Is the Handler Signature?

All handlers follow this signature:

```go
func (c httpControllers) handlerName(ctx http.ServerCtx) error
```

### How Do I Deserialize Request Bodies?

Use `serializer.DeserializeFromFn` with Fiber's `BodyParser`:

```go
func (c httpControllers) postVendorProvidePaymentInfo(ctx http.ServerCtx) error {
    vendorID, err := auth.CtxVendorID(ctx.Context())
    if err != nil {
        return http.Response(ctx, errors.Wrap(err, "failed to get vendorID for jwt"))
    }

    var request paymentsmodels.UpdatePaymentMethodRequest
    err = serializer.DeserializeFromFn(ctx.BodyParser, &request)
    if err != nil {
        return http.Response(ctx, errors.Wrap(err, "failed to deserialize checkout request"))
    }

    url, err := c.businessLayer.ProvidePaymentInfo(ctx.Context(), vendorID, request.PaymentProvider)
    if err != nil {
        return http.Response(ctx, errors.Wrap(err, "failed to create url"))
    }

    return http.Response(ctx, url, 201)
}
```

**Handler Pattern**:
1. Extract context data (JWT, IDs)
2. Deserialize request body
3. Call business layer method
4. Return response with appropriate status

---

<!-- /ANCHOR:handler-implementation -->
<!-- ANCHOR:request-response-patterns -->
## 6. REQUEST/RESPONSE PATTERNS

### How Do I Define Request Models?

Define request payloads in `pkg/models/{domain}/`:

```go
type UpdatePaymentMethodRequest struct {
    PaymentProvider PaymentProviderEnum `json:"payment_provider" validate:"required"`
}

type GenerateCheckoutLinkRequest struct {
    BillableItemID string `json:"billable_item_id" validate:"required"`
    CouponCode     string `json:"coupon_code"`
}
```

### What Should Controllers Return?

**Critical Rule**: HTTP handlers must return models from `pkg/models/`, never entities.

- Business layer methods already return models (adapted from entities)
- Controllers call business layer and receive models
- Controllers **never** import `internal/domain/*_entities` packages
- Controllers **never** perform entity-to-model adaptation

**Correct Pattern**:
```go
// GOOD: Controller returns model from business layer
func (c httpControllers) getWallet(ctx http.ServerCtx) error {
    walletID := uid.UID(ctx.Params("id"))

    // Business layer returns payments.Wallet (model)
    walletModel, err := c.businessLayer.GetWallet(ctx.Context(), walletID)
    if err != nil {
        return http.Response(ctx, err)
    }

    return http.Response(ctx, walletModel)
}
```

**Incorrect Pattern**:
```go
// BAD: Controller calling service directly (would get entity)
func (c httpControllers) getWallet(ctx http.ServerCtx) error {
    walletID := uid.UID(ctx.Params("id"))

    // Service returns payments_entities.Wallet (entity) - WRONG
    walletEntity, err := c.walletService.GetByID(ctx.Context(), walletID)
    if err != nil {
        return http.Response(ctx, err)
    }

    return http.Response(ctx, walletEntity) // Exposing entity - WRONG
}
```

### How Do I Handle Responses?

Use the standard `http.Response` helper:

```go
// Success with default 200
return http.Response(ctx, data)

// Success with custom status
return http.Response(ctx, data, 201)

// Error response
return http.Response(ctx, err)
return http.Response(ctx, errors.Wrap(err, "context message"))

// Custom status with message
return http.Response(ctx, "payment info already provided", 208)
```

---

<!-- /ANCHOR:request-response-patterns -->
<!-- ANCHOR:query-parameters -->
## 7. QUERY PARAMETERS

### How Do I Parse Query Parameters?

Use `http.ParseQueryParameters` for GET requests:

```go
func (c httpControllers) listVendorInvoices(ctx http.ServerCtx) error {
    var (
        pageSize        = 20
        offset          string
        paymentProvider paymentsmodels.PaymentProviderEnum
        err             error
    )

    queryParams := http.ParseQueryParameters(ctx)

    paramPageSize, ok := queryParams["page_size"]
    if ok && len(paramPageSize) > 0 {
        pageSize, err = strconv.Atoi(paramPageSize[0])
        if err != nil {
            return http.Response(ctx, errors.NewValidationError("Validation failed", &errors.FieldError{
                Field:   "page_size",
                Rule:    "invalidPageSize",
                Message: "invalid page size",
            }))
        }
    }
    if pageSize > 100 {
        pageSize = 100
    }

    response, err := c.businessLayer.ListVendorInvoices(ctx.Context(), jwt.User.ID, pageSize, offset, paymentProvider)
    return http.Response(ctx, response, err)
}
```

**Query Parameter Patterns**:
- Set sensible defaults
- Validate and cap maximum values
- Return validation errors for invalid parameters
- Required parameters should error if missing

---

<!-- /ANCHOR:query-parameters -->
<!-- ANCHOR:authentication-authorization -->
## 8. AUTHENTICATION & AUTHORIZATION

### How Do I Extract JWT Data?

Use helpers to extract JWT data:

```go
jwt := http.GetCtxJWT(ctx)
userID := jwt.User.ID
```

### How Do I Extract Vendor ID?

Use domain-specific helpers:

```go
vendorID, err := auth.CtxVendorID(ctx.Context())
if err != nil {
    return http.Response(ctx, errors.Wrap(err, "failed to get vendorID for jwt"))
}
```

### How Do I Apply Authorization Gates?

Apply gates at route definition:

```go
hasPermission := c.gates.IsAuthenticated.AllFeaturesOf
vendorGroup.Post("/change-subscription", hasPermission("Vendor"), c.postVendorChangeSubscription)

// Or for less strict auth
couponsPrivateGroup := c.server.Group("/coupons", c.gates.IsAuthenticated.AuthenticatedOrAuthenticatedInactive())
```

---

<!-- /ANCHOR:authentication-authorization -->
<!-- ANCHOR:http-status-codes -->
## 9. HTTP STATUS CODES

### What Status Codes Are Used?

| Code                   | Meaning                   | Usage Example                                 |
| ---------------------- | ------------------------- | --------------------------------------------- |
| `200 OK`               | Default success           | `http.Response(ctx, result)`                  |
| `201 Created`          | Resource created          | `http.Response(ctx, url, 201)`                |
| `208 Already Reported` | Resource in desired state | `http.Response(ctx, "already provided", 208)` |
| `404 Not Found`        | Resource doesn't exist    | `http.Response(ctx, "not found", 404)`        |
| `401 Unauthorized`     | Missing/invalid auth      | Handled by middleware                         |
| `403 Forbidden`        | Insufficient permissions  | Handled by gates                              |

**Status Code Examples**:
```go
// 200 (default)
return http.Response(ctx, result)

// 201 Created
return http.Response(ctx, url, 201)

// 208 Already Reported
return http.Response(ctx, "payment info already provided", 208)

// 404 Not Found
return http.Response(ctx, "no active main subscription", 404)
```

---

<!-- /ANCHOR:http-status-codes -->
<!-- ANCHOR:error-handling -->
## 10. ERROR HANDLING

### How Do I Return Validation Errors?

```go
return http.Response(ctx, errors.NewValidationError("Validation failed", &errors.FieldError{
    Field:   "payment_provider",
    Rule:    "requiredPaymentProvider",
    Message: "payment provider is required",
}))
```

### How Do I Wrap Errors?

Always wrap errors with context:

```go
err = c.businessLayer.ProvidePaymentInfo(ctx.Context(), vendorID, request.PaymentProvider)
if err != nil {
    return http.Response(ctx, errors.Wrap(err, "failed to create url"))
}
```

### How Do I Handle Specific Errors?

Check for specific error codes:

```go
err = c.businessLayer.ProvidePaymentInfoConfirm(ctx.Context(), vendorID, request.HostedPageID, request.PaymentProvider)
if err != nil {
    _, has := errors.Has(err, apperrors.PaymentInfoAlreadyProvidedErrorCode)
    if has {
        return http.Response(ctx, "payment info already provided", 208)
    }
    return http.Response(ctx, errors.Wrap(err, "failed to confirm payment information"))
}
```

---

<!-- /ANCHOR:error-handling -->
<!-- ANCHOR:rules -->
## 11. RULES

### ✅ ALWAYS

1. **Keep handlers thin** - Delegate to business layer
2. **Validate input** - Check required fields, cap max values
3. **Use typed request/response models** from `pkg/models/`
4. **Extract JWT/context data at handler start** - Before business logic
5. **Wrap errors with meaningful context** - `errors.Wrap(err, "context")`
6. **Use authorization gates consistently** - At route or group level
7. **Group related routes logically** - By resource/feature
8. **Return models from business layer** - Already adapted
9. **Define static routes BEFORE parameterized routes** - See Section 4 (Route Precedence)

### ❌ NEVER

1. **Put business logic in controllers** - Delegate to business layer
2. **Ignore errors** - Always handle and wrap
3. **Return raw database entities** - Use business layer for models
4. **Import `internal/domain/*_entities`** - Controllers use models only
5. **Perform entity-to-model adaptation** in controllers
6. **Skip authentication/authorization** - Use gates consistently
7. **Use generic error messages** - Provide context
8. **Mix concerns** - HTTP logic vs business logic
9. **Call services directly** - Use business layer
10. **Register parameterized routes before static routes** - Causes route shadowing

### ⚠️ ESCALATE IF

1. **Complex validation needed** - Consider validation middleware
2. **New auth pattern required** - Consult security team
3. **Cross-domain data needed** - May need architecture review
4. **Performance concerns** - Response size or latency issues

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 12. RELATED RESOURCES

| File                                                                       | Purpose                               |
| -------------------------------------------------------------------------- | ------------------------------------- |
| [go_standards.md](./go_standards.md)                                       | Project structure, naming conventions |
| [domain_layers.md](./domain_layers.md)                                     | Business layer patterns, transactions |
| [models_vs_entities_and_adapters.md](./models_vs_entities_and_adapters.md) | Entity/model boundaries               |
<!-- /ANCHOR:related-resources -->
