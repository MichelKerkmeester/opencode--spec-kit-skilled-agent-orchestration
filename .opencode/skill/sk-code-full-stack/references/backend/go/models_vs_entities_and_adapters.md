---
title: Models vs Entities - Adapter Boundary Architecture
description: Defines the architectural boundary between database entities and business models, establishing where adapter patterns must be used to convert internal data structures to external API contracts.
---

# Models vs Entities - Adapter Boundary Architecture

Defines the architectural boundary between database entities and business models, establishing where adapter patterns must be used to convert internal data structures to external API contracts.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

- **Layer isolation** - Database changes don't break API contracts
- **Clear boundaries** - Business layer is the adaptation point
- **Consistent patterns** - Standardized adapter implementation
- **Type safety** - Strong typing at each layer

### Progressive Disclosure

```
Level 1: This file (models_vs_entities_and_adapters.md)
         └─ Core principles, adapter patterns, boundary rules
            ↓
Level 2: Related knowledge files
         ├─ domain_layers.md → Layer hierarchy, service patterns
         ├─ go_standards.md → Project structure, naming
         └─ api_design.md → Controller patterns
```

### When to Use This File

- Creating new adapters
- Understanding where to adapt entities
- Debugging layer boundary issues
- Reviewing code for boundary violations

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:core-principles -->
## 2. CORE PRINCIPLES

### What Are the Three Mandatory Principles?

**Principle 1: Business Layer Returns Models Only**

All business layer methods must return models from `pkg/models/`, never entities.

- Business layers are the boundary between internal domain logic and external consumers
- Entities are internal implementation details that must not leak beyond business layer
- Controllers, HTTP handlers, and external interfaces consume models only

**Principle 2: Adapters Used Only in Business Layer**

Adapter patterns must be used exclusively from the business layer to convert entities to models.

- Adapters live in `internal/adapters/{domain}_adapters/`
- Business layers aggregate domain-specific adapters
- No other layer performs adaptation
- Adaptation happens once at the edge of business layer

**Principle 3: Below Business Layer Uses Entities Only**

Services, repositories, and data layers deal exclusively with entities.

- Repositories return entities from `internal/domain/{domain}/{domain}_entities/`
- Services operate on entities and return entities
- Data layers coordinate repositories using entities
- No models flow into or through these layers

---

<!-- /ANCHOR:core-principles -->
<!-- ANCHOR:layer-responsibilities -->
## 3. LAYER RESPONSIBILITIES

### What Does Each Layer Consume and Produce?

| Layer                | Consumes | Produces      | Uses Adapters? |
| -------------------- | -------- | ------------- | -------------- |
| **HTTP Controllers** | Models   | Models (JSON) | No             |
| **Business Layer**   | Entities | **Models**    | Yes            |
| **Service Layer**    | Entities | Entities      | No             |
| **Data Layer**       | Entities | Entities      | No             |
| **Repository Layer** | Database | Entities      | No             |

### What Is the Data Flow?

```
Repository → Entity → Service → Entity → Business Layer → [ADAPTER] → Model → Controller → JSON
```

**Adaptation Point**:
- Happens **once** at business layer output
- Business layer may orchestrate multiple services internally using entities
- Final return value is always a model

---

<!-- /ANCHOR:layer-responsibilities -->
<!-- ANCHOR:adapter-design-pattern -->
## 4. ADAPTER DESIGN PATTERN

### How Do I Structure Adapters?

Adapters are organized by domain:

```
internal/adapters/
├── payments_adapters/
│   ├── adapters.go              # Aggregator
│   ├── wallet_adapter.go
│   ├── coupon_adapter.go
│   └── invoice_adapter.go
├── core_adapters/
│   ├── core_adapters.go         # Aggregator
│   └── content_type_adapter.go
└── vendors_adapters/
    ├── vendor_adapters.go       # Aggregator
    └── vendor_adapter.go
```

### How Do I Create an Aggregator?

Each domain has an `Adapters` struct that aggregates all adapters:

```go
// internal/adapters/payments_adapters/adapters.go
package payments_adapters

type Adapters struct {
    WalletAdapter
    CouponAdapter
    InvoiceAdapter
    BillableItemAdapter
}

func NewAdapters() Adapters {
    return Adapters{
        WalletAdapter:       NewWalletAdapter(),
        CouponAdapter:       NewCouponAdapter(),
        InvoiceAdapter:      NewInvoiceAdapter(),
        BillableItemAdapter: NewBillableItemAdapter(),
    }
}
```

### How Do I Implement an Individual Adapter?

Each adapter has two standard methods:

```go
// internal/adapters/payments_adapters/wallet_adapter.go
package payments_adapters

import (
    "github.com/example/backend/internal/domain/payments/payments_data_layer/payments_entities"
    "github.com/example/backend/pkg/models/payments"
)

type WalletAdapter struct {}

func NewWalletAdapter() WalletAdapter {
    return WalletAdapter{}
}

// Adapt converts a single entity to a model
func (a WalletAdapter) Adapt(wallet payments_entities.Wallet) payments.Wallet {
    var walletMetadata payments.WalletMetadata

    if wallet.Metadata != nil {
        err := serializer.FromJSONB(wallet.Metadata, &walletMetadata)
        if err != nil {
            walletMetadata = payments.WalletMetadata{
                ProviderMappings: make(map[payments.PaymentProviderEnum]string),
            }
        }
    } else {
        walletMetadata = payments.WalletMetadata{
            ProviderMappings: make(map[payments.PaymentProviderEnum]string),
        }
    }

    return payments.Wallet{
        ID:         wallet.ID,
        EntityID:   wallet.EntityID,
        EntityType: wallet.EntityType,
        Metadata:   walletMetadata,
        SoftDeletable: models.SoftDeletable{
            CreatedAt: wallet.CreatedAt,
            UpdatedAt: wallet.UpdatedAt,
        },
    }
}

// AdaptCollection converts a slice of entities to a slice of models
func (a WalletAdapter) AdaptCollection(wallets []payments_entities.Wallet) []payments.Wallet {
    return slices.Map(wallets, a.Adapt)
}
```

### What Naming Convention Should I Use?

**Standard naming**:
- `Adapt(entity Entity) Model` - Single entity to model
- `AdaptCollection(entities []Entity) []Model` - Slice conversion

**Do NOT use**: `ToModel`, `Convert`, `Transform`, `AdaptAll`, `AdaptMany`

---

<!-- /ANCHOR:adapter-design-pattern -->
<!-- ANCHOR:error-handling-in-adapters -->
## 5. ERROR HANDLING IN ADAPTERS

### How Should Adapters Handle Errors?

**Philosophy**: Adapters should be resilient and provide sensible defaults rather than failing.

```go
// GOOD: Provide defaults for missing/invalid data
func (a WalletAdapter) Adapt(wallet payments_entities.Wallet) payments.Wallet {
    var walletMetadata payments.WalletMetadata
    if wallet.Metadata != nil {
        err := serializer.FromJSONB(wallet.Metadata, &walletMetadata)
        if err != nil {
            // Log error but provide default
            walletMetadata = payments.WalletMetadata{
                ProviderMappings: make(map[payments.PaymentProviderEnum]string),
            }
        }
    }
    return payments.Wallet{...}
}

// BAD: Don't return errors from Adapt
func (a WalletAdapter) Adapt(wallet payments_entities.Wallet) (payments.Wallet, error) {
    // Adapters should not fail
}
```

**Exception**: If adaptation legitimately cannot proceed:

```go
func (a BillableItemAdapter) Adapt(item payments_entities.BillableItem) (payments.BillableItem, error) {
    if item.PricingModel == "" {
        return payments.BillableItem{}, errors.New("pricing_model is required")
    }
    return payments.BillableItem{...}, nil
}
```

---

<!-- /ANCHOR:error-handling-in-adapters -->
<!-- ANCHOR:usage-in-business-layer -->
## 6. USAGE IN BUSINESS LAYER

### How Do I Structure the Business Layer?

Business layers aggregate adapters:

```go
type PaymentsBusinessLayer struct {
    config           PaymentsBusinessLayerConfiguration
    dataLayer        *payments_data_layer.PaymentsDataLayer
    adapters         payments_adapters.Adapters      // Domain adapters
    vendorsAdapters  vendors_adapters.Adapters       // Cross-domain if needed
    walletService    payments_services.WalletService
    couponService    payments_services.CouponService
}

func NewPaymentsBusinessLayer(
    config PaymentsBusinessLayerConfiguration,
    dataLayer *payments_data_layer.PaymentsDataLayer,
    walletService payments_services.WalletService,
) PaymentsBusinessLayer {
    return PaymentsBusinessLayer{
        config:    config,
        dataLayer: dataLayer,
        adapters:  payments_adapters.NewAdapters(),  // Initialize adapters
        walletService: walletService,
    }
}
```

### How Do I Adapt in Business Methods?

**Pattern**: Call service (gets entities) -> Adapt -> Return model

```go
// GOOD: Business layer adapts entity to model before returning
func (l *PaymentsBusinessLayer) GetWallet(
    ctx context.Context,
    walletID uid.UID,
) (payments.Wallet, error) {
    // Service returns entity
    walletEntity, err := l.walletService.GetByID(ctx, walletID)
    if err != nil {
        return payments.Wallet{}, db_errors.Handle(err)
    }

    // Adapt entity to model before returning
    walletModel := l.adapters.WalletAdapter.Adapt(walletEntity)
    return walletModel, nil
}

// GOOD: Collection adaptation
func (l *PaymentsBusinessLayer) ListWallets(
    ctx context.Context,
    parameters map[string][]string,
) (operators.PaginatedResult[[]payments.Wallet], error) {
    result, err := l.walletService.GetAll(ctx, parameters)
    if err != nil {
        return operators.PaginatedResult[[]payments.Wallet]{}, err
    }

    // Adapt collection
    walletModels := l.adapters.WalletAdapter.AdaptCollection(result.Data)

    return operators.PaginatedResult[[]payments.Wallet]{
        UntypedPaginatedResult: result.UntypedPaginatedResult,
        Data:                   walletModels,
    }, nil
}
```

### How Do I Handle Multi-Service Orchestration?

Work with entities internally, adapt only at the return:

```go
func (l *PaymentsBusinessLayer) GetWalletWithSubscriptions(
    ctx context.Context,
    walletID uid.UID,
) (payments.WalletWithSubscriptions, error) {
    // All services work with entities
    walletEntity, err := l.walletService.GetByID(ctx, walletID)
    if err != nil {
        return payments.WalletWithSubscriptions{}, db_errors.Handle(err)
    }

    subscriptionEntities, err := l.walletSubscriptionService.GetByWalletID(ctx, walletID)
    if err != nil {
        return payments.WalletWithSubscriptions{}, db_errors.Handle(err)
    }

    // Adapt entities to models ONCE at the output boundary
    walletModel := l.adapters.WalletAdapter.Adapt(walletEntity)
    subscriptionModels := l.adapters.WalletSubscriptionAdapter.AdaptCollection(subscriptionEntities)

    return payments.WalletWithSubscriptions{
        Wallet:        walletModel,
        Subscriptions: subscriptionModels,
    }, nil
}
```

---

<!-- /ANCHOR:usage-in-business-layer -->
<!-- ANCHOR:rules -->
## 7. RULES

### ✅ ALWAYS

1. **Return models from business layer** - All business layer methods return `pkg/models/*` types
2. **Use adapters only in business layer** - Adaptation happens exclusively at business layer
3. **Return entities from services** - Services return `internal/domain/*_entities/*` types
4. **Use `Adapt` and `AdaptCollection`** naming - Standard method names
5. **Provide sensible defaults** - Handle missing/invalid data gracefully
6. **Aggregate adapters in business layer** - Use `Adapters` struct pattern
7. **Test adapter field mappings** - Validate all fields map correctly

### ❌ NEVER

1. **Adapt in services** - Services must not import adapter packages
2. **Adapt in controllers** - Controllers receive models from business layer
3. **Return entities from business layer** - Always adapt before returning
4. **Return models from services** - Services work with entities only
5. **Import `*_entities` in controllers** - Controllers use models only
6. **Use inconsistent naming** - Use `Adapt`/`AdaptCollection` only
7. **Fail without defaults** - Adapters should be resilient

### ⚠️ ESCALATE IF

1. **Cross-domain adaptation needed** - May need architectural review
2. **Circular dependencies** - Adapter importing creates cycle
3. **Complex transformations** - May need helper functions
4. **Performance concerns** - Large collection adaptations

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:testing-adapters -->
## 8. TESTING ADAPTERS

### How Do I Test Adapters?

```go
func TestWalletAdapter_Adapt(t *testing.T) {
    adapter := NewWalletAdapter()

    entity := payments_entities.Wallet{
        ID:         uidgen.Wallet(),
        EntityID:   uidgen.Vendor(),
        EntityType: "vendor",
        Metadata:   database_models.JSONB(`{"provider_mappings":{"stripe":"cust_123"}}`),
        CreatedAt:  time.Now(),
        UpdatedAt:  time.Now(),
    }

    model := adapter.Adapt(entity)

    assert.Equal(t, entity.ID, model.ID)
    assert.Equal(t, entity.EntityID, model.EntityID)
    assert.Equal(t, entity.EntityType, model.EntityType)
    assert.NotNil(t, model.Metadata.ProviderMappings)
}

func TestWalletAdapter_AdaptCollection(t *testing.T) {
    adapter := NewWalletAdapter()

    entities := []payments_entities.Wallet{
        {ID: uidgen.Wallet(), EntityID: uidgen.Vendor(), EntityType: "vendor"},
        {ID: uidgen.Wallet(), EntityID: uidgen.Vendor(), EntityType: "vendor"},
    }

    models := adapter.AdaptCollection(entities)

    assert.Len(t, models, 2)
    assert.Equal(t, entities[0].ID, models[0].ID)
}
```

---

<!-- /ANCHOR:testing-adapters -->
<!-- ANCHOR:complete-flow-example -->
## 9. COMPLETE FLOW EXAMPLE

### How Does Data Flow Through the System?

```go
// 1. REPOSITORY: Returns entity
func (r WalletRepository) GetByID(ID uid.UID) (payments_entities.Wallet, error) {
    var wallet payments_entities.Wallet
    err := r.DB.Model(&payments_entities.Wallet{}).Where("id = ?", ID).First(&wallet).Error
    return wallet, err
}

// 2. SERVICE: Works with entities
func (s WalletService) GetByID(ctx context.Context, ID uid.UID) (payments_entities.Wallet, error) {
    txWalletRepo := s.paymentsDataLayer.WalletRepository
    if !s.TxNil() {
        txWalletRepo = txWalletRepo.WithTx(s.Tx)
    }
    return txWalletRepo.GetByID(ID)
}

// 3. BUSINESS LAYER: Adapts entity to model
func (l *PaymentsBusinessLayer) GetWallet(
    ctx context.Context,
    walletID uid.UID,
) (payments.Wallet, error) {
    walletEntity, err := l.walletService.GetByID(ctx, walletID)
    if err != nil {
        return payments.Wallet{}, db_errors.Handle(err)
    }

    // ADAPTATION HAPPENS HERE
    walletModel := l.adapters.WalletAdapter.Adapt(walletEntity)
    return walletModel, nil
}

// 4. CONTROLLER: Uses model from business layer
func (c httpControllers) getWallet(ctx http.ServerCtx) error {
    walletID := uid.UID(ctx.Params("id"))

    walletModel, err := c.businessLayer.GetWallet(ctx.Context(), walletID)
    if err != nil {
        return http.Response(ctx, err)
    }

    return http.Response(ctx, walletModel) // JSON serialization of model
}
```

---

<!-- /ANCHOR:complete-flow-example -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

| File                                           | Purpose                                  |
| ---------------------------------------------- | ---------------------------------------- |
| [domain_layers.md](./domain_layers.md)         | Layer architecture, transaction patterns |
| [go_standards.md](./go_standards.md)           | Project structure, naming conventions    |
| [api_design.md](./api_design.md)               | HTTP controller patterns                 |
| [database_patterns.md](./database_patterns.md) | Repository and entity patterns           |
<!-- /ANCHOR:related-resources -->
