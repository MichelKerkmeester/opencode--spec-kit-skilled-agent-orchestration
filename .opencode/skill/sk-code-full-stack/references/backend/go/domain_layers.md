---
title: Domain Layers Architecture - Generic Service Pattern and Transaction Management
description: Understanding the layered architecture pattern used across all domains in backend systems, focusing on the generic service pattern, transaction management, and entity-to-model boundaries.
---

# Domain Layers Architecture - Generic Service Pattern and Transaction Management

Understanding the layered architecture pattern used across all domains in backend systems, focusing on the generic service pattern, transaction management, and entity-to-model boundaries.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose


- **Layer separation** - Clear boundaries between business, service, data, and repository layers
- **Transaction management** - Generic service pattern with `services.Service[T]`
- **Entity/model boundaries** - Where entities become models
- **Cross-service coordination** - Business layer orchestration patterns

### Progressive Disclosure

```
Level 1: This file (domain_layers.md)
         - Layer hierarchy, generic service pattern, transactions
            |
Level 2: Related knowledge files
         |- go_standards.md - Project structure, naming conventions
         |- database_patterns.md - Repository pattern, GORM usage
         +- models_vs_entities_and_adapters.md - Adapter patterns
```

### When to Use This File

- Implementing new services with transaction support
- Understanding layer responsibilities
- Coordinating multiple services in business layer
- Debugging transaction-related issues

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:lifecycle-methods-defer-health-init -->
## 2. LIFECYCLE METHODS (Defer/Health/Init)

### What Lifecycle Methods Exist?

Every layer implements lifecycle methods for proper resource management:

```go
// From pkg/layer/generic_data_layer.go
type GenericDataLayer struct {
    orm *database.Orm
}

func (l GenericDataLayer) InitLayer(_ context.Context) error {
    logger.Debug("empty init layer for ChatDataLayer")
    return nil
}

func (l GenericDataLayer) Health(_ context.Context) HealthResponse {
    return HealthResponse{
        Err: l.orm.Ping(),
    }
}

func (l GenericDataLayer) Defer() {
    err := l.orm.Close()
    if err != nil {
        logger.With("error", err).Error("unable to close ORM connection")
    }
}
```

### How Does the Defer Pattern Work?

**Purpose**: Cleanup/shutdown handling for graceful resource release.

**Pattern**: Business layers implement `Defer()` which calls `dataLayer.Defer()`:

```go
// From internal/domain/payments/payments_business_layer/payments_business_layer.go
func (l *PaymentsBusinessLayer) Defer() {
    l.dataLayer.Defer()
}

// From internal/domain/chat/chat_business_layer/chat_business_layer.go
func (l ChatBusinessLayer) Defer() {
    l.dataLayer.Defer()
}

// From internal/domain/cron/cron_business_layer/cron_manager_business_layer.go
func (l CronManagerBusinessLayer) Defer() {
    l.dataLayer.Defer()
}
```

**Microservice Level**: Microservices call `metrics.Defer()` and potentially business layer `Defer()`:

```go
// From internal/ms/ms_payments/microservice.go
func (m *PaymentsMicroservice) Defer() {
    metrics.Defer(m.ctx)
}

// From internal/ms/ms_cron/microservice.go (calls business layer Defer)
func (m *CronMicroservice) Defer() {
    metrics.Defer(m.ctx)
    // May also call: m.businessLayer.Defer()
}
```

**Empty Defer**: Some business layers have empty Defer when no cleanup is needed:

```go
// From internal/domain/auth/auth_business_layer/authentication_business_layer.go
func (l AuthenticationBusinessLayer) Defer() {}

// From internal/domain/organizations/organizations_business_layer/organizations_business_layer.go
func (l OrganizationsBusinessLayer) Defer() {}
```

### How Does the Health Pattern Work?

**Purpose**: Health checks for monitoring and load balancer readiness.

**Data Layer Health**: `GenericDataLayer.Health()` pings the database:

```go
func (l GenericDataLayer) Health(_ context.Context) HealthResponse {
    return HealthResponse{
        Err: l.orm.Ping(),
    }
}
```

**Business Layer Health**: Returns nil error when no additional checks needed:

```go
// From internal/domain/payments/payments_business_layer/payments_business_layer.go
func (l *PaymentsBusinessLayer) Health(_ context.Context) layer.HealthResponse {
    return layer.HealthResponse{
        Err: nil,
    }
}
```

**HealthResponse Type**:

```go
// From pkg/layer/generic_data_layer.go
type HealthResponse struct {
    Err error
}
```

### How Does InitLayer Work?

**Purpose**: Initialization logic after DI construction.

```go
// From internal/domain/payments/payments_business_layer/payments_business_layer.go
func (l *PaymentsBusinessLayer) InitLayer(_ context.Context) error {
    logger.Debug("empty init layer for PaymentsBusinessLayer")
    return nil
}
```

---

<!-- /ANCHOR:lifecycle-methods-defer-health-init -->
<!-- ANCHOR:layer-hierarchy -->
## 3. LAYER HIERARCHY

### What Is the Domain Structure?

Every domain follows this structure:

```
internal/domain/{domain}/
|- {domain}_business_layer/    # Business logic orchestration
|- {domain}_services/           # Domain services
|- {domain}_data_layer/         # Data access layer
|   |- {domain}_entities/      # Database entities
|   |- {domain}_repositories/  # Repository implementations
|   +- {domain}_migrations/    # Database migrations (optional)
|- {domain}_checks/             # Health checks (optional)
|- {domain}_providers/          # External providers (optional)
+- registry.go                  # DI registry
```

**Example**: `internal/domain/payments/`

### What Are the Layer Responsibilities?

```
Business Layer (Orchestration)
    |
Service Layer (Domain Logic)
    |
Data Layer (Aggregation)
    |
Repository Layer (Data Access)
    |
Database
```

**Business Layer** (`{domain}_business_layer/`):
- Orchestrates multiple services
- Implements complex workflows
- Handles cross-service transactions
- Coordinates external providers
- Entry point from HTTP controllers
- **Returns models** (adapted from entities)

**Service Layer** (`{domain}_services/`):
- Single responsibility per service
- Domain-specific operations
- Transaction-aware via `services.Service[T]`
- Can call other services within same domain
- Uses repositories for data access
- **Returns entities**

**Data Layer** (`{domain}_data_layer/`):
- Aggregates all repositories
- Provides transaction management
- Database connection handling
- Health check coordination
- Transaction isolation configuration
- **Works with entities**

**Repository Layer** (`{domain}_data_layer/{domain}_repositories/`):
- Direct database operations
- CRUD implementations
- Query optimization
- GORM usage
- No business logic
- **Returns entities**

---

<!-- /ANCHOR:layer-hierarchy -->
<!-- ANCHOR:generic-service-pattern -->
## 4. GENERIC SERVICE PATTERN

### How Does `services.Service[T]` Work?

The core of transaction management:

```go
// From infra/services/generic.go
type Service[T any] struct {
    Instance    *T
    newInstance func(Service[T]) (*T, *Service[T])
    Tx          *database.DB
}

func NewService[T any](instance *T, newInstance func(Service[T]) (*T, *Service[T])) Service[T] {
    svc := Service[T]{
        Instance:    instance,
        Tx:          nil,
    }
    svc.newInstance = newInstance
    return svc
}

// WithTx creates a copy of current service, setting with txDB as service.Tx
func (svc Service[T]) WithTx(txDB *database.DB) T {
    if types.Nil(svc.newInstance) {
        logger.Logger.Error("wrong call to WithTx on Service[T]")
        panic(errors.New("wrong call to WithTx on Service[%s]", types.NameOf(svc.Instance)))
    }

    i, s := svc.newInstance(svc)
    s.Tx = txDB
    return *i
}

func (svc Service[T]) TxNil() bool {
    return types.Nil(svc.Tx)
}
```

**How It Works**:
1. Each service embeds `services.Service[T]` where T is the service type itself
2. `WithTx(tx)` creates a new instance with the transaction set
3. Services check `TxNil()` to determine if they're in a transaction
4. Repositories are created with `repo.WithTx(s.Tx)` when transaction exists

---

<!-- /ANCHOR:generic-service-pattern -->
<!-- ANCHOR:service-implementation -->
## 5. SERVICE IMPLEMENTATION

### How Do I Structure a Service?

```go
type WalletService struct {
    services.Service[WalletService]  // Embedded generic service

    ctx               context.Context
    config            WalletServiceConfiguration
    paymentsDataLayer payments_data_layer.PaymentsDataLayer
    paymentProvider   payments.WalletProvider
}
```

### How Do I Create the Service Constructor?

```go
func NewWalletService(
    ctx context.Context,
    config WalletServiceConfiguration,
    paymentsDataLayer payments_data_layer.PaymentsDataLayer,
    paymentProvider payments.WalletProvider,
) WalletService {
    walletService := WalletService{
        ctx:               ctx,
        config:            config,
        paymentsDataLayer: paymentsDataLayer,
        paymentProvider:   paymentProvider,
    }

    // Initialize the generic service with self-reference
    walletService.Service = services.NewService(&walletService, NewWalletServiceFrom)

    return walletService
}
```

### How Do I Implement the Copy Constructor? (Critical for WithTx)

```go
func NewWalletServiceFrom(service services.Service[WalletService]) (*WalletService, *services.Service[WalletService]) {
    us := &WalletService{
        services.Service[WalletService]{},
        service.Instance.config,
        service.Instance.paymentsDataLayer,
        service.Instance.paymentProvider,
    }

    us.Service = services.NewService(us, nil)
    return us, &us.Service
}
```

**Key Points**:
- `NewWalletServiceFrom` is the copy constructor
- **Use struct literal initialization WITHOUT named parameters** - field order must match struct definition
- First field is always `services.Service[XXXService]{}` (the embedded generic service)
- The generic service handles setting the transaction
- The second constructor parameter is `nil` (no further copying needed)

**IMPORTANT: Why Struct Literal Pattern?**

This pattern provides **compile-time safety**:
1. **Field order must match struct definition exactly** - ensures all fields are considered
2. **Compiler errors on missing fields** - if you add a new field to the struct, the compiler will complain until you add it here
3. **Prevents silent bugs** - no risk of forgetting to copy a field when the struct changes
4. **No named parameters** - using positional fields forces you to account for ALL fields

**DO NOT use this pattern** (field-by-field assignment):
```go
// BAD: Adding a new field to WalletService won't cause a compiler error here
walletService := &WalletService{}
walletService.config = service.Instance.config
walletService.paymentsDataLayer = service.Instance.paymentsDataLayer
// Easy to forget: walletService.paymentProvider = service.Instance.paymentProvider
```

---

<!-- /ANCHOR:service-implementation -->
<!-- ANCHOR:transaction-patterns -->
## 6. TRANSACTION PATTERNS

### Pattern 1: Service Method Without Transaction Requirement

Service method that works both with and without transactions:

```go
func (s WalletService) GetByID(_ context.Context, ID uid.UID) (payments_entities.Wallet, error) {
    txWalletRepo := s.paymentsDataLayer.WalletRepository

    // Check if we're in a transaction
    if !s.TxNil() {
        txWalletRepo = txWalletRepo.WithTx(s.Tx)
    }

    return txWalletRepo.GetByID(ID)
}
```

**When to use**: Methods that should work both standalone and within a larger transaction.

### Pattern 2: Service Method Requiring Transaction

Service method that assumes transaction context:

```go
func (s WalletService) CreateWalletWithID(
    _ context.Context,
    id uid.UID,
    entityID uid.UID,
    entityType string,
    metadata database_models.JSONB,
) (payments_entities.Wallet, error) {
    // Always use transaction-aware repository
    txWalletRepo := s.paymentsDataLayer.WalletRepository.WithTx(s.Tx)

    if !uidgen.IsWallet(id) {
        return payments_entities.Wallet{}, errors.New("Invalid ULID for wallet")
    }

    return txWalletRepo.CreateWithID(id, entityID, entityType, metadata)
}
```

**When to use**: Write operations that must be part of a transaction.

### Pattern 3: Service Method Creating Transaction

Service method that initiates its own transaction:

```go
func (s WalletService) GetAll(ctx context.Context, queryParams map[string][]string) (operators.PaginatedResult[[]payments_entities.Wallet], error) {
    var (
        walletEntities []payments_entities.Wallet
        records        *operators.UntypedPaginatedResult
        err            error
    )

    // Create transaction using data layer
    err = s.paymentsDataLayer.Transaction(ctx, func(tx *database.DB) error {
        // Create tx-aware repository
        txWalletRepo := s.paymentsDataLayer.WalletRepository.WithTx(tx)

        // Perform operations
        records, err = txWalletRepo.GetAllThroughPipeline(ctx, pipeline.NewPipeline(...))
        if err != nil {
            return err
        }

        return nil
    }, &database.TxOptions{
        Isolation: database.IsolationLevelReadCommitted,
        ReadOnly:  true,
    })

    if err != nil {
        return operators.PaginatedResult[[]payments_entities.Wallet]{}, err
    }

    return operators.PaginatedResult[[]payments_entities.Wallet]{
        UntypedPaginatedResult: *records,
        Data:                   walletEntities,
    }, nil
}
```

**When to use**: Self-contained operations that need transaction isolation.

---

<!-- /ANCHOR:transaction-patterns -->
<!-- ANCHOR:cross-service-transactions -->
## 7. CROSS-SERVICE TRANSACTIONS

### How Do I Coordinate Multiple Services in a Transaction?

Business layer coordinates services across transactions:

```go
// In business layer
func (bl PaymentsBusinessLayer) ProvidePaymentInfoConfirm(
    ctx context.Context,
    vendorID uid.UID,
    hostedPageID string,
    paymentProvider payments.PaymentProviderEnum,
) error {
    return bl.paymentsDataLayer.Transaction(ctx, func(tx *database.DB) error {
        // Create tx-aware services
        walletServiceTx := bl.walletService.WithTx(tx)
        walletActivityLogServiceTx := bl.walletActivityLogService.WithTx(tx)

        // Perform operations across services
        wallet, err := walletServiceTx.GetByEntityIDAndType(ctx, vendorID, "vendor")
        if err != nil {
            return errors.Wrap(err, "failed to get wallet")
        }

        // Log activity
        err = walletActivityLogServiceTx.LogAction(ctx, wallet.ID, "payment_info_confirmed")
        if err != nil {
            return errors.Wrap(err, "failed to log activity")
        }

        return nil
    }, &database.TxOptions{
        Isolation: database.IsolationLevelReadCommitted,
    })
}
```

**Key Points**:
- Business layer initiates transaction
- Uses `service.WithTx(tx)` to create tx-aware service instances
- All services operate within same transaction
- Any error triggers rollback
- Commit happens automatically on success

---

<!-- /ANCHOR:cross-service-transactions -->
<!-- ANCHOR:entity-model-boundary -->
## 8. ENTITY-MODEL BOUNDARY

### Where Do Entities Become Models?

**Critical Rule**: Business layers are the boundary where entities become models.

**Three Mandatory Principles**:
1. **Business layer returns models only** - All business-layer returns must be `pkg/models/*` types
2. **Adapters used only in business layer** - Adaptation happens exclusively at business layer
3. **Below business layer uses entities only** - Services, repositories, data layers work with entities

### How Do I Handle Cross-Service Orchestration?

When business layer orchestrates multiple services:
- Services are called with entities as parameters (if needed)
- Services return entities
- Business layer works with entities internally
- **Adaptation happens once at the final return** (entity to model)

**Example**:
```go
func (bl PaymentsBusinessLayer) GetWalletWithSubscriptions(
    ctx context.Context,
    walletID uid.UID,
) (payments.WalletWithSubscriptions, error) {
    // Services return entities
    walletEntity, err := bl.walletService.GetByID(ctx, walletID)
    if err != nil {
        return payments.WalletWithSubscriptions{}, err
    }

    subscriptionEntities, err := bl.walletSubscriptionService.GetByWalletID(ctx, walletID)
    if err != nil {
        return payments.WalletWithSubscriptions{}, err
    }

    // Adapt entities to models at the output boundary
    walletModel := bl.adapters.WalletAdapter.Adapt(walletEntity)
    subscriptionModels := bl.adapters.WalletSubscriptionAdapter.AdaptCollection(subscriptionEntities)

    return payments.WalletWithSubscriptions{
        Wallet:        walletModel,
        Subscriptions: subscriptionModels,
    }, nil
}
```

### Why Does This Boundary Exist?

- **Entities** represent database structure and relationships (internal implementation)
- **Models** represent business API contract (external interface)
- Separating these allows database schema changes without breaking API contracts
- Adaptation at business layer prevents entities from leaking to controllers/CLI/external services

**See Also**: `models_vs_entities_and_adapters.md` for complete adapter patterns.

---

<!-- /ANCHOR:entity-model-boundary -->
<!-- ANCHOR:pipeline-pattern-query-building -->
## 9. PIPELINE PATTERN (Query Building)

### What Is the Pipeline Pattern?

The Pipeline pattern provides dynamic query building with filters, search, ordering, and pagination. It's a fluent builder pattern from `github.com/pixie-sh/database-helpers-go/pipeline`.

**Core Components**:
- `pipeline.Pipeline` - Builder for query operations
- `operators.*` - Individual operations (search, filter, order, paginate)
- `pipelineModels.SearchableProperty` - Field definition for operations

### How Do I Create a Pipeline?

```go
import (
    "github.com/pixie-sh/database-helpers-go/pipeline"
    "github.com/pixie-sh/database-helpers-go/pipeline/operators"
    pipelineModels "github.com/pixie-sh/database-helpers-go/pipeline/operators/models"
)

// From internal/domain/payments/payments_services/wallet_service.go
func (s WalletService) GetAll(ctx context.Context, queryParams map[string][]string) (operators.PaginatedResult[[]payments_entities.Wallet], error) {
    var (
        walletEntities []payments_entities.Wallet
        records        *operators.UntypedPaginatedResult
        err            error
    )

    err = s.paymentsDataLayer.Transaction(ctx, func(tx *database.DB) error {
        txWalletRepo := s.paymentsDataLayer.WalletRepository.WithTx(tx)

        records, err = txWalletRepo.GetAllThroughPipeline(
            ctx,
            pipeline.NewPipeline(pixiecontext.GetCtxLogger(ctx)).
                AddOperator(operators.NewGlobalSearchOperator(queryParams, "search",
                    pipelineModels.SearchableProperty{Field: "entity_id", Type: "text", LikeBefore: true, LikeAfter: true, Unaccent: true},
                    pipelineModels.SearchableProperty{Field: "entity_type", Type: "text", LikeBefore: true, LikeAfter: true, Unaccent: true},
                )).
                AddOperator(operators.NewSearchInPropertiesOperator(queryParams, "search_in",
                    pipelineModels.SearchableProperty{Field: "entity_id", Type: "text", Comparison: "="},
                    pipelineModels.SearchableProperty{Field: "entity_type", Type: "text", Comparison: "="},
                )).
                AddOperator(operators.NewOrderByOperator(queryParams, true, []string{"-created_at"},
                    pipelineModels.SearchableProperty{Field: "created_at", Type: "date"},
                )).
                AddOperator(operators.NewPaginateOperator(queryParams, &walletEntities, 10, 20, 50, 100)),
        )
        return err
    }, &database.TxOptions{
        Isolation: database.IsolationLevelReadCommitted,
        ReadOnly:  true,
    })

    if err != nil {
        return operators.PaginatedResult[[]payments_entities.Wallet]{}, err
    }

    return operators.PaginatedResult[[]payments_entities.Wallet]{
        UntypedPaginatedResult: *records,
        Data:                   walletEntities,
    }, nil
}
```

### What Operators Are Available?

| Operator                        | Purpose                        | Example               |
| ------------------------------- | ------------------------------ | --------------------- |
| `NewGlobalSearchOperator`       | Full-text search across fields | Search by name, email |
| `NewSearchInPropertiesOperator` | Exact match filter             | Filter by status      |
| `NewOrderByOperator`            | Sorting with direction         | Sort by `-created_at` |
| `NewPaginateOperator`           | Pagination with limits         | Page 1, 20 per page   |
| `NewWhereUUIDsInOperator`       | Filter by UUID list            | Get orders by IDs     |

### How Do I Implement GetAllThroughPipeline in Repository?

```go
// From internal/domain/payments/payments_data_layer/payments_repositories/wallet_repository.go
func (r WalletRepository) GetAllThroughPipeline(ctx context.Context, pipe *pipeline.Pipeline) (*operators.UntypedPaginatedResult, error) {
    db := r.DB.Model(&payments_entities.Wallet{})

    exec, err := pipe.ExecWithPassable(ctx, operators.NewResult(db))
    if err != nil {
        return nil, err
    }

    if exec.Error() != nil {
        return nil, exec.Error()
    }

    result, ok := exec.GetPassable().(*operators.UntypedPaginatedResult)
    if !ok {
        return nil, errors.New("cannot get paginated result")
    }

    return result, nil
}
```

### What Is SearchableProperty?

```go
pipelineModels.SearchableProperty{
    Field:      "entity_id",     // Database column name
    Type:       "text",          // text, date, number, uuid
    LikeBefore: true,            // %value (prefix wildcard)
    LikeAfter:  true,            // value% (suffix wildcard)
    Unaccent:   true,            // Remove accents for matching
    Comparison: "=",             // =, >, <, >=, <=, LIKE
}
```

### How Do I Return Paginated Results?

```go
// UntypedPaginatedResult contains pagination metadata
type UntypedPaginatedResult struct {
    Page       int   `json:"page"`
    PerPage    int   `json:"per_page"`
    TotalPages int   `json:"total_pages"`
    TotalCount int64 `json:"total_count"`
}

// PaginatedResult[T] combines metadata with typed data
type PaginatedResult[T any] struct {
    UntypedPaginatedResult
    Data T `json:"data"`
}

// Return from service method
return operators.PaginatedResult[[]payments_entities.Wallet]{
    UntypedPaginatedResult: *records,
    Data:                   walletEntities,
}, nil
```

### Pipeline Usage Pattern Summary

1. **Service Layer**: Creates pipeline with operators from query params
2. **Repository Layer**: Executes pipeline against GORM model
3. **Result**: Returns `UntypedPaginatedResult` with pagination metadata
4. **Typing**: Service wraps result in `PaginatedResult[T]` for type safety

---

<!-- /ANCHOR:pipeline-pattern-query-building -->
<!-- ANCHOR:data-layer-pattern -->
## 10. DATA LAYER PATTERN

### How Is the Data Layer Structured?

```go
type PaymentsDataLayer struct {
    layer.GenericDataLayer  // Provides Transaction(), Health(), Connection()

    config                             PaymentsDataLayerConfiguration
    CouponRepository                   payments_repositories.CouponRepository
    BillableItemRepository             payments_repositories.BillableItemsRepository
    WalletRepository                   payments_repositories.WalletRepository
    WalletSubscriptionRepository       payments_repositories.WalletSubscriptionRepository
}

func NewPaymentDataLayer(
    _ context.Context,
    orm *database.Orm,
    layerConfig PaymentsDataLayerConfiguration,
) (PaymentsDataLayer, error) {
    return PaymentsDataLayer{
        GenericDataLayer:         layer.NewGenericDataLayer(orm),
        config:                   layerConfig,
        CouponRepository:         payments_repositories.NewCouponRepository(orm.DB),
        BillableItemRepository:   payments_repositories.NewBillableItemsRepository(orm.DB),
        WalletRepository:         payments_repositories.NewWalletRepository(orm.DB),
        WalletSubscriptionRepository: payments_repositories.NewWalletSubscriptionRepository(orm.DB),
    }, nil
}
```

### What Does GenericDataLayer Provide?

From `pkg/layer/generic_data_layer.go`:

```go
type GenericDataLayer struct {
    orm *database.Orm
}

// Health check
func (l GenericDataLayer) Health(_ context.Context) HealthResponse {
    return HealthResponse{
        Err: l.orm.Ping(),
    }
}

// Get database connection
func (l GenericDataLayer) Connection(_ context.Context) *database.DB {
    return l.orm.DB
}

// Transaction wrapper
func (l GenericDataLayer) Transaction(
    ctx context.Context,
    handler func(db *database.DB) error,
    opts ...*database.TxOptions,
) (err error) {
    return database.NewRepository(
        l.Connection(ctx),
        func(db *database.DB) any {
            panic("wrong GenericDataLayer usage of transaction")
        },
    ).Transaction(handler, opts...)
}
```

---

<!-- /ANCHOR:data-layer-pattern -->
<!-- ANCHOR:transaction-flow-examples -->
## 11. TRANSACTION FLOW EXAMPLES

### Example 1: Simple Service Method

Can work with or without transaction:

```go
func (s WalletService) UpdateMetadata(
    _ context.Context,
    walletID uid.UID,
    metadata database_models.JSONB,
) error {
    txWalletRepo := s.paymentsDataLayer.WalletRepository
    if !s.TxNil() {
        txWalletRepo = txWalletRepo.WithTx(s.Tx)
    }

    return txWalletRepo.UpdateMetadata(walletID, metadata)
}
```

### Example 2: Multi-Service Transaction

Business layer orchestrating multiple services:

```go
func (bl PaymentsBusinessLayer) CreateWalletAndSubscription(
    ctx context.Context,
    vendorID uid.UID,
    planID string,
) error {
    return bl.paymentsDataLayer.Transaction(ctx, func(tx *database.DB) error {
        // Create tx-aware services
        walletSvc := bl.walletService.WithTx(tx)
        subscriptionSvc := bl.walletSubscriptionService.WithTx(tx)

        // Create wallet
        wallet, err := walletSvc.CreateWalletWithID(ctx, uidgen.Wallet(), vendorID, "vendor", nil)
        if err != nil {
            return err
        }

        // Create subscription
        _, err = subscriptionSvc.CreateSubscription(ctx, wallet.ID, planID)
        return err
    })
}
```

### Example 3: Read-Only Transaction

Optimized for read operations:

```go
func (s WalletService) GetWalletWithSubscriptions(
    ctx context.Context,
    walletID uid.UID,
) (WalletWithSubscriptions, error) {
    var result WalletWithSubscriptions

    err := s.paymentsDataLayer.Transaction(ctx, func(tx *database.DB) error {
        walletRepo := s.paymentsDataLayer.WalletRepository.WithTx(tx)
        subscriptionRepo := s.paymentsDataLayer.WalletSubscriptionRepository.WithTx(tx)

        wallet, err := walletRepo.GetByID(walletID)
        if err != nil {
            return err
        }

        subscriptions, err := subscriptionRepo.GetByWalletID(walletID)
        if err != nil {
            return err
        }

        result.Wallet = wallet
        result.Subscriptions = subscriptions
        return nil
    }, &database.TxOptions{
        Isolation: database.IsolationLevelReadCommitted,
        ReadOnly:  true,  // Optimization for read-only
    })

    return result, err
}
```

---

<!-- /ANCHOR:transaction-flow-examples -->
<!-- ANCHOR:state-machine-pattern -->
## 12. STATE MACHINE PATTERN

### What Is the State Machine Pattern?

The State Machine pattern provides workflow state management for entities that have complex lifecycle transitions. It's implemented using `infra/state_machine` and used by domains like `organizations` for managing entity states.

**Location**: `infra/state_machine/`
**Reference Implementation**: `internal/domain/organizations/organizations_services/organization_state_machine.go`

### How Do I Create a State Machine?

```go
// From internal/domain/organizations/organizations_services/organization_state_machine.go
func GetOrganizationStateMachine(
    ctx context.Context,
    organizationID uid.UID,
    storage state_machine.StateMachineStorage,
    withStateMachineEntityStorage ...state_machine.StateMachineEntityStorage,
) (*state_machine.Machine, error) {
    // Create machine with unique identifier
    organizationStateMachine := state_machine.NewMachine(
        ctx,
        fmt.Sprintf("%s-%s", "Organization", organizationID),
        storage,
        withStateMachineEntityStorage...,
    )

    // Try to restore existing state
    err := organizationStateMachine.Restore()
    if err != nil {
        // Create new state machine if restoration fails
        pixiecontext.GetCtxLogger(ctx).With("err", err).
            Warn("problem getting organization %+v state machine, creating new one.", organizationID)

        // Define states
        organizationStateMachine.AddState(organizations_enums.CreatedOrganizationState)
        organizationStateMachine.AddState(organizations_enums.DraftOrganizationState)
        organizationStateMachine.AddState(organizations_enums.LiveOrganizationState)
        organizationStateMachine.AddState(organizations_enums.ArchivedOrganizationState)
        organizationStateMachine.AddState(organizations_enums.TrashedOrganizationState)

        // Set initial state
        _ = organizationStateMachine.SetInitialState(organizations_enums.CreatedOrganizationState)

        // Define transitions
        // From Created
        _ = organizationStateMachine.AddTransition(
            organizations_enums.CreatedOrganizationState,
            organizations_enums.DraftCreatedOrganizationTransitionEvent,
            organizations_enums.DraftOrganizationState,
        )
        _ = organizationStateMachine.AddTransition(
            organizations_enums.CreatedOrganizationState,
            organizations_enums.LiveCreatedOrganizationTransitionEvent,
            organizations_enums.LiveOrganizationState,
        )

        // From Draft
        _ = organizationStateMachine.AddTransition(
            organizations_enums.DraftOrganizationState,
            organizations_enums.PushToLiveOrganizationTransitionEvent,
            organizations_enums.LiveOrganizationState,
        )
        _ = organizationStateMachine.AddTransition(
            organizations_enums.DraftOrganizationState,
            organizations_enums.PushToArchivedOrganizationTransitionEvent,
            organizations_enums.ArchivedOrganizationState,
        )
        _ = organizationStateMachine.AddTransition(
            organizations_enums.DraftOrganizationState,
            organizations_enums.PushToTrashOrganizationTransitionEvent,
            organizations_enums.TrashedOrganizationState,
        )

        // Save the new state machine
        err = organizationStateMachine.Save()
        if err != nil {
            return nil, err
        }
    }

    return organizationStateMachine, nil
}
```

### What Are the State Machine Components?

| Component | Purpose | Example |
|-----------|---------|---------|
| `state_machine.Machine` | Core state machine instance | Manages states and transitions |
| `state_machine.StateMachineStorage` | Persistence layer | Stores/restores state machine state |
| `state_machine.StateMachineEntityStorage` | Entity state tracking | Optional, for entity-level state |
| States | Valid entity states | `Created`, `Draft`, `Live`, `Archived`, `Trashed` |
| Transitions | State change events | `PushToLiveOrganizationTransitionEvent` |

### How Do State Machine Enums Work?

State and transition enums are defined in `pkg/models/{domain}_enums/`:

```go
// From pkg/models/organizations_enums/organization_state_enums.go
const (
    CreatedOrganizationState  = "created"
    DraftOrganizationState    = "draft"
    LiveOrganizationState     = "live"
    ArchivedOrganizationState = "archived"
    TrashedOrganizationState  = "trashed"
)

// Transition events
const (
    DraftCreatedOrganizationTransitionEvent    = "draft_created"
    LiveCreatedOrganizationTransitionEvent     = "live_created"
    PushToLiveOrganizationTransitionEvent      = "push_to_live"
    PushToDraftOrganizationTransitionEvent     = "push_to_draft"
    PushToArchivedOrganizationTransitionEvent  = "push_to_archived"
    PushToTrashOrganizationTransitionEvent     = "push_to_trash"
)
```

### State Machine Lifecycle Flow

```
+--------------------------------------------------------------+
|                    Organization State Machine                 |
+--------------------------------------------------------------+
|                                                              |
|   +---------+                                                |
|   | Created | --(draft_created)---> +-------+                |
|   +---------+                       | Draft | <----------+   |
|       |                             +-------+            |   |
|       |                                 |                |   |
|       +--(live_created)--->             |                |   |
|                             +------+ <--+----------------+   |
|                             | Live | (push_to_live)      |   |
|                             +------+                     |   |
|                                 |                        |   |
|                                 | (push_to_archived)     |   |
|                                 v                        |   |
|                           +----------+                   |   |
|                           | Archived |--(push_to_draft)--+   |
|                           +----------+                       |
|                                 |                            |
|                                 | (push_to_trash)            |
|                                 v                            |
|                           +---------+                        |
|                           | Trashed |                        |
|                           +---------+                        |
|                                 |                            |
|                                 +--(push_to_draft)-----------+
+--------------------------------------------------------------+
```

### When to Use State Machine Pattern?

Use state machines when:
- Entity has multiple distinct lifecycle states
- State transitions must be validated
- Need to track state history
- Business rules depend on current state
- Concurrent state changes must be prevented

**Examples**:
- Organization lifecycle (Created to Draft to Live to Archived to Trashed)
- Order workflow states
- Application approval workflows

---

<!-- /ANCHOR:state-machine-pattern -->
<!-- ANCHOR:rules -->
## 13. RULES

### ✅ ALWAYS

1. **Embed `services.Service[T]`** in services for transaction support
2. **Implement `NewXServiceFrom`** copy constructor for `WithTx` to work
3. **Check `s.TxNil()`** before deciding on repository creation
4. **Use `service.WithTx(tx)`** for cross-service transactions
5. **Initiate transactions at business layer** - Not in services
6. **Specify transaction isolation levels** - Appropriate for use case
7. **Return errors to trigger rollback** - Don't panic in transactions
8. **Adapt entities to models only in business layer** - Final boundary
9. **Return models from business layer methods** - Not entities

### ❌ NEVER

1. **Forget to implement copy constructor** - `WithTx` will panic
2. **Mix transactional and non-transactional** repository access in same operation
3. **Create transactions in service layer** - Do it in business layer
4. **Ignore `TxNil()` checks** - Can cause inconsistent behavior
5. **Panic in transactions** - Return errors instead
6. **Nest transactions unnecessarily** - Use single transaction scope
7. **Adapt entities in services** - Only business layer adapts
8. **Expose entities beyond business layer** - Use models
9. **Return models from services** - Return entities instead

### ⚠️ ESCALATE IF

1. **"wrong call to WithTx on Service[T]"** - `NewXServiceFrom` not implemented
2. **Changes not persisted** - Not using `WithTx` inside transaction handler
3. **Deadlocks occurring** - Wrong isolation level or nested transactions
4. **Services not sharing transaction** - Missing `service.WithTx(tx)` calls
5. **Complex cross-domain transactions** - May need architectural review

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:debugging-transaction-issues -->
## 14. DEBUGGING TRANSACTION ISSUES

### Common Issue: "wrong call to WithTx on Service[T]"

**Cause**: `NewXServiceFrom` not implemented or not passed to `NewService`
**Fix**: Implement proper copy constructor

### Common Issue: Changes Not Persisted

**Cause**: Not using `WithTx` inside transaction
**Fix**: Always use `repo.WithTx(tx)` inside transaction handlers

### Common Issue: Deadlocks

**Cause**: Wrong isolation level or nested transactions
**Fix**: Use appropriate isolation level, avoid nested transactions

### Common Issue: Services Not Sharing Transaction

**Cause**: Not using `service.WithTx(tx)` for each service
**Fix**: Create tx-aware instances with `WithTx` for all services in transaction

---

<!-- /ANCHOR:debugging-transaction-issues -->
<!-- ANCHOR:related-resources -->
## 15. RELATED RESOURCES

| File                                                                       | Purpose                                      |
| -------------------------------------------------------------------------- | -------------------------------------------- |
| [go_standards.md](./go_standards.md)                                       | Project structure, naming conventions        |
| [database_patterns.md](./database_patterns.md)                             | Repository pattern, GORM, entity definitions |
| [models_vs_entities_and_adapters.md](./models_vs_entities_and_adapters.md) | Adapter patterns, boundary rules             |
| [api_design.md](./api_design.md)                                           | HTTP controller patterns                     |
<!-- /ANCHOR:related-resources -->
