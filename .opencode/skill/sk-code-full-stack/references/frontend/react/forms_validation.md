---
title: Forms & Validation
description: React Hook Form setup, Zod schema validation, form state management, error display patterns, multi-step forms, and file upload handling.
---

# Forms & Validation

React Hook Form setup, Zod schema validation, form state management, error display patterns, multi-step forms, and file upload handling.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provides comprehensive guidance on building forms in React and Next.js applications using React Hook Form with Zod validation, covering single forms, multi-step wizards, file uploads, and Server Action integration.

### When to Use

- Building any form (login, registration, checkout, settings)
- Implementing client and server-side validation
- Creating multi-step form wizards
- Handling file uploads
- Integrating forms with Server Actions

### Prerequisites

- **[Component Architecture](./component_architecture.md)**: Server vs Client Components
- **[Data Fetching](./data_fetching.md)**: Server Actions for form submission
- **[State Management](./state_management.md)**: Form state persistence

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:react-hook-form-setup -->
## 2. REACT HOOK FORM SETUP

### Installation

```bash
npm install react-hook-form @hookform/resolvers zod
```

### Basic Form Setup

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Define schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

// 2. Infer TypeScript type from schema
type LoginFormData = z.infer<typeof loginSchema>;

// 3. Build the form
export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('Form data:', data);
    // Submit to API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="rememberMe"
          type="checkbox"
          {...register('rememberMe')}
        />
        <label htmlFor="rememberMe" className="ml-2">Remember me</label>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

### Form Configuration Options

```typescript
const form = useForm<FormData>({
  // Validation resolver
  resolver: zodResolver(schema),

  // Default values (important for controlled inputs)
  defaultValues: {
    email: '',
    name: '',
  },

  // Validation mode
  mode: 'onBlur',          // Validate on blur (default)
  // mode: 'onChange',     // Validate on every change
  // mode: 'onSubmit',     // Validate on submit only
  // mode: 'onTouched',    // Validate on first blur, then on change
  // mode: 'all',          // Validate on blur and change

  // Re-validation mode (after first submit)
  reValidateMode: 'onChange',

  // Criteria mode for error display
  criteriaMode: 'firstError', // Show only first error per field
  // criteriaMode: 'all',      // Show all errors

  // Focus first error on submit
  shouldFocusError: true,

  // Delay validation (milliseconds)
  delayError: 500,
});
```

---

<!-- /ANCHOR:react-hook-form-setup -->
<!-- ANCHOR:zod-schema-validation -->
## 3. ZOD SCHEMA VALIDATION

### Common Schema Patterns

```typescript
import { z } from 'zod';

// String validations
const stringSchemas = z.object({
  required: z.string().min(1, 'This field is required'),
  email: z.string().email('Invalid email address'),
  url: z.string().url('Invalid URL'),
  minLength: z.string().min(8, 'Must be at least 8 characters'),
  maxLength: z.string().max(100, 'Must be less than 100 characters'),
  pattern: z.string().regex(/^[A-Z]{2}\d{6}$/, 'Invalid format'),
  optional: z.string().optional(),
  nullable: z.string().nullable(),
  trimmed: z.string().trim().min(1, 'Required'),
});

// Number validations
const numberSchemas = z.object({
  integer: z.number().int('Must be a whole number'),
  positive: z.number().positive('Must be positive'),
  range: z.number().min(1).max(100),
  fromString: z.coerce.number().positive(), // Coerce string to number
});

// Date validations
const dateSchemas = z.object({
  date: z.coerce.date(),
  future: z.coerce.date().min(new Date(), 'Date must be in the future'),
  past: z.coerce.date().max(new Date(), 'Date must be in the past'),
});

// Enum validations
const enumSchemas = z.object({
  status: z.enum(['draft', 'published', 'archived']),
  role: z.enum(['admin', 'user', 'guest'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
});

// Array validations
const arraySchemas = z.object({
  tags: z.array(z.string()).min(1, 'At least one tag required'),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().positive(),
  })).min(1),
});

// Object validations
const objectSchemas = z.object({
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    zipCode: z.string().regex(/^\d{5}$/),
  }),
});
```

### Custom Validations

```typescript
import { z } from 'zod';

// Password with complexity requirements
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Confirm password with refinement
const registrationSchema = z
  .object({
    email: z.string().email(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Error will appear on confirmPassword field
  });

// Conditional validation
const paymentSchema = z
  .object({
    paymentMethod: z.enum(['card', 'bank', 'paypal']),
    cardNumber: z.string().optional(),
    bankAccount: z.string().optional(),
    paypalEmail: z.string().email().optional(),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === 'card') return !!data.cardNumber;
      if (data.paymentMethod === 'bank') return !!data.bankAccount;
      if (data.paymentMethod === 'paypal') return !!data.paypalEmail;
      return true;
    },
    {
      message: 'Please provide payment details',
      path: ['paymentMethod'],
    }
  );

// Async validation (e.g., check if email exists)
const uniqueEmailSchema = z.string().email().refine(
  async (email) => {
    const exists = await checkEmailExists(email);
    return !exists;
  },
  { message: 'This email is already registered' }
);

// Transform values
const normalizedSchema = z.object({
  email: z.string().email().toLowerCase(),
  phone: z.string().transform((val) => val.replace(/\D/g, '')),
  tags: z.string().transform((val) => val.split(',').map((s) => s.trim())),
});
```

### Schema Composition

```typescript
import { z } from 'zod';

// Base schemas
const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be 2 characters'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
});

const contactSchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
});

// Compose schemas
const customerSchema = z.object({
  name: z.string().min(2),
  billingAddress: addressSchema,
  shippingAddress: addressSchema.optional(),
  contact: contactSchema,
});

// Extend schemas
const businessCustomerSchema = customerSchema.extend({
  companyName: z.string().min(1),
  taxId: z.string().regex(/^\d{9}$/),
});

// Pick/Omit fields
const simpleCustomer = customerSchema.pick({
  name: true,
  contact: true,
});

const customerWithoutContact = customerSchema.omit({
  contact: true,
});

// Partial schemas (all fields optional)
const updateCustomerSchema = customerSchema.partial();

// Deep partial
const deepPartialSchema = customerSchema.deepPartial();
```

---

<!-- /ANCHOR:zod-schema-validation -->
<!-- ANCHOR:form-components -->
## 4. FORM COMPONENTS

### Reusable Form Field Component

```typescript
'use client';

import {
  useFormContext,
  type FieldPath,
  type FieldValues,
  type ControllerProps,
  Controller,
} from 'react-hook-form';
import { cn } from '@/lib/utils/cn';

interface FormFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
  children: React.ReactNode;
}

export function FormField<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  children,
}: FormFieldProps<TFieldValues>) {
  const {
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const error = errors[name];

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
    </div>
  );
}

// Input component
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  description?: string;
}

export function FormInput({
  name,
  label,
  description,
  className,
  ...props
}: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <input
        id={name}
        {...register(name)}
        className={cn(
          'flex h-10 w-full rounded-md border px-3 py-2',
          error && 'border-destructive',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive">{error.message as string}</p>
      )}
    </div>
  );
}
```

### Controlled Components with Controller

```typescript
'use client';

import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  category: z.string().min(1, 'Please select a category'),
  rating: z.number().min(1).max(5),
  agree: z.boolean().refine((val) => val === true, 'You must agree'),
});

type FormData = z.infer<typeof schema>;

export function ControlledForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: '',
      rating: 3,
      agree: false,
    },
  });

  const { control, handleSubmit } = form;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(console.log)}>
        {/* Controlled Select */}
        <Controller
          name="category"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div>
              <label>Category</label>
              <select {...field}>
                <option value="">Select...</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
              </select>
              {error && <p className="text-red-500">{error.message}</p>}
            </div>
          )}
        />

        {/* Controlled Custom Component */}
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <div>
              <label>Rating</label>
              <RatingStars
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            </div>
          )}
        />

        {/* Controlled Checkbox */}
        <Controller
          name="agree"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
                I agree to the terms
              </label>
              {error && <p className="text-red-500">{error.message}</p>}
            </div>
          )}
        />

        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
}
```

### Form with Field Arrays

```typescript
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const orderSchema = z.object({
  customerName: z.string().min(1),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product is required'),
        quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
        notes: z.string().optional(),
      })
    )
    .min(1, 'At least one item is required'),
});

type OrderForm = z.infer<typeof orderSchema>;

export function OrderForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: '',
      items: [{ productId: '', quantity: 1, notes: '' }],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = (data: OrderForm) => {
    console.log('Order:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label>Customer Name</label>
        <input {...register('customerName')} />
        {errors.customerName && (
          <p className="text-red-500">{errors.customerName.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <h3>Order Items</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-4 items-start">
            <div>
              <input
                {...register(`items.${index}.productId`)}
                placeholder="Product ID"
              />
              {errors.items?.[index]?.productId && (
                <p className="text-red-500">
                  {errors.items[index]?.productId?.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="number"
                {...register(`items.${index}.quantity`)}
                placeholder="Qty"
              />
              {errors.items?.[index]?.quantity && (
                <p className="text-red-500">
                  {errors.items[index]?.quantity?.message}
                </p>
              )}
            </div>

            <input
              {...register(`items.${index}.notes`)}
              placeholder="Notes (optional)"
            />

            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove
            </button>

            {index > 0 && (
              <button type="button" onClick={() => move(index, index - 1)}>
                Move Up
              </button>
            )}
          </div>
        ))}

        {errors.items?.root && (
          <p className="text-red-500">{errors.items.root.message}</p>
        )}

        <button
          type="button"
          onClick={() => append({ productId: '', quantity: 1, notes: '' })}
        >
          Add Item
        </button>
      </div>

      <button type="submit">Submit Order</button>
    </form>
  );
}
```

---

<!-- /ANCHOR:form-components -->
<!-- ANCHOR:multi-step-forms -->
## 5. MULTI-STEP FORMS

### Multi-Step Form with Context

```typescript
'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useForm, FormProvider, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Step schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
});

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().regex(/^\d{5}$/, 'Invalid ZIP code'),
});

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Invalid card number'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),
});

// Combined schema
const checkoutSchema = z.object({
  personal: personalInfoSchema,
  address: addressSchema,
  payment: paymentSchema,
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Step context
interface StepContextValue {
  currentStep: number;
  totalSteps: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
}

const StepContext = createContext<StepContextValue | null>(null);

function useStepContext() {
  const context = useContext(StepContext);
  if (!context) throw new Error('Must be used within StepProvider');
  return context;
}

// Step components
function PersonalInfoStep() {
  const { nextStep } = useStepContext();
  const { register, formState: { errors }, trigger } = useFormContext<CheckoutFormData>();

  const handleNext = async () => {
    const isValid = await trigger('personal');
    if (isValid) nextStep();
  };

  return (
    <div className="space-y-4">
      <h2>Personal Information</h2>
      <div>
        <input {...register('personal.firstName')} placeholder="First Name" />
        {errors.personal?.firstName && (
          <p className="text-red-500">{errors.personal.firstName.message}</p>
        )}
      </div>
      <div>
        <input {...register('personal.lastName')} placeholder="Last Name" />
        {errors.personal?.lastName && (
          <p className="text-red-500">{errors.personal.lastName.message}</p>
        )}
      </div>
      <div>
        <input {...register('personal.email')} placeholder="Email" />
        {errors.personal?.email && (
          <p className="text-red-500">{errors.personal.email.message}</p>
        )}
      </div>
      <button type="button" onClick={handleNext}>Next</button>
    </div>
  );
}

function AddressStep() {
  const { nextStep, prevStep } = useStepContext();
  const { register, formState: { errors }, trigger } = useFormContext<CheckoutFormData>();

  const handleNext = async () => {
    const isValid = await trigger('address');
    if (isValid) nextStep();
  };

  return (
    <div className="space-y-4">
      <h2>Shipping Address</h2>
      <div>
        <input {...register('address.street')} placeholder="Street" />
        {errors.address?.street && (
          <p className="text-red-500">{errors.address.street.message}</p>
        )}
      </div>
      <div>
        <input {...register('address.city')} placeholder="City" />
        {errors.address?.city && (
          <p className="text-red-500">{errors.address.city.message}</p>
        )}
      </div>
      <div>
        <input {...register('address.zipCode')} placeholder="ZIP Code" />
        {errors.address?.zipCode && (
          <p className="text-red-500">{errors.address.zipCode.message}</p>
        )}
      </div>
      <div className="flex gap-4">
        <button type="button" onClick={prevStep}>Back</button>
        <button type="button" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}

function PaymentStep() {
  const { prevStep } = useStepContext();
  const { register, formState: { errors, isSubmitting } } = useFormContext<CheckoutFormData>();

  return (
    <div className="space-y-4">
      <h2>Payment Details</h2>
      <div>
        <input {...register('payment.cardNumber')} placeholder="Card Number" />
        {errors.payment?.cardNumber && (
          <p className="text-red-500">{errors.payment.cardNumber.message}</p>
        )}
      </div>
      <div className="flex gap-4">
        <div>
          <input {...register('payment.expiryDate')} placeholder="MM/YY" />
          {errors.payment?.expiryDate && (
            <p className="text-red-500">{errors.payment.expiryDate.message}</p>
          )}
        </div>
        <div>
          <input {...register('payment.cvv')} placeholder="CVV" />
          {errors.payment?.cvv && (
            <p className="text-red-500">{errors.payment.cvv.message}</p>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        <button type="button" onClick={prevStep}>Back</button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Complete Purchase'}
        </button>
      </div>
    </div>
  );
}

// Main wizard component
export function CheckoutWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      personal: { firstName: '', lastName: '', email: '' },
      address: { street: '', city: '', zipCode: '' },
      payment: { cardNumber: '', expiryDate: '', cvv: '' },
    },
    mode: 'onBlur',
  });

  const stepContext: StepContextValue = {
    currentStep,
    totalSteps,
    goToStep: setCurrentStep,
    nextStep: () => setCurrentStep((s) => Math.min(s + 1, totalSteps)),
    prevStep: () => setCurrentStep((s) => Math.max(s - 1, 1)),
    canGoNext: currentStep < totalSteps,
    canGoPrev: currentStep > 1,
  };

  const onSubmit = async (data: CheckoutFormData) => {
    console.log('Checkout data:', data);
    // Submit to API
  };

  return (
    <StepContext.Provider value={stepContext}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Progress indicator */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center ${
                  step <= currentStep ? 'text-primary' : 'text-muted'
                }`}
              >
                <span className="w-8 h-8 rounded-full border flex items-center justify-center">
                  {step}
                </span>
                <span className="ml-2">
                  {step === 1 ? 'Personal' : step === 2 ? 'Address' : 'Payment'}
                </span>
              </div>
            ))}
          </div>

          {/* Step content */}
          {currentStep === 1 && <PersonalInfoStep />}
          {currentStep === 2 && <AddressStep />}
          {currentStep === 3 && <PaymentStep />}
        </form>
      </FormProvider>
    </StepContext.Provider>
  );
}
```

---

<!-- /ANCHOR:multi-step-forms -->
<!-- ANCHOR:file-uploads -->
## 6. FILE UPLOADS

### File Upload with Preview

```typescript
'use client';

import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const profileSchema = z.object({
  name: z.string().min(1),
  avatar: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'Avatar is required')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      'Max file size is 5MB'
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Only JPEG, PNG, and WebP are accepted'
    ),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const onSubmit = async (data: ProfileForm) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('avatar', data.avatar[0]);

    const response = await fetch('/api/profile', {
      method: 'POST',
      body: formData,
    });

    // Handle response
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Name</label>
        <input {...register('name')} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label>Avatar</label>
        <div className="flex items-center gap-4">
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 rounded-full object-cover"
            />
          )}
          <input
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            {...register('avatar', { onChange: handleFileChange })}
          />
        </div>
        {errors.avatar && (
          <p className="text-red-500">{errors.avatar.message}</p>
        )}
      </div>

      <button type="submit">Save Profile</button>
    </form>
  );
}
```

### Drag and Drop Upload

```typescript
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const uploadSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, 'At least one file is required')
    .max(5, 'Maximum 5 files allowed'),
});

type UploadForm = z.infer<typeof uploadSchema>;

export function MultiFileUpload() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UploadForm>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { files: [] },
  });

  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles].slice(0, 5);
      setFiles(newFiles);
      setValue('files', newFiles, { shouldValidate: true });
    },
    [files, setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    setValue('files', newFiles, { shouldValidate: true });
  };

  const onSubmit = async (data: UploadForm) => {
    const formData = new FormData();
    data.files.forEach((file) => {
      formData.append('files', file);
    });

    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="files"
        control={control}
        render={() => (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted'}
            `}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <p>Drag & drop files here, or click to select</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Max 5 files, up to 10MB each
            </p>
          </div>
        )}
      />

      {errors.files && (
        <p className="text-red-500">{errors.files.message}</p>
      )}

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-2 bg-muted rounded"
            >
              <span>{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-destructive"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <button type="submit" disabled={files.length === 0}>
        Upload Files
      </button>
    </form>
  );
}
```

---

<!-- /ANCHOR:file-uploads -->
<!-- ANCHOR:server-action-integration -->
## 7. SERVER ACTION INTEGRATION

### Form with Server Action

```typescript
// app/actions/contact.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

type FormState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

export async function submitContact(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  };

  const result = contactSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      message: 'Please fix the errors below',
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // Save to database
    await db.contact.create({ data: result.data });

    // Send email notification
    await sendEmail({
      to: 'support@example.com',
      subject: 'New Contact Form Submission',
      body: `From: ${result.data.name} (${result.data.email})\n\n${result.data.message}`,
    });

    revalidatePath('/contact');

    return {
      success: true,
      message: 'Thank you for your message!',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
```

```typescript
// components/ContactForm.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitContact } from '@/app/actions/contact';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Sending...' : 'Send Message'}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(submitContact, {
    success: false,
    message: '',
  });

  return (
    <form action={formAction} className="space-y-4">
      {state.message && (
        <div
          className={`p-4 rounded ${
            state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required />
        {state.errors?.name && (
          <p className="text-red-500">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
        {state.errors?.email && (
          <p className="text-red-500">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={5} required />
        {state.errors?.message && (
          <p className="text-red-500">{state.errors.message[0]}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
```

### React Hook Form + Server Action

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition } from 'react';
import { createProduct } from '@/app/actions/product';

const productSchema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().positive(),
  description: z.string().min(10),
});

type ProductForm = z.infer<typeof productSchema>;

export function CreateProductForm() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (data: ProductForm) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const result = await createProduct(formData);

      if (result.success) {
        reset();
        // Show success message
      } else {
        // Handle server errors
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Product Name</label>
        <input {...register('name')} />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label>Price</label>
        <input type="number" step="0.01" {...register('price')} />
        {errors.price && <p className="text-red-500">{errors.price.message}</p>}
      </div>

      <div>
        <label>Description</label>
        <textarea {...register('description')} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}
```

---

<!-- /ANCHOR:server-action-integration -->
<!-- ANCHOR:error-display-patterns -->
## 8. ERROR DISPLAY PATTERNS

### Inline Errors

```typescript
'use client';

import { cn } from '@/lib/utils/cn';

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}
```

### Summary Errors

```typescript
'use client';

import { useFormState } from 'react-hook-form';

interface FormErrorSummaryProps {
  errors: Record<string, { message?: string }>;
}

export function FormErrorSummary({ errors }: FormErrorSummaryProps) {
  const errorEntries = Object.entries(errors);

  if (errorEntries.length === 0) return null;

  return (
    <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
      <h3 className="font-medium text-destructive mb-2">
        Please fix the following errors:
      </h3>
      <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
        {errorEntries.map(([field, error]) => (
          <li key={field}>
            <span className="font-medium">{field}:</span> {error.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Toast Notifications

```typescript
'use client';

import { useToast } from '@/hooks/useToast';

export function FormWithToast() {
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    try {
      await submitForm(data);
      toast({
        title: 'Success',
        description: 'Your form has been submitted.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  // ...
}
```

---

<!-- /ANCHOR:error-display-patterns -->
<!-- ANCHOR:quick-reference -->
## 9. QUICK REFERENCE

### React Hook Form Cheatsheet

```typescript
// Setup
const form = useForm<T>({
  resolver: zodResolver(schema),
  defaultValues: { ... },
  mode: 'onBlur',
})

// Destructure
const { register, handleSubmit, control, formState, reset, watch, setValue, trigger } = form

// FormState
const { errors, isSubmitting, isValid, isDirty, dirtyFields } = formState

// Registration
<input {...register('fieldName')} />
<Controller name="fieldName" control={control} render={({ field }) => <CustomInput {...field} />} />

// Submission
<form onSubmit={handleSubmit(onSubmit)}>

// Field Arrays
const { fields, append, remove, move, insert } = useFieldArray({ control, name: 'items' })

// Form Provider
<FormProvider {...form}>
  <form>
    {/* useFormContext() available in children */}
  </form>
</FormProvider>
```

### Zod Cheatsheet

```typescript
// Primitives
z.string()
z.number()
z.boolean()
z.date()
z.enum(['a', 'b'])

// Modifiers
.optional()
.nullable()
.min(n)
.max(n)
.email()
.url()
.regex(pattern)
.transform(fn)
.refine(fn, { message })

// Objects
z.object({ ... })
.extend({ ... })
.pick({ field: true })
.omit({ field: true })
.partial()
.deepPartial()
.merge(otherSchema)

// Arrays
z.array(z.string())
.min(1)
.max(10)
.nonempty()

// Unions/Intersections
z.union([schemaA, schemaB])
z.intersection(schemaA, schemaB)
z.discriminatedUnion('type', [...])

// Inference
type T = z.infer<typeof schema>
```

### Checklist: Building Forms

- [ ] Define Zod schema with validation rules
- [ ] Set up useForm with zodResolver
- [ ] Provide defaultValues for all fields
- [ ] Use register() for native inputs
- [ ] Use Controller for custom components
- [ ] Display errors inline with each field
- [ ] Disable submit button when submitting
- [ ] Handle server errors appropriately
- [ ] Add loading/success states
- [ ] Test validation edge cases

---

<!-- /ANCHOR:quick-reference -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

### Related References

- [Component Architecture](./component_architecture.md) - Form component patterns
- [Data Fetching](./data_fetching.md) - Server Actions for form submission
- [State Management](./state_management.md) - Form state persistence
- [React/Next.js Standards](./react_nextjs_standards.md) - File organization
<!-- /ANCHOR:related-resources -->
