# BookNook

**BookNook** is a premium, responsive online library built with Next.js. Readers can discover curated books, search and filter the collection, borrow titles with a chosen return date, add their own books to the shelves, and manage their loans from a personal dashboard.

This repository contains the **BookNook frontend client**. Authentication is handled inside the Next.js application with Better Auth and MongoDB. Book and borrowing data are read from and written to a separate BookNook API service configured through `NEXT_PUBLIC_API_URL`.

![Next.js](https://img.shields.io/badge/Next.js-16.4.3-000000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.3.0-087EA4?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Better Auth](https://img.shields.io/badge/Better_Auth-1.7.14-000000)

---

## Table of Contents

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

## Project Overview

BookNook is a full reading-room experience rather than a simple catalog. The home page combines an image-led hero slider, browsing categories, curated discovery tools, new arrivals, a rotating reading quote, and a reader's wall of community book notes. Signed-in readers get a complete loan lifecycle: add a book, see it on their shelf, edit or delete it, borrow other readers' books, and return them when finished.

The interface is built around a calm white and deep-teal visual system, with Playfair Display headings, Inter body text, rounded cards, subtle motion, accessible dialogs, loading skeletons, and empty states throughout.

The application expects a compatible backend service for books and borrows. That backend is **not included in this repository**.

---

## Key Features

### Discovery & Home Page

- Full-width hero slider powered by Swiper with fade transitions, autoplay every 4 seconds, looped slides, and clickable pagination.
- Three editorial hero slides with library photography, custom headings, descriptions, and a **Browse Books** call to action.
- Feature strip highlighting curated shelves, clear availability, and user-added books.
- Popular category cards for **Fiction**, **Science**, **History**, **Kids**, and **Others**, each linking to the filtered catalog.
- **Discover Your Next Read** section with:
  - **Blind Date with a Book** — a click-to-reveal card that unwraps a surprise title from a curated list of 20 books.
  - **Reading Mood Studio** — mood-based recommendations for relaxing, thrilling, learning, and escapist reads, revealed with an animated 3D flip.
- **New Arrivals** grid that fetches the six newest books from the API.
- Rotating literary quote section that changes every 10 seconds.
- **The Reader's Wall** — a community section of pinned reader notes about books that stayed with them, followed by a closing call-to-action.
- Responsive sticky navbar with active-link styling, auth-aware links, a profile dropdown, and a mobile hamburger menu.
- Footer with quick links, category links, contact details, and social links.

### Book Catalog

- Responsive book grid with one, two, or three columns depending on screen size.
- Debounced search by title, author, or description (350 ms).
- Category filtering and server-side pagination at nine books per page.
- URL-synchronized filters (`q`, `category`, `page`) so catalog views are shareable.
- Sort by newest first.
- Live result count, clear-filters action, loading skeletons, error retry states, and a dedicated empty state.
- Book cards show cover, category, title, author, availability, and a details link.
- Cover fallback treatment when an image is missing or fails to load.

### Book Details & Borrowing

- Two-column detail layout with a sticky cover and availability panel on desktop.
- Displays title, author, category, description, added-by reader, date added, total copies, available copies, and copies on loan.
- Availability progress bar with clear **available**, **low availability**, and **not available** states.
- Authentication-aware actions:
  - Guests are prompted to sign in.
  - Owners are directed to manage their book.
  - Signed-in readers can open the borrow dialog.
- Borrow confirmation modal with read-only borrower details, borrow date, and return date.
- Default loan window of 14 days, with the return date constrained to the borrow date or later.
- Successful borrow state with a link to **My Borrows**.
- Book availability refreshes after a successful loan.

### Book Management

- **Add Book** page wrapped in an authentication gate.
- Fields for title, author, category, number of copies, description, and cover image.
- Read-only display of the signed-in user's name and email.
- Live book-card preview while filling out the form.
- Direct cover upload through ImgBB or manual image URL entry.
- Image type and 5 MB size validation.
- Copy count validation between 1 and 50; descriptions capped at 1,200 characters.
- **My Books** dashboard with totals for titles added, total copies, and available copies.
- Responsive management UI: table on desktop and cards on mobile.
- Edit a book in a prefilled modal and save changes without leaving the page.
- Delete a book through a custom confirmation dialog with error handling and toast feedback.
- Loading skeletons, error retry, and an empty-shelf state.

### Borrowing Dashboard

- **My Borrows** page with **Active** and **History** tabs and item counts.
- Summary cards for active loans, due-soon/overdue loans, and returned books.
- Displays cover, title, author, borrow date, return date, and status.
- Active, overdue, and returned status badges.
- Due-today, days-remaining, and overdue-day messaging.
- Return a book through a confirmation dialog; the copy is restored and the list refreshes.
- Responsive table-to-card layout with skeleton and empty states.

### Reader Profile

- Profile page with avatar or generated initials, name, email, reader badge, and membership date.
- Reading snapshot showing books added, active borrows, and books returned.
- Edit-profile modal for updating display name and profile image.
- Profile image can be uploaded to ImgBB or supplied as a URL.
- Quick links to **My Books**, **My Borrows**, and **Add Book**.

### Authentication

- Email and password sign-up and sign-in through Better Auth.
- Minimum password length of eight characters and password confirmation feedback on registration.
- Optional photo URL during registration.
- Google OAuth sign-in/sign-up support, configurable through Google Cloud credentials.
- Show/hide password control.
- Redirect preservation through the `redirect` query parameter.
- Signed-in users are redirected away from the login and registration pages.
- Session-aware navigation and logout from both desktop and mobile menus.
- Friendly toast notifications for authentication and data actions.

### Experience & Accessibility

- Custom 404 page with library-themed illustration and recovery links.
- Global error boundary with a retry action.
- Toast provider for success, error, and informational messages.
- Accessible modal implementation with focus management, focus trapping, Escape-to-close, and body scroll locking.
- Visible focus styles, semantic labels, `aria-current`, `aria-live` regions, and reduced-motion support.
- Responsive layouts across mobile, tablet, and desktop.

---

## Technologies Used

| Category | Technology |
| --- | --- |
| Framework | [Next.js 16.4.3](https://nextjs.org/) — App Router |
| UI Runtime | [React 19.3.0](https://react.dev/) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 with `@tailwindcss/turbopack` |
| Component System | shadcn/ui (`base-nova` style) and Base UI primitives |
| Icons | Lucide React |
| Fonts | `next/font` — Inter, Playfair Display, Geist |
| Animation | CSS keyframes, `tw-animate-css`, Swiper transitions |
| Carousel | Swiper 14 with Autoplay, Pagination, and EffectFade modules |
| Authentication | Better Auth 1.7.14 with the JWT plugin |
| Auth Database | MongoDB through `@better-auth/mongo-adapter` and the MongoDB driver |
| Image Hosting | ImgBB upload API (client-side uploads) |
| Images | `next/image` with remote HTTPS image support |
| Tooling | ESLint 9, `eslint-config-next`, React Compiler, Turbopack |
| Package Manager | npm (`package-lock.json`) |

The project also enables Next.js `cacheComponents`, `partialPrefetching`, and the React Compiler in `next.config.ts`.

---

## Architecture

```text
Browser
   │
   ├── Next.js App Router (this repository)
   │      ├── Pages, layouts, components, client-side data fetching
   │      ├── /api/auth/[...all]  ──> Better Auth
   │      │                             ├── MongoDB (booknook database)
   │      │                             ├── Email/password sessions
   │      │                             └── Google OAuth
   │      └── ImgBB API (cover and avatar uploads)
   │
   └── BookNook API (external service)
          ├── /books
          ├── /books/:id
          ├── /borrows
          └── /borrows/:id
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
│   ├── books/                    # Local book cover artwork
│   ├── images/
│   │   └── hero-library.jpg
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── api/auth/[...all]/route.ts   # Better Auth Next.js handler
│   │   ├── add-book/page.tsx            # Add a book
│   │   ├── books/page.tsx               # Catalog shell + suspense fallback
│   │   ├── books/[id]/page.tsx          # Book details and borrowing
│   │   ├── login/page.tsx               # Sign in
│   │   ├── register/page.tsx            # Registration
│   │   ├── my-books/page.tsx            # Manage owned books
│   │   ├── my-borrows/page.tsx          # Active loans and history
│   │   ├── profile/page.tsx             # Reader profile
│   │   ├── error.tsx                    # Global error boundary
│   │   ├── not-found.tsx                # Custom 404 page
│   │   ├── layout.tsx                   # Root layout, fonts, navbar, footer
│   │   ├── page.tsx                     # Home page
│   │   ├── globals.css                  # Tailwind theme and design tokens
│   │   └── favicon.ico
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthShell.tsx            # Split-screen auth layout
│   │   │   └── PasswordInput.tsx        # Password field with visibility toggle
│   │   ├── books/
│   │   │   ├── AllBooksClient.tsx       # Catalog search, filters, pagination
│   │   │   ├── BookCard.tsx
│   │   │   ├── BookCover.tsx
│   │   │   ├── BookForm.tsx             # Shared add/edit book form
│   │   │   ├── BookGridSkeleton.tsx
│   │   │   ├── BorrowModal.tsx
│   │   │   └── Pagination.tsx
│   │   ├── home/
│   │   │   ├── Categories.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── CtaSection.tsx
│   │   │   ├── DiscoverySection.tsx
│   │   │   ├── HeroSlider.tsx
│   │   │   ├── HeroStrip.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── NewArrivals.tsx
│   │   │   ├── ReadingNook.tsx
│   │   │   ├── ReadersWall.tsx
│   │   │   └── discovery/
│   │   │       ├── BlindDateCard.tsx
│   │   │       └── MoodStudio.tsx
│   │   ├── shared/
│   │   │   ├── AuthGate.tsx             # Client-side auth guard
│   │   │   ├── AvatarUpload.tsx         # ImgBB avatar upload
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProfileModal.tsx
│   │   │   ├── UserMenu.tsx
│   │   │   └── navbar/
│   │   │       ├── MobileMenu.tsx
│   │   │       ├── NavLinks.tsx
│   │   │       └── NavLogo.tsx
│   │   └── ui/
│   │       ├── Alert.tsx
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── Container.tsx
│   │       ├── dialog.tsx               # Base UI dialog primitives
│   │       ├── EmptyState.tsx
│   │       ├── Form.tsx                 # Input, Label, Select, Textarea
│   │       ├── Modal.tsx
│   │       ├── PageLoader.tsx
│   │       ├── SectionHeading.tsx
│   │       ├── Skeleton.tsx
│   │       └── Toast.tsx
│   ├── data/
│   │   └── slides.ts                    # Hero slider content
│   ├── lib/
│   │   ├── api.ts                       # Authenticated API client
│   │   ├── auth-client.ts               # Better Auth browser client
│   │   ├── auth.ts                      # Better Auth server configuration
│   │   ├── client-token.ts              # Browser JWT retrieval
│   │   ├── hooks.ts                     # useDebouncedValue
│   │   ├── server-token.ts              # Server-side JWT retrieval
│   │   ├── types.ts                     # Book, Borrow, and response types
│   │   └── utils.ts                     # Class names, dates, initials, helpers
│   └── proxy.ts                         # Session-cookie route protection
├── .gitignore
├── AGENTS.md
├── DESIGN.md
├── PROMPT.md
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

> `node_modules/`, `.next/`, build output, environment files, and other ignored artifacts are intentionally omitted.

---

## Installation & Setup

### Prerequisites

- **Node.js 20.9 or newer** (recommended for Next.js 16)
- **npm** (the repository includes a `package-lock.json`)
- A running **BookNook API** service for books and borrows
- A **MongoDB** database reachable from the Next.js server (local or MongoDB Atlas)
- Optional: **Google Cloud OAuth credentials** for Google sign-in
- Optional: an **ImgBB API key** for direct cover/avatar uploads

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a local environment file in the project root:

```bash
.env.local
```

Add the values described in [Environment Variables](#environment-variables). Environment files are ignored by Git through the `.env*` rule in `.gitignore`, so no `.env.example` file is tracked in this repository.

### 3. Start MongoDB and the BookNook API

The frontend reads the API root from `NEXT_PUBLIC_API_URL` (default: `https://booknook-s-ph.vercel.app/api`). To use a local backend, set it to `http://localhost:8000/api` and start that service separately. Confirm its `/books` endpoint is reachable before running the client.

### 4. Start the development server

```bash
npm run dev
```

---

## Environment Variables

The following variables are referenced directly in the source code.

| Variable | Scope | Required | Description | Default / Example |
| --- | --- | --- | --- | --- |
| `DB_URL` | Server | Yes | MongoDB connection string used by Better Auth. The adapter uses the `booknook` database. | `mongodb+srv://...` |
| `BETTER_AUTH_SECRET` | Server | Yes | Secret used by Better Auth to sign sessions and tokens. | A long random string |
| `BETTER_AUTH_URL` | Server | Yes | Public base URL of the Next.js app. Also registered as a trusted auth origin. | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Server | For Google auth | Google OAuth client ID. | `...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Server | For Google auth | Google OAuth client secret. | `GOCSPX-...` |
| `NEXT_PUBLIC_APP_URL` | Client | Recommended | Base URL used by the Better Auth browser client. | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Client | Recommended | Root URL of the external BookNook API, without a trailing slash. | `https://booknook-s-ph.vercel.app/api` |
| `NEXT_PUBLIC_IMGBB_API_KEY` | Client | For uploads | ImgBB API key used by book-cover and avatar upload components. | Your ImgBB key |

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

> Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Do not put private server credentials in public variables.

---

## How to Run Locally

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The Better Auth handler is available at `/api/auth/*`, and the client will call the API configured by `NEXT_PUBLIC_API_URL`.

### Production build locally

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

### Typical local workflow

1. Start MongoDB (or allow access to your Atlas cluster).
2. Start the BookNook API on port `8000`, or set `NEXT_PUBLIC_API_URL` to its address.
3. Run `npm run dev` in this project.
4. Register an account, add a book, and verify that it appears in **All Books**, **My Books**, and **New Arrivals**.
5. Borrow a book from another account and confirm it moves to **My Borrows**.

---

## Authentication & Route Protection

### Better Auth configuration

`src/lib/auth.ts` configures Better Auth with:

- MongoDB storage through `mongodbAdapter(client.db("booknook"))`
- A reusable MongoDB client across development hot reloads
- Email and password authentication with a minimum password length of 8
- Automatic sign-in after registration
- Google as a social provider
- The Better Auth JWT plugin
- `BETTER_AUTH_URL` as both the auth base URL and trusted origin

The App Router handler in `src/app/api/auth/[...all]/route.ts` exposes Better Auth through `toNextJsHandler(auth)` for both `GET` and `POST` requests.

### Client session handling

- `src/lib/auth-client.ts` creates the browser client with `createAuthClient`, the `jwtClient()` plugin, and `NEXT_PUBLIC_APP_URL`.
- `useSession`, `signIn`, `signUp`, and `signOut` are re-exported for use across the UI.
- Protected pages are wrapped in `AuthGate`, which shows a loader while the session resolves and redirects unauthenticated visitors to `/login?redirect=...`.
- The navbar swaps **Login / Register** for the reader's avatar and profile menu after sign-in.

### Route protection

`src/proxy.ts` checks for the Better Auth session cookie and redirects unauthenticated requests to the login page. This uses the Next.js 16 proxy convention (`export async function proxy`). Requests for static book-cover files under `/books/` are allowed through so signed-out visitors can load local cover art; book detail routes remain protected, while the `/books` catalog stays public. The configured matcher covers:

```text
/add-book/:path*
/my-books/:path*
/my-borrows/:path*
/books/:id
/profile/:path*
```

The `redirect` query parameter preserves the destination after sign-in.

### API authentication

`src/lib/api.ts` wraps `fetch` with:

- The API base URL from `NEXT_PUBLIC_API_URL`, falling back to the deployed BookNook API
- JSON request/response handling
- An optional `auth` flag so public endpoints can skip token retrieval
- A Bearer token obtained from the Better Auth JWT plugin through `authClient.token()`, cached in memory and `sessionStorage` until shortly before expiry
- `cache: "no-store"` for fresh server data
- A typed `ApiError` containing the HTTP status
- Removal of the stored token when the API responds with `401`

---

## API Documentation

The client communicates with an external REST API. All paths below are relative to `NEXT_PUBLIC_API_URL` (default `https://booknook-s-ph.vercel.app/api`).

Requests are sent with:

```http
Authorization: Bearer <better-auth-jwt>
Content-Type: application/json
```

The API may return either a paginated books object or a plain array; the catalog and new-arrivals views normalize both shapes.

### Endpoints used by the client

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/books` | List, search, filter, sort, and paginate books |
| `GET` | `/books/:id` | Fetch a single book |
| `POST` | `/books` | Add a new book |
| `PATCH` | `/books/:id` | Update a book |
| `DELETE` | `/books/:id` | Delete an owned book |
| `GET` | `/borrows` | Fetch a reader's active and returned loans |
| `POST` | `/borrows` | Borrow a book |
| `DELETE` | `/borrows/:id` | Return a book |

### `GET /books`

Supported query parameters used by the application:

| Parameter | Description |
| --- | --- |
| `page` | Page number, starting at `1` |
| `limit` | Number of results per page (catalog uses `9`, new arrivals use `6`, my books uses `100`) |
| `sort` | `newest` for newest-first ordering |
| `search` | Text search across title, author, and description |
| `category` | One of `Fiction`, `Science`, `History`, `Kids`, `Others` |
| `addedBy` | Filter by the owning user ID |
| `userEmail` | Filter by the owning user's email |

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

Expected response, either wrapped:

```json
{
  "book": {}
}
```

or returned directly as a book object.

### `POST /books` and `PATCH /books/:id`

Request body:

```json
{
  "title": "Book title",
  "author": "Author name",
  "category": "Fiction",
  "totalCopies": 3,
  "description": "Short description",
  "image": "https://example.com/cover.jpg",
  "userId": "user-id",
  "userName": "Reader Name",
  "userEmail": "reader@example.com",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

Expected response:

```json
{
  "book": {}
}
```

### `DELETE /books/:id`

The client calls:

```http
DELETE /books/:id?userId=<user-id>
```

The response body is not used by the UI. A successful response updates the local list and shows a toast.

### `GET /borrows`

Query parameters:

| Parameter | Description |
| --- | --- |
| `userId` | Reader's user ID |
| `userEmail` | Reader's email |

Expected response:

```json
{
  "borrows": []
}
```

### `POST /borrows`

Request body:

```json
{
  "bookId": "book-id",
  "bookTitle": "Book title",
  "bookImage": "https://example.com/cover.jpg",
  "userId": "user-id",
  "userName": "Reader Name",
  "userEmail": "reader@example.com",
  "borrowDate": "2026-01-01T00:00:00.000Z",
  "returnDate": "2026-01-15T23:59:59.000Z",
  "dueDate": "2026-01-15T23:59:59.000Z"
}
```

Expected response:

```json
{
  "borrow": {}
}
```

### `DELETE /borrows/:id`

Returns a borrowed book and restores the available copy. The UI removes the loan from the active list and refreshes the borrows data after success.

> The backend must enforce its own authorization and availability rules. The UI hides or disables owner actions and unavailable books, but the API remains the source of truth.

---

## Data Models

Core types live in `src/lib/types.ts`.

### User

```ts
type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};
```

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
  addedBy: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
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
  borrowedAt?: string;
  returnDate: string;
  dueDate?: string;
  returnedAt: string | null;
  status: "active" | "returned";
  book?: Book | null;
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

The borrow dashboard also reads `borrowedAt`, `dueDate`, and nested `book` fields when provided by the API, so it remains compatible with both flat and expanded borrow records.

---

## Design System

BookNook uses one consistent visual language across all pages.

### Color tokens

| Token | Value | Usage |
| --- | --- | --- |
| Canvas | `#F8FAFC` | Page background |
| Ink | `#17212B` | Primary text |
| Muted | `#5B6B7C` | Secondary text |
| Line | `#E2E8F0` | Borders and dividers |
| Brand | `#0F766E` | Primary actions and accents |
| Brand Dark | `#0B5F59` | Hover and dark panels |
| Brand Soft | `#ECFDF9` | Soft teal surfaces |

### Typography

- **Inter** — body copy and interface text.
- **Playfair Display** — display headings and editorial titles.
- **Geist** — loaded as an additional sans variable.

### Layout and components

- Tailwind CSS 4 theme tokens defined in `src/app/globals.css`.
- shadcn/ui configuration in `components.json` (`base-nova`, neutral base color, CSS variables, Lucide icons).
- Reusable primitives for buttons, badges, alerts, modals, confirmation dialogs, forms, skeletons, pagination, empty states, and toasts.
- Responsive maximum-width container (`max-w-7xl`) with mobile, tablet, and desktop spacing.
- Consistent 2:3 book-cover aspect ratio and rounded card treatment.
- Subtle `fade-up`, `fade-in`, and `scale-in` animations, 3D flip reveals in the Reading Mood Studio, and reduced-motion support.
- Remote HTTPS images accepted through `next.config.ts`; missing covers fall back to a branded placeholder.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server with Turbopack |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint with Next.js core-web-vitals and TypeScript rules |

---

## Deployment

This repository does not include a platform-specific deployment configuration (such as a Dockerfile, `vercel.json`, or CI workflow). It is a standard Next.js application and can be deployed to any Node.js host that supports Next.js, including Vercel.

### Production checklist

1. Set all required environment variables on the hosting platform.
2. Use production values for `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL`; both should match the deployed origin.
3. Point `NEXT_PUBLIC_API_URL` at the production BookNook API.
4. Ensure the MongoDB cluster is reachable from the deployment environment.
5. Register the production callback URL in the Google Cloud OAuth configuration.
6. Provide `NEXT_PUBLIC_IMGBB_API_KEY` if image uploads should work.
7. Run `npm run build` and start with `npm start`.

`next.config.ts` allows remote images over HTTPS from any hostname and enables `cacheComponents`, `partialPrefetching`, the React Compiler, and the Tailwind Turbopack CSS loader.

---

## Contact

- GitHub: [aminulislamdev](https://github.com/aminulislamdev)
- LinkedIn: [aminulislamjs](https://www.linkedin.com/in/aminulislamjs/)
- Email: [aminulislam424842@gmail.com](mailto:aminulislam424842@gmail.com)
