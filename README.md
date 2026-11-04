# BookNook

**BookNook** is a premium, full-stack online library built with Next.js and Express. Readers can discover curated books, search and filter the collection, borrow titles with a chosen return date, add their own books to the shelves, and manage their loans from a personal dashboard — all wrapped in a calm, editorial UI with full dark-mode support.

This repository contains the **BookNook frontend client**. Authentication is handled inside the Next.js application with Better Auth and MongoDB. Book and borrowing data are read from and written to the companion **BookNook API** server configured through `NEXT_PUBLIC_API_URL`.

![Next.js](https://img.shields.io/badge/Next.js-16.4.3-000000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.3.0-087EA4?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Better Auth](https://img.shields.io/badge/Better_Auth-1.7.14-000000)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb)

---

## Table of Contents

- [Preview](#preview)
- [Live Links](#live-links)
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [How to Run Locally](#how-to-run-locally)
- [Authentication & Route Protection](#authentication--route-protection)
- [API Documentation](#api-documentation)
- [Data Models](#data-models)
- [Design System](#design-system)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Contact](#contact)

---

## Preview

| Screenshot | Description |
|---|---|
| ![Project Preview](public/screenshots/project-preview.png) | Full project overview |
| ![Home Page](public/screenshots/homepage.png) | Hero slider, categories, and new arrivals |
| ![Books Page](public/screenshots/books-page.png) | Search, filter, and paginated catalog |
| ![Book Details](public/screenshots/book-details.png) | Detail view with availability and borrow modal |
| ![Dashboard](public/screenshots/dashboard.png) | My Books and My Borrows management |
| ![Dark Mode](public/screenshots/dark-mode.png) | Full dark theme in action |

> Images will be shown once added to `public/screenshots/`.

---

## Live Links

| Resource | URL |
|---|---|
| **Live Website** | [https://booknook-c-ph.vercel.app](https://booknook-c-ph.vercel.app) |
| **Server API** | [https://booknook-s-ph.vercel.app](https://booknook-s-ph.vercel.app) |

---

## Project Overview

BookNook is a full reading-room experience, not a simple catalog. The home page combines an image-led hero slider, browsing categories, curated discovery tools, new arrivals, a rotating reading quote, and a community reader's wall. Signed-in readers get a complete loan lifecycle: add a book, see it on their shelf, edit or delete it, borrow other readers' books, and return them when finished.

The interface is built around a calm white-and-teal visual system (deep navy in dark mode), with Playfair Display headings, Inter body text, rounded cards, subtle lift-and-shadow motion, accessible dialogs, loading skeletons, and empty states throughout. A system-aware dark/light theme toggle lives in the navbar.

---

## Key Features

### Discovery & Home Page

- Full-width hero slider powered by **Swiper 14** with fade transitions, 4-second autoplay, looped slides, and clickable pagination dots.
- Three editorial hero slides with library photography, custom headings, descriptions, and a **Browse Books** call to action.
- Dark sub-strip below the slider highlighting curated shelves, clear availability, and community book adding.
- Category grid for **Fiction**, **Science**, **History**, **Kids**, and **Others** — each links to the filtered catalog.
- **Discover Your Next Read** section:
  - **Blind Date with a Book** — click-to-reveal card unwrapping a surprise title from a curated list of 20 books.
  - **Reading Mood Studio** — mood-based recommendations with an animated 3D card flip.
- **New Arrivals** grid fetching the six newest books from the API.
- Rotating literary quote section (George R.R. Martin, Harper Lee, Hemingway, C.S. Lewis) changing every 10 seconds.
- **The Reader's Wall** — tilted sticky-note community reviews with 5-star ratings.
- Closing **CTA section** with "Explore Books" and "Add a Book" links.
- Responsive sticky navbar with active-link styling, auth-aware links, reader avatar dropdown, and mobile hamburger menu.
- System-aware **Dark/Light theme toggle** (Sun/Moon icons) persisted to `localStorage`.
- Footer with quick links, category links, contact details (email, phone, location), and social links (GitHub, LinkedIn).

### Book Catalog (`/books`)

- Responsive book grid: 1 / 2 / 3 columns on mobile / tablet / desktop.
- Debounced search by title or author (350 ms).
- Category filtering via URL param (`?category=Fiction`).
- Server-side pagination at nine books per page.
- URL-synchronized filters (`q`, `category`, `page`) — catalog views are bookmarkable and shareable.
- Newest-first sort by default.
- Live result count, clear-filters action, loading skeletons, error retry, and empty state.
- Book cards show cover (with graceful fallback), category badge, title, author, availability indicator, and a **View Details** link.

### Book Details & Borrowing (`/books/:id`)

- Two-column desktop layout: cover + availability panel left, full metadata right.
- Shows title, author, category, description, added-by reader, date added, total copies, available copies, and copies on loan.
- Color-coded availability progress bar: green (available) / amber (low) / red (not available).
- Authentication-aware actions: guests prompted to sign in; book owners directed to manage their book; signed-in readers can open the borrow dialog.
- **Borrow modal** with read-only borrower details, borrow date, and return date picker (default 14-day window).
- After borrowing, the detail view refreshes availability and shows a link to **My Borrows**.

### Book Management

- **Add Book** (`/add-book`) — private route with live book-card preview while filling out the form.
  - Fields: title, author, category, copies (1–50), description (up to 1,200 chars), cover image URL.
  - Direct ImgBB upload via the API key; falls back to a manual URL.
  - Read-only display of the signed-in user's name and email.
- **My Books** (`/my-books`) — private dashboard with totals for titles added, total copies, and available copies.
  - Responsive UI: table on desktop, cards on mobile.
  - Edit a book in a prefilled modal without leaving the page.
  - Delete a book through a custom confirmation dialog (blocked if the book has an active loan).
  - Loading skeletons, error retry, and empty-shelf state.

### Borrowing Dashboard (`/my-borrows`)

- Active and History tabs with item counts.
- Summary stat cards: active loans, due-soon / overdue, returned.
- Displays cover, title, author, borrow date, return date, and a status badge (active / overdue / returned).
- Due-today, days-remaining, and overdue-day messaging per loan.
- Return a book through a confirmation dialog; the available copy is restored and the list refreshes.
- Responsive table-to-card layout with skeletons and empty states.

### Reader Profile (`/profile`)

- Avatar (or generated initials), name, email, reader badge, and membership date.
- Reading snapshot: books added, active borrows, books returned.
- Edit-profile modal for display name and profile image (ImgBB upload or URL).
- Quick links to **My Books**, **My Borrows**, and **Add Book**.

### Authentication

- Email and password sign-up and sign-in via **Better Auth**.
- Minimum 8-character password with real-time confirmation feedback on registration.
- Optional photo URL on registration.
- Google OAuth support (configurable via Google Cloud credentials).
- Show/hide password toggle.
- Redirect preservation via the `redirect` query parameter.
- Signed-in users are redirected away from `/login` and `/register`.
- Session-aware navigation; logout from desktop and mobile menus clears the JWT.

### Experience & Accessibility

- Custom 404 page with library-themed illustration and recovery links.
- Global error boundary with a retry action.
- Toast system: success (teal), error (red), info (blue) — 4-second auto-dismiss.
- Accessible modals: focus trap, Escape-to-close, body scroll lock, `aria-modal`.
- Visible focus styles, semantic HTML, `aria-current`, `aria-live`, reduced-motion support.
- Full dark/light theme: all color tokens swap via `.dark` CSS class, no flicker.
- Responsive layouts across mobile (360px), tablet (768px), and desktop (1280px+).

---

## Technologies Used

| Category | Technology |
|---|---|
| Framework | [Next.js 16.4.3](https://nextjs.org/) — App Router |
| UI Runtime | [React 19.3.0](https://react.dev/) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 with `@tailwindcss/turbopack` |
| Component System | shadcn/ui (`base-nova` style) + Base UI primitives (`@base-ui/react`) |
| Icons | Lucide React 1.65 |
| Fonts | `next/font` — Inter, Playfair Display, Geist |
| Animation | CSS keyframes, `tw-animate-css`, Framer Motion, Swiper transitions |
| Carousel | Swiper 14 — Autoplay, Pagination, EffectFade modules |
| Theme | next-themes 0.4.6 — class-based dark/light with system preference |
| Authentication | Better Auth 1.7.14 with the JWT plugin |
| Auth Database | MongoDB via `@better-auth/mongo-adapter` and the MongoDB Node.js driver |
| Image Hosting | ImgBB upload API (client-side uploads) |
| Images | `next/image` with remote HTTPS wildcard pattern |
| Tooling | ESLint 9, `eslint-config-next`, React Compiler (`babel-plugin-react-compiler`), Turbopack |
| Package Manager | npm (`package-lock.json`) |

`next.config.ts` enables `cacheComponents`, `partialPrefetching`, and the React Compiler.

---

## Architecture

```text
Browser
   │
   ├── Next.js App Router (this repository)
   │      ├── Pages, layouts, components, client-side data fetching
   │      ├── /api/auth/[...all]  ──► Better Auth
   │      │                               ├── MongoDB (booknook database)
   │      │                               ├── Email/password sessions
   │      │                               └── Google OAuth
   │      └── ImgBB API (cover and avatar uploads)
   │
   └── BookNook API (booknook-server — separate repository)
          ├── GET  /api/books
          ├── GET  /api/books/:id
          ├── POST /api/books           (JWT required)
          ├── PATCH /api/books/:id      (JWT required)
          ├── DELETE /api/books/:id     (JWT required)
          ├── GET  /api/borrows         (JWT required)
          ├── POST /api/borrows         (JWT required)
          └── DELETE /api/borrows/:id   (JWT required)
```

- The Next.js app owns authentication, sessions, and the authenticated UI.
- Better Auth stores users, accounts, and sessions in the `booknook` MongoDB database.
- The JWT plugin issues tokens used as Bearer credentials when calling the external API.
- Books and borrows are fetched client-side through `src/lib/api.ts`.
- The external API base URL defaults to `https://booknook-s-ph.vercel.app/api` when `NEXT_PUBLIC_API_URL` is not set.

---

## Project Structure

```text
booknook-client/
├── public/
│   ├── books/                    # 24 local book cover images (.jpg)
│   ├── images/
│   │   └── hero-library.jpg      # Local hero image
│   └── screenshots/              # Add project screenshots here
├── src/
│   ├── app/
│   │   ├── api/auth/[...all]/route.ts   # Better Auth Next.js handler
│   │   ├── add-book/page.tsx            # Add a book (private)
│   │   ├── books/page.tsx               # Catalog shell + Suspense
│   │   ├── books/[id]/page.tsx          # Book details and borrowing (private)
│   │   ├── login/page.tsx               # Sign in
│   │   ├── register/page.tsx            # Registration
│   │   ├── my-books/page.tsx            # Manage owned books (private)
│   │   ├── my-borrows/page.tsx          # Active loans and history (private)
│   │   ├── profile/page.tsx             # Reader profile (private)
│   │   ├── error.tsx                    # Global error boundary
│   │   ├── not-found.tsx                # Custom 404 page
│   │   ├── layout.tsx                   # Root layout: fonts, theme, navbar, footer
│   │   ├── page.tsx                     # Home page
│   │   ├── globals.css                  # Tailwind theme, design tokens, dark mode
│   │   └── favicon.ico
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthShell.tsx            # Split-screen auth layout
│   │   │   └── PasswordInput.tsx        # Password field with visibility toggle
│   │   ├── books/
│   │   │   ├── AllBooksClient.tsx       # Catalog: search, filters, pagination
│   │   │   ├── BookCard.tsx             # Book grid card with availability
│   │   │   ├── BookCover.tsx            # Image with initials fallback
│   │   │   ├── BookForm.tsx             # Shared add/edit book form
│   │   │   ├── BookGridSkeleton.tsx     # Loading skeleton for book grids
│   │   │   ├── BorrowModal.tsx          # Borrow confirmation dialog
│   │   │   └── Pagination.tsx           # Page navigation
│   │   ├── home/
│   │   │   ├── Categories.tsx           # 5-category grid
│   │   │   ├── CategoryCard.tsx         # Individual category card
│   │   │   ├── CtaSection.tsx           # Closing CTA with teal card
│   │   │   ├── DiscoverySection.tsx     # Blind Date + Mood Studio
│   │   │   ├── HeroSlider.tsx           # Swiper fade hero with 3 slides
│   │   │   ├── HeroStrip.tsx            # Dark sub-bar below hero
│   │   │   ├── HowItWorks.tsx           # Steps explanation section
│   │   │   ├── NewArrivals.tsx          # Latest 6 books from API
│   │   │   ├── ReadersWall.tsx          # Community sticky-note reviews
│   │   │   ├── ReadingNook.tsx          # Rotating literary quote
│   │   │   └── discovery/
│   │   │       ├── BlindDateCard.tsx    # Click-to-reveal surprise book
│   │   │       └── MoodStudio.tsx       # 3D-flip mood recommendations
│   │   ├── shared/
│   │   │   ├── AuthGate.tsx             # Client-side auth guard with redirect
│   │   │   ├── AvatarUpload.tsx         # ImgBB avatar upload component
│   │   │   ├── Footer.tsx               # 4-column footer with social links
│   │   │   ├── Navbar.tsx               # Sticky auth-aware navbar
│   │   │   ├── PageTitleProvider.tsx    # Dynamic document title
│   │   │   ├── ProfileModal.tsx         # Edit profile dialog
│   │   │   ├── ThemeProvider.tsx        # next-themes wrapper
│   │   │   ├── ThemeToggle.tsx          # Sun/Moon toggle button
│   │   │   ├── UserMenu.tsx             # Avatar dropdown with logout
│   │   │   └── navbar/
│   │   │       ├── MobileMenu.tsx       # Full-screen mobile nav
│   │   │       ├── NavLinks.tsx         # Desktop nav link list
│   │   │       └── NavLogo.tsx          # BookNook wordmark logo
│   │   └── ui/
│   │       ├── Alert.tsx                # Inline alert (info/success/warning/error)
│   │       ├── Badge.tsx                # Status and category badges
│   │       ├── Button.tsx               # CVA button with variants and sizes
│   │       ├── ConfirmDialog.tsx        # Destructive action confirmation
│   │       ├── Container.tsx            # max-w-7xl responsive wrapper
│   │       ├── dialog.tsx               # Base UI dialog primitives
│   │       ├── EmptyState.tsx           # Empty list state with icon and CTA
│   │       ├── Form.tsx                 # Input, Label, Select, Textarea
│   │       ├── Modal.tsx                # Accessible focus-trapped modal
│   │       ├── PageLoader.tsx           # Full-page loading spinner
│   │       ├── SectionHeading.tsx       # Eyebrow + title + description heading
│   │       ├── Skeleton.tsx             # Animated pulse skeleton
│   │       └── Toast.tsx                # Global toast provider and hook
│   ├── data/
│   │   └── slides.ts                    # Hero slider content (3 slides)
│   ├── lib/
│   │   ├── api.ts                       # Authenticated fetch client + JWT caching
│   │   ├── auth-client.ts               # Better Auth browser client
│   │   ├── auth.ts                      # Better Auth server configuration
│   │   ├── client-token.ts              # Browser JWT retrieval
│   │   ├── hooks.ts                     # useDebouncedValue
│   │   ├── server-token.ts              # Server-side JWT retrieval
│   │   ├── types.ts                     # Book, Borrow, Category types
│   │   └── utils.ts                     # cn, formatDate, initials, daysBetween, etc.
│   └── proxy.ts                         # Session-cookie route protection middleware
├── AGENTS.md
├── DESIGN.md                            # Design system reference
├── PROMPT.md
├── components.json                      # shadcn/ui configuration
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

> `node_modules/`, `.next/`, build output, and environment files are intentionally omitted.

---

## Installation & Setup

### Prerequisites

- **Node.js 20.9 or newer** (required for Next.js 16)
- **npm** (the repository includes a `package-lock.json`)
- A running **BookNook API** (`booknook-server`) for books and borrows
- A **MongoDB** database reachable from the Next.js server (local or MongoDB Atlas)
- Optional: **Google Cloud OAuth credentials** for Google sign-in
- Optional: an **ImgBB API key** for direct cover and avatar uploads

### 1. Clone and install

```bash
git clone https://github.com/aminulislamdev/booknook-client.git
cd booknook-client
npm install
```

### 2. Configure environment variables

Create `.env.local` in the project root (see [Environment Variables](#environment-variables) below).

### 3. Start the BookNook API

The frontend reads the API root from `NEXT_PUBLIC_API_URL`. To use the deployed API, set it to `https://booknook-s-ph.vercel.app/api`. To use a local server, set it to `http://localhost:8000/api` and start `booknook-server` separately.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

All variables consumed directly by the source code:

| Variable | Scope | Required | Description | Example |
|---|---|---|---|---|
| `DB_URL` | Server | Yes | MongoDB connection string for Better Auth storage. Uses the `booknook` database. | `mongodb+srv://...` |
| `BETTER_AUTH_SECRET` | Server | Yes | Secret used by Better Auth to sign sessions and tokens. Use a long, random string. | A 32+ char random string |
| `BETTER_AUTH_URL` | Server | Yes | Public base URL of the Next.js app. Also set as the trusted auth origin. | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Server | For Google auth | Google OAuth 2.0 client ID. | `...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Server | For Google auth | Google OAuth 2.0 client secret. | `GOCSPX-...` |
| `NEXT_PUBLIC_APP_URL` | Client | Recommended | Base URL used by the Better Auth browser client. | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Client | Recommended | Root URL of the BookNook API, without a trailing slash. | `https://booknook-s-ph.vercel.app/api` |
| `NEXT_PUBLIC_IMGBB_API_KEY` | Client | For uploads | ImgBB API key for book-cover and avatar uploads. | Your ImgBB key |

### Example `.env.local`

```env
# MongoDB / Better Auth
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Public client configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_IMGBB_API_KEY=your-imgbb-api-key
```

> Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put server credentials in public variables.

---

## How to Run Locally

### Development

```bash
npm run dev
```

The Better Auth handler is at `/api/auth/*`. The client calls the API at `NEXT_PUBLIC_API_URL`.

### Production build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

### Typical local workflow

1. Start MongoDB (or allow Atlas access).
2. Start `booknook-server` on port 8000, or point `NEXT_PUBLIC_API_URL` at the deployed API.
3. Run `npm run dev`.
4. Register an account, add a book, verify it appears in **All Books**, **My Books**, and **New Arrivals**.
5. Borrow a book from a second account and confirm it moves to **My Borrows**.
6. Return the book and confirm the available copy count is restored.

---

## Authentication & Route Protection

### Better Auth configuration

`src/lib/auth.ts` configures Better Auth with:

- MongoDB storage via `mongodbAdapter(client.db("booknook"))`
- Reusable MongoDB client across development hot reloads
- Email and password auth with minimum password length of 8
- Automatic sign-in after registration
- Google as a social provider
- The Better Auth **JWT plugin** (issues short-lived JWTs for API access)
- `BETTER_AUTH_URL` as both the auth base URL and trusted origin

The App Router handler in `src/app/api/auth/[...all]/route.ts` exposes Better Auth via `toNextJsHandler(auth)` for GET and POST requests.

### Client session handling

- `src/lib/auth-client.ts` creates the browser client with `createAuthClient`, the `jwtClient()` plugin, and `NEXT_PUBLIC_APP_URL`.
- Protected pages are wrapped in `AuthGate`, which shows a loader while the session resolves and redirects unauthenticated visitors to `/login?redirect=...`.
- The navbar swaps **Login / Register** for the reader's avatar and profile dropdown after sign-in.

### Route protection middleware

`src/proxy.ts` checks for the Better Auth session cookie and redirects unauthenticated requests to the login page (Next.js 16 `proxy` convention). The matcher covers:

```
/add-book/:path*
/my-books/:path*
/my-borrows/:path*
/books/:id
/profile/:path*
```

Static book-cover files (`/books/`) bypass the middleware so signed-out visitors can load local cover art.

### API authentication

`src/lib/api.ts` wraps `fetch` with:

- JSON request/response handling
- An optional `auth` flag — public endpoints (catalog, book detail) can skip token retrieval
- A Bearer token from `authClient.token()`, cached in memory and `sessionStorage` until shortly before expiry
- `cache: "no-store"` to prevent stale server data
- A typed `ApiError` containing the HTTP status
- Automatic token removal on `401` responses

---

## API Documentation

The client communicates with the external BookNook REST API. All paths below are relative to `NEXT_PUBLIC_API_URL` (default: `https://booknook-s-ph.vercel.app/api`).

Protected requests include:

```http
Authorization: Bearer <better-auth-jwt>
Content-Type: application/json
```

### Endpoints used by the client

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `GET` | `/books` | No | List, search, filter, sort, paginate books |
| `GET` | `/books/:id` | No | Fetch a single book |
| `POST` | `/books` | Yes | Add a new book |
| `PATCH` | `/books/:id` | Yes | Update a book |
| `DELETE` | `/books/:id` | Yes | Delete an owned book |
| `GET` | `/borrows` | Yes | Fetch the signed-in reader's loans |
| `POST` | `/borrows` | Yes | Borrow a book |
| `DELETE` | `/borrows/:id` | Yes | Return a book |

### `GET /books`

| Parameter | Description |
|---|---|
| `page` | Page number, starting at `1` |
| `limit` | Results per page (catalog: `9`, new arrivals: `6`, My Books: `100`) |
| `sort` | `newest` for newest-first ordering |
| `search` | Text search across title and author |
| `category` | One of `Fiction`, `Science`, `History`, `Kids`, `Others` |
| `userEmail` | Filter by the owning user's email (used in My Books) |

Expected paginated response:

```json
{
  "books": [],
  "total": 0,
  "page": 1,
  "limit": 9,
  "totalPages": 0
}
```

### `GET /books/:id`

Returns the book both nested under `book` and flattened at the top level:

```json
{
  "book": { "id": "...", "title": "...", "availableCopies": 2 },
  "id": "...",
  "title": "..."
}
```

### `POST /books` and `PATCH /books/:id`

Request body:

```json
{
  "title": "Book title",
  "author": "Author name",
  "category": "Fiction",
  "totalCopies": 3,
  "description": "Short description",
  "image": "https://example.com/cover.jpg"
}
```

### `DELETE /books/:id`

```http
DELETE /books/:id?userId=<user-id>
```

Blocked by the API if the book has an active loan.

### `GET /borrows`

Returns the authenticated user's borrow records (matched by user ID or email from the JWT), newest first, with the associated book document embedded:

```json
{
  "borrows": [
    {
      "id": "...",
      "bookId": "...",
      "bookTitle": "Atomic Habits",
      "status": "active",
      "returnDate": "2026-01-24T00:00:00.000Z",
      "book": { "id": "...", "availableCopies": 2 }
    }
  ]
}
```

### `POST /borrows`

Request body:

```json
{
  "bookId": "book-id",
  "borrowDate": "2026-01-10T00:00:00.000Z",
  "returnDate": "2026-01-24T23:59:59.000Z"
}
```

The API enforces: availability check (`availableCopies > 0`), atomic copy decrement, and duplicate-loan prevention (same user, same book, `status: "active"`).

### `DELETE /borrows/:id`

Marks the loan as returned, restores the available copy, and removes the record. The UI removes the loan from the active list and refreshes after success.

> The backend is the source of truth for all business rules. The UI hides or disables owner actions and unavailable books, but all constraints are enforced server-side.

---

## Data Models

Core types live in `src/lib/types.ts`.

### Book

```ts
type Book = {
  id: string;
  title: string;
  author: string;
  category: "Fiction" | "Science" | "History" | "Kids" | "Others";
  description: string;
  image: string;
  totalCopies: number;
  availableCopies: number;
  addedBy: { id: string; name: string; email: string; image?: string };
  userId?: string;
  userName?: string;
  userEmail?: string;
  createdAt: string;
  updatedAt: string;
};
```

### Borrow

```ts
type Borrow = {
  id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userId: string;
  userName: string;
  userEmail: string;
  borrowDate: string;
  borrowedAt?: string;   // alias
  returnDate: string;
  dueDate?: string;      // alias
  returnedAt: string | null;
  status: "active" | "returned";
  book?: Book | null;    // embedded when available
};
```

### Response Shapes

```ts
type BooksResponse = {
  books: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type BorrowsResponse = {
  borrows: Borrow[];
};
```

---

## Design System

BookNook uses one consistent visual language across all pages. The full reference is in [`DESIGN.md`](./DESIGN.md).

### Color tokens (light mode)

| Token | Value | Usage |
|---|---|---|
| Canvas | `#F8FAFC` | Page background |
| Paper | `#FFFFFF` | Card and surface backgrounds |
| Ink | `#17212B` | Primary text |
| Muted | `#5B6B7C` | Secondary text |
| Line | `#E2E8F0` | Borders and dividers |
| Brand | `#0F766E` | Primary actions, active links |
| Brand Dark | `#0B5F59` | Hover states, quote section background |
| Brand Soft | `#ECFDF9` | Soft teal surfaces, "View Details" button |

All tokens redefine under `.dark` — no component uses hard-coded hex values.

### Typography

- **Playfair Display** — display headings, editorial titles, book card titles.
- **Inter** — body copy, navigation, UI labels, metadata.
- **Geist** — loaded as an additional sans variable (available via `--font-geist-sans`).

### Layout

- `Container`: `max-w-7xl` with `px-4` / `px-6` / `px-8` responsive horizontal padding.
- Section vertical padding: `py-20 sm:py-24` standard.
- Book grid: `gap-6 sm:grid-cols-2 lg:grid-cols-3`.
- Navbar: `h-18` (72px), sticky, glass backdrop.

### Key primitives

`Button` (CVA variants: default/outline/ghost/danger, sizes: sm/default/lg), `Badge` (teal/success/warning/danger/muted), `Alert`, `Modal` (focus-trapped), `ConfirmDialog`, `Toast`, `SectionHeading`, `BookCard`, `CategoryCard`, `EmptyState`, `Skeleton`, `Pagination`.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server with Turbopack |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build locally |
| `npm run lint` | Run ESLint (Next.js core-web-vitals + TypeScript rules) |

---

## Deployment

Both the client and server are deployed on **Vercel**.

| Project | Vercel Name | URL |
|---|---|---|
| Frontend | `booknook-c-ph` | https://booknook-c-ph.vercel.app |
| Backend | `booknook-s-ph` | https://booknook-s-ph.vercel.app |

The server uses `vercel.json` to route all requests through `index.js` via `@vercel/node`.

### Production checklist

1. Set all required environment variables on the hosting platform.
2. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the deployed frontend origin.
3. Set `NEXT_PUBLIC_API_URL` to the production BookNook API URL.
4. Ensure the MongoDB cluster allows connections from Vercel's IP ranges.
5. Register the production callback URL in the Google Cloud OAuth app.
6. Set `NEXT_PUBLIC_IMGBB_API_KEY` for image uploads.
7. Run `npm run build` and deploy; Vercel handles `npm start` automatically.

`next.config.ts` enables remote images over HTTPS from any hostname, `cacheComponents`, `partialPrefetching`, the React Compiler, and the Tailwind Turbopack CSS loader.

---

## Contact

| Channel | Link |
|---|---|
| GitHub | [aminulislamdev](https://github.com/aminulislamdev) |
| LinkedIn | [aminulislamjs](https://www.linkedin.com/in/aminulislamjs/) |
| Email | [aminulislam424842@gmail.com](mailto:aminulislam424842@gmail.com) |
| Phone | +880 1709150885 |
| Location | Rajshahi, Bangladesh |
