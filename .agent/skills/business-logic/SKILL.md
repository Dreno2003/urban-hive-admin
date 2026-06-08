# Business Logic Skill

Business logic is the core functionality of your app — state management, data transformations, API interactions, and complex computations. This skill defines patterns for keeping it clean, testable, and maintainable.

---

## Core Principles

1. **Separation of Concerns** — Business logic lives in hooks and services, never in components.
2. **Testability** — Pure functions where possible; side effects isolated and mockable.
3. **Reusability** — Logic exported and used across multiple components.
4. **Clarity** — Naming and structure make intent obvious.
5. **Type Safety** — Full TypeScript coverage; never use `any`.
6. **Internationalization (i18n)** — Internationalisation is a MUST in any feature for every static content.
7. **Single Responsibility Principle (SRP)** — Each module, hook, page, or layout component must have one reason to change. Deconstruct massive files (like routing layout files) into focused subcomponents (e.g. `Sidebar`, `DashboardHeader`) to maintain high maintainability.
8. **Split by Feature and Reusability** — Place domain-specific logic inside feature folders (e.g. `features/auth/`), and export generic layout structures (such as sidebars, headers, and standard wrappers) to the `shared/` directory to share them across multiple page routes.

---

## Architecture Patterns

### Services (Axios — API & External Calls)

Services handle all HTTP communication using **axios**. They are plain async functions or class statics — no React, no hooks.

**Location:** `features/[feature]/services/` or `shared/services/`

**Setup — shared axios instance:**
```typescript
// shared/services/apiClient.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token on every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message ?? `HTTP ${error.response?.status}`
      : 'Unexpected error';
    return Promise.reject(new Error(message));
  },
);
```

**Structure — one file per domain:**
```typescript
// features/users/services/userService.ts
import { apiClient } from '@/shared/services/apiClient';
import type { User, CreateUserPayload, UpdateUserPayload } from '../types';

export const userService = {
  async fetchAll(): Promise<User[]> {
    const { data } = await apiClient.get<User[]>('/users');
    return data;
  },

  async fetchById(id: string): Promise<User> {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const { data } = await apiClient.post<User>('/users', payload);
    return data;
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const { data } = await apiClient.patch<User>(`/users/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
```

**Rules:**
- Always use the shared `apiClient` instance, never bare `fetch` or `axios.get()`
- Destructure `{ data }` from the axios response; return typed data, not the full response
- Let the global interceptor handle error normalization; don't swallow errors silently
- One service file per domain: `userService`, `postService`, `authService`
- Keep URLs relative — base URL lives in `apiClient`
- if i prefix a chat with /no-impl, do not carry out the implementation, just tell me about steps you are to take to implement it, and ask me if i want to proceed with the implementation

---

### Query Hooks (TanStack Query — reads)

Use `useQuery` for all data fetching. Wrap it in a custom hook to hide TanStack internals from components.

**Location:** `features/[feature]/hooks/`

```typescript
// features/users/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';
import type { User } from '../types';

export function useUsers() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: userService.fetchAll,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  return {
    users: data ?? [],
    isLoading,
    error,
    refetch,
  };
}
```

```typescript
// features/users/hooks/useUser.ts
import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';
import type { User } from '../types';

export function useUser(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.fetchById(id),
    enabled: Boolean(id), // skip query if id is empty
  });

  return {
    user: data as User | undefined,
    isLoading,
    error,
  };
}
```

**Rules:**
- Always set a typed `queryKey` — it drives caching and invalidation
- Use `enabled` to guard against undefined or empty params
- Return a simplified object, never the raw `useQuery` result
- Set `staleTime` to avoid unnecessary refetches
- Use `select` to transform or filter data without extra computation in the component

---

### Mutation Hooks (TanStack Query — writes)

Use `useMutation` for all create / update / delete operations. Invalidate related queries in `onSuccess`.

```typescript
// features/users/hooks/useCreateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import type { CreateUserPayload } from '../types';

export function useCreateUser() {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error } = useMutation({
    mutationFn: (payload: CreateUserPayload) => userService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return { createUser: mutate, createUserAsync: mutateAsync, isPending, error };
}
```

```typescript
// features/users/hooks/useDeleteUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (id: string) => userService.remove(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.removeQueries({ queryKey: ['users', id] });
    },
  });

  return { deleteUser: mutate, isPending, error };
}
```

**Rules:**
- One hook per mutation (create, update, delete) — not one "god" mutation hook
- Always invalidate or update the cache in `onSuccess`
- Expose `mutate` (fire-and-forget) **and** `mutateAsync` (awaitable, for chaining) when useful
- Handle optimistic updates with `onMutate` / `onError` / `onSettled` when UX demands it

**Optimistic update example:**
```typescript
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      userService.update(id, payload),

    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['users', id] });
      const previous = queryClient.getQueryData<User>(['users', id]);
      queryClient.setQueryData(['users', id], (old: User) => ({ ...old, ...payload }));
      return { previous };
    },

    onError: (_err, { id }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['users', id], context.previous);
      }
    },

    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
}
```

---

### Computed Hooks (Derived State)

For expensive derivations or composed logic, keep pure hooks separate from data hooks.

```typescript
// features/users/hooks/useUserStats.ts
import { useMemo } from 'react';
import type { User } from '../types';

export function useUserStats(user: User | undefined) {
  return useMemo(() => {
    if (!user) return { isActive: false, tier: 'free', badges: [] };

    const isActive = user.lastLogin
      ? Date.now() - user.lastLogin < 7 * 24 * 60 * 60 * 1000
      : false;

    const tier = (user.posts?.length ?? 0) > 50 ? 'premium' : 'free';

    const badges = [
      user.verified && 'verified',
      user.moderator && 'moderator',
    ].filter(Boolean) as string[];

    return { isActive, tier, badges };
  }, [user]);
}
```

---

## Data Flow

| State type | Tool | When to use |
|---|---|---|
| Server data (reads) | `useQuery` | Any data fetched from an API |
| Server data (writes) | `useMutation` | Create, update, delete |
| UI/local state | `useState` | Modals, toggles, filters |
| Derived/expensive | `useMemo` | Computed values from existing state |

---

## Type Safety

Define all types in the feature's `types/index.ts`:

```typescript
// features/users/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  lastLogin: number;
  posts: string[];
  verified: boolean;
  moderator: boolean;
}

export type CreateUserPayload = Pick<User, 'name' | 'email'>;
export type UpdateUserPayload = Partial<Pick<User, 'name' | 'email'>>;
```

Use them in both services and hooks — never `any`, never inline type casting except where necessary at the service boundary.

---

## Testing

**Services:** mock `apiClient` with `axios-mock-adapter` or `msw`:
```typescript
describe('userService.fetchById', () => {
  it('returns user data', async () => {
    mockAdapter.onGet('/users/123').reply(200, { id: '123', name: 'Ada' });
    const user = await userService.fetchById('123');
    expect(user.id).toBe('123');
  });
});
```

**Hooks:** wrap with `QueryClientWrapper` and use React Testing Library:
```typescript
describe('useUser', () => {
  it('returns user on success', async () => {
    server.use(http.get('/users/123', () => HttpResponse.json({ id: '123' })));
    const { result } = renderHook(() => useUser('123'), { wrapper });
    await waitFor(() => expect(result.current.user).toBeDefined());
  });
});
```

---

## Anti-Patterns (Avoid)

❌ **Raw `fetch` or bare `axios` in hooks/components** — always go through the service layer  
❌ **`useEffect` for data fetching** — use `useQuery` instead  
❌ **Forgetting cache invalidation after mutations** — stale UI will result  
❌ **God hooks doing queries + mutations + computations** — split by responsibility  
❌ **`any` types at service boundaries** — always type axios responses with generics  

---

## Naming Conventions

| Type | Convention | Examples |
|---|---|---|
| Query hooks | `use[Feature]` | `useUsers`, `useUser` |
| Mutation hooks | `use[Action][Feature]` | `useCreateUser`, `useDeleteUser` |
| Services | `[domain]Service` | `userService`, `authService` |
| Query keys | `['domain']`, `['domain', id]` | `['users']`, `['users', id]` |
| Types | `PascalCase` | `User`, `CreateUserPayload` |
| Constants | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_RETRIES` |

---

## Summary

| Pattern | Tool | Responsibility |
|---|---|---|
| **Service** | axios (`apiClient`) | HTTP calls, URL construction, response typing |
| **Query hook** | `useQuery` | Read server state, caching, background refresh |
| **Mutation hook** | `useMutation` | Write server state, cache invalidation |
| **Computed hook** | `useMemo` | Derived/expensive values |
| **Local state** | `useState` | UI-only state (no server interaction) |

Services own the network. Hooks own the state. Components own nothing but rendering.