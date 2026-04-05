/* ─────────────────────────────────────────────────────────────
   SwiftUI View Patterns - Reusable View Templates

   PURPOSE: Production-ready SwiftUI view patterns for iOS 17+
   USAGE: Copy and adapt these patterns for your specific use cases
──────────────────────────────────────────────────────────────── */

import SwiftUI

/* ─────────────────────────────────────────────────────────────
   1. BASIC VIEW TEMPLATES
──────────────────────────────────────────────────────────────── */

/// Basic view with ViewModel integration
/// - Uses @Observable ViewModel pattern
/// - Handles loading, error, and content states
struct ContentView: View {
    @State private var viewModel = ContentViewModel()

    var body: some View {
        NavigationStack {
            content
                .navigationTitle("Content")
                .task {
                    await viewModel.loadContent()
                }
                .refreshable {
                    await viewModel.loadContent()
                }
        }
    }

    @ViewBuilder
    private var content: some View {
        switch viewModel.state {
        case .idle:
            Color.clear
        case .loading:
            ProgressView("Loading...")
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        case .loaded(let items):
            contentList(items)
        case .error(let error):
            errorView(error)
        }
    }

    private func contentList(_ items: [ContentItem]) -> some View {
        List(items) { item in
            ContentRowView(item: item)
        }
    }

    private func errorView(_ error: Error) -> some View {
        ContentUnavailableView {
            Label("Error", systemImage: "exclamationmark.triangle")
        } description: {
            Text(error.localizedDescription)
        } actions: {
            Button("Try Again") {
                Task {
                    await viewModel.loadContent()
                }
            }
        }
    }
}

/* ─────────────────────────────────────────────────────────────
   2. LIST VIEW WITH NAVIGATION
──────────────────────────────────────────────────────────────── */

/// Master-detail list view with navigation
/// - Supports search and filtering
/// - Pull-to-refresh enabled
/// - Empty state handling
struct ProductListView: View {
    @State private var viewModel = ProductListViewModel()
    @State private var searchText = ""

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading && viewModel.products.isEmpty {
                    loadingView
                } else if filteredProducts.isEmpty {
                    emptyView
                } else {
                    productList
                }
            }
            .navigationTitle("Products")
            .searchable(text: $searchText, prompt: "Search products")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    sortMenu
                }
            }
            .task {
                await viewModel.loadProducts()
            }
            .refreshable {
                await viewModel.loadProducts()
            }
        }
    }

    private var filteredProducts: [Product] {
        if searchText.isEmpty {
            return viewModel.products
        }
        return viewModel.products.filter { product in
            product.name.localizedCaseInsensitiveContains(searchText)
        }
    }

    private var loadingView: some View {
        ProgressView()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var emptyView: some View {
        ContentUnavailableView.search(text: searchText)
    }

    private var productList: some View {
        List(filteredProducts) { product in
            NavigationLink(value: product) {
                ProductRowView(product: product)
            }
        }
        .navigationDestination(for: Product.self) { product in
            ProductDetailView(product: product)
        }
    }

    private var sortMenu: some View {
        Menu {
            ForEach(ProductListViewModel.SortOption.allCases, id: \.self) { option in
                Button {
                    viewModel.sortBy(option)
                } label: {
                    if viewModel.currentSort == option {
                        Label(option.title, systemImage: "checkmark")
                    } else {
                        Text(option.title)
                    }
                }
            }
        } label: {
            Label("Sort", systemImage: "arrow.up.arrow.down")
        }
    }
}

/// Product row view for list display
struct ProductRowView: View {
    let product: Product

    var body: some View {
        HStack(spacing: 12) {
            // Product Image
            AsyncImage(url: product.imageURL) { phase in
                switch phase {
                case .empty:
                    Rectangle()
                        .fill(.quaternary)
                        .overlay {
                            ProgressView()
                        }
                case .success(let image):
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                case .failure:
                    Rectangle()
                        .fill(.quaternary)
                        .overlay {
                            Image(systemName: "photo")
                                .foregroundStyle(.secondary)
                        }
                @unknown default:
                    EmptyView()
                }
            }
            .frame(width: 60, height: 60)
            .clipShape(RoundedRectangle(cornerRadius: 8))

            // Product Info
            VStack(alignment: .leading, spacing: 4) {
                Text(product.name)
                    .font(.headline)
                    .lineLimit(2)

                Text(product.formattedPrice)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            // Stock indicator
            if product.inStock {
                Circle()
                    .fill(.green)
                    .frame(width: 8, height: 8)
            } else {
                Text("Out of Stock")
                    .font(.caption)
                    .foregroundStyle(.red)
            }
        }
        .padding(.vertical, 4)
    }
}

/// Product detail view
struct ProductDetailView: View {
    let product: Product
    @State private var quantity = 1

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                // Hero Image
                AsyncImage(url: product.imageURL) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                } placeholder: {
                    Rectangle()
                        .fill(.quaternary)
                        .aspectRatio(1, contentMode: .fit)
                        .overlay {
                            ProgressView()
                        }
                }

                // Product Info
                VStack(alignment: .leading, spacing: 12) {
                    Text(product.name)
                        .font(.title)
                        .fontWeight(.bold)

                    Text(product.formattedPrice)
                        .font(.title2)
                        .foregroundStyle(.primary)

                    Text(product.description)
                        .font(.body)
                        .foregroundStyle(.secondary)

                    Divider()

                    // Quantity Selector
                    HStack {
                        Text("Quantity")
                            .font(.headline)

                        Spacer()

                        Stepper(value: $quantity, in: 1...10) {
                            Text("\(quantity)")
                                .font(.headline)
                                .frame(width: 40)
                        }
                    }
                }
                .padding(.horizontal)
            }
        }
        .safeAreaInset(edge: .bottom) {
            addToCartButton
        }
        .navigationBarTitleDisplayMode(.inline)
    }

    private var addToCartButton: some View {
        Button {
            // Add to cart action
        } label: {
            HStack {
                Text("Add to Cart")
                    .fontWeight(.semibold)
                Spacer()
                Text(product.formattedPrice)
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(product.inStock ? .blue : .gray)
            .foregroundStyle(.white)
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
        .disabled(!product.inStock)
        .padding()
        .background(.ultraThinMaterial)
    }
}

/* ─────────────────────────────────────────────────────────────
   3. FORM VIEW PATTERNS
──────────────────────────────────────────────────────────────── */

/// Form view with validation
/// - Real-time validation feedback
/// - Keyboard handling
/// - Focus state management
struct UserProfileFormView: View {
    @State private var viewModel = UserProfileFormViewModel()
    @FocusState private var focusedField: FormField?
    @Environment(\.dismiss) private var dismiss

    enum FormField: Hashable {
        case firstName
        case lastName
        case email
        case phone
    }

    var body: some View {
        NavigationStack {
            Form {
                // Personal Information Section
                Section {
                    TextField("First Name", text: $viewModel.firstName)
                        .textContentType(.givenName)
                        .focused($focusedField, equals: .firstName)
                        .submitLabel(.next)
                        .onSubmit { focusedField = .lastName }

                    if let error = viewModel.firstNameError {
                        Text(error)
                            .font(.caption)
                            .foregroundStyle(.red)
                    }

                    TextField("Last Name", text: $viewModel.lastName)
                        .textContentType(.familyName)
                        .focused($focusedField, equals: .lastName)
                        .submitLabel(.next)
                        .onSubmit { focusedField = .email }

                    if let error = viewModel.lastNameError {
                        Text(error)
                            .font(.caption)
                            .foregroundStyle(.red)
                    }
                } header: {
                    Text("Personal Information")
                } footer: {
                    Text("Your name will be displayed on your profile.")
                }

                // Contact Section
                Section("Contact") {
                    TextField("Email", text: $viewModel.email)
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()
                        .focused($focusedField, equals: .email)
                        .submitLabel(.next)
                        .onSubmit { focusedField = .phone }

                    if let error = viewModel.emailError {
                        Text(error)
                            .font(.caption)
                            .foregroundStyle(.red)
                    }

                    TextField("Phone", text: $viewModel.phone)
                        .textContentType(.telephoneNumber)
                        .keyboardType(.phonePad)
                        .focused($focusedField, equals: .phone)

                    if let error = viewModel.phoneError {
                        Text(error)
                            .font(.caption)
                            .foregroundStyle(.red)
                    }
                }

                // Preferences Section
                Section("Preferences") {
                    Toggle("Email Notifications", isOn: $viewModel.emailNotifications)
                    Toggle("Push Notifications", isOn: $viewModel.pushNotifications)

                    Picker("Theme", selection: $viewModel.theme) {
                        ForEach(UserProfileFormViewModel.Theme.allCases, id: \.self) { theme in
                            Text(theme.rawValue.capitalized)
                                .tag(theme)
                        }
                    }
                }
            }
            .navigationTitle("Edit Profile")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        dismiss()
                    }
                }

                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        Task {
                            await viewModel.save()
                            if viewModel.isSaved {
                                dismiss()
                            }
                        }
                    }
                    .disabled(!viewModel.isValid || viewModel.isSaving)
                }

                ToolbarItem(placement: .keyboard) {
                    HStack {
                        Spacer()
                        Button("Done") {
                            focusedField = nil
                        }
                    }
                }
            }
            .alert("Error", isPresented: $viewModel.showError) {
                Button("OK", role: .cancel) {}
            } message: {
                Text(viewModel.errorMessage ?? "An error occurred")
            }
        }
    }
}

/* ─────────────────────────────────────────────────────────────
   4. CUSTOM VIEW MODIFIERS
──────────────────────────────────────────────────────────────── */

/// Card style modifier
struct CardStyle: ViewModifier {
    var backgroundColor: Color = .white
    var cornerRadius: CGFloat = 12
    var shadowRadius: CGFloat = 4

    func body(content: Content) -> some View {
        content
            .padding()
            .background(backgroundColor)
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
            .shadow(color: .black.opacity(0.1), radius: shadowRadius, x: 0, y: 2)
    }
}

extension View {
    func cardStyle(
        backgroundColor: Color = .white,
        cornerRadius: CGFloat = 12,
        shadowRadius: CGFloat = 4
    ) -> some View {
        modifier(CardStyle(
            backgroundColor: backgroundColor,
            cornerRadius: cornerRadius,
            shadowRadius: shadowRadius
        ))
    }
}

/// Loading overlay modifier
struct LoadingOverlay: ViewModifier {
    let isLoading: Bool
    let message: String?

    func body(content: Content) -> some View {
        content
            .disabled(isLoading)
            .overlay {
                if isLoading {
                    ZStack {
                        Color.black.opacity(0.3)
                            .ignoresSafeArea()

                        VStack(spacing: 16) {
                            ProgressView()
                                .scaleEffect(1.5)

                            if let message {
                                Text(message)
                                    .font(.callout)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        .padding(24)
                        .background(.ultraThinMaterial)
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                    }
                }
            }
    }
}

extension View {
    func loadingOverlay(isLoading: Bool, message: String? = nil) -> some View {
        modifier(LoadingOverlay(isLoading: isLoading, message: message))
    }
}

/// Shake effect modifier for validation errors
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
            .onChange(of: trigger) { _, newValue in
                if newValue {
                    withAnimation(.default) {
                        shakeAmount = 1
                    }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                        shakeAmount = 0
                    }
                }
            }
    }
}

/// Conditional modifier
extension View {
    @ViewBuilder
    func `if`<Transform: View>(
        _ condition: Bool,
        transform: (Self) -> Transform
    ) -> some View {
        if condition {
            transform(self)
        } else {
            self
        }
    }

    @ViewBuilder
    func ifLet<Value, Transform: View>(
        _ value: Value?,
        transform: (Self, Value) -> Transform
    ) -> some View {
        if let value {
            transform(self, value)
        } else {
            self
        }
    }
}

/* ─────────────────────────────────────────────────────────────
   5. REUSABLE COMPONENTS
──────────────────────────────────────────────────────────────── */

/// Primary button component
struct PrimaryButton: View {
    let title: String
    let icon: String?
    let isLoading: Bool
    let action: () -> Void

    init(
        _ title: String,
        icon: String? = nil,
        isLoading: Bool = false,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.icon = icon
        self.isLoading = isLoading
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if isLoading {
                    ProgressView()
                        .tint(.white)
                } else {
                    if let icon {
                        Image(systemName: icon)
                    }
                    Text(title)
                        .fontWeight(.semibold)
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(.blue)
            .foregroundStyle(.white)
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
        .disabled(isLoading)
    }
}

/// Secondary button component
struct SecondaryButton: View {
    let title: String
    let icon: String?
    let action: () -> Void

    init(
        _ title: String,
        icon: String? = nil,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.icon = icon
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if let icon {
                    Image(systemName: icon)
                }
                Text(title)
                    .fontWeight(.medium)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(.blue.opacity(0.1))
            .foregroundStyle(.blue)
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
    }
}

/// Avatar view component
struct AvatarView: View {
    let url: URL?
    let name: String
    let size: CGFloat

    init(url: URL? = nil, name: String, size: CGFloat = 40) {
        self.url = url
        self.name = name
        self.size = size
    }

    var body: some View {
        if let url {
            AsyncImage(url: url) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                initialsView
            }
            .frame(width: size, height: size)
            .clipShape(Circle())
        } else {
            initialsView
        }
    }

    private var initialsView: some View {
        Circle()
            .fill(Color.blue.gradient)
            .frame(width: size, height: size)
            .overlay {
                Text(initials)
                    .font(.system(size: size * 0.4, weight: .semibold))
                    .foregroundStyle(.white)
            }
    }

    private var initials: String {
        let components = name.split(separator: " ")
        let initials = components.prefix(2).compactMap { $0.first }
        return String(initials).uppercased()
    }
}

/// Badge view component
struct BadgeView: View {
    let text: String
    let color: Color

    init(_ text: String, color: Color = .blue) {
        self.text = text
        self.color = color
    }

    var body: some View {
        Text(text)
            .font(.caption)
            .fontWeight(.medium)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color.opacity(0.15))
            .foregroundStyle(color)
            .clipShape(Capsule())
    }
}

/// Empty state view component
struct EmptyStateView: View {
    let icon: String
    let title: String
    let description: String
    let actionTitle: String?
    let action: (() -> Void)?

    init(
        icon: String,
        title: String,
        description: String,
        actionTitle: String? = nil,
        action: (() -> Void)? = nil
    ) {
        self.icon = icon
        self.title = title
        self.description = description
        self.actionTitle = actionTitle
        self.action = action
    }

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: icon)
                .font(.system(size: 48))
                .foregroundStyle(.secondary)

            Text(title)
                .font(.title2)
                .fontWeight(.semibold)

            Text(description)
                .font(.body)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)

            if let actionTitle, let action {
                Button(actionTitle, action: action)
                    .buttonStyle(.borderedProminent)
                    .padding(.top, 8)
            }
        }
        .padding(32)
    }
}

/* ─────────────────────────────────────────────────────────────
   6. PREVIEW PROVIDERS
──────────────────────────────────────────────────────────────── */

/// Preview with mock data
#Preview("Product List") {
    ProductListView()
}

#Preview("Product Row") {
    List {
        ProductRowView(product: .preview)
        ProductRowView(product: .previewOutOfStock)
    }
}

#Preview("Product Detail") {
    NavigationStack {
        ProductDetailView(product: .preview)
    }
}

#Preview("Form") {
    UserProfileFormView()
}

#Preview("Buttons") {
    VStack(spacing: 16) {
        PrimaryButton("Continue", icon: "arrow.right") {}
        PrimaryButton("Loading...", isLoading: true) {}
        SecondaryButton("Cancel", icon: "xmark") {}
    }
    .padding()
}

#Preview("Avatar") {
    HStack(spacing: 16) {
        AvatarView(name: "John Doe", size: 40)
        AvatarView(name: "Jane Smith", size: 60)
        AvatarView(name: "A", size: 80)
    }
}

#Preview("Badge") {
    HStack {
        BadgeView("New", color: .green)
        BadgeView("Sale", color: .red)
        BadgeView("Featured", color: .blue)
    }
}

#Preview("Empty State") {
    EmptyStateView(
        icon: "cart",
        title: "Your cart is empty",
        description: "Start shopping and add items to your cart.",
        actionTitle: "Browse Products"
    ) {}
}

#Preview("Card Style") {
    VStack {
        Text("Card Content")
            .frame(maxWidth: .infinity)
            .cardStyle()
    }
    .padding()
    .background(Color.gray.opacity(0.1))
}

/* ─────────────────────────────────────────────────────────────
   7. SUPPORTING TYPES (for compilation)
──────────────────────────────────────────────────────────────── */

// Note: These types support the examples above. In a real app, these would be
// in separate files within your Models/ and ViewModels/ directories.

struct ContentItem: Identifiable {
    let id = UUID()
    let title: String
}

struct ContentRowView: View {
    let item: ContentItem
    var body: some View {
        Text(item.title)
    }
}

@Observable
final class ContentViewModel {
    enum State {
        case idle
        case loading
        case loaded([ContentItem])
        case error(Error)
    }

    private(set) var state: State = .idle

    @MainActor
    func loadContent() async {
        state = .loading
        try? await Task.sleep(for: .seconds(1))
        state = .loaded([
            ContentItem(title: "Item 1"),
            ContentItem(title: "Item 2")
        ])
    }
}

struct Product: Identifiable, Hashable {
    let id = UUID()
    let name: String
    let price: Decimal
    let description: String
    let imageURL: URL?
    let inStock: Bool

    var formattedPrice: String {
        price.formatted(.currency(code: "USD"))
    }

    static let preview = Product(
        name: "Sample Product",
        price: 29.99,
        description: "This is a sample product description.",
        imageURL: URL(string: "https://example.com/image.jpg"),
        inStock: true
    )

    static let previewOutOfStock = Product(
        name: "Out of Stock Item",
        price: 49.99,
        description: "This item is currently unavailable.",
        imageURL: nil,
        inStock: false
    )
}

@Observable
final class ProductListViewModel {
    enum SortOption: String, CaseIterable {
        case name, priceLow, priceHigh

        var title: String {
            switch self {
            case .name: "Name"
            case .priceLow: "Price: Low to High"
            case .priceHigh: "Price: High to Low"
            }
        }
    }

    private(set) var products: [Product] = []
    private(set) var isLoading = false
    private(set) var currentSort: SortOption = .name

    @MainActor
    func loadProducts() async {
        isLoading = true
        try? await Task.sleep(for: .seconds(1))
        products = [.preview, .previewOutOfStock]
        isLoading = false
    }

    func sortBy(_ option: SortOption) {
        currentSort = option
    }
}

@Observable
final class UserProfileFormViewModel {
    enum Theme: String, CaseIterable {
        case system, light, dark
    }

    var firstName = ""
    var lastName = ""
    var email = ""
    var phone = ""
    var emailNotifications = true
    var pushNotifications = true
    var theme: Theme = .system

    private(set) var isSaving = false
    private(set) var isSaved = false
    var showError = false
    var errorMessage: String?

    var firstNameError: String? {
        firstName.isEmpty ? nil : (firstName.count < 2 ? "Too short" : nil)
    }

    var lastNameError: String? {
        lastName.isEmpty ? nil : (lastName.count < 2 ? "Too short" : nil)
    }

    var emailError: String? {
        guard !email.isEmpty else { return nil }
        let emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
        return email.wholeMatch(of: emailRegex) == nil ? "Invalid email" : nil
    }

    var phoneError: String? { nil }

    var isValid: Bool {
        !firstName.isEmpty && !lastName.isEmpty && !email.isEmpty &&
        firstNameError == nil && lastNameError == nil && emailError == nil
    }

    @MainActor
    func save() async {
        isSaving = true
        try? await Task.sleep(for: .seconds(1))
        isSaved = true
        isSaving = false
    }
}
