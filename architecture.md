# GoonnexTrip Architecture & System Overview

This document describes the overall architectural design, tech stack, directory structure, and key patterns used in the **GoonnexTrip** (Travel Portal UI) application.

---

## 1. Technology Stack
- **Framework**: [Next.js](https://nextjs.org/) (v13.5+, App Router)
- **Language**: TypeScript / JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with CSS variables & PostCSS nesting
- **Component Library**: [Radix UI](https://www.radix-ui.com/) / [shadcn/ui](https://ui.shadcn.com/)
- **State & Forms**: React Hook Form with Zod schema validation
- **Icons & UI Enhancements**: Lucide React, Swiper / Embla Carousel, Recharts, Sonner (toasts)
- **Backend / Database**: [Supabase](https://supabase.com/) (Database, Authentication, Real-time APIs)

---

## 2. Workspace & Directory Structure

The repository root encapsulates the core frontend application inside the `project/` subdirectory:

```
travel-portal-ui/
├── architecture.md          # Architecture overview (this file)
├── memory.md                # Persistent log & development memory
└── project/                 # Core application code
    ├── app/                 # Next.js App Router pages, global layouts, styles
    ├── components/          # Reusable UI components (shadcn/ui, modals, cards, etc.)
    ├── hooks/               # Custom React hooks
    ├── lib/                 # Utility helpers and backend query integrations (Supabase)
    ├── public/              # Static media assets & icons
    ├── tailwind.config.ts   # Tailwind styling & theme design tokens
    └── tsconfig.json        # TypeScript compiler configuration
```

---

## 3. Core Architectural Patterns

### 3.1 Routing & Navigation (App Router)
- The application follows Next.js App Router conventions within `project/app/`.
- Major modular domain routes include:
  - `/destinations` - Exploring specific travel spots and detailed guides.
  - `/packages` - Structured holiday and tour offerings.
  - `/treks` - Trekking itineraries and expeditions.
- Global navigation elements (Navbar, Footer, Modal providers) are structured cleanly in root layout files (`project/app/layout.tsx`).

### 3.2 Global Enquiry System
- A primary interactive feature is the contextual global travel enquiry system.
- An enquiry state/modal provider wraps the root architecture so users can initiate tour or trekking inquiries seamlessly from any page, route, or individual item card.

### 3.3 Data Layer & Backend Integration
- **Supabase Client (`project/lib/supabase.js`)**: Manages anonymous and authenticated interactions with Supabase services using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Query Abstractions (`project/lib/queries.js`)**: Encapsulates CRUD operations, data fetching for destinations, trek details, user reviews, and enquiry submissions, keeping UI components clean of raw SQL or API query boilerplate.

### 3.4 Domain Data & Entity Structures (Itineraries & Policies)
- **Itinerary Modeling**: Itineraries support polymorphic attachment to both Packages (`referenceType: 0`) and Treks (`referenceType: 1`). Every individual itinerary record (such as a specific trip day or sequence) encapsulates a **structured list of subsidiary items** (`activities: List<String>`) in addition to operational metrics (`travelMode`, `distanceCovered`, `altitude`, `stay`, `meals`).
- **Policy Modeling**: Adhering to the same structured hierarchy as itineraries, travel policies (e.g., Cancellation Policies, Payment Terms, Operational Guidelines) must be designed and handled as containing a **list of bullet points / rules** (`List<String>` or structured arrays of points) rather than raw monolithic text blobs. Frontend displays and admin interfaces must preserve this list-based formatting.

---

## 4. Development Guidelines & Conventions
1. **Component Modularity**: UI widgets should leverage standard shadcn/ui components (`project/components`) and Tailwind styling. Avoid inline arbitrary CSS where design tokens exist.
2. **Form Validation**: All form submissions (especially user inquiries) should use strictly typed Zod schemas combined with React Hook Form.
3. **Memory Tracking**: As mandated by workflow guidelines, any feature implementation, component modifications, or refactoring in this repository must be systematically logged in [memory.md](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/memory.md).
