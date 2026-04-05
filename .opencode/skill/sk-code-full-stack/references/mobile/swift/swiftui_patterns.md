---
title: SwiftUI Patterns
description: A comprehensive guide to SwiftUI view composition, state management, navigation patterns, custom modifiers, and modern iOS 17+ SwiftUI features for building production-ready iOS applications.
---

# SwiftUI Patterns

A comprehensive guide to SwiftUI view composition, state management, navigation patterns, custom modifiers, and modern iOS 17+ SwiftUI features for building production-ready iOS applications.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on SwiftUI patterns including:

- **View composition** - Building complex UIs from simple components
- **State management** - @State, @Binding, @Observable, @Environment
- **Navigation** - NavigationStack, NavigationSplitView, sheets, alerts
- **Lists and grids** - Efficient data display patterns
- **Custom modifiers** - Reusable view modifications
- **Environment** - Dependency injection and configuration

### When to Use

- Building SwiftUI views and screens
- Managing view state and data flow
- Implementing navigation patterns
- Creating reusable UI components
- Optimizing SwiftUI performance

### Core Principle

Declarative UI + unidirectional data flow + composition = predictable, maintainable SwiftUI code.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:quick-start-creating-a-swiftui-view -->
## 2. QUICK START: CREATING A SWIFTUI VIEW

### The Checklist

Before creating a view, answer:

1. **What state does this view own?** - Use @State
2. **What state does it receive?** - Use @Binding or let
3. **What environment does it need?** - Use @Environment
4. **Is this reusable?** - Consider extracting to separate file

### Step-by-Step: Create a Basic View

**Step 1: Define the view structure**

```swift
import SwiftUI

struct ProductCardView: View {
    // MARK: - Properties

    let product: Product
    var onAddToCart: (() -> Void)?

    // MARK: - State

    @State private var isExpanded = false

    // MARK: - Body

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            headerSection
            if isExpanded {
                detailsSection
            }
            actionButton
        }
        .padding()
        .background(.background)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .shadow(radius: 2)
    }

    // MARK: - Subviews

    private var headerSection: some View {
        HStack {
            AsyncImage(url: product.imageURL) { image in
                image.resizable().aspectRatio(contentMode: .fill)
            } placeholder: {
                ProgressView()
            }
            .frame(width: 60, height: 60)
            .clipShape(RoundedRectangle(cornerRadius: 8))

            VStack(alignment: .leading) {
                Text(product.name)
                    .font(.headline)
                Text(product.price, format: .currency(code: "USD"))
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            Button {
                withAnimation {
                    isExpanded.toggle()
                }
            } label: {
                Image(systemName: "chevron.down")
                    .rotationEffect(.degrees(isExpanded ? 180 : 0))
            }
        }
    }

    private var detailsSection: some View {
        Text(product.description)
            .font(.body)
            .foregroundStyle(.secondary)
    }

    private var actionButton: some View {
        Button("Add to Cart") {
            onAddToCart?()
        }
        .buttonStyle(.borderedProminent)
        .frame(maxWidth: .infinity)
    }
}
```

**Step 2: Add preview**

```swift
#Preview {
    ProductCardView(
        product: Product(
            name: "Sample Product",
            price: 29.99,
            description: "A great product"
        )
    )
    .padding()
}
```

---

<!-- /ANCHOR:quick-start-creating-a-swiftui-view -->
<!-- ANCHOR:state-management -->
## 3. STATE MANAGEMENT

### State Property Wrappers Overview

| Wrapper | Ownership | Use Case |
|---------|-----------|----------|
| `@State` | View owns | Local view state |
| `@Binding` | Parent owns | Two-way binding from parent |
| `@Observable` | External object | Shared observable state (iOS 17+) |
| `@Bindable` | From @Observable | Bindings to @Observable properties |
| `@Environment` | System/App | Environment values and dependencies |
| `@StateObject` | View owns (legacy) | ObservableObject lifecycle |
| `@ObservedObject` | Parent owns (legacy) | ObservableObject reference |
| `@EnvironmentObject` | App provides (legacy) | Shared ObservableObject |

### @State - Local View State

Use @State for simple, view-local state:

```swift
struct CounterView: View {
    @State private var count = 0
    @State private var isAnimating = false

    var body: some View {
        VStack {
            Text("Count: \(count)")
                .font(.largeTitle)
                .scaleEffect(isAnimating ? 1.2 : 1.0)

            Button("Increment") {
                count += 1
                withAnimation(.spring()) {
                    isAnimating = true
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                    withAnimation {
                        isAnimating = false
                    }
                }
            }
        }
    }
}
```

### @Binding - Two-Way Data Flow

Use @Binding when a child view needs to modify parent state:

```swift
// Parent view
struct ParentView: View {
    @State private var text = ""
    @State private var isValid = false

    var body: some View {
        VStack {
            ValidatedTextField(text: $text, isValid: $isValid)

            Button("Submit") {
                // Submit action
            }
            .disabled(!isValid)
        }
    }
}

// Child view with bindings
struct ValidatedTextField: View {
    @Binding var text: String
    @Binding var isValid: Bool

    var body: some View {
        TextField("Enter text", text: $text)
            .onChange(of: text) { _, newValue in
                isValid = newValue.count >= 3
            }
            .textFieldStyle(.roundedBorder)
            .overlay(alignment: .trailing) {
                if isValid {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundStyle(.green)
                        .padding(.trailing, 8)
                }
            }
    }
}
```

### @Observable - Modern Observable State (iOS 17+)

Use @Observable for view models and shared state:

```swift
import Observation

@Observable
class ShoppingCartViewModel {
    var items: [CartItem] = []
    var isLoading = false
    var errorMessage: String?

    var totalPrice: Decimal {
        items.reduce(0) { $0 + $1.price * Decimal($1.quantity) }
    }

    var itemCount: Int {
        items.reduce(0) { $0 + $1.quantity }
    }

    func addItem(_ product: Product) {
        if let index = items.firstIndex(where: { $0.productID == product.id }) {
            items[index].quantity += 1
        } else {
            items.append(CartItem(product: product))
        }
    }

    func removeItem(at offsets: IndexSet) {
        items.remove(atOffsets: offsets)
    }

    func checkout() async {
        isLoading = true
        defer { isLoading = false }

        do {
            // Perform checkout
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

// Using @Observable in views
struct CartView: View {
    var viewModel: ShoppingCartViewModel

    var body: some View {
        List {
            ForEach(viewModel.items) { item in
                CartItemRow(item: item)
            }
            .onDelete { offsets in
                viewModel.removeItem(at: offsets)
            }
        }
        .overlay {
            if viewModel.isLoading {
                ProgressView()
            }
        }
    }
}
```

### @Bindable - Bindings to Observable Properties

Use @Bindable to create bindings from @Observable objects:

```swift
@Observable
class UserProfile {
    var name: String = ""
    var email: String = ""
    var notifications: Bool = true
}

struct ProfileEditorView: View {
    @Bindable var profile: UserProfile

    var body: some View {
        Form {
            TextField("Name", text: $profile.name)
            TextField("Email", text: $profile.email)
            Toggle("Notifications", isOn: $profile.notifications)
        }
    }
}

// Parent view
struct SettingsView: View {
    @State private var profile = UserProfile()

    var body: some View {
        ProfileEditorView(profile: profile)
    }
}
```

### @Environment - System and Custom Values

```swift
// Using system environment values
struct ThemeAwareView: View {
    @Environment(\.colorScheme) private var colorScheme
    @Environment(\.dynamicTypeSize) private var dynamicTypeSize
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack {
            Text("Theme: \(colorScheme == .dark ? "Dark" : "Light")")

            Button("Dismiss") {
                dismiss()
            }
        }
    }
}

// Custom environment value
struct UserKey: EnvironmentKey {
    static let defaultValue: User? = nil
}

extension EnvironmentValues {
    var currentUser: User? {
        get { self[UserKey.self] }
        set { self[UserKey.self] = newValue }
    }
}

// Setting custom environment value
struct ContentView: View {
    @State private var user: User?

    var body: some View {
        ChildView()
            .environment(\.currentUser, user)
    }
}

// Reading custom environment value
struct ProfileView: View {
    @Environment(\.currentUser) private var user

    var body: some View {
        if let user {
            Text("Welcome, \(user.name)")
        }
    }
}
```

### Legacy State Management (Pre-iOS 17)

For projects targeting iOS 16 or earlier:

```swift
// ObservableObject pattern (legacy)
class UserViewModel: ObservableObject {
    @Published var name: String = ""
    @Published var isLoading = false
}

// @StateObject - view creates and owns the object
struct ParentView: View {
    @StateObject private var viewModel = UserViewModel()

    var body: some View {
        ChildView(viewModel: viewModel)
    }
}

// @ObservedObject - view receives but doesn't own the object
struct ChildView: View {
    @ObservedObject var viewModel: UserViewModel

    var body: some View {
        TextField("Name", text: $viewModel.name)
    }
}

// @EnvironmentObject - shared across view hierarchy
@main
struct MyApp: App {
    @StateObject private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
        }
    }
}
```

---

<!-- /ANCHOR:state-management -->
<!-- ANCHOR:navigation-patterns -->
## 4. NAVIGATION PATTERNS

### NavigationStack (iOS 16+)

```swift
struct ContentView: View {
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            List {
                NavigationLink("Products", value: Route.products)
                NavigationLink("Profile", value: Route.profile)
                NavigationLink("Settings", value: Route.settings)
            }
            .navigationTitle("Home")
            .navigationDestination(for: Route.self) { route in
                switch route {
                case .products:
                    ProductsView(path: $path)
                case .profile:
                    ProfileView()
                case .settings:
                    SettingsView()
                case .productDetail(let id):
                    ProductDetailView(productID: id)
                }
            }
        }
    }
}

// Route enum for type-safe navigation
enum Route: Hashable {
    case products
    case profile
    case settings
    case productDetail(id: String)
}

// Programmatic navigation
struct ProductsView: View {
    @Binding var path: NavigationPath
    let products: [Product] = []

    var body: some View {
        List(products) { product in
            Button(product.name) {
                path.append(Route.productDetail(id: product.id))
            }
        }
        .navigationTitle("Products")
    }
}
```

### NavigationSplitView (iPad/Mac)

```swift
struct SplitContentView: View {
    @State private var selectedCategory: Category?
    @State private var selectedProduct: Product?

    var body: some View {
        NavigationSplitView {
            // Sidebar
            List(Category.allCases, selection: $selectedCategory) { category in
                NavigationLink(value: category) {
                    Label(category.name, systemImage: category.icon)
                }
            }
            .navigationTitle("Categories")
        } content: {
            // Content (middle column)
            if let category = selectedCategory {
                ProductListView(
                    category: category,
                    selection: $selectedProduct
                )
            } else {
                ContentUnavailableView(
                    "Select a Category",
                    systemImage: "folder"
                )
            }
        } detail: {
            // Detail (right column)
            if let product = selectedProduct {
                ProductDetailView(product: product)
            } else {
                ContentUnavailableView(
                    "Select a Product",
                    systemImage: "shippingbox"
                )
            }
        }
        .navigationSplitViewStyle(.balanced)
    }
}
```

### Sheet Presentation

```swift
struct SheetExampleView: View {
    @State private var showingSheet = false
    @State private var showingFullScreen = false
    @State private var selectedItem: Item?

    var body: some View {
        VStack(spacing: 20) {
            // Basic sheet
            Button("Show Sheet") {
                showingSheet = true
            }
            .sheet(isPresented: $showingSheet) {
                SheetContentView()
            }

            // Full screen cover
            Button("Show Full Screen") {
                showingFullScreen = true
            }
            .fullScreenCover(isPresented: $showingFullScreen) {
                FullScreenView()
            }

            // Item-based sheet
            Button("Show Item Sheet") {
                selectedItem = Item(name: "Example")
            }
            .sheet(item: $selectedItem) { item in
                ItemDetailSheet(item: item)
            }
        }
    }
}

// Sheet content with dismiss
struct SheetContentView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack {
                Text("Sheet Content")
            }
            .navigationTitle("Sheet")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
    }
}
```

### Alerts and Confirmation Dialogs

```swift
struct AlertExampleView: View {
    @State private var showingAlert = false
    @State private var showingConfirmation = false
    @State private var showingErrorAlert = false
    @State private var error: AppError?

    var body: some View {
        VStack(spacing: 20) {
            // Simple alert
            Button("Show Alert") {
                showingAlert = true
            }
            .alert("Title", isPresented: $showingAlert) {
                Button("OK", role: .cancel) { }
            } message: {
                Text("This is an alert message.")
            }

            // Confirmation dialog
            Button("Delete Item") {
                showingConfirmation = true
            }
            .confirmationDialog(
                "Are you sure?",
                isPresented: $showingConfirmation,
                titleVisibility: .visible
            ) {
                Button("Delete", role: .destructive) {
                    // Delete action
                }
                Button("Cancel", role: .cancel) { }
            } message: {
                Text("This action cannot be undone.")
            }

            // Error alert with optional
            Button("Trigger Error") {
                error = AppError.networkError
            }
            .alert(
                "Error",
                isPresented: $showingErrorAlert,
                presenting: error
            ) { _ in
                Button("Retry") {
                    // Retry action
                }
                Button("Cancel", role: .cancel) { }
            } message: { error in
                Text(error.localizedDescription)
            }
        }
    }
}
```

---

<!-- /ANCHOR:navigation-patterns -->
<!-- ANCHOR:list-and-data-display-patterns -->
## 5. LIST AND DATA DISPLAY PATTERNS

### Basic List Patterns

```swift
struct ProductListView: View {
    let products: [Product]
    @State private var searchText = ""

    var filteredProducts: [Product] {
        if searchText.isEmpty {
            return products
        }
        return products.filter {
            $0.name.localizedCaseInsensitiveContains(searchText)
        }
    }

    var body: some View {
        List {
            ForEach(filteredProducts) { product in
                ProductRow(product: product)
            }
        }
        .searchable(text: $searchText, prompt: "Search products")
        .listStyle(.plain)
    }
}

struct ProductRow: View {
    let product: Product

    var body: some View {
        HStack {
            AsyncImage(url: product.imageURL) { image in
                image.resizable().aspectRatio(contentMode: .fill)
            } placeholder: {
                Color.gray.opacity(0.3)
            }
            .frame(width: 50, height: 50)
            .clipShape(RoundedRectangle(cornerRadius: 8))

            VStack(alignment: .leading) {
                Text(product.name)
                    .font(.headline)
                Text(product.price, format: .currency(code: "USD"))
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            if product.isFavorite {
                Image(systemName: "heart.fill")
                    .foregroundStyle(.red)
            }
        }
        .contentShape(Rectangle())
    }
}
```

### Sectioned Lists

```swift
struct GroupedProductListView: View {
    let productsByCategory: [Category: [Product]]

    var body: some View {
        List {
            ForEach(Array(productsByCategory.keys.sorted()), id: \.self) { category in
                Section {
                    ForEach(productsByCategory[category] ?? []) { product in
                        ProductRow(product: product)
                    }
                } header: {
                    Text(category.name)
                } footer: {
                    Text("\(productsByCategory[category]?.count ?? 0) items")
                }
            }
        }
        .listStyle(.insetGrouped)
    }
}
```

### Swipe Actions and Edit Mode

```swift
struct EditableListView: View {
    @State private var items: [Item] = []
    @State private var editMode: EditMode = .inactive

    var body: some View {
        List {
            ForEach(items) { item in
                ItemRow(item: item)
                    .swipeActions(edge: .trailing, allowsFullSwipe: true) {
                        Button(role: .destructive) {
                            deleteItem(item)
                        } label: {
                            Label("Delete", systemImage: "trash")
                        }

                        Button {
                            archiveItem(item)
                        } label: {
                            Label("Archive", systemImage: "archivebox")
                        }
                        .tint(.orange)
                    }
                    .swipeActions(edge: .leading) {
                        Button {
                            toggleFavorite(item)
                        } label: {
                            Label(
                                item.isFavorite ? "Unfavorite" : "Favorite",
                                systemImage: item.isFavorite ? "heart.slash" : "heart"
                            )
                        }
                        .tint(.pink)
                    }
            }
            .onDelete { offsets in
                items.remove(atOffsets: offsets)
            }
            .onMove { source, destination in
                items.move(fromOffsets: source, toOffset: destination)
            }
        }
        .environment(\.editMode, $editMode)
        .toolbar {
            EditButton()
        }
    }

    private func deleteItem(_ item: Item) {
        items.removeAll { $0.id == item.id }
    }

    private func archiveItem(_ item: Item) {
        // Archive logic
    }

    private func toggleFavorite(_ item: Item) {
        if let index = items.firstIndex(where: { $0.id == item.id }) {
            items[index].isFavorite.toggle()
        }
    }
}
```

### LazyVStack and LazyHStack

```swift
struct LazyListView: View {
    let items: [Item]

    var body: some View {
        ScrollView {
            LazyVStack(spacing: 12, pinnedViews: [.sectionHeaders]) {
                Section {
                    ForEach(items) { item in
                        ItemCard(item: item)
                            .padding(.horizontal)
                    }
                } header: {
                    Text("All Items")
                        .font(.headline)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding()
                        .background(.bar)
                }
            }
        }
    }
}

// Horizontal lazy stack
struct HorizontalScrollView: View {
    let categories: [Category]

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            LazyHStack(spacing: 16) {
                ForEach(categories) { category in
                    CategoryCard(category: category)
                }
            }
            .padding(.horizontal)
        }
    }
}
```

### Grid Layouts

```swift
struct ProductGridView: View {
    let products: [Product]

    let columns = [
        GridItem(.adaptive(minimum: 150, maximum: 200), spacing: 16)
    ]

    var body: some View {
        ScrollView {
            LazyVGrid(columns: columns, spacing: 16) {
                ForEach(products) { product in
                    ProductGridItem(product: product)
                }
            }
            .padding()
        }
    }
}

struct ProductGridItem: View {
    let product: Product

    var body: some View {
        VStack(alignment: .leading) {
            AsyncImage(url: product.imageURL) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Color.gray.opacity(0.3)
            }
            .frame(height: 150)
            .clipShape(RoundedRectangle(cornerRadius: 12))

            Text(product.name)
                .font(.headline)
                .lineLimit(2)

            Text(product.price, format: .currency(code: "USD"))
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
    }
}
```

---

<!-- /ANCHOR:list-and-data-display-patterns -->
<!-- ANCHOR:custom-view-modifiers -->
## 6. CUSTOM VIEW MODIFIERS

### Creating Custom Modifiers

```swift
// Basic custom modifier
struct CardModifier: ViewModifier {
    let cornerRadius: CGFloat
    let shadowRadius: CGFloat

    init(cornerRadius: CGFloat = 12, shadowRadius: CGFloat = 4) {
        self.cornerRadius = cornerRadius
        self.shadowRadius = shadowRadius
    }

    func body(content: Content) -> some View {
        content
            .background(.background)
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
            .shadow(radius: shadowRadius)
    }
}

// View extension for cleaner API
extension View {
    func cardStyle(
        cornerRadius: CGFloat = 12,
        shadowRadius: CGFloat = 4
    ) -> some View {
        modifier(CardModifier(
            cornerRadius: cornerRadius,
            shadowRadius: shadowRadius
        ))
    }
}

// Usage
struct ContentView: View {
    var body: some View {
        VStack {
            Text("Card Content")
        }
        .padding()
        .cardStyle()
    }
}
```

### Conditional Modifiers

```swift
extension View {
    @ViewBuilder
    func `if`<Content: View>(
        _ condition: Bool,
        transform: (Self) -> Content
    ) -> some View {
        if condition {
            transform(self)
        } else {
            self
        }
    }

    @ViewBuilder
    func ifLet<T, Content: View>(
        _ value: T?,
        transform: (Self, T) -> Content
    ) -> some View {
        if let value {
            transform(self, value)
        } else {
            self
        }
    }
}

// Usage
struct ExampleView: View {
    let isHighlighted: Bool
    let badge: String?

    var body: some View {
        Text("Hello")
            .if(isHighlighted) { view in
                view.foregroundStyle(.red)
            }
            .ifLet(badge) { view, badge in
                view.badge(badge)
            }
    }
}
```

### Loading State Modifier

```swift
struct LoadingModifier: ViewModifier {
    let isLoading: Bool

    func body(content: Content) -> some View {
        ZStack {
            content
                .disabled(isLoading)
                .blur(radius: isLoading ? 2 : 0)

            if isLoading {
                ProgressView()
                    .scaleEffect(1.5)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(.ultraThinMaterial)
            }
        }
    }
}

extension View {
    func loading(_ isLoading: Bool) -> some View {
        modifier(LoadingModifier(isLoading: isLoading))
    }
}
```

### Shake Effect Modifier

```swift
struct ShakeEffect: GeometryEffect {
    var amount: CGFloat = 10
    var shakesPerUnit = 3
    var animatableData: CGFloat

    func effectValue(size: CGSize) -> ProjectionTransform {
        ProjectionTransform(CGAffineTransform(translationX:
            amount * sin(animatableData * .pi * CGFloat(shakesPerUnit)),
            y: 0))
    }
}

extension View {
    func shake(trigger: Bool) -> some View {
        modifier(ShakeModifier(trigger: trigger))
    }
}

struct ShakeModifier: ViewModifier {
    let trigger: Bool
    @State private var shakeAmount: CGFloat = 0

    func body(content: Content) -> some View {
        content
            .modifier(ShakeEffect(animatableData: shakeAmount))
            .onChange(of: trigger) { _, _ in
                withAnimation(.default) {
                    shakeAmount = 1
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                    shakeAmount = 0
                }
            }
    }
}
```

---

<!-- /ANCHOR:custom-view-modifiers -->
<!-- ANCHOR:environment-and-preferences -->
## 7. ENVIRONMENT AND PREFERENCES

### Custom Environment Values

```swift
// Define the environment key
private struct ThemeKey: EnvironmentKey {
    static let defaultValue = AppTheme.default
}

extension EnvironmentValues {
    var theme: AppTheme {
        get { self[ThemeKey.self] }
        set { self[ThemeKey.self] = newValue }
    }
}

// Theme configuration
struct AppTheme {
    let primaryColor: Color
    let secondaryColor: Color
    let cornerRadius: CGFloat

    static let `default` = AppTheme(
        primaryColor: .blue,
        secondaryColor: .gray,
        cornerRadius: 12
    )

    static let dark = AppTheme(
        primaryColor: .purple,
        secondaryColor: .gray,
        cornerRadius: 16
    )
}

// Using the theme
struct ThemedButton: View {
    @Environment(\.theme) private var theme

    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .padding()
                .background(theme.primaryColor)
                .foregroundStyle(.white)
                .clipShape(RoundedRectangle(cornerRadius: theme.cornerRadius))
        }
    }
}

// Setting the theme
struct ContentView: View {
    var body: some View {
        VStack {
            ThemedButton(title: "Action") { }
        }
        .environment(\.theme, .dark)
    }
}
```

### Preference Keys

Use preferences to pass data UP the view hierarchy:

```swift
// Define preference key
struct ScrollOffsetPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = 0

    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}

// Reading scroll offset
struct ScrollViewWithOffset: View {
    @State private var scrollOffset: CGFloat = 0

    var body: some View {
        ScrollView {
            VStack {
                ForEach(0..<50) { index in
                    Text("Item \(index)")
                        .frame(height: 50)
                }
            }
            .background(GeometryReader { geometry in
                Color.clear.preference(
                    key: ScrollOffsetPreferenceKey.self,
                    value: geometry.frame(in: .named("scroll")).minY
                )
            })
        }
        .coordinateSpace(name: "scroll")
        .onPreferenceChange(ScrollOffsetPreferenceKey.self) { value in
            scrollOffset = value
        }
        .overlay(alignment: .top) {
            Text("Offset: \(scrollOffset, specifier: "%.0f")")
                .padding()
                .background(.bar)
        }
    }
}
```

### Anchor Preferences

```swift
struct BoundsPreferenceKey: PreferenceKey {
    static var defaultValue: [String: Anchor<CGRect>] = [:]

    static func reduce(
        value: inout [String: Anchor<CGRect>],
        nextValue: () -> [String: Anchor<CGRect>]
    ) {
        value.merge(nextValue()) { $1 }
    }
}

struct HighlightableView: View {
    let items = ["Home", "Search", "Profile", "Settings"]
    @State private var selected = "Home"

    var body: some View {
        HStack {
            ForEach(items, id: \.self) { item in
                Text(item)
                    .padding()
                    .anchorPreference(key: BoundsPreferenceKey.self, value: .bounds) {
                        [item: $0]
                    }
                    .onTapGesture {
                        withAnimation {
                            selected = item
                        }
                    }
            }
        }
        .overlayPreferenceValue(BoundsPreferenceKey.self) { preferences in
            GeometryReader { geometry in
                if let anchor = preferences[selected] {
                    let bounds = geometry[anchor]
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color.blue.opacity(0.3))
                        .frame(width: bounds.width, height: bounds.height)
                        .offset(x: bounds.minX, y: bounds.minY)
                }
            }
        }
    }
}
```

---

<!-- /ANCHOR:environment-and-preferences -->
<!-- ANCHOR:geometry-and-layout -->
## 8. GEOMETRY AND LAYOUT

### GeometryReader

```swift
struct ResponsiveView: View {
    var body: some View {
        GeometryReader { geometry in
            VStack {
                // Responsive sizing based on container
                let isCompact = geometry.size.width < 500

                if isCompact {
                    VStack {
                        imageSection(size: geometry.size)
                        contentSection
                    }
                } else {
                    HStack {
                        imageSection(size: geometry.size)
                        contentSection
                    }
                }
            }
        }
    }

    private func imageSection(size: CGSize) -> some View {
        Rectangle()
            .fill(.gray.opacity(0.3))
            .frame(
                width: min(size.width * 0.4, 300),
                height: min(size.width * 0.4, 300)
            )
    }

    private var contentSection: some View {
        VStack(alignment: .leading) {
            Text("Title")
                .font(.title)
            Text("Description text goes here")
                .font(.body)
        }
        .padding()
    }
}
```

### Safe Area and Ignore Safe Area

```swift
struct FullScreenImageView: View {
    var body: some View {
        ZStack {
            // Background ignores safe area
            Image("background")
                .resizable()
                .aspectRatio(contentMode: .fill)
                .ignoresSafeArea()

            // Content respects safe area
            VStack {
                Text("Title")
                    .font(.largeTitle)
                    .bold()

                Spacer()

                Button("Action") { }
                    .buttonStyle(.borderedProminent)
            }
            .padding()
        }
    }
}

// Reading safe area insets
struct SafeAreaAwareView: View {
    var body: some View {
        GeometryReader { geometry in
            VStack {
                Text("Top inset: \(geometry.safeAreaInsets.top)")
                Text("Bottom inset: \(geometry.safeAreaInsets.bottom)")
            }
        }
    }
}
```

### Custom Layout (iOS 16+)

```swift
struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(
        proposal: ProposedViewSize,
        subviews: Subviews,
        cache: inout ()
    ) -> CGSize {
        let containerWidth = proposal.width ?? .infinity
        var currentX: CGFloat = 0
        var currentY: CGFloat = 0
        var lineHeight: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)

            if currentX + size.width > containerWidth {
                currentX = 0
                currentY += lineHeight + spacing
                lineHeight = 0
            }

            lineHeight = max(lineHeight, size.height)
            currentX += size.width + spacing
        }

        return CGSize(width: containerWidth, height: currentY + lineHeight)
    }

    func placeSubviews(
        in bounds: CGRect,
        proposal: ProposedViewSize,
        subviews: Subviews,
        cache: inout ()
    ) {
        var currentX = bounds.minX
        var currentY = bounds.minY
        var lineHeight: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)

            if currentX + size.width > bounds.maxX {
                currentX = bounds.minX
                currentY += lineHeight + spacing
                lineHeight = 0
            }

            subview.place(
                at: CGPoint(x: currentX, y: currentY),
                proposal: ProposedViewSize(size)
            )

            lineHeight = max(lineHeight, size.height)
            currentX += size.width + spacing
        }
    }
}

// Usage
struct TagsView: View {
    let tags: [String]

    var body: some View {
        FlowLayout(spacing: 8) {
            ForEach(tags, id: \.self) { tag in
                Text(tag)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Color.blue.opacity(0.1))
                    .clipShape(Capsule())
            }
        }
    }
}
```

---

<!-- /ANCHOR:geometry-and-layout -->
<!-- ANCHOR:animations -->
## 9. ANIMATIONS

### Basic Animations

```swift
struct AnimationExamplesView: View {
    @State private var isAnimating = false

    var body: some View {
        VStack(spacing: 40) {
            // Implicit animation
            Circle()
                .fill(isAnimating ? .blue : .red)
                .frame(width: 100, height: 100)
                .scaleEffect(isAnimating ? 1.2 : 1.0)
                .animation(.spring(duration: 0.5), value: isAnimating)

            // Explicit animation
            Button("Animate") {
                withAnimation(.easeInOut(duration: 0.5)) {
                    isAnimating.toggle()
                }
            }

            // Repeating animation
            Circle()
                .fill(.green)
                .frame(width: 50, height: 50)
                .offset(y: isAnimating ? -20 : 20)
                .animation(
                    .easeInOut(duration: 1)
                    .repeatForever(autoreverses: true),
                    value: isAnimating
                )
        }
        .onAppear {
            isAnimating = true
        }
    }
}
```

### Transitions

```swift
struct TransitionExampleView: View {
    @State private var showDetail = false

    var body: some View {
        VStack {
            Button("Toggle") {
                withAnimation(.spring()) {
                    showDetail.toggle()
                }
            }

            if showDetail {
                DetailCard()
                    .transition(.asymmetric(
                        insertion: .scale.combined(with: .opacity),
                        removal: .slide.combined(with: .opacity)
                    ))
            }
        }
    }
}

// Custom transition
extension AnyTransition {
    static var slideAndFade: AnyTransition {
        .asymmetric(
            insertion: .move(edge: .trailing).combined(with: .opacity),
            removal: .move(edge: .leading).combined(with: .opacity)
        )
    }
}
```

### Phase Animator (iOS 17+)

```swift
struct PhaseAnimationView: View {
    @State private var trigger = false

    var body: some View {
        VStack {
            Circle()
                .fill(.blue)
                .frame(width: 100, height: 100)
                .phaseAnimator([false, true], trigger: trigger) { content, phase in
                    content
                        .scaleEffect(phase ? 1.2 : 1.0)
                        .opacity(phase ? 0.5 : 1.0)
                } animation: { phase in
                    .spring(duration: 0.5)
                }

            Button("Animate") {
                trigger.toggle()
            }
        }
    }
}
```

### Keyframe Animator (iOS 17+)

```swift
struct KeyframeAnimationView: View {
    @State private var trigger = false

    var body: some View {
        VStack {
            Image(systemName: "star.fill")
                .font(.system(size: 60))
                .foregroundStyle(.yellow)
                .keyframeAnimator(
                    initialValue: AnimationValues(),
                    trigger: trigger
                ) { content, value in
                    content
                        .scaleEffect(value.scale)
                        .rotationEffect(value.rotation)
                        .offset(y: value.yOffset)
                } keyframes: { _ in
                    KeyframeTrack(\.scale) {
                        LinearKeyframe(1.5, duration: 0.2)
                        SpringKeyframe(1.0, duration: 0.3)
                    }
                    KeyframeTrack(\.rotation) {
                        LinearKeyframe(.degrees(360), duration: 0.5)
                    }
                    KeyframeTrack(\.yOffset) {
                        SpringKeyframe(-50, duration: 0.25)
                        SpringKeyframe(0, duration: 0.25)
                    }
                }

            Button("Animate") {
                trigger.toggle()
            }
        }
    }
}

struct AnimationValues {
    var scale: Double = 1.0
    var rotation: Angle = .zero
    var yOffset: Double = 0
}
```

---

<!-- /ANCHOR:animations -->
<!-- ANCHOR:rules -->
## 10. RULES

### ✅ ALWAYS

1. **Extract complex views** - Break down into smaller, reusable components
2. **Use @State for local state** - View-owned, simple state
3. **Use @Observable for view models** - iOS 17+ shared state (iOS 17+)
4. **Prefer NavigationStack** - Over deprecated NavigationView
5. **Use lazy stacks for large lists** - LazyVStack, LazyHStack for performance
6. **Add meaningful previews** - Test different states and configurations
7. **Use environment for dependencies** - Proper dependency injection
8. **Animate state changes** - withAnimation or .animation modifier
9. **Handle loading and error states** - Show appropriate UI feedback
10. **Use semantic colors** - .primary, .secondary, .background for theming

### ❌ NEVER

1. **Force unwrap in views** - Always handle optionals safely
2. **Use NavigationView** - Deprecated, use NavigationStack
3. **Put business logic in views** - Extract to view models
4. **Overuse GeometryReader** - Only when necessary
5. **Ignore accessibility** - Add labels and traits
6. **Create deeply nested views** - Extract to separate components
7. **Mix state management patterns** - Choose one approach
8. **Use @StateObject with @Observable** - Use @State instead
9. **Block the main thread** - Use async/await for long operations
10. **Hardcode dimensions** - Use relative sizing when possible

### ⚠️ ESCALATE IF

1. **Performance issues** - Profile with Instruments before optimizing
2. **Complex navigation requirements** - Discuss architecture approach
3. **Custom layout needs** - Consider custom Layout protocol
4. **Cross-platform (iOS/macOS)** - Platform-specific considerations

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:related-resources -->
## 11. RELATED RESOURCES

| File | Purpose |
|------|---------|
| [swift_standards.md](./swift_standards.md) | Swift project structure and naming conventions |
| [mvvm_architecture.md](./mvvm_architecture.md) | MVVM architecture patterns with SwiftUI |
| [async_patterns.md](./async_patterns.md) | Swift concurrency and async/await patterns |
| [testing_strategy.md](./testing_strategy.md) | XCTest and testing best practices |
| [persistence_patterns.md](./persistence_patterns.md) | SwiftData, Core Data, and storage patterns |
<!-- /ANCHOR:related-resources -->
