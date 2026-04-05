---
title: Infrastructure Events - Event System Architecture
description: Event system architecture, SQS producers/consumers, message packs, and event routing for asynchronous communication between microservices via AWS SQS.
---

# Infrastructure Events - Event System Architecture

Event system architecture, SQS producers/consumers, message packs, and event routing for asynchronous communication between microservices via AWS SQS.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This document defines the event-driven architecture patterns used in the backend system. The event system enables asynchronous communication between microservices via AWS SQS, with type-safe message definitions and flexible routing.

### Progressive Disclosure

| If you need to... | Read section... |
|-------------------|-----------------|
| Create and emit a new event | 4 (Event Wrappers) |
| Define a new event type | 5 (Message Packs) |
| Consume events from SQS | 6 (SQS Consumer) |
| Configure producer routing | 7 (ProducersPool) |
| Route events to handlers | 8 (MessageRouter) |
| Understand the architecture | 2 (Architecture Overview) |

### File Relationships

```
infrastructure_events.md (this file)
    ├── Uses patterns from → di_configuration.md (bundles, DI)
    ├── Used by → domain_layers.md (business layer event emission)
    └── References → go_standards.md (naming, error handling)
```

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:architecture-overview -->
## 2. ARCHITECTURE OVERVIEW

### How does the event system work?

```
                    PRODUCER SIDE                              CONSUMER SIDE

┌─────────────────────────────────────┐     ┌─────────────────────────────────────┐
│         Business Layer              │     │         Business Layer              │
│  ┌─────────────────────────────┐    │     │    ┌─────────────────────────┐      │
│  │ event.NewWalletSubscription │    │     │    │   Event Handler         │      │
│  │    CreatedEvent(...)        │    │     │    │   func HandleEvent(...) │      │
│  └────────────┬────────────────┘    │     │    └────────────▲────────────┘      │
│               │                     │     │                 │                   │
└───────────────┼─────────────────────┘     └─────────────────┼───────────────────┘
                │                                             │
                ▼                                             │
┌─────────────────────────────────────┐     ┌─────────────────────────────────────┐
│      Event[T] / UntypedEventWrapper │     │         Message Router              │
│  ┌─────────────────────────────┐    │     │    ┌─────────────────────────┐      │
│  │ .Emit(ctx)                  │    │     │    │ router.Handle(ctx, msg) │      │
│  │ .EmitAsync(ctx)             │    │     │    │ Routes by PayloadType   │      │
│  └────────────┬────────────────┘    │     │    └────────────▲────────────┘      │
│               │                     │     │                 │                   │
└───────────────┼─────────────────────┘     └─────────────────┼───────────────────┘
                │                                             │
                ▼                                             │
┌─────────────────────────────────────┐     ┌─────────────────────────────────────┐
│         ProducersPool               │     │         Message Factory             │
│  ┌─────────────────────────────┐    │     │    ┌─────────────────────────┐      │
│  │ Routes by PayloadType to    │    │     │    │ Deserializes by         │      │
│  │ configured producers        │    │     │    │ payload_type            │      │
│  └────────────┬────────────────┘    │     │    └────────────▲────────────┘      │
│               │                     │     │                 │                   │
└───────────────┼─────────────────────┘     └─────────────────┼───────────────────┘
                │                                             │
                ▼                                             │
┌─────────────────────────────────────┐     ┌─────────────────────────────────────┐
│         SQS Producer                │     │         SQS Consumer                │
│  ┌─────────────────────────────┐    │     │    ┌─────────────────────────┐      │
│  │ Serializes & sends to SQS   │────┼────►│    │ Polls & deserializes    │      │
│  │ with message attributes     │    │     │    │ from SQS queue          │      │
│  └─────────────────────────────┘    │     │    └─────────────────────────┘      │
│                                     │     │                                     │
└─────────────────────────────────────┘     └─────────────────────────────────────┘
                          │                             ▲
                          └─────────────────────────────┘
                                    AWS SQS Queue
```

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `Event[T]` | `infra/events/event_wrapper.go` | Type-safe event wrapper with generic payload |
| `UntypedEventWrapper` | `infra/events/untyped_event_wrapper.go` | Untyped event wrapper for runtime handling |
| `ProducersPool` | `infra/events/producers_pool.go` | Routes events to configured producers by type |
| `Producer` | `infra/events/sqs/producer.go` | SQS message producer |
| `Consumer` | `infra/events/sqs/consumer.go` | SQS message consumer |
| `Factory` | `infra/message_factory/factory.go` | Deserializes messages by payload_type |
| `MessagePacks` | `infra/message_packs/` | Event type definitions grouped by domain |
| `Router` | `infra/message_router/router.go` | Routes messages to handlers by type |
| `Forwarder` | `infra/events/forwarder.go` | Simple rule-based event forwarding |

---

<!-- /ANCHOR:architecture-overview -->
<!-- ANCHOR:core-interfaces -->
## 3. CORE INTERFACES

### What interfaces define the event system?

```go
// infra/events/interfaces.go

// Emitter uses the Producer to emit itself using producer
type Emitter interface {
    WithProducer(p ...Producer) Emitter
    Emit(ctx context.Context, useDefault ...bool) error
    EmitAsync(ctx context.Context, useDefault ...bool) error
}

// Producer used by Emitter.Emit to produce itself
type Producer interface {
    ID() string
    ProduceBatch(ctx context.Context, wrapper ...UntypedEventWrapper) error
    Produce(ctx context.Context, wrapper UntypedEventWrapper) error
}

// Consumer must be implemented by consumers of Events
type Consumer interface {
    ConsumeBatch(ctx context.Context, handler func(context.Context, UntypedEventWrapper) error) error
    Consume(ctx context.Context, handler func(UntypedEventWrapper) error) error
}
```

---

<!-- /ANCHOR:core-interfaces -->
<!-- ANCHOR:event-wrappers -->
## 4. EVENT WRAPPERS

### How do I create and emit an event?

Use `events.NewEventWrapper[T]` or domain-specific constructors:

```go
// Using generic event wrapper
import "github.com/example/backend/infra/events"

event := events.NewEventWrapper(
    uid.NewUUID(),                              // Event ID
    "WalletSubscriptionCreatedEvent",           // PayloadType
    WalletSubscriptionCreatedEvent{             // Typed payload
        WalletSubscriptionID: subscription.ID,
        PaymentProvider:      payments.StripePaymentProviderEnum,
    },
)

// Emit synchronously
err := event.Emit(ctx)

// Emit asynchronously (fire and forget)
err := event.EmitAsync(ctx)
```

### How do I use domain-specific event constructors?

Each event type has a constructor in `infra/message_packs/event/`:

```go
// infra/message_packs/event/wallet_subscription_created_event.go
import "github.com/example/backend/infra/message_packs/event"

// Using domain constructor (preferred)
evt := event.NewWalletSubscriptionCreatedEvent(
    uid.NewUUID(),
    walletSubscription,
    payments.StripePaymentProviderEnum,
    providerSubscriptionID,
)

err := evt.Emit(ctx)
```

### How do I specify which producer to use?

```go
// Use specific producer
event.WithProducer(sqsProducer).Emit(ctx)

// Use default producer if no specific one set
event.Emit(ctx, true)  // useDefault = true
```

### How do I add metadata to events?

```go
event.SetHeader("key", "value").
    WithTo("recipient-id-1", "recipient-id-2").
    WithSender(senderID).
    Emit(ctx)
```

### How do I delay event consumption?

```go
// Delay message visibility for 10 minutes
event.WithDelayedConsumption(10 * time.Minute).Emit(ctx)

// Limitations:
// - Standard queues: Maximum 15 minutes (AWS DelaySeconds limit)
// - FIFO queues: Maximum 12 hours (ChangeMessageVisibility limit)
```

---

<!-- /ANCHOR:event-wrappers -->
<!-- ANCHOR:message-packs -->
## 5. MESSAGE PACKS

### How are event types defined?

Events are defined in `infra/message_packs/event/` and registered in packs:

```go
// infra/message_packs/event/wallet_subscription_created_event.go
package event

import (
    "github.com/example/backend/infra/events"
    "github.com/example/backend/pkg/types"
)

// PayloadType constant for runtime lookup
var WalletSubscriptionCreatedEventType = types.PayloadTypeOf[WalletSubscriptionCreatedEvent]()

// Event payload struct
type WalletSubscriptionCreatedEvent struct {
    // Documentation via struct tags
    byte `event_description:"Trigger notification about a wallet subscription creation"`

    WalletSubscriptionID   uid.UID                      `json:"wallet_subscription_id" validate:"required" field_description:"Wallet's SubscriptionID"`
    ProviderSubscriptionID string                       `json:"provider_subscription_id" validate:"required"`
    PaymentProvider        payments.PaymentProviderEnum `json:"payment_provider" validate:"required"`
    WalletSubscription     payments.WalletSubscription  `json:"wallet_subscription" validate:"required"`
}

// Constructor returns typed Event[T]
func NewWalletSubscriptionCreatedEvent(
    id string,
    walletSubscription payments.WalletSubscription,
    paymentProvider payments.PaymentProviderEnum,
    providerSubscriptionID string,
) events.Event[WalletSubscriptionCreatedEvent] {
    return events.NewEventWrapper(
        id,
        WalletSubscriptionCreatedEventType.String(),
        WalletSubscriptionCreatedEvent{
            WalletSubscriptionID:   walletSubscription.ID,
            PaymentProvider:        paymentProvider,
            ProviderSubscriptionID: providerSubscriptionID,
            WalletSubscription:     walletSubscription,
        })
}
```

### How do I register events in a message pack?

```go
// infra/message_packs/payments_message_pack.go
package message_packs

import (
    "github.com/example/backend/infra/message_factory"
    "github.com/example/backend/infra/message_packs/event"
)

var PaymentsMessagePack = message_factory.NewPack(
    "PaymentsMessagePack",
    message_factory.PackEntry[event.WalletSubscriptionCreatedEvent](),
    message_factory.PackEntry[event.WalletSubscriptionUpdatedEvent](),
    message_factory.PackEntry[event.WalletSubscriptionUpgradedEvent](),
    message_factory.PackEntry[event.WalletSubscriptionCancelledEvent](),
    // ... more event types
)
```

### How do I register all packs?

```go
// infra/message_packs/packs.go
package message_packs

var Packs = []message_factory.Pack{
    UserMessagePack,
    VendorsMessagePack,
    CreatorsMessagePack,
    OrganizationsMessagePack,
    OrderMessagePack,
    OrderApplicationMessagePack,
    ReportsAndReviewsMessagePack,
    AIMessagePack,
    ChatMessagePack,
    NotificationMessagePack,
    PaymentsMessagePack,
}

// Called at microservice startup
func RegisterAllPacks(factories ...*message_factory.Factory) {
    once.Do(func() {
        var factory = message_factory.Singleton
        if len(factories) > 0 {
            factory = factories[0]
        }
        RegisterPacks(factory, Packs...)
    })
}
```

### Available Message Packs

| Pack | Domain | Example Events |
|------|--------|----------------|
| `UserMessagePack` | User | PasswordRecoveryOTPEmail, PasswordRecoveryOTPSMS |
| `VendorsMessagePack` | Vendors | VendorRegisteredEvent, VendorOTPVerifiedEvent |
| `CreatorsMessagePack` | Creators | CreatorRegisteredEvent, CreatorActivatedEvent |
| `OrganizationsMessagePack` | Organizations | OrganizationCreatedEvent, OrganizationUpdatedEvent |
| `OrderMessagePack` | Orders | OrderCreatedEvent, OrderUpdatedEvent |
| `OrderApplicationMessagePack` | Applications | ApplicationAcceptedEvent, ApplicationRejectedEvent |
| `ChatMessagePack` | Chat | ChatMessageEvent, ChatRoomEvent |
| `NotificationMessagePack` | Notifications | GenericPushNotificationEvent |
| `PaymentsMessagePack` | Payments | WalletSubscriptionCreatedEvent |
| `AIMessagePack` | AI | AI integration events |
| `ReportsAndReviewsMessagePack` | Reports | ApplicationReportCreatedEvent |

---

<!-- /ANCHOR:message-packs -->
<!-- ANCHOR:sqs-consumer -->
## 6. SQS CONSUMER

### How do I configure an SQS consumer?

```go
// bundles/sqs_consumer_bundle.go

type SQSConsumerBundleConfiguration struct {
    SQSConsumerClientConfiguration sqs.ClientConfiguration   `json:"sqs_consumer_client"`
    ConsumerConfiguration          sqs.ConsumerConfiguration `json:"sqs_consumer_configuration"`
}

// Consumer configuration options
type ConsumerConfiguration struct {
    QueueURL                        string `json:"queue_url"`
    MaxNumberOfMessages             int32  `json:"max_number_of_messages"`     // 1-10
    WaitTimeSeconds                 int32  `json:"wait_time_seconds"`          // Long polling
    RequeueBackoffTimeSeconds       int32  `json:"requeue_backoff_time_seconds"`
    RequeueMaxRetries               int    `json:"requeue_max_retries"`
    WithoutScope                    bool   `json:"without_scope,omitempty"`    // Skip scope validation
    ProcessDelayedConsumptionHeader bool   `json:"process_delayed_consumption_header,omitempty"`
}
```

### How does the consumer process messages?

```go
// infra/events/sqs/consumer.go

// ConsumeBatch is a blocking call
func (s *Consumer) ConsumeBatch(ctx context.Context, handler func(context.Context, events.UntypedEventWrapper) error) error {
    for {
        select {
        case <-ctx.Done():
            return ctx.Err()
        default:
            // Poll SQS
            output, err := s.client.ReceiveMessage(ctx, &sqs.ReceiveMessageInput{
                QueueUrl:            aws.String(s.cfg.QueueURL),
                MaxNumberOfMessages: s.cfg.MaxNumberOfMessages,
                WaitTimeSeconds:     s.cfg.WaitTimeSeconds,
                // ...
            })

            for _, message := range output.Messages {
                // Deserialize using MessageFactory
                wrapper, err := message_factory.Singleton.CreateFromString(ctx, *message.Body)

                // Call handler
                err = handler(requestCtx, events.NewUntypedEventWrapperFromMessage(wrapper))

                // Delete on success, requeue on failure
                if err == nil {
                    s.Delete(ctx, &receiptHandle)
                } else {
                    s.requeueOrDelete(ctx, log, err, message)
                }
            }
        }
    }
}
```

### How does requeue/delete logic work?

```go
func (s *Consumer) requeueOrDelete(ctx context.Context, log logger.Interface, err error, message types.Message) {
    // Check for non-retriable error codes
    _, has := errors.Has(err, errors.ProcessFailedDoNotRequeueErrorCode)
    _, haz := errors.Has(err, errors.NoRetryErrorCode)

    receiveCount := message.Attributes["ApproximateReceiveCount"]

    // Requeue if retriable and under max retries
    if (!haz || !has) && receiveCount <= s.cfg.RequeueMaxRetries {
        s.Requeue(ctx, message.ReceiptHandle)
        return
    }

    // Delete if non-retriable or max retries exceeded
    s.Delete(ctx, message.ReceiptHandle)
}
```

---

<!-- /ANCHOR:sqs-consumer -->
<!-- ANCHOR:producers-pool -->
## 7. PRODUCERS POOL

### How do I configure a ProducersPool?

```go
// JSON configuration
{
    "sqs_producer_pool_bundle": {
        "sqs_producer_client": {
            "region": "eu-central-1",
            "endpoint_url": "",
            "access_key_id": "${env.AWS_ACCESS_KEY_ID}",
            "secret_access_key": "${env.AWS_SECRET_ACCESS_KEY}"
        },
        "sqs_producer_configurations": [
            {
                "producer_id": "notifications_producer",
                "queue_url": "https://sqs.eu-central-1.amazonaws.com/xxx/notifications-queue",
                "is_fifo": false
            },
            {
                "producer_id": "payments_producer",
                "queue_url": "https://sqs.eu-central-1.amazonaws.com/xxx/payments-queue.fifo",
                "is_fifo": true
            }
        ],
        "producer_pool": {
            "producer_pool_id": "main-producer-pool",
            "supported_payload_types": {
                "notifications_producer": ["GenericPushNotificationEvent", "CampaignPushNotificationEvent"],
                "payments_producer": ["*"]  // Wildcard: receives all event types
            },
            "supported_packs": {
                "payments_producer": ["PaymentsMessagePack"]
            }
        }
    }
}
```

### How does payload type routing work?

```go
// infra/events/producers_pool.go

const EventTypesWildcard = "*"  // Always triggered
const EventTypesFallback = "?"  // Triggered when no other rule matches

func (p *ProducersPool) Produce(ctx context.Context, wrapper UntypedEventWrapper) error {
    // Find producers for this payload type
    producers, ok := p.producersMapped[wrapper.PayloadType]

    // Add wildcard producers
    producers = append(producers, p.producersMapped[EventTypesWildcard]...)

    // Produce to all matching producers
    for _, producer := range producers {
        err := producer.Produce(ctx, wrapper)
        // ...
    }
}
```

### ProducersPool Configuration Options

| Option | Description |
|--------|-------------|
| `supported_payload_types` | Map producer ID to specific event type names |
| `supported_packs` | Map producer ID to MessagePack names (all events in pack) |
| `*` (wildcard) | Producer receives ALL event types |
| `?` (fallback) | Producer receives events with no matching rule |

---

<!-- /ANCHOR:producers-pool -->
<!-- ANCHOR:message-router -->
## 8. MESSAGE ROUTER

### How do I route messages to handlers?

```go
// infra/message_router/router.go

// Register handler for specific event type
router.Register("WalletSubscriptionCreatedEvent", func(rc *RouterContext) {
    // Handle the event
    msg := rc.Request
    // Process...
})

// Register fallback handler for unknown types
router.Register(types.PayloadTypeFallback, func(rc *RouterContext) {
    // Handle unknown event types
})

// Handle a message (blocking)
err := router.Handle(ctx, untypedMessage)
```

### How do I use the router with SQS consumer?

```go
// In microservice startup
func (ms *PaymentsMicroservice) Run(ctx context.Context) error {
    // Register handlers
    ms.router.Register("WalletSubscriptionCreatedEvent", ms.handleWalletSubscriptionCreated)
    ms.router.Register("WalletSubscriptionUpdatedEvent", ms.handleWalletSubscriptionUpdated)

    // Start consuming (blocking)
    return ms.sqsConsumer.ConsumeBatch(ctx, func(ctx context.Context, wrapper events.UntypedEventWrapper) error {
        return ms.router.Handle(ctx, wrapper.UntypedMessage)
    })
}
```

---

<!-- /ANCHOR:message-router -->
<!-- ANCHOR:forwarder -->
## 9. FORWARDER

### How do I use the Forwarder for simple routing?

```go
// infra/events/forwarder.go

forwarder, _ := events.NewForwarder(ctx, events.ForwarderConfiguration{})

// Register rule for specific event type
forwarder.RegisterRule(ctx, "WalletSubscriptionCreatedEvent", func(ctx context.Context, wrappers ...UntypedEventWrapper) error {
    // Forward to specific handler
    return nil
})

// Register wildcard rule (handles all events)
forwarder.RegisterRule(ctx, events.EventTypesWildcard, func(ctx context.Context, wrappers ...UntypedEventWrapper) error {
    // Forward all events
    return nil
})

// Register fallback rule (handles events with no specific rule)
forwarder.RegisterRule(ctx, events.EventTypesFallback, func(ctx context.Context, wrappers ...UntypedEventWrapper) error {
    // Handle fallback
    return nil
})

// Forward events
err := forwarder.Forward(ctx, event1, event2)  // All must have same PayloadType
```

---

<!-- /ANCHOR:forwarder -->
<!-- ANCHOR:bundles -->
## 10. BUNDLES

### SQS Consumer Bundle

```go
// bundles/sqs_consumer_bundle.go

type SQSConsumerBundle struct {
    SQSClient     *sqs.SQSClient
    SQSConsumer   *sqs.Consumer
    MessageRouter *message_router.Router
}

// Registration
func init() {
    di.Register(RegistrySQSConsumerBundle)
}
```

### SQS Producer Pool Bundle

```go
// bundles/sqs_producer_pool.go

type SQSProducerPoolBundle struct {
    SQSClient    *sqs.SQSClient
    ProducerPool *events.ProducersPool
}

// Registration
func init() {
    di.Register(RegistrySQSProducerPoolBundle)
}
```

---

<!-- /ANCHOR:bundles -->
<!-- ANCHOR:common-patterns -->
## 11. COMMON PATTERNS

### Emitting Events from Business Layer

```go
// internal/domain/payments/payments_business_layer/payments_business_layer.go

func (b *PaymentsBusinessLayer) HandleSubscriptionCreated(ctx context.Context, subscription payments.WalletSubscription) error {
    // Business logic...

    // Emit event
    evt := event.NewWalletSubscriptionCreatedEvent(
        uid.NewUUID(),
        subscription,
        payments.StripePaymentProviderEnum,
        providerSubscriptionID,
    )

    return evt.Emit(ctx)
}
```

### Consuming Events in Handler

```go
func (h *PaymentEventsHandler) HandleWalletSubscriptionCreated(rc *message_router.RouterContext) {
    log := rc.Logger

    // Get typed payload
    msg, err := message_wrapper.MessageOf[event.WalletSubscriptionCreatedEvent](rc.Ctx, rc.Request)
    if err != nil {
        rc.Error = errors.NewWithError(err, "failed to parse message")
        return
    }

    payload := msg.Payload
    log.With("wallet_subscription_id", payload.WalletSubscriptionID).Log("Processing subscription created")

    // Business logic...
}
```

### Default Emitter Setup

```go
// Set default emitter at microservice startup
func (ms *NotificationsMicroservice) Init(ctx context.Context) error {
    // Register producer pool as default emitter
    events.SetDefaultEmitter(ms.producerPool)

    // Now events use default emitter automatically
    // event.Emit(ctx) will use producerPool
}
```

---

<!-- /ANCHOR:common-patterns -->
<!-- ANCHOR:rules -->
## 12. RULES

### ✅ ALWAYS

- Use domain-specific event constructors (e.g., `event.NewWalletSubscriptionCreatedEvent`)
- Register all event types in MessagePacks before consuming
- Include `payload_type` in JSON serialization
- Handle consumer errors appropriately (requeue vs delete)
- Use `uid.NewUUID()` for event IDs
- Set meaningful `event_description` and `field_description` tags

### ❌ NEVER

- Emit events without a producer configured
- Mix event types in a single `Forward()` call
- Ignore consumer errors silently
- Hard-code queue URLs (use configuration)
- Skip message pack registration

### ⚠️ ESCALATE IF

- Events are lost (not appearing in consumer)
- Requeue loops occur (same message processed repeatedly)
- Deserialization fails for known event types
- Producer pool routing doesn't match expected behavior

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 13. RELATED RESOURCES

| Topic | Document | Section |
|-------|----------|---------|
| DI bundles | [di_configuration.md](./di_configuration.md) | Bundles pattern |
| Business layer event emission | [domain_layers.md](./domain_layers.md) | Business layer |
| Error handling | [go_standards.md](./go_standards.md) | Error handling |
| Testing events | [testing_strategy.md](./testing_strategy.md) | E2E mock patterns |
<!-- /ANCHOR:related-resources -->
