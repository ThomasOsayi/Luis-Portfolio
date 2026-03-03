# Luis Rosa Portfolio — Repository Structure

## File Tree

```
Luis-Portfolio/
├── public/
│   ├── fonts/
│   ├── images/
│   │   └── hero.jpeg
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── clients/
│   │   │   │   └── page.tsx      # Clients CRUD + live preview
│   │   │   ├── projects/
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx  # Add/Edit project, split view, YouTube thumb
│   │   │   │   └── page.tsx      # Projects table, filters, category pills
│   │   │   ├── settings/
│   │   │   │   └── page.tsx      # Site settings, section nav, live /about preview
│   │   │   ├── layout.tsx        # Auth guard, admin nav, sign out
│   │   │   └── page.tsx          # Dashboard: stats, recent projects, quick actions
│   │   ├── login/
│   │   │   └── page.tsx          # Email/password login → /admin
│   │   ├── about/
│   │   │   └── page.tsx          # About (static content for now)
│   │   ├── clients/
│   │   │   └── page.tsx          # Public clients grid (static data)
│   │   ├── films/
│   │   │   └── page.tsx          # Short films (static projects filter)
│   │   ├── photography/
│   │   │   └── page.tsx          # Photography grid (local photos)
│   │   ├── work/
│   │   │   └── page.tsx          # Work grid — fetches from Firestore
│   │   ├── favicon.ico
│   │   ├── globals.css           # Theme, film grain, admin animations
│   │   ├── layout.tsx            # Fonts, FilmGrain, ContactModal, LayoutShell
│   │   └── page.tsx              # Enter gate (scroll/touch to enter)
│   │
│   ├── components/
│   │   ├── ContactModal.tsx      # Contact form modal
│   │   ├── FilmEntry.tsx         # Film row (thumbnail, title, role, description)
│   │   ├── FilmGrain.tsx         # Film-grain overlay
│   │   ├── Footer.tsx            # Site footer
│   │   ├── LayoutShell.tsx       # Navbar + main + Footer (hidden on /admin)
│   │   ├── Navbar.tsx            # Fixed top nav
│   │   ├── PageTransition.tsx    # (stub)
│   │   ├── PhotoItem.tsx         # Photo grid item (tall/wide, label on hover)
│   │   ├── ProjectCard.tsx       # Work card (imageUrl or gradient, play icon)
│   │   └── ScrollReveal.tsx      # Scroll fade-up
│   │
│   ├── data/
│   │   └── projects.ts          # Static projects + clients (films, clients pages)
│   │
│   └── lib/
│       └── firebase.ts           # Firebase app, Auth, Firestore, Storage, Analytics
│
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── README.md
└── STRUCTURE.md
```

---

## Tech Stack

| Layer        | Technology                                    |
| ------------ | --------------------------------------------- |
| Framework    | Next.js 16 (App Router)                       |
| Language     | TypeScript                                    |
| Styling      | Tailwind CSS 4 (`@theme` in globals.css)     |
| Animations   | Framer Motion                                 |
| Fonts        | Chivo (sans) + Cormorant Garamond (serif)    |
| Backend      | Firebase (Auth, Firestore, Storage, Analytics)|
| Deployment   | Vercel-ready                                  |

---

## What Has Been Implemented

### Design System (`globals.css` + `tailwind.config.ts`)

- **Tailwind v4 theme**: `@theme` with `--color-bg`, `--color-tx`, `--color-gold`, `--font-sans`, `--font-serif`, `--ease-smooth`.
- **Base**: dark background, smooth scroll, gold scrollbar, film-grain keyframes.
- **Admin animations**: `@keyframes admin-fade-in`, `admin-fade-in-up`; utility `.animate-fade-in-up` used on admin pages.
- **tailwind.config.ts**: content paths, extended colors/fonts/easing.

### Root Layout (`layout.tsx`)

- Google Fonts (Chivo, Cormorant Garamond). Renders: `FilmGrain`, `ContactModal`, `LayoutShell` (wraps children). No Navbar/Footer in layout directly — they live inside LayoutShell.

### LayoutShell (`LayoutShell.tsx`)

- Wraps children in `Navbar` → `main` → `Footer` when path is **not** `/admin`; on `/admin` only `main` (no nav/footer). Keeps admin UI uncluttered.

### Enter Gate / Homepage (`page.tsx`)

- Full-screen hero, “Luis Rosa” branding. **Enter** and **Contact** buttons; Enter → `/work`. **Scroll to enter**: wheel listener (two scroll steps) and touch-swipe down trigger navigation to `/work`. Contact opens modal via `open-contact` event.

### Public Pages

- **Work** (`work/page.tsx`): Fetches projects from Firestore `projects` collection (`orderBy("order")`). Loading state. Renders grid of `ProjectCard` with `imageUrl`, `gradient`, `categoryLabel`, `subtitle`, `hasVideo`/`isVideo`, `featured`/`isFeatured`.
- **About** (`about/page.tsx`): Two-column layout — image side, text side (heading, two paragraphs, details grid: Based In, Education, Focus, Heritage). Static content; not yet driven by `siteSettings`.
- **Clients** (`clients/page.tsx`): “Selected Clients & Collaborators” grid; client names from static `data/projects.ts` `clients` array; serif/sans styling and staggered Framer Motion.
- **Short Films** (`films/page.tsx`): Filters static `projects` by film/documentary; each rendered with `FilmEntry` (thumbnail, title, role, description, alternating reverse layout).
- **Photography** (`photography/page.tsx`): Local `photos` array; grid of `PhotoItem` (gradient, optional tall/wide span, label on hover).

### Components

- **Navbar**: Fixed nav, links (Work, Short Films, Photography, Clients, About), Contact, active route, Instagram; hidden on `/` and `/login`. Rendered inside LayoutShell (hidden on admin).
- **Footer**: Copyright, “Designed by HNO Consulting”; hidden on `/`; inside LayoutShell.
- **ContactModal**: Full-screen overlay, form (name, email, project type, message), `open-contact` event, close on Escape; submit not wired to backend.
- **ProjectCard**: Accepts `imageUrl` (real image) or `gradient` fallback; hover overlay (category, title, subtitle); optional play icon when `isVideo`. Used by Work page with Firestore data.
- **FilmEntry**: `Project` prop; gradient thumbnail + play button; title, role, description; optional `reverse` for alternating layout.
- **PhotoItem**: Gradient block, optional `row-span-2` / `col-span-2`, label on hover.
- **ScrollReveal**, **FilmGrain**: Unchanged (scroll fade-up, film-grain overlay).

### Firebase (`lib/firebase.ts`)

- Single app init via `NEXT_PUBLIC_FIREBASE_*` env vars. Exports: `db` (Firestore), `storage` (Storage), `auth` (Auth), `app`, `analytics` (client-only when supported).

### Authentication & Admin

- **Login** (`login/page.tsx`): Email/password, `signInWithEmailAndPassword`, `onAuthStateChanged` → redirect to `/admin`. Loading state.
- **Admin layout** (`admin/layout.tsx`): Auth guard; unauthenticated → inline login form; authenticated → admin nav (Dashboard, Projects, Clients, Settings), “View Site”, Sign Out. Wraps children in padded container.

- **Admin dashboard** (`admin/page.tsx`): Firestore stats (total projects, music videos, films, clients, featured). Recent projects (last 4, orderBy order). Quick actions: New Film Project, New Music Video, New Photo Set, New Documentary (links to `/admin/projects/new?cat=...`). Portfolio sections: Short Films, Music Videos, Photography with category counts and links. Icons (Film, Play, Camera, Image, Arrow).

- **Projects list** (`admin/projects/page.tsx`): Firestore `projects`, `orderBy("order")`. Filter tabs: All + by category (Music Video, Short Film, Documentary, Photography) with counts. Table: #, Project (mini thumbnail + title + subtitle), Category (colored pill), Status (Featured badge), Order, Actions (Edit link, Delete with confirm). Category colors (gold, green, indigo, pink). Row hover state. Icons (Grip, Edit, Trash, Plus).

- **Add/Edit project** (`admin/projects/new/page.tsx`): Split view: left form, right live preview. Form: title, category, subtitle, description, role, video URL, thumbnail (file upload or **YouTube thumbnail auto-fetch** from video URL), gradient, featured/hasVideo checkboxes, order. Back button to list. Edit mode loads doc by `?edit=id`; create uses `addDoc`. Image upload to Storage `projects/`. Preview shows card/detail. Uses `featured` and `hasVideo` in Firestore.

- **Clients admin** (`admin/clients/page.tsx`): Firestore `clients`, `orderBy("order")`. Add form (name + style serif/sans). List with order, name, style, Remove (with confirm). **Show/Hide Preview**: when on, live preview of public clients page (including name being typed). Icons (Plus, Trash, Grip, Eye).

- **Site settings** (`admin/settings/page.tsx`): Single doc `siteSettings/main`. **Section nav**: Hero & Branding, About Page, Details Grid, Social Links (smooth scroll to section). **Show/hide live preview** of `/about` (heading, paragraphs, details grid, social links). Form: hero image upload (Storage `site/`), mission statement, about heading, about paragraphs 1 & 2, basedIn, education, focus, heritage, instagram/vimeo/youtube. Icons (Eye, Upload, Check, Instagram, Vimeo, Youtube, MapPin, Book, Target, Globe). Split layout (form ~55%, preview ~45% when preview on). Save with `setDoc`; “Settings saved” feedback.

### Data

- **`data/projects.ts`**: Static `Project[]` and `clients` array. Used by **Films** and **Clients** public pages. **Work** page reads from Firestore; admin reads/writes Firestore.

---

## Stubs / Not Yet Implemented

| Item                     | Status                                                                 |
| ------------------------ | ---------------------------------------------------------------------- |
| `PageTransition`         | Stub — passthrough wrapper, no animation                               |
| Contact form submit       | Form UI only; no backend or `onSubmit` handler                          |
| Navbar Contact button     | Present; may need to dispatch `open-contact` (verify wiring)            |
| Public Films from Firestore | Films page uses static `projects.ts` filter; not Firestore             |
| Public Clients from Firestore | Clients page uses static `clients` from `projects.ts`                  |
| About from site settings  | About page is static; not driven by `siteSettings/main`                |
| Enter gate hero from settings | Hero image/background not loaded from `siteSettings` (if desired)      |
| Mobile hamburger menu     | Nav links `hidden md:flex`; no mobile menu                            |
| Project detail / video modal | ProjectCard/FilmEntry do not open detail page or video modal on click |
