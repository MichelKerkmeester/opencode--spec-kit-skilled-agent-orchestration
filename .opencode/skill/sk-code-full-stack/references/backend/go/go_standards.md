---
title: Go Code Standards - Backend System Coding Conventions
description: Mandatory Go coding conventions for backend projects defining project structure, naming conventions, layered architecture patterns, and code organization standards.
---

# Go Code Standards - Backend System Coding Conventions

Mandatory Go coding conventions for backend projects defining project structure, naming conventions, layered architecture patterns, and code organization standards.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose


- **Structural consistency** - Uniform project organization across all domains
- **Naming clarity** - Predictable file, variable, and type names
- **Layer separation** - Clear boundaries between architectural layers
- **Pattern adherence** - Standardized service, repository, and adapter patterns

### Progressive Disclosure

```
Level 1: This file (go_standards.md)
         - Project structure, naming, patterns overview
            |
Level 2: Related knowledge files
         |- database_patterns.md - Repository and transaction patterns
         |- domain_layers.md - Generic service pattern details
         +- models_vs_entities_and_adapters.md - Entity/model boundaries
```

### When to Use This File

- Creating new domains, services, or repositories
- Understanding project structure and conventions
- Reviewing code for standards compliance
- Onboarding to the codebase

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:project-structure -->
## 2. PROJECT STRUCTURE

### How Is the Project Organized?

The backend follows a domain-driven design with clear separation between application entry points, domain logic, infrastructure, and shared packages.

### Root Directory Structure

```
backend/
|- cmd/                    # Application entry points
|   |- ms/                # Microservices
|   |   |- ms_orders/     # Orders microservice
|   |   |- ms_users/      # Users microservice
|   |   |- ms_feed/       # Feed microservice
|   |   +- ...
|   +- cli/               # CLI applications
|       +- cli_admin/     # Main CLI
|- internal/              # Private application code
|   |- adapters/          # Entity-to-model adapters
|   |   |- orders_adapters/
|   |   |- users_adapters/
|   |   +- ...
|   |- domain/            # Domain-driven design modules
|   |   |- orders/        # Orders domain
|   |   |- users/         # Users domain
|   |   +- ...
|   |- ms/                # Microservice implementations
|   |   |- ms_orders/     # Orders MS logic
|   |   +- ...
|   +- cli/               # CLI implementations
|- infra/                 # Infrastructure code
|   |- apis/              # External API clients
|   |- core/              # Core-specific infra
|   |- di/                # Dependency injection
|   |- services/          # Generic service patterns
|   +- version/           # Version info
|- pkg/                   # Public/shared libraries
|   |- comm/              # Communication helpers (HTTP)
|   |- context/           # Context utilities
|   |- models/            # Shared models
|   |- uid/               # UID generation
|   +- layer/             # Data layer abstractions
|- bundles/               # Service bundles/configs
|- docs/                  # Documentation
+- scripts/               # Build/utility scripts
```

### How Do I Create a New Domain?

Each domain follows this layered structure:

```
internal/domain/{domain}/
|- {domain}_business_layer/   # Business logic orchestration
|   |- business_layer.go
|   +- *.go
|- {domain}_services/          # Domain services
|   |- *_service.go
|   +- registry.go
|- {domain}_data_layer/        # Data access layer
|   |- {domain}_data_layer.go
|   |- {domain}_entities/     # Database entities
|   |- {domain}_repositories/ # Repository implementations
|   +- {domain}_migrations/   # Database migrations
|- {domain}_checks/            # Health checks
|- {domain}_providers/         # External providers/clients
+- registry.go                 # DI registry
```

**Example**: `internal/domain/orders/`

### What Domains Exist in a Typical Codebase?

The `internal/domain/` directory contains domain modules:

| Domain            | Description                         | Has Business Layer | Has Registry |
| ----------------- | ----------------------------------- | ------------------ | ------------ |
| `ai_integrations` | AI/ML service integrations          | Yes                | No           |
| `auth`            | Authentication & authorization      | Yes                | Yes          |
| `core`            | Core platform logic                 | Yes                | Yes          |
| `bo`              | Backoffice operations               | Yes                | No           |
| `chat`            | Messaging and chat functionality    | Yes                | Yes          |
| `organizations`   | Organization management             | Yes                | Yes          |
| `users`           | User management                     | Yes                | Yes          |
| `cron`            | Scheduled job management            | Yes                | Yes          |
| `orders`          | Order lifecycle management          | Yes                | Yes          |
| `feed`            | Activity feed                       | Yes                | Yes          |
| `legacy`          | Legacy code (migration target)      | No                 | No           |
| `media`           | Media upload/processing             | Yes                | Yes          |
| `migrator`        | Database migrations                 | Yes                | Yes          |
| `notifications`   | Push/email notifications            | Yes                | Yes          |
| `onboarding`      | User onboarding flows               | Yes                | Yes          |
| `vendors`         | Vendor management                   | Yes                | Yes          |
| `payments`        | Payment processing                  | Yes                | Yes          |
| `profile`         | User profiles                       | Yes                | Yes          |
| `social_media`    | Social media integrations           | Yes                | Yes          |
| `workflows`       | Business workflow engine            | Yes                | Yes          |

**Key Reference Domains**:
- `payments` - Most complete implementation of modern patterns. Use as reference for new domains.
- `organizations` - New domain with state machine, shows modern entity/service/business layer patterns.

### How Do I Create Adapters?

Adapters for entity-to-model conversion follow this structure:

```
internal/adapters/{domain}_adapters/
|- adapters.go                 # Aggregator struct
|- {name}_adapter.go           # Individual adapters
|- wallet_adapter.go
|- coupon_adapter.go
+- invoice_adapter.go
```

**Example**: `internal/adapters/payments_adapters/`

### How Do I Create a Microservice?

```
cmd/ms/{ms_name}/
+- application.go              # Entry point

internal/ms/{ms_name}/
|- http_controllers.go         # HTTP route handlers
|- microservice.go             # MS configuration
+- registry.go                 # DI setup
```

### What Microservices Exist?

There are multiple microservices in `internal/ms/`:

| Microservice         | Primary Domain  | Purpose                                 | Bootstrap Pattern |
| -------------------- | --------------- | --------------------------------------- | ----------------- |
| `ms_ai_integrations` | ai_integrations | AI/ML service integration APIs          | Old (layers.go)   |
| `ms_authentication`  | auth            | Login, registration, session management | New (DI-driven)   |
| `ms_core`            | core            | Core platform APIs                      | New (DI-driven)   |
| `ms_chat`            | chat            | Real-time messaging APIs                | Old (layers.go)   |
| `ms_users`           | users           | User management APIs                    | New (DI-driven)   |
| `ms_cron`            | cron            | Scheduled job execution                 | New (DI-driven)   |
| `ms_orders`          | orders          | Order lifecycle APIs                    | New (DI-driven)   |
| `ms_feed`            | feed            | Activity feed APIs                      | New (DI-driven)   |
| `ms_media`           | media           | Media upload/processing APIs            | New (DI-driven)   |
| `ms_notifications`   | notifications   | Notification delivery                   | New (DI-driven)   |
| `ms_vendors`         | vendors         | Vendor management APIs                  | New (DI-driven)   |
| `ms_payments`        | payments        | Payment processing APIs                 | New (DI-driven)   |

**Key Reference Microservices**:
- `ms_payments` - Most complete implementation of modern patterns with SQS consumers.
- `ms_core` - Reference for multi-domain microservice with comprehensive HTTP routing.

**Bootstrap Patterns:**
- **New (DI-driven)**: Uses `microservice.BootstrapMust[T, CT]()`, has `registry.go` + `microservice.go`
- **Old (layers.go)**: Manual wiring in `application.go`, has `layers.go` - being migrated

### How Do I Create a CLI Command?

```
cmd/cli/{cli_name}/
+- application.go              # Entry point

internal/cli/{cli_name}/
|- cli.go                      # CLI root
|- all_commands.go             # Command registry
|- {feature}_cmd/              # Command groups
|   |- group.go
|   +- {command}_cmd.go
+- setup_cmd.go                # Setup commands
```

---

<!-- /ANCHOR:project-structure -->
<!-- ANCHOR:naming-conventions -->
## 3. NAMING CONVENTIONS

### What Are the File Naming Rules?

| Type           | Convention                                 | Example                                    |
| -------------- | ------------------------------------------ | ------------------------------------------ |
| General        | `snake_case.go`                            | `http_controllers.go`, `wallet_service.go` |
| Tests          | `*_test.go`                                | `wallet_service_test.go`                   |
| Business Layer | `{domain}_business_layer.go`               | `payments_business_layer.go`               |
| Data Layer     | `{domain}_data_layer.go`                   | `payments_data_layer.go`                   |
| Services       | `{name}_service.go`                        | `wallet_service.go`, `coupon_service.go`   |
| Repositories   | `{name}_repository.go`                     | `wallet_repository.go`                     |
| Entities       | `entities.go`, `relational.go`, `views.go` | Inside `{domain}_entities/`                |

### What Are the Variable & Function Naming Rules?

| Type               | Rule                     | Example                              |
| ------------------ | ------------------------ | ------------------------------------ |
| Variables          | `camelCase` (unexported) | `walletRepo`, `userData`             |
| Exported Variables | `PascalCase`             | `WalletService`, `ConfigFile`        |
| Functions          | `camelCase` (unexported) | `createWallet()`, `processPayment()` |
| Exported Functions | `PascalCase`             | `NewWalletService()`, `GetByID()`    |
| Constants          | `PascalCase`             | `MaxRetries`, `DefaultTimeout`       |

### What Are the Type & Struct Naming Rules?

| Type                | Convention                    | Example                                   |
| ------------------- | ----------------------------- | ----------------------------------------- |
| Structs             | `PascalCase`                  | `WalletService`, `PaymentRequest`         |
| Interfaces          | `PascalCase`                  | `WalletRepository`, `PaymentProvider`     |
| Enums               | `PascalCase` ending in `Enum` | `PaymentProviderEnum`, `WalletStatusEnum` |
| Data Layers         | `{Domain}DataLayer`           | `PaymentsDataLayer`, `OrdersDataLayer`    |
| Business Layers     | `{Domain}BusinessLayer`       | `PaymentsBusinessLayer`                   |
| Services            | `{Name}Service`               | `WalletService`, `CouponService`          |
| Repositories        | `{Name}Repository`            | `WalletRepository`                        |
| Adapters            | `{Name}Adapter`               | `WalletAdapter`, `CouponAdapter`          |
| Adapter Aggregators | `Adapters`                    | `payments_adapters.Adapters`              |

### What Are the Package Naming Rules?

| Type             | Convention             | Example                                        |
| ---------------- | ---------------------- | ---------------------------------------------- |
| Domain packages  | `{domain}_{layer}`     | `payments_business_layer`, `payments_services` |
| Adapter packages | `{domain}_adapters`    | `payments_adapters`, `orders_adapters`         |
| General          | lowercase, descriptive | `http`, `database`, `serializer`               |
| Microservices    | `ms_{name}`            | `ms_payments`, `ms_orders`                     |

---

<!-- /ANCHOR:naming-conventions -->
<!-- ANCHOR:layer-architecture -->
## 4. LAYER ARCHITECTURE

### What Are the Architectural Layers?

**Business Layer** (`{domain}_business_layer/`):
- Orchestrates business logic
- Calls multiple services
- Handles complex workflows
- **Returns models** (via adapters)

**Adapter Layer** (`internal/adapters/{domain}_adapters/`):
- Converts entities to models
- Used **only** by business layer
- See: `models_vs_entities_and_adapters.md`

**Service Layer** (`{domain}_services/`):
- Domain-specific operations
- Uses repositories for data access
- **Returns entities**
- Transaction-aware via `services.Service[T]`

**Data Layer** (`{domain}_data_layer/`):
- Aggregates repositories
- Provides transaction handling
- Database connection management
- **Works with entities**

**Repository Layer** (`{domain}_data_layer/{domain}_repositories/`):
- Direct database operations
- CRUD operations
- Query implementations
- **Returns entities**

### What Is the Dependency Flow?

```
HTTP Controllers
    |
Business Layer (returns models)
    |
Services (returns entities)
    |
Repositories (returns entities)
    |
Database
```

**Critical Rules**:
- Controllers **only** call Business Layer
- Business Layer orchestrates Services
- Services use Repositories
- **No layer skipping** (e.g., Controllers to Services directly)

---

<!-- /ANCHOR:layer-architecture -->
<!-- ANCHOR:code-patterns -->
## 5. CODE PATTERNS

### How Do I Implement the Generic Service Pattern?

Use `services.Service[T]` for transaction support:

```go
type WalletService struct {
    services.Service[WalletService]

    ctx               context.Context
    config            WalletServiceConfiguration
    paymentsDataLayer payments_data_layer.PaymentsDataLayer
}

func NewWalletService(
    ctx context.Context,
    config WalletServiceConfiguration,
    paymentsDataLayer payments_data_layer.PaymentsDataLayer,
) WalletService {
    walletService := WalletService{
        ctx:               ctx,
        config:            config,
        paymentsDataLayer: paymentsDataLayer,
    }

    walletService.Service = services.NewService(&walletService, NewWalletServiceFrom)
    return walletService
}

func NewWalletServiceFrom(service services.Service[WalletService]) (*WalletService, *services.Service[WalletService]) {
    us := &WalletService{
        services.Service[WalletService]{},
        service.Instance.config,
        service.Instance.paymentsDataLayer,
    }

    us.Service = services.NewService(us, nil)
    return us, &us.Service
}
```

**Key Points**:
- Embed `services.Service[T]` for transaction support
- Implement `NewXServiceFrom` for `WithTx` functionality
- **Use struct literal initialization WITHOUT named parameters** in `NewXServiceFrom`
- Field order MUST match the struct definition exactly
- First field is always `services.Service[XXXService]{}` (the embedded generic service)
- Access transaction via `s.Tx`
- Check transaction with `s.TxNil()`

**Compile-Time Safety**: The struct literal pattern catches missing fields when the struct changes - the compiler will error if a field is omitted.

### How Do I Implement the Repository Pattern?

Use `database.Repository[T]`:

```go
type WalletRepository struct {
    database.Repository[WalletRepository]
}

func NewWalletRepository(db *database.DB) WalletRepository {
    return WalletRepository{database.NewRepository(db, NewWalletRepository)}
}

func (r WalletRepository) GetByID(ID uid.UID) (wallet payments_entities.Wallet, err error) {
    return wallet, r.DB.
        Model(&payments_entities.Wallet{}).
        Where("id = ?", ID).
        First(&wallet).Error
}
```

### How Do I Implement the Data Layer Pattern?

Embed `GenericDataLayer` and aggregate repositories:

```go
type PaymentsDataLayer struct {
    layer.GenericDataLayer
    config                   PaymentsDataLayerConfiguration
    WalletRepository         payments_repositories.WalletRepository
    CouponRepository         payments_repositories.CouponRepository
}

func NewPaymentDataLayer(_ context.Context, orm *database.Orm, layerConfig PaymentsDataLayerConfiguration) (PaymentsDataLayer, error) {
    return PaymentsDataLayer{
        GenericDataLayer: layer.NewGenericDataLayer(orm),
        config:           layerConfig,
        WalletRepository: payments_repositories.NewWalletRepository(orm.DB),
        CouponRepository: payments_repositories.NewCouponRepository(orm.DB),
    }, nil
}
```

---

<!-- /ANCHOR:code-patterns -->
<!-- ANCHOR:error-handling -->
## 6. ERROR HANDLING

### How Do I Wrap Errors?

Always wrap errors with context:

```go
url, err := c.businessLayer.ProvidePaymentInfo(ctx.Context(), vendorID, request.PaymentProvider)
if err != nil {
    return http.Response(ctx, errors.Wrap(err, "failed to create url"))
}
```

### How Do I Create Custom Errors?

Use error codes:

```go
if !uidgen.IsWallet(id) {
    return payments_entities.Wallet{}, errors.New("Invalid ULID for wallet").WithErrorCode(errors.DBInvalidValueErrorCode)
}
```

### How Do I Check for Specific Errors?

```go
_, has := errors.Has(err, apperrors.PaymentInfoAlreadyProvidedErrorCode)
if has {
    return http.Response(ctx, "payment info already provided", 208)
}
```

---

<!-- /ANCHOR:error-handling -->
<!-- ANCHOR:import-organization -->
## 7. IMPORT ORGANIZATION

### How Should I Organize Imports?

Group imports in this order with blank lines between groups:

```go
import (
    // Standard library
    "context"
    "strconv"

    // External dependencies
    "github.com/gofiber/fiber/v2"
    "github.com/pixie-sh/errors-go"
    "github.com/pixie-sh/database-helpers-go/database"

    // Internal packages - bundles
    "github.com/example/backend/bundles"

    // Internal packages - infra
    "github.com/example/backend/infra/core"

    // Internal packages - domain
    "github.com/example/backend/internal/domain/payments/payments_business_layer"

    // Internal packages - pkg
    "github.com/example/backend/pkg/comm/http"
    "github.com/example/backend/pkg/models/payments"
)
```

---

<!-- /ANCHOR:import-organization -->
<!-- ANCHOR:testing -->
## 8. TESTING

### Where Do I Place Test Files?

Located next to source: `wallet_service_test.go`

### How Do I Structure Tests?

```go
func TestWalletService_GetByID(t *testing.T) {
    tests := []struct {
        name    string
        walletID uid.UID
        want    *payments_entities.Wallet
        wantErr bool
    }{
        {
            name:    "existing wallet",
            walletID: uidgen.Wallet(),
            want:    &payments_entities.Wallet{...},
            wantErr: false,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // test implementation
        })
    }
}
```

### How Do I Test Adapters?

Adapter tests validate entity-to-model field mappings:

```go
func TestWalletAdapter_Adapt(t *testing.T) {
    adapter := NewWalletAdapter()

    entity := payments_entities.Wallet{
        ID:         uidgen.Wallet(),
        EntityID:   uidgen.Vendor(),
        EntityType: "vendor",
    }

    model := adapter.Adapt(entity)

    assert.Equal(t, entity.ID, model.ID)
    assert.Equal(t, entity.EntityID, model.EntityID)
    assert.Equal(t, entity.EntityType, model.EntityType)
}

func TestWalletAdapter_AdaptCollection(t *testing.T) {
    adapter := NewWalletAdapter()
    entities := []payments_entities.Wallet{...}

    models := adapter.AdaptCollection(entities)

    assert.Len(t, models, len(entities))
    // Validate each mapped correctly
}
```

**Adapter Test Guidelines**:
- Test both `Adapt` and `AdaptCollection` methods
- Validate all fields map correctly from entity to model
- Test nullable/optional fields with nil values
- Test error handling for adapters that can return errors

---

<!-- /ANCHOR:testing -->
<!-- ANCHOR:rules -->
## 9. RULES

### ✅ ALWAYS

1. **Follow layered architecture strictly** - Controllers to Business Layer to Services to Repositories
2. **Use `services.Service[T]`** for transaction support in services
3. **Wrap all errors with context** using `errors.Wrap(err, "context")`
4. **Use typed UIDs** (`uid.UID`) instead of strings
5. **Aggregate repositories in data layers** - Single point of access
6. **Aggregate adapters in business layers** - Single point of adaptation
7. **Keep controllers thin** - Delegate to business layer
8. **Use dependency injection** - Via DI registry
9. **Define clear boundaries between layers** - No skipping
10. **Adapt entities to models only in business layer** - See `models_vs_entities_and_adapters.md`
11. **Return models from business layer** - Entities from services

### ❌ NEVER

1. **Skip architectural layers** - e.g., Controllers to Services directly
2. **Put business logic in HTTP handlers** - Keep controllers thin
3. **Use global state** - Use dependency injection
4. **Ignore transaction patterns** - Use `WithTx` appropriately
5. **Mix concerns across layers** - Maintain separation
6. **Use string-based IDs** - Use `uid.UID`
7. **Create manual database transactions** - Use data layer's `Transaction()`
8. **Adapt entities outside business layer** - Only business layer adapts
9. **Return entities from business layer** - Return models instead
10. **Return models from services** - Return entities instead
11. **Import `*_entities` packages in controllers** - Use models only
12. **Ignore errors** - `result, _ := doSomething()` is forbidden

### ⚠️ ESCALATE IF

1. **New pattern needed** - Consult team before introducing new patterns
2. **Transaction complexity** - Nested transactions or cross-domain transactions
3. **Layer violation required** - Document the exception and reason
4. **Performance concerns** - When layer abstraction impacts performance

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

| File                                                                       | Purpose                                             |
| -------------------------------------------------------------------------- | --------------------------------------------------- |
| [database_patterns.md](./database_patterns.md)                             | Repository pattern, transactions, GORM usage        |
| [domain_layers.md](./domain_layers.md)                                     | Generic service pattern, transaction management     |
| [models_vs_entities_and_adapters.md](./models_vs_entities_and_adapters.md) | Entity/model boundaries, adapter patterns           |
| [api_design.md](./api_design.md)                                           | HTTP controller patterns, request/response handling |
| [testing_strategy.md](./testing_strategy.md)                               | Test organization and patterns                      |
<!-- /ANCHOR:related-resources -->
