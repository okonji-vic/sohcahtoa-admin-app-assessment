# SohCahToa Admin — Secure Transaction Monitoring Dashboard

Next.js (App Router) + TypeScript admin dashboard built for the SohCahToa
Holdings frontend assessment. Covers authentication, a live transactions
table, real-time updates, admin actions, and the security requirements in
Section 5 of the brief.

## Run it

1. Copy `.env.local.example` to `.env.local` and set a real `AUTH_SECRET`.
2. `npm install`
3. `npm run dev`, visit `/` — you're redirected to `/login` (or `/dashboard`
   if already authenticated).
4. Sign in with `admin@sohcahtoa.test / admin1234` (admin role) or the
   analyst account in `lib/mock-users.ts` to see role-gated behavior.

## File map

    proxy.ts                              Edge gate for /, /login, /dashboard/*
    lib/constants.ts                      Cookie names + TTLs (edge-safe, no next/headers)
    lib/jwt.ts                            HS256 sign/verify on Web Crypto (edge + node)
    lib/auth.ts                           Server-only: cookies, issue/clear, getSession
    lib/mock-users.ts                     In-memory user store
    lib/api.ts                            Axios client: single-flight refresh, session-scoped cancellation
    lib/session-controller.ts             Shared AbortController + SSE registry, torn down on logout
    lib/csrf.ts                           Custom-header CSRF check for mutating routes
    lib/log.ts                            Redacting logger — the only sanctioned console.log entry point
    lib/types.ts                          Shared domain types (AuthUser, Transaction, ...)
    lib/transactions/data.ts              In-memory transaction store + query/mutation logic (shared by SSR + Route Handlers)
    lib/transactions/events.ts            In-process EventEmitter used to fan out changes to SSE clients
    lib/transactions/simulator.ts         Interval that fabricates transaction activity for the SSE demo

    app/api/auth/login/route.ts           POST: validate, issue tokens, set cookies
    app/api/auth/refresh/route.ts         POST: CSRF check, rotate tokens, or 401 + clear on failure
    app/api/auth/logout/route.ts          POST: CSRF check, clear cookies
    app/api/transactions/route.ts         GET: validated, paginated/sorted/filtered transaction list
    app/api/transactions/[id]/route.ts    PATCH: CSRF check, flag/unflag (admin-only) or add note
    app/api/transactions/stream/route.ts  GET: Server-Sent Events stream of transaction changes

    app/login/page.tsx                    Server Component shell (redirects away if already authenticated)
    app/login/login-form.tsx              Client Component form
    app/page.tsx                          Root redirect fallback (auth-aware)
    app/dashboard/page.tsx                Server Component: FX + card overview
    app/dashboard/transactions/page.tsx   Server Component: auth check + first-paint data fetch

    components/Table/                     Reusable generic DataTable (antd + styled-components), EmptyTable, ErrorState
    components/Transactions/              TransactionsExplorer (client), columns, filters, detail drawer
    hooks/useAuth.ts                      useLogin / useLogout
    hooks/useTransactions.ts              TanStack Query wrapper around the transactions list
    hooks/useTransactionStream.ts         Subscribes to SSE, patches the TanStack Query cache in place
    hooks/useTransactionActions.ts        Optimistic flag / add-note mutations with rollback
    store/auth.ts                         Zustand store: client-side view of the signed-in user (display only)

---

## SECTION 1 — Authentication

### 1.1 / 1.2 — Login and middleware protection

`/login` posts to `app/api/auth/login/route.ts`, which validates credentials
and sets two httpOnly cookies (`st_access`, `st_refresh`) — see the "1.1 vs
5.4 deviation" note below for why tokens aren't also returned in the JSON
body.

**A note on naming:** in Next.js 16 the `middleware.ts` convention was
renamed to `proxy.ts` (exported function `proxy` instead of `middleware`).
This project uses `proxy.ts`. Functionally it's the same request-lifecycle
hook the brief describes as "middleware" — Section 6.4 below still refers to
it as middleware/proxy interchangeably since that's the vocabulary the brief
uses.

`proxy.ts` gates `/`, `/login`, and `/dashboard/*`:

- No access token *and* no refresh token → redirect to `/login?from=<path>`.
- Valid access token → allow through.
- Expired/missing access token but a valid refresh token → mint a fresh
  access token at the edge (via `lib/jwt.ts`, Web Crypto only) and continue,
  rather than bouncing an otherwise-valid session to `/login`. This is what
  keeps a session alive across page navigations past the 10-minute access
  token TTL without a client-side round trip.
- Authenticated user hitting `/login` → redirect to `/dashboard`.
- Every response through this gate sets `Cache-Control: no-store` so the
  browser's back/forward cache can't resurrect a stale `/login` or
  `/dashboard` render after logout or session expiry.

### 1.3 — Token refresh flow and race condition prevention

`app/api/auth/refresh/route.ts` verifies the refresh cookie, rotates **both**
tokens, and sets new cookies. Rotating the refresh token on every call is
what makes reuse detection possible in a fuller implementation, and it's also
exactly why concurrent refresh calls are dangerous: two refreshes racing
would each invalidate the other's rotation and log a healthy user out.

**Client-side (the actual fix the brief is testing):** `lib/api.ts` keeps a
single in-flight refresh promise:

```typescript
let refreshInFlight: Promise<boolean> | null = null;
function refreshOnce() {
  if (!refreshInFlight) {
    refreshInFlight = callRefresh().finally(() => { refreshInFlight = null; });
  }
  return refreshInFlight;
}
```

If ten requests 401 at nearly the same moment (access token just expired),
the first starts the refresh and stores the promise; the other nine await
that *same* promise instead of each starting their own. N concurrent 401s
produce exactly one `/api/auth/refresh` call, then all N retry once. On
failure, everyone gets `false` and the session is torn down (see 5.2) before
redirecting to `/login`. This lives at module scope, so it's shared by every
component using the shared `api` instance — genuinely single-flight for the
whole tab.

**Server-side, this is stateless.** Two refreshes from *different tabs* at
the same literal instant could still each mint valid tokens independently —
there's no server-side one-time-use tracking. A production version would
need refresh tokens tracked in a store (Redis, DB) so a second use of an
already-rotated token is detected and the whole token family is revoked.
Noted here as a deliberate scope cut for this assessment, not an oversight.

---

## SECTION 2 — Transactions Dashboard

### 2.1 — Data fetching / server-client separation

`app/dashboard/transactions/page.tsx` is a pure Server Component: it checks
`getSession()`, calls `getTransactions()` directly (the same function the
Route Handler calls — one implementation of the query logic, not two that
can drift), and hands the first page of data to `TransactionsExplorer` as
`initialData`. It never uses `"use client"`, `useState`, or an event handler.

Everything below `TransactionsExplorer` is `"use client"` and owns all
interaction: pagination, sorting, filtering, loading/error/empty states, the
detail drawer, and (Section 3) the live stream. `TransactionsExplorer` is the
deliberate seam between server and client concerns.

### 2.2 — Table features

`components/Table/index.tsx` is a generic, reusable `DataTable<T>` (ported
from an earlier project's `SofiaTable` pattern: styled-components container,
antd `Table` underneath, a shared `EmptyTable` + `ErrorState`, memoized
pagination/loading config). `components/Transactions/` supplies the
transaction-specific columns and filters on top of it.

- **Server-side pagination/sorting** — `app/api/transactions/route.ts`
  accepts `page`, `pageSize`, `sortField`, `sortOrder` and applies them
  against the in-memory store in `lib/transactions/data.ts` before slicing;
  nothing is sorted/paginated client-side.
- **Filters** — status (exact match) and a date range, both validated
  server-side and applied the same way.
- **States** — `isLoading`/`isFetching` drive the table's loading spinner,
  `isError` swaps in `ErrorState` with a retry button, and an empty result
  set renders `EmptyTable` via antd's `locale.emptyText`.

A deliberate state-management choice: pagination/sort/filter state lives in
the client component (`useState`), **not** synced to the URL. Syncing to the
URL would re-invoke the Server Component's `searchParams` on every
interaction, causing a double-fetch (once server-side, once via TanStack
Query) on every page/sort/filter change — that fights the "clear separation
of server and client concerns" requirement rather than serving it. URL sync
would be a reasonable addition if deep-linking to a specific
filtered/paginated view became a requirement.

---

## SECTION 3 — Real-Time Updates

Implemented as **Server-Sent Events** (`app/api/transactions/stream/route.ts`,
`runtime = "nodejs"` — SSE needs a long-lived Node stream, not Edge).

- `lib/transactions/events.ts` is an in-process `EventEmitter` (single
  server instance only — noted as a scope cut; production would use Redis
  pub/sub or similar for multi-instance fan-out).
- `lib/transactions/simulator.ts` fabricates transaction creates/updates on
  an interval, guarded by a `globalThis` flag so Next.js dev-mode hot reload
  doesn't spin up duplicate intervals.
- `hooks/useTransactionStream.ts` opens an `EventSource` and, on each
  message, patches the TanStack Query cache directly with
  `queryClient.setQueryData` — it **never calls `invalidateQueries`/refetch**,
  because a refetch would silently reset whatever page/sort/filter the user
  is currently on.
  - An **update** to a row only patches that row if it's present in the
    currently-cached page; every other row keeps its object identity, so
    antd only re-renders the one changed row.
  - A **new** transaction is only spliced into view when the current query
    is the unfiltered, first, newest-first page — i.e., the page a new row
    would actually belong on. Any other page/filter/sort is left untouched;
    the row is simply there next time that query runs. This is the concrete
    mechanism behind "preserve pagination + filters."
  - A dedup check (`old.items.some(t => t.id === payload.transaction.id)`)
    guards against `EventSource`'s automatic-reconnect replay.
- **No hydration mismatch:** the `EventSource` connection is only opened
  inside a `useEffect`, which runs client-side post-mount. The server-rendered
  HTML never differs based on stream state, so there's nothing for React to
  reconcile against a mismatched server render.

---

## SECTION 4 — Admin Actions

Clicking a row opens `TransactionDetailPanel` (`"use client"`, an antd
`Drawer`), wired via `onRow` on the table.

- **Mutation:** `PATCH /api/transactions/[id]` (Route Handler, not a Server
  Action, to keep the mutation on the same typed-request/normalized-error
  pattern as the rest of the API surface) — `{ action: "flag" | "unflag" }`
  or `{ action: "note", note }`.
- **Role-based access:** the drawer hides the flag button for non-admins as
  a UX courtesy, but the **actual enforcement** is server-side — the Route
  Handler checks `session.role !== "admin"` and returns 403 for flag/unflag
  regardless of what the client sends. Never trust a client-side role check
  alone.
- **Optimistic UI + rollback:** `hooks/useTransactionActions.ts` patches
  every cached transactions page containing the affected row *before* the
  request resolves (`onMutate`), snapshots the prior cache state, and
  restores that snapshot on failure (`onError`). On success, the server's
  returned transaction reconciles the cache (trusting the server's final
  state over the optimistic guess). Patching *every* cached page matters
  because `keepPreviousData` (Section 2.2) means several pages/filters can be
  cached simultaneously.

---

## SECTION 5 — Security Requirements

### 5.1 — XSS handling

One seeded transaction's `counterparty` field is the literal string
`<script>alert("xss")</script>` (`lib/transactions/data.ts`).

Mitigation: every place this value is rendered — the table column and the
detail drawer — uses plain JSX text interpolation (`{transaction.counterparty}`),
never `dangerouslySetInnerHTML`. React escapes interpolated text by default,
so the string renders as visible literal text (`&lt;script&gt;...`) and is
never parsed as markup by the browser. The same reasoning applies to the
free-text `note` field admins can add. There is no `dangerouslySetInnerHTML`
anywhere in this codebase; if a future feature genuinely needed to render
user-supplied HTML, it would go through a sanitizer (DOMPurify) first, not
around this rule.

### 5.2 — Session handling

Token expiration and refresh failure are both handled, and — beyond just
"redirect and clear cookies" — the app explicitly cancels outstanding work so
nothing keeps talking to a dead session:

- `lib/session-controller.ts` holds one shared `AbortController` and a
  registry of open `EventSource` connections for the current session.
  `lib/api.ts` attaches that controller's signal to every request by default.
- On **refresh failure** (the interceptor in `lib/api.ts` exhausts a retry
  and the refresh call itself fails), `teardownSession()` runs before the
  redirect: it aborts every in-flight request and closes every open SSE
  stream, *then* replaces the controller with a fresh one for whatever comes
  next, then redirects to `/login`.
- On **logout**, `useLogout`'s `onSuccess` runs the same `teardownSession()`
  before navigating — so the cookie-clearing response, the request
  cancellation, and the SSE close all happen together, not as three
  independently-timed events.
- On **login**, `resetSessionController()` gives the new session a clean
  controller (an aborted `AbortController` can't be un-aborted).

### 5.3 — CSRF

Two layers, matching the brief's "sameSite protection OR CSRF token" — this
implementation uses both, since they cover different gaps:

1. **`sameSite: "lax"`** on both auth cookies (`lib/auth.ts`). A cross-site
   form/fetch simply doesn't attach the cookie in a modern browser, so a
   forged request from another origin arrives unauthenticated and is
   rejected by `getSession()` before it does anything.
2. **Custom-header check** (`lib/csrf.ts`) on every mutating,
   cookie-authenticated route — `refresh`, `logout`, and the transactions
   `PATCH` — requiring `x-requested-with: sohcahtoa`. A cross-site
   `<form>`/`<img>` submission has no way to set a custom header, and a
   cross-origin `fetch` attempting to would be stopped by CORS preflight
   first. `lib/api.ts` sets this header on every request via the shared
   axios instance defaults, so no per-call wiring is needed. `/api/auth/login`
   is intentionally exempt — there's no pre-existing session for CSRF to ride
   at that point, so the check would add noise without covering a real risk
   there.

### 5.4 — Sensitive data handling

- **Masking:** `lib/transactions/data.ts` stores/generates card numbers
  already masked (`**** **** **** 1234`) — the full PAN never exists in the
  response payload in the first place, not just hidden in the UI.
- **No tokens in responses:** `login` and `refresh` return only
  `{ user, expiresIn }` / `{ expiresIn }`. Tokens live exclusively in httpOnly
  cookies (see "1.1 vs 5.4 deviation" below).
- **No token logging:** `lib/log.ts` is the only sanctioned logging entry
  point in the codebase and redacts known-sensitive keys (`accessToken`,
  `refreshToken`, `authorization`, `cookie`, `password`, `cardNumber`) before
  printing anything, and is a no-op in production. In practice, every
  `catch` block across the Route Handlers responds with a static error
  message and does not `console.log`/`console.error` the raw error, request
  body, or headers — so there's currently nothing that logs a token. The
  rule going forward: any future logging goes through `safeLog()`, never a
  bare `console.log`.
- **No cookies exposed to client JS:** both auth cookies are `httpOnly`;
  `store/auth.ts` (Zustand) holds only a display-only `{ id, role }` shape
  for UI purposes (role-gating the flag button, header text) — never the
  cookie values themselves, and it's never persisted to `localStorage`.

---

## SECTION 6 — Architecture Requirements

### 6.1 — App Router usage

Server Components own auth gating and first-paint data fetching
(`dashboard/page.tsx`, `dashboard/transactions/page.tsx`). Client Components
are scoped to exactly what needs interactivity: the login form, the
transactions explorer (table/filters/drawer), and the sidenav. There's no
`"use client"` above the point where interactivity is actually needed —
`TransactionsExplorer` is that boundary for the transactions feature.

### 6.2 — Route Handlers

Every handler validates input before touching business logic — e.g.
`app/api/transactions/route.ts` allow-lists `status`, `sortField`, and
`sortOrder` and rejects anything else with 422 rather than silently ignoring
bad input. Responses use a consistent `{ error: string }` shape with
deliberately chosen status codes:

| Status | Meaning here |
|---|---|
| 400 | Malformed JSON body |
| 401 | Missing/invalid session |
| 403 | Authenticated but wrong role, or failed CSRF check |
| 404 | Unknown resource (e.g. transaction id) |
| 422 | Well-formed request, semantically invalid input |
| 500 | Unexpected failure |

### 6.3 — Caching strategy

Every route under `/api/auth/*` and `/api/transactions/*`, and both
dashboard pages, set `export const dynamic = "force-dynamic"`. This is a
deliberate, uniform choice, not an oversight: auth state is inherently
per-request, and transaction data is live monitoring data where a stale
cached read is a correctness bug (an analyst acting on a cached "pending"
status for a transaction that was just flagged) rather than a UX nicety.
Nothing in this app was reached for `revalidate` because nothing in it has a
"a few seconds stale is fine" tolerance — if a slowly-changing, read-heavy
endpoint were added later (e.g. a static list of supported currencies), that
would be the natural candidate for `revalidate` instead of `force-dynamic`.

### 6.4 — Middleware (proxy) awareness

`proxy.ts` runs on the **Edge runtime**: no Node APIs, no database access,
Web Crypto only (`lib/jwt.ts` is written to work in both Edge and Node for
exactly this reason — one signing/verifying implementation, used by both
`proxy.ts` and the Node-runtime Route Handlers). It verifies the access
token's signature and expiry and, for page navigations, opportunistically
mints a new access token from a valid refresh cookie so a session doesn't
die mid-browse.

This is deliberately **not** the security boundary:

- It can't reach a database, so it can't check whether a user was disabled,
  a role changed, or a specific token was revoked since issuance.
- It only sees the request in isolation — no fine-grained per-resource
  decisions (that's why the transactions `PATCH` route does its own
  `session.role !== "admin"` check rather than relying on proxy-level
  gating).
- Matching is path-based and coarse (`/`, `/login`, `/dashboard/*`).

So `proxy.ts` is a fast, cheap first gate for a good user experience (bounce
an obviously-logged-out user before any Server Component even runs). Every
Route Handler and Server Component **re-verifies** independently via
`getSession()` (Node runtime, `lib/auth.ts`) and is the actual authority —
this is what enforces roles, and what a production build would extend with
real revocation-list/DB checks. Redirects always build off `req.url`
(`new URL("/login", req.url)`) rather than a hardcoded origin, so they stay
correct across environments (localhost, preview deploys, production).

---

## The 1.1 vs 5.4 deviation

Brief 1.1 lists `accessToken`/`refreshToken` in the login response body.
Brief 5.4 (mandatory) says not to expose tokens to client JS. These
conflict. This project follows 5.4: tokens live only in httpOnly cookies;
the login response body is `{ user, expiresIn }`. To match 1.1 literally
instead, the two token strings could be added to the JSON in
`app/api/auth/login/route.ts` — but that would mean shipping tokens
readable by any injected script, which defeats the point of 5.4, so it
wasn't done.

## Known scope cuts (deliberate, not oversights)

- **Refresh token rotation is not tracked server-side** — no reuse
  detection/token-family revocation. Noted in Section 1.3.
- **The SSE event bus is single-instance, in-memory** — not safe across
  multiple server instances. Noted in Section 3.
- **CSRF header check, not a rotating CSRF token** — chosen because
  `sameSite: lax` is already the primary defence and a static custom header
  is simpler to reason about than token issuance/rotation for this scope.
  Noted in Section 5.3.