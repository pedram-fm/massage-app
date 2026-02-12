# 🎨 Frontend Development Guide

> Next.js frontend setup and development

## Prerequisites

- Node.js >= 20.x
- npm >= 10.x
- Git

---

## Installation

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd massage-app/massage-app-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Frontend URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### 4. Start Development Server

```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

---

## Project Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run Jest tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

---

## Project Structure

```
app/
├── admin/                        # Admin panel (protected)
│   ├── layout.tsx                # Admin sidebar layout
│   ├── todos/page.tsx            # Kanban board
│   ├── logs/page.tsx             # Log monitor
│   └── appointments/page.tsx     # Appointment management
├── api/                          # API routes (server-side)
│   ├── todos/route.ts            # TODO CRUD operations
│   └── logs/tail/route.ts        # Log fetching
├── auth/                         # Authentication pages
│   └── login/page.tsx            # Login & Register
├── dashboard/                    # User dashboard
│   ├── layout.tsx
│   └── page.tsx
├── layout.tsx                    # Root layout
├── page.tsx                      # Landing page
└── globals.css                   # Global styles

components/
├── admin/                        # Admin components
│   ├── DashboardModals.tsx
│   └── NewReservationModal.tsx
├── auth/                         # Auth components
│   ├── Register.tsx
│   ├── ForgotPassword.tsx
│   └── OTPModal.tsx
├── shared/                       # Shared components
│   ├── ThemeToggle.tsx
│   ├── CloudCompanion.tsx
│   └── FloatingElements.tsx
└── ui/                           # Base UI components
    ├── Button.tsx
    ├── Input.tsx
    └── Card.tsx

hooks/
└── auth/                         # Custom hooks
    ├── useRegisterForm.ts
    └── useAuthApi.ts

lib/
└── api.ts                        # API utilities
```

---

## Key Technologies

### Core Framework
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **React 19**: UI library

### Styling
- **Tailwind CSS**: Utility-first CSS
- **CSS Variables**: Theme customization
- **Dark Mode**: System preference detection

### UI & Animation
- **Framer Motion**: Smooth animations
- **@dnd-kit**: Drag-and-drop (Kanban)
- **Lucide React**: Icon library

### Form Handling
- **React Hook Form**: Form management
- **Zod**: Schema validation

---

## Development Guidelines

### 1. Component Structure

```tsx
// components/shared/Button.tsx
'use client'; // Only if using client-side features

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### 2. API Calls

```typescript
// lib/api.ts
export async function fetchAppointments() {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch appointments');
  }

  return response.json();
}
```

### 3. Custom Hooks

```typescript
// hooks/useAppointments.ts
import { useState, useEffect } from 'react';

export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAppointments();
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { appointments, loading, error };
}
```

### 4. Server Components

```tsx
// app/appointments/page.tsx
import { getAppointments } from '@/lib/api';

export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div>
      <h1>Appointments</h1>
      {appointments.map(apt => (
        <div key={apt.id}>{apt.service.name}</div>
      ))}
    </div>
  );
}
```

---

## Styling Guide

### Using Tailwind CSS

```tsx
<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
  <p className="mt-2 text-sm text-gray-600">Description</p>
</div>
```

### Using CSS Variables

```css
/* app/globals.css */
:root {
  --brand: #13743d;
  --brand-foreground: #f8f1e9;
  --surface: #ffffff;
  --surface-muted: #e5e7eb;
  --muted-text: #6b7280;
}

[data-theme="dark"] {
  --brand: #4ade80;
  --surface: #1f2937;
  --surface-muted: #374151;
}
```

```tsx
<div className="bg-[color:var(--surface)] text-[color:var(--brand)]">
  Themed Content
</div>
```

### RTL Support

```tsx
<div dir="rtl">
  {/* Persian/Arabic content */}
  <p>محتوای فارسی</p>
</div>
```

---

## State Management

### Local State (useState)

```tsx
const [count, setCount] = useState(0);
```

### Complex State (useReducer)

```tsx
const [state, dispatch] = useReducer(reducer, initialState);

dispatch({ type: 'INCREMENT' });
```

### Server State

```tsx
// Using SWR
import useSWR from 'swr';

const { data, error, mutate } = useSWR('/api/appointments', fetcher);
```

---

## Performance Optimization

### 1. React.memo

```tsx
export const TaskCard = memo(function TaskCard({ task }) {
  return <div>{task.title}</div>;
});
```

### 2. useMemo

```tsx
const filteredTasks = useMemo(
  () => tasks.filter(t => t.status === 'todo'),
  [tasks]
);
```

### 3. useCallback

```tsx
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);
```

### 4. Dynamic Imports

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

---

## Testing

### Unit Tests (Jest)

```typescript
// components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### E2E Tests (Cypress)

```javascript
// cypress/e2e/login.cy.js
describe('Login Flow', () => {
  it('should login successfully', () => {
    cy.visit('/auth/login');
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

---

## Build & Deployment

### Production Build

```bash
# Build
npm run build

# Start production server
npm run start
```

### Docker Build

```bash
# Build image
docker build -t massage-app-frontend .

# Run container
docker run -p 3000:3000 massage-app-frontend
```

### Environment Variables

**Production (.env.production)**:
```env
NEXT_PUBLIC_API_URL=https://api.massage-app.com
NEXT_PUBLIC_APP_URL=https://massage-app.com
NODE_ENV=production
```

---

## Troubleshooting

### Issue: "Module not found"

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Issue: TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf .next node_modules
npm install
npm run type-check
```

### Issue: Styling Not Applied

```bash
# Rebuild Tailwind
npm run dev
# Force browser refresh (Ctrl + Shift + R)
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated**: February 12, 2026
