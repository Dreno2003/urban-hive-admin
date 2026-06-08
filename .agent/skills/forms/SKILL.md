---
name: forms
description: Authoritative guide for form management using Formik and Yup at Urban Hive.
---

# Form Management Skill

This skill defines the standard patterns, rules, and best practices for implementing forms across the Urban Hive platform. We use **Formik** (specifically the `useFormik` hook) for state management and **Yup** for schema-based validation.

## 🎯 Mission
To provide a consistent, robust, and user-friendly form experience that minimizes boilerplate while maximizing validation accuracy and accessibility.

## 🛠 Tech Stack
- **State Management**: [Formik](https://formik.org/docs/overview) (`useFormik` hook)
- **Validation**: [Yup](https://github.com/jquense/yup)
- **UI Components**: Shared UI library (Input, Button, Choice, etc.)

---

## 📏 Authoritative Rules

### 1. Hook-First Approach
Always use the `useFormik` hook instead of the `<Formik />` component wrapper for better flexibility and cleaner logic separation.

### 2. Centralized Validation Schemas
Define validation schemas using `yup` outside the component or in a dedicated `schemas.ts` file for reusability and testing.

### 3. Native Form Elements
Wrap fields in a standard HTML `<form>` tag and use `formik.handleSubmit` for the `onSubmit` handler to ensure proper event handling and browser defaults (like "Enter to submit").

### 4. Direct Binding
Bind value and change handlers directly to custom components:
- `value={formik.values.fieldName}`
- `onChange={formik.handleChange}`
- `onBlur={formik.handleBlur}`

### 5. Error Timing
Only show validation errors if the field has been visited (`formik.touched.fieldName`) and an error exists (`formik.errors.fieldName`).

---

## 💻 Implementation Guide

### Basic Pattern

```tsx
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Too short').required('Required'),
});

export function LoginForm() {
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values) => {
      // Handle submission
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && formik.errors.email}
        />
      </div>
      
      <div className="space-y-1">
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && formik.errors.password}
        />
      </div>

      <Button type="submit" loading={formik.isSubmitting}>
        Sign In
      </Button>
    </form>
  );
}
```

### Handling Complex Components (Selects/Toggles)

For components that don't provide a standard `event.target` object, use `formik.setFieldValue`:

```tsx
<DropdownMenu>
  {/* ... country selection ... */}
  <DropdownMenuItem 
    onClick={() => formik.setFieldValue('countryCode', country.code)}
  >
    {country.name}
  </DropdownMenuItem>
</DropdownMenu>
```

---

## 🚨 Error Handling Strategy

1. **Inline Validation**: Show errors immediately under the field.
2. **Form-Level Errors**: Use a global `error` state (or `formik.setStatus`) for API errors like "Invalid credentials".
3. **Submit Blocking**: Ensure the submit button is disabled or shows a loading state during async operations.

## 🧪 Common Validation Patterns

| Field | Yup Pattern |
| :--- | :--- |
| Email | `Yup.string().email('Invalid email').required('Required')` |
| Password | `Yup.string().min(8, 'Minimum 8 characters').required('Required')` |
| Phone | `Yup.string().matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')` |
| Required | `Yup.string().required('This field is required')` |

## 🔗 Best Practices
- **Persistence**: Don't clear form values on failed submission unless necessary for security (like passwords).
- **Accessibility**: Use `aria-invalid` and `aria-describedby` that point to error messages.
- **Micro-interactions**: Use subtle transitions when error messages appear/disappear.
