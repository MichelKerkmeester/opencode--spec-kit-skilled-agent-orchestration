/* ─────────────────────────────────────────────────────────────
   REACT FORM PATTERNS
   Production-ready forms with React Hook Form + Zod
──────────────────────────────────────────────────────────────── */

'use client';

import {
  forwardRef,
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from 'react';
import {
  useForm,
  useFormContext,
  useFieldArray,
  useWatch,
  Controller,
  FormProvider,
  type UseFormReturn,
  type FieldValues,
  type FieldPath,
  type FieldError,
  type SubmitHandler,
  type DefaultValues,
  type UseFormProps,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/* ─────────────────────────────────────────────────────────────
   1. ZOD SCHEMA PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Common Zod schemas for form validation
 * - Reusable across the application
 * - Type-safe with automatic TypeScript inference
 */

// Primitive field schemas with custom error messages
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number');

export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .or(z.literal(''));

// Complex field schemas
export const dateRangeSchema = z.object({
  start: z.date({ required_error: 'Start date is required' }),
  end: z.date({ required_error: 'End date is required' }),
}).refine((data) => data.end >= data.start, {
  message: 'End date must be after start date',
  path: ['end'],
});

export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

// Form-level schemas
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const registrationFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
  website: urlSchema.optional(),
  phone: phoneSchema.optional().or(z.literal('')),
  address: addressSchema.optional(),
});

// Type inference from schemas
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegistrationFormData = z.infer<typeof registrationFormSchema>;
export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type Address = z.infer<typeof addressSchema>;


/* ─────────────────────────────────────────────────────────────
   2. FORM SETUP PATTERN
──────────────────────────────────────────────────────────────── */

/**
 * useZodForm - Type-safe form hook with Zod resolver
 *
 * @example
 * const form = useZodForm({
 *   schema: loginFormSchema,
 *   defaultValues: { email: '', password: '' },
 * });
 */

interface UseZodFormOptions<T extends z.ZodType> extends Omit<UseFormProps<z.infer<T>>, 'resolver'> {
  schema: T;
}

export function useZodForm<T extends z.ZodType>({
  schema,
  ...options
}: UseZodFormOptions<T>): UseFormReturn<z.infer<T>> {
  return useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    mode: 'onBlur', // Validate on blur for better UX
    ...options,
  });
}

// Form wrapper component with context
interface FormProps<T extends FieldValues> extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
}

export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  ...props
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </FormProvider>
  );
}


/* ─────────────────────────────────────────────────────────────
   3. FIELD COMPONENTS
──────────────────────────────────────────────────────────────── */

/**
 * Type-safe field components that integrate with React Hook Form context
 */

// Field wrapper with label and error display
interface FormFieldProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ name, label, description, required, children }: FormFieldProps) {
  const { formState: { errors } } = useFormContext();
  const error = errors[name] as FieldError | undefined;
  const errorId = error ? `${name}-error` : undefined;
  const descId = description ? `${name}-desc` : undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p id={descId} className="text-sm text-gray-500">
          {description}
        </p>
      )}
      {children}
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}

// Text input field
interface TextFieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'name'> {
  name: string;
  label: string;
  description?: string;
}

export const TextField = forwardRef<ElementRef<'input'>, TextFieldProps>(
  function TextField({ name, label, description, type = 'text', ...props }, ref) {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name] as FieldError | undefined;
    const registration = register(name);

    return (
      <FormField name={name} label={label} description={description} required={props.required}>
        <input
          {...registration}
          ref={(e) => {
            registration.ref(e);
            if (typeof ref === 'function') ref(e);
            else if (ref) ref.current = e;
          }}
          id={name}
          type={type}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={[
            error ? `${name}-error` : undefined,
            description ? `${name}-desc` : undefined,
          ].filter(Boolean).join(' ') || undefined}
          className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          {...props}
        />
      </FormField>
    );
  }
);

// Textarea field
interface TextareaFieldProps extends Omit<ComponentPropsWithoutRef<'textarea'>, 'name'> {
  name: string;
  label: string;
  description?: string;
}

export const TextareaField = forwardRef<ElementRef<'textarea'>, TextareaFieldProps>(
  function TextareaField({ name, label, description, ...props }, ref) {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name] as FieldError | undefined;
    const registration = register(name);

    return (
      <FormField name={name} label={label} description={description} required={props.required}>
        <textarea
          {...registration}
          ref={(e) => {
            registration.ref(e);
            if (typeof ref === 'function') ref(e);
            else if (ref) ref.current = e;
          }}
          id={name}
          aria-invalid={error ? 'true' : undefined}
          className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          {...props}
        />
      </FormField>
    );
  }
);

// Select field
interface SelectFieldProps extends Omit<ComponentPropsWithoutRef<'select'>, 'name'> {
  name: string;
  label: string;
  description?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const SelectField = forwardRef<ElementRef<'select'>, SelectFieldProps>(
  function SelectField({ name, label, description, options, placeholder, ...props }, ref) {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name] as FieldError | undefined;
    const registration = register(name);

    return (
      <FormField name={name} label={label} description={description} required={props.required}>
        <select
          {...registration}
          ref={(e) => {
            registration.ref(e);
            if (typeof ref === 'function') ref(e);
            else if (ref) ref.current = e;
          }}
          id={name}
          aria-invalid={error ? 'true' : undefined}
          className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>
    );
  }
);

// Checkbox field
interface CheckboxFieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'name' | 'type'> {
  name: string;
  label: string;
  description?: string;
}

export const CheckboxField = forwardRef<ElementRef<'input'>, CheckboxFieldProps>(
  function CheckboxField({ name, label, description, ...props }, ref) {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name] as FieldError | undefined;
    const registration = register(name);

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <input
            {...registration}
            ref={(e) => {
              registration.ref(e);
              if (typeof ref === 'function') ref(e);
              else if (ref) ref.current = e;
            }}
            id={name}
            type="checkbox"
            aria-invalid={error ? 'true' : undefined}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            {...props}
          />
          <label htmlFor={name} className="text-sm text-gray-700">
            {label}
          </label>
        </div>
        {description && (
          <p className="text-sm text-gray-500 ml-6">{description}</p>
        )}
        {error && (
          <p className="text-sm text-red-600 ml-6" role="alert">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);


/* ─────────────────────────────────────────────────────────────
   4. FORM SUBMISSION HANDLING
──────────────────────────────────────────────────────────────── */

/**
 * Submit button with loading state
 */
interface SubmitButtonProps extends ComponentPropsWithoutRef<'button'> {
  isLoading?: boolean;
  loadingText?: string;
}

export function SubmitButton({
  isLoading,
  loadingText = 'Submitting...',
  children,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner className="mr-2 h-4 w-4" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

// Form submission hook with async handling
interface UseFormSubmitOptions<T> {
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: Error) => void;
  successMessage?: string;
}

export function useFormSubmit<T>(
  submitFn: (data: T) => Promise<void>,
  options: UseFormSubmitOptions<T> = {}
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = useCallback(
    async (data: T) => {
      setIsSubmitting(true);
      setSubmitError(null);
      setIsSuccess(false);

      try {
        await submitFn(data);
        setIsSuccess(true);
        await options.onSuccess?.(data);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setSubmitError(err);
        options.onError?.(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [submitFn, options]
  );

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setSubmitError(null);
    setIsSuccess(false);
  }, []);

  return {
    handleSubmit,
    isSubmitting,
    submitError,
    isSuccess,
    reset,
  };
}


/* ─────────────────────────────────────────────────────────────
   5. ERROR DISPLAY PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Form-level error display
 */
interface FormErrorProps {
  error: Error | string | null;
}

export function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  const message = typeof error === 'string' ? error : error.message;

  return (
    <div className="rounded-md bg-red-50 p-4" role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-red-800">{message}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Success message display
 */
interface FormSuccessProps {
  message: string;
  show: boolean;
}

export function FormSuccess({ message, show }: FormSuccessProps) {
  if (!show) return null;

  return (
    <div className="rounded-md bg-green-50 p-4" role="status">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">{message}</p>
        </div>
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────
   6. MULTI-STEP FORM PATTERN
──────────────────────────────────────────────────────────────── */

/**
 * Multi-step form with shared state and navigation
 */

interface MultiStepFormContextValue<T extends FieldValues> {
  form: UseFormReturn<T>;
  currentStep: number;
  totalSteps: number;
  goToStep: (step: number) => void;
  nextStep: () => Promise<boolean>;
  prevStep: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const MultiStepFormContext = createContext<MultiStepFormContextValue<FieldValues> | null>(null);

export function useMultiStepForm<T extends FieldValues>() {
  const context = useContext(MultiStepFormContext);
  if (!context) {
    throw new Error('useMultiStepForm must be used within MultiStepFormProvider');
  }
  return context as MultiStepFormContextValue<T>;
}

interface StepConfig<T extends FieldValues> {
  id: string;
  title: string;
  fields: Array<FieldPath<T>>;
  component: React.ComponentType;
}

interface MultiStepFormProviderProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  steps: Array<StepConfig<T>>;
  onComplete: SubmitHandler<T>;
  children: ReactNode;
}

export function MultiStepFormProvider<T extends FieldValues>({
  form,
  steps,
  onComplete,
  children,
}: MultiStepFormProviderProps<T>) {
  const [currentStep, setCurrentStep] = useState(0);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  }, [steps.length]);

  const nextStep = useCallback(async (): Promise<boolean> => {
    const currentStepConfig = steps[currentStep];
    const isValid = await form.trigger(currentStepConfig.fields);

    if (isValid) {
      if (currentStep === steps.length - 1) {
        await form.handleSubmit(onComplete)();
        return true;
      }
      setCurrentStep((prev) => prev + 1);
      return true;
    }

    return false;
  }, [form, steps, currentStep, onComplete]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const value: MultiStepFormContextValue<T> = {
    form: form as UseFormReturn<T>,
    currentStep,
    totalSteps: steps.length,
    goToStep,
    nextStep,
    prevStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
  };

  return (
    <MultiStepFormContext.Provider value={value as MultiStepFormContextValue<FieldValues>}>
      <FormProvider {...form}>
        {children}
      </FormProvider>
    </MultiStepFormContext.Provider>
  );
}

// Step indicator component
interface StepIndicatorProps {
  steps: Array<{ id: string; title: string }>;
}

export function StepIndicator({ steps }: StepIndicatorProps) {
  const { currentStep, goToStep } = useMultiStepForm();

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const status = index < currentStep ? 'complete' : index === currentStep ? 'current' : 'upcoming';

          return (
            <li key={step.id} className="relative flex items-center">
              {index > 0 && (
                <div
                  className={`h-0.5 w-16 mx-2 ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  aria-hidden="true"
                />
              )}
              <button
                type="button"
                onClick={() => status === 'complete' && goToStep(index)}
                disabled={status === 'upcoming'}
                className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                  status === 'complete'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : status === 'current'
                    ? 'border-2 border-blue-600 bg-white'
                    : 'border-2 border-gray-300 bg-white'
                }`}
                aria-current={status === 'current' ? 'step' : undefined}
              >
                {status === 'complete' ? (
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span
                    className={
                      status === 'current' ? 'text-blue-600' : 'text-gray-500'
                    }
                  >
                    {index + 1}
                  </span>
                )}
                <span className="sr-only">{step.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Navigation buttons
export function StepNavigation() {
  const { isFirstStep, isLastStep, prevStep, nextStep } = useMultiStepForm();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNext = async () => {
    setIsNavigating(true);
    await nextStep();
    setIsNavigating(false);
  };

  return (
    <div className="flex justify-between pt-6">
      <button
        type="button"
        onClick={prevStep}
        disabled={isFirstStep}
        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        type="button"
        onClick={handleNext}
        disabled={isNavigating}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isNavigating ? (
          <Spinner className="h-5 w-5" />
        ) : isLastStep ? (
          'Submit'
        ) : (
          'Next'
        )}
      </button>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────
   7. COMPLETE FORM EXAMPLES
──────────────────────────────────────────────────────────────── */

/**
 * Example: Login Form
 */
export function LoginForm({ onSubmit }: { onSubmit: (data: LoginFormData) => Promise<void> }) {
  const form = useZodForm({
    schema: loginFormSchema,
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const { handleSubmit, isSubmitting, submitError } = useFormSubmit(onSubmit);

  return (
    <Form form={form} onSubmit={handleSubmit} className="space-y-6">
      <FormError error={submitError} />

      <TextField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
      />

      <TextField
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        required
      />

      <CheckboxField
        name="rememberMe"
        label="Remember me"
      />

      <SubmitButton isLoading={isSubmitting}>
        Sign in
      </SubmitButton>
    </Form>
  );
}

/**
 * Example: Registration Form with password confirmation
 */
export function RegistrationForm({
  onSubmit,
}: {
  onSubmit: (data: RegistrationFormData) => Promise<void>;
}) {
  const form = useZodForm({
    schema: registrationFormSchema,
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      acceptTerms: false as unknown as true, // Type workaround for literal type
    },
  });

  const { handleSubmit, isSubmitting, submitError, isSuccess } = useFormSubmit(onSubmit, {
    successMessage: 'Account created successfully!',
  });

  // Watch password for real-time strength indicator
  const password = useWatch({ control: form.control, name: 'password' });

  return (
    <Form form={form} onSubmit={handleSubmit} className="space-y-6">
      <FormError error={submitError} />
      <FormSuccess message="Account created successfully!" show={isSuccess} />

      <div className="grid grid-cols-2 gap-4">
        <TextField name="firstName" label="First name" required />
        <TextField name="lastName" label="Last name" required />
      </div>

      <TextField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
      />

      <div className="space-y-2">
        <TextField
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          required
        />
        {password && <PasswordStrengthIndicator password={password} />}
      </div>

      <TextField
        name="confirmPassword"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        required
      />

      <CheckboxField
        name="acceptTerms"
        label="I accept the terms and conditions"
        required
      />

      <SubmitButton isLoading={isSubmitting}>
        Create account
      </SubmitButton>
    </Form>
  );
}

/**
 * Example: Multi-step onboarding form
 */
const onboardingSchema = z.object({
  // Step 1: Personal info
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  // Step 2: Contact info
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  // Step 3: Preferences
  newsletter: z.boolean(),
  notifications: z.enum(['all', 'important', 'none']),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

export function OnboardingForm({
  onComplete,
}: {
  onComplete: (data: OnboardingData) => Promise<void>;
}) {
  const form = useZodForm({
    schema: onboardingSchema,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      newsletter: true,
      notifications: 'important',
    },
  });

  const steps: Array<StepConfig<OnboardingData>> = [
    {
      id: 'personal',
      title: 'Personal Info',
      fields: ['firstName', 'lastName'],
      component: PersonalInfoStep,
    },
    {
      id: 'contact',
      title: 'Contact Info',
      fields: ['email', 'phone'],
      component: ContactInfoStep,
    },
    {
      id: 'preferences',
      title: 'Preferences',
      fields: ['newsletter', 'notifications'],
      component: PreferencesStep,
    },
  ];

  return (
    <MultiStepFormProvider form={form} steps={steps} onComplete={onComplete}>
      <div className="space-y-8">
        <StepIndicator steps={steps} />
        <MultiStepContent steps={steps} />
        <StepNavigation />
      </div>
    </MultiStepFormProvider>
  );
}

function MultiStepContent({ steps }: { steps: Array<StepConfig<OnboardingData>> }) {
  const { currentStep } = useMultiStepForm<OnboardingData>();
  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-[200px]">
      <CurrentStepComponent />
    </div>
  );
}

function PersonalInfoStep() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Personal Information</h2>
      <TextField name="firstName" label="First name" required />
      <TextField name="lastName" label="Last name" required />
    </div>
  );
}

function ContactInfoStep() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Contact Information</h2>
      <TextField name="email" label="Email" type="email" required />
      <TextField name="phone" label="Phone (optional)" type="tel" />
    </div>
  );
}

function PreferencesStep() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Your Preferences</h2>
      <CheckboxField name="newsletter" label="Subscribe to newsletter" />
      <SelectField
        name="notifications"
        label="Notification preferences"
        options={[
          { value: 'all', label: 'All notifications' },
          { value: 'important', label: 'Important only' },
          { value: 'none', label: 'None' },
        ]}
      />
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────
   8. UTILITY COMPONENTS
──────────────────────────────────────────────────────────────── */

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className ?? ''}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function PasswordStrengthIndicator({ password }: { password: string }) {
  const getStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Fair', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const { score, label, color } = getStrength(password);
  const percentage = Math.min((score / 6) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">Password strength: {label}</p>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  // Schemas
  emailSchema,
  passwordSchema,
  phoneSchema,
  urlSchema,
  dateRangeSchema,
  addressSchema,
  loginFormSchema,
  registrationFormSchema,
  profileFormSchema,
  // Form setup
  useZodForm,
  Form,
  // Field components
  FormField,
  TextField,
  TextareaField,
  SelectField,
  CheckboxField,
  // Submission
  SubmitButton,
  useFormSubmit,
  // Messages
  FormError,
  FormSuccess,
  // Multi-step
  MultiStepFormProvider,
  useMultiStepForm,
  StepIndicator,
  StepNavigation,
  // Complete forms
  LoginForm,
  RegistrationForm,
  OnboardingForm,
  // Utilities
  PasswordStrengthIndicator,
};

export type {
  LoginFormData,
  RegistrationFormData,
  ProfileFormData,
  Address,
  StepConfig,
};
