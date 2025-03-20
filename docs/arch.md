# ShipEasy SaaS Template Architecture

## Overview

ShipEasy is a monorepo-based SaaS template that provides a comprehensive foundation for building subscription-based web applications. It includes user management, authentication, payment processing, and administration functionality. The template is implemented in both Next.js and Nuxt.js to provide flexibility based on developer preferences, leveraging their built-in backend capabilities.

## Core Features

- User authentication (Email/Password + OAuth providers)
- Role-based authorization
- Subscription management and payment processing
- Admin dashboard
- Multi-tenancy support
- API services
- Organization management with team permissions
- Shared backend logic across frameworks
- Consistent UI/UX across framework implementations

## Technology Stack

### Frontend & Backend Frameworks
- **Next.js** (React-based)
  - Server Components
  - API Routes (App Router)
  - Middleware
  - Server Actions
- **Nuxt.js** (Vue-based)
  - Nuxt Server Engine
  - Server API Routes
  - Nitro server
  - Server Middleware

### UI & Design System
- **Design Tokens** as framework-agnostic style definitions
- **CSS Strategy**:
  - **TailwindCSS** for utility-first styling across frameworks
  - **CSS Variables** for theming and design consistency
- **React Components**:
  - **shadcn/ui** (for Next.js implementation)
- **Vue Components**:
  - **Nuxt UI** or **Radix Vue** (for Nuxt.js implementation)
- **Design Assets**:
  - Shared icons, illustrations, and media

### Shared Backend
- **Core Business Logic** implemented as framework-agnostic modules
- **Unified API Layer** with TypeScript interfaces and implementations
- **Service Adapters** for framework-specific integration

### Database
- **PostgreSQL** as the primary database
- **Drizzle ORM** for database access (Better-Auth compatible)
- **Redis** for caching and session management

### Authentication
- **Better-Auth** for authentication across all frameworks
  - Framework-agnostic implementation
  - Email & password authentication
  - OAuth social providers (Google, GitHub, Discord, etc.)
  - Two-factor authentication
  - Organization & team management
  - Session management
  - Plugin ecosystem

### Payment Processing
- **Stripe** integration for subscription management

### Deployment & Infrastructure
- **Vercel** for Next.js deployment (with serverless functions)
- **Netlify** or **Cloudflare Pages** for Nuxt.js deployment
- **Edge Functions** for global distribution
- **GitHub Actions** for CI/CD
- **Docker** for local development consistency

## Monorepo Structure

```
shipeasy/
├── apps/
│   ├── next-app/               # Next.js implementation
│   │   ├── app/                # App Router
│   │   │   ├── api/            # API Routes (thin adapters to core logic)
│   │   │   ├── auth/           # Auth endpoints with Better-Auth
│   │   │   └── dashboard/      # User dashboard
│   │   └── admin/              # Admin interfaces
│   ├── nuxt-app/               # Nuxt.js implementation
│   │   ├── pages/              # Pages directory
│   │   ├── server/             # Server APIs
│   │   │   ├── api/            # API endpoints (thin adapters to core logic)
│   │   │   ├── auth/           # Auth endpoints with Better-Auth
│   │   │   ├── routes/         # Server routes
│   │   │   └── middleware/     # Server middleware
│   │   └── admin/              # Admin interfaces
│   └── docs/                   # Documentation site
├── packages/
│   ├── database/               # Shared database schema and migrations
│   ├── config/                 # Shared configuration
│   ├── ui/                     # Shared UI assets and design tokens
│   │   ├── design-tokens/      # Framework-agnostic design variables
│   │   ├── tailwind-config/    # Base Tailwind configuration
│   │   ├── themes/             # Light/dark mode themes
│   │   ├── react-components/   # React UI components for Next.js
│   │   └── vue-components/     # Vue UI components for Nuxt.js
│   ├── utils/                  # Common utilities
│   ├── auth/                   # Shared Better-Auth configuration and components
│   └── core/                   # Shared backend business logic
│       ├── services/           # Core service implementations
│       │   ├── user/           # User management services
│       │   ├── billing/        # Subscription and payment services
│       │   ├── tenant/         # Multi-tenancy services
│       │   └── admin/          # Admin functionality
│       ├── models/             # Data models and interfaces
│       ├── validation/         # Validation schemas
│       └── errors/             # Error handling and types
├── tools/                      # Development and build tools
├── docs/                       # Architecture documentation
└── package.json                # Root package.json for workspaces
```

## Development Workflow

1. **Setup**: Initialize monorepo with pnpm/yarn/npm workspaces
2. **Core Packages**: Develop shared packages (database, UI components, utilities)
3. **Core Backend Logic**: Implement framework-agnostic business logic in shared packages
4. **Auth Setup**: Configure Better-Auth with PostgreSQL and Drizzle ORM
5. **Next.js App**: Implement Next.js application with thin API adapters to core logic
6. **Nuxt.js App**: Implement Nuxt.js application with thin API adapters to core logic
7. **Admin**: Build admin interfaces for both implementations
8. **Deployment**: Set up CI/CD pipelines and cloud deployments

## Next Steps

1. Set up monorepo structure with workspace configuration
2. Initialize database schema with Drizzle ORM (for Better-Auth compatibility)
3. Design and implement core backend services as shared packages
4. Implement Better-Auth with email/password and OAuth providers
5. Configure two-factor authentication and organization features
6. Create API adapters in Next.js and Nuxt.js that use the shared core logic
7. Develop frontend interfaces in both frameworks
8. Integrate payment processing with Stripe
9. Build admin interfaces
10. Configure deployments for both frameworks

## Technical Considerations

- **Full-Stack Framework Utilization**: Leverage built-in backend capabilities of Next.js and Nuxt.js
- **Auth Ownership**: Own your authentication with Better-Auth instead of using SaaS auth providers
- **Type Safety**: Ensure type safety across the entire stack with TypeScript
- **Security**: Implement proper authentication, authorization, and data validation
- **Performance**: Use edge functions and caching strategies for optimal performance
- **Scalability**: Design with horizontal scaling in mind
- **Developer Experience**: Create a seamless development experience with consistent tooling across both implementations
- **Code Reusability**: Maximize shared logic to minimize duplication between frameworks
- **Design Consistency**: Ensure UI/UX consistency across different framework implementations

## Authentication Implementation

The authentication system will be based on Better-Auth, providing a consistent experience across both Next.js and Nuxt.js implementations:

```typescript
// Example Better-Auth configuration (packages/auth/config.ts)
export const auth = betterAuth({
  database: dbClient, // PostgreSQL with Drizzle ORM
  emailAndPassword: {
    enabled: true,
  },
  oauth: {
    providers: [
      github({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }),
      google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ],
  },
  plugins: [
    organization(), // Multi-tenant support
    twoFactor(),    // 2FA support
  ],
})
```

This configuration will be shared between both Next.js and Nuxt.js implementations, ensuring consistent auth behavior across the entire platform.

## Shared Backend Logic

To avoid duplicating backend logic across frameworks, we'll implement a framework-agnostic core business logic layer. This approach offers several advantages:

1. **Write Once, Use Everywhere**: Core logic only needs to be implemented once
2. **Simplified Testing**: Test core logic independently of framework specifics
3. **Consistency**: Ensure identical behavior across frameworks
4. **Maintainability**: Easier to maintain and update a single implementation

### Implementation Approach

```typescript
// Example service implementation (packages/core/services/subscription/index.ts)
export class SubscriptionService {
  constructor(private db: Database) {}

  async createSubscription(userId: string, planId: string): Promise<Subscription> {
    // Business logic for creating a subscription
    const subscription = await this.db.subscriptions.create({
      userId,
      planId,
      status: 'active',
      createdAt: new Date(),
    });
    
    // Additional business logic (e.g., send welcome email, update user role)
    return subscription;
  }

  async cancelSubscription(subscriptionId: string): Promise<Subscription> {
    // Business logic for canceling subscriptions
    return await this.db.subscriptions.update({
      where: { id: subscriptionId },
      data: {
        status: 'canceled',
        canceledAt: new Date(),
      },
    });
  }
}

// Framework-specific adapter for Next.js (apps/next-app/app/api/subscription/route.ts)
import { SubscriptionService } from '@shipeasy/core/services/subscription';
import { db } from '@shipeasy/database';

export async function POST(request: Request) {
  const subscriptionService = new SubscriptionService(db);
  const data = await request.json();
  
  try {
    const subscription = await subscriptionService.createSubscription(
      data.userId,
      data.planId
    );
    return Response.json({ subscription });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

// Framework-specific adapter for Nuxt.js (apps/nuxt-app/server/api/subscription.post.ts)
import { SubscriptionService } from '@shipeasy/core/services/subscription';
import { db } from '@shipeasy/database';

export default defineEventHandler(async (event) => {
  const subscriptionService = new SubscriptionService(db);
  const data = await readBody(event);
  
  try {
    const subscription = await subscriptionService.createSubscription(
      data.userId,
      data.planId
    );
    return { subscription };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }
});
```

### Dependency Injection

For more complex scenarios, we can use a dependency injection pattern to make services more testable and maintainable:

```typescript
// Service interfaces (packages/core/services/interfaces.ts)
export interface IUserService {
  createUser(data: UserCreateDto): Promise<User>;
  getUserById(id: string): Promise<User | null>;
}

export interface IEmailService {
  sendWelcomeEmail(user: User): Promise<void>;
}

// Implementation (packages/core/services/user/user.service.ts)
export class UserService implements IUserService {
  constructor(
    private db: Database,
    private emailService: IEmailService,
  ) {}

  async createUser(data: UserCreateDto): Promise<User> {
    const user = await this.db.users.create({ data });
    await this.emailService.sendWelcomeEmail(user);
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.db.users.findUnique({ where: { id } });
  }
}
```

This architecture allows us to maintain a clean separation of concerns while maximizing code reuse between frameworks.

## UI Components & Styling Approach

While React and Vue components cannot be directly shared, we can adopt strategies to maintain design consistency and reduce duplication:

### Design Token Approach

```js
// packages/ui/design-tokens/colors.js
module.exports = {
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      // ... more shades
      600: '#0284c7',
      700: '#0369a1',
    },
    // ... other color categories
  },
  // ... other token types
};
```

These tokens can be used to configure both React and Vue component libraries, ensuring visual consistency.

### Tailwind CSS Configuration

```js
// packages/ui/tailwind-config/index.js
const colors = require('../design-tokens/colors');

module.exports = {
  theme: {
    colors: colors.colors,
    // ... other theme settings
  },
  // ... other Tailwind configurations
};
```

This base configuration can be extended in both Next.js and Nuxt.js applications.

### Component Implementation

While the component implementations will differ between React and Vue, they can share:

- Visual design and behavior specifications
- Props/events API patterns
- Style and theme variables
- Accessibility requirements

#### React Component Example (Next.js)

```tsx
// packages/ui/react-components/Button/Button.tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700',
        secondary: 'bg-secondary-200 text-secondary-900 hover:bg-secondary-300',
        // ... other variants
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 py-1',
        lg: 'h-12 px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props} />
  );
}
```

#### Vue Component Example (Nuxt.js)

```vue
<!-- packages/ui/vue-components/Button/Button.vue -->
<template>
  <button :class="classes" v-bind="$attrs">
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'secondary', 'outline'].includes(value),
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'sm', 'lg'].includes(value),
  },
});

const classes = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2';
  
  const variantClasses = {
    default: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-secondary-200 text-secondary-900 hover:bg-secondary-300',
    outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
  };
  
  const sizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 py-1',
    lg: 'h-12 px-6 py-3',
  };
  
  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
  ];
});
</script>
```

### Component Documentation & Design System

To ensure consistency between implementations, a shared documentation site can include:

- Component specifications and usage guidelines
- Design patterns and principles
- Visual regression testing
- Interactive examples of both React and Vue implementations

By following these patterns, we can maintain a consistent user experience across both Next.js and Nuxt.js implementations while leveraging the best component libraries for each framework. 