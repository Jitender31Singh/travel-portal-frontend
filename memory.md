# Project Memory & Change Log

This document serves as a persistent project memory bank, development context tracker, and chronological change log for the GoonnexTrip (Travel Portal UI) repository.

---

## 🚨 Critical Directive for All Tasks
**MANDATORY RULE**: For every change made to the codebase (new features, refactoring, styling tweaks, debugging, or config modifications), a corresponding entry **must** be recorded in the **Change Log** section of this file immediately after making the changes.

---

## 1. Project Context & Objectives
- **Project Name**: GoonnexTrip (Travel Portal UI)
- **Goal**: Maintain and extend a modern, visually engaging Next.js web application for discovering destinations, holiday tour packages, and trekking expeditions across India.
- **Key References**: See [architecture.md](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/architecture.md) for system design, tech stack details, and folder structure.

---

## 2. Active Technical Decisions & Preferences
- **Styling**: Tailwind CSS & Radix UI / shadcn components.
- **State / Forms**: React Hook Form + Zod validation.
- **Backend**: Supabase integrated via utility query wrappers in `project/lib/`.

---

## 3. Chronology & Change Log

### [2026-07-25] - System Initialization & Documentation Setup
- **Action**: Initialized global workspace documentation files.
- **Files Modified/Created**:
  - `architecture.md` (Created): Defined overall tech stack (Next.js App Router, Tailwind, Supabase), folder structure, and core architectural patterns.
  - `memory.md` (Created): Established persistent development tracking and added the mandatory directive to log all future codebase modifications here.
- **Status / Next Steps**: Ready for subsequent user requests and codebase development.

### [2026-07-25] - Admin Dashboard Edit Capabilities for Itinerary & FAQs
- **Action**: Implemented full Edit and Delete support on the Admin Itinerary management page, and added Edit capability to the Admin FAQs management page.
- **Files Modified**:
  - [project/lib/api.js](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/lib/api.js): Added API endpoint helper functions `updateItinerary`, `deleteItinerary`, and `updateFaq`.
  - [project/app/admin/itinerary/page.jsx](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/app/admin/itinerary/page.jsx): Added editing states, `openEdit` handler, update/delete API integrations, action buttons (Pencil/Trash) on itinerary cards, and a delete confirmation modal.
  - [project/app/admin/faqs/page.jsx](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/app/admin/faqs/page.jsx): Added edit functionality, `openEdit` form prefilling, update API integration, and an edit (Pencil) icon button on FAQ items.
- **Status / Alignment**: Maintained consistency with existing design tokens and admin layout conventions as defined in [architecture.md](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/architecture.md).

### [2026-07-25] - Aligned Itinerary Fields with Backend Entity & DTO Mappings
- **Action**: Fixed field mappings for `travelMode`, `distanceCovered`, `altitude`, and `createdAt` across administrative and public itinerary UI components to match the Spring Boot backend DTO (`ItineraryRequest`) and Entity (`Itinerary`).
- **Files Modified**:
  - [project/app/admin/itinerary/page.jsx](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/app/admin/itinerary/page.jsx): Updated `openEdit` to cleanly map `travelMode`, `distanceCovered`, `altitude`, and `createdAt` (with snake_case fallback compatibility), restructured `handleSubmit` payload to explicitly construct all DTO attributes without omissions, and added `distanceCovered` display into the admin itinerary item list grid.
  - [project/app/packages/[slug]/page.jsx](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/app/packages/[slug]/page.jsx): Fixed a bug where `day.travel_mode` was being evaluated instead of `day.travelMode` resulting in empty text, and added rich styled UI badges for displaying `distanceCovered` and `altitude` on day-by-day itineraries.
- **Status**: Completely synchronized UI mapping with Java backend DTO specifications.

### [2026-07-25] - Admin Reference Persistence & Automatic Slug Generation
- **Action**: Improved admin UX by persisting selected reference filters during item creation (FAQs & Images) and automating real-time URL slug generation across inventory creation pages (Destinations, Packages, Treks).
- **Files Modified**:
  - [project/lib/utils.ts](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/lib/utils.ts): Added `generateSlug` utility function to transform raw text into SEO-friendly hyphen-delimited lowercase string strings in real-time.
  - [project/app/admin/faqs/page.jsx](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/app/admin/faqs/page.jsx): Updated `openCreate` to automatically prefill `referenceType` and `referenceId` using the currently filtered dropdown state so users never need to repeatedly select them when adding multiple FAQs.
  - [project/app/admin/images/page.jsx](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/app/admin/images/page.jsx): Removed `setParentId('')` reset in `handleSave` so selected Parent Item and Reference Type persist across sequential gallery uploads.
  - [project/app/admin/destinations/page.jsx](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/app/admin/destinations/page.jsx): Integrated auto-slug calculation via `handleNameChange` whenever typing destination names in create mode.
  - [project/app/admin/packages/page.jsx](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/app/admin/packages/page.jsx): Integrated auto-slug calculation via `handleTitleChange` whenever typing package titles in create mode.
  - [project/app/admin/treks/page.jsx](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/app/admin/treks/page.jsx): Integrated auto-slug calculation via `handleTitleChange` whenever typing trek titles in create mode.
- **Status / UX Gain**: Eliminates tedious redundant clicks during multi-item insertions and prevents manual error-prone slug input when establishing new records.

### [2026-07-25] - Extended Itinerary Architecture for Treks & Packages via Reference DTO
- **Action**: Transitioned Itinerary management and display from a package-only model (`packageId`) to a polymorphic reference model (`referenceId` & `referenceType`), allowing both Packages (`type: 0`) and Treks (`type: 1`) to manage and render comprehensive day-by-day itineraries in alignment with the upgraded Java `ItineraryRequest` DTO.
- **Files Modified**:
  - [project/lib/api.js](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/lib/api.js): Refactored `getItineraryApi(referenceId, type)` to query by both `referenceId` and `type`/`referenceType` while preserving legacy fallback parameter support.
  - [project/lib/queries.js](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/lib/queries.js): Updated `getItinerary(referenceId, referenceType)` helper to query public API routes cleanly with reference parameters.
  - [project/app/admin/itinerary/page.jsx](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/app/admin/itinerary/page.jsx): Completely rebuilt the admin interface to load both Packages and Treks, added Reference Type selector dropdowns, automated reference filter persistence into the modal form, and updated create/update payload formatting to supply `referenceId` and `referenceType`.
  - [project/app/treks/[slug]/page.jsx](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/app/treks/[slug]/page.jsx): Added itinerary fetching and implemented a responsive "Day-by-Day Trek Itinerary" section featuring rich icon badges (`meals`, `stay`, `travelMode`, `distanceCovered`, `altitude`) directly on public trek detail pages.
  - [project/app/packages/[slug]/page.jsx](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/app/packages/[slug]/page.jsx): Upgraded package itinerary visual presentation with enhanced card depth, visual separators, and explicit reference type filtering.
- **Status**: Complete end-to-end support for both Package and Trek itineraries across admin and public frontends, fully synchronized with Spring Boot specifications.

### [2026-07-25] - Debugged and Fixed TypeScript / IDE Configuration Errors
- **Action**: Resolved IDE and compiler diagnostics in `tsconfig.json` stemming from unmapped JavaScript/JSX codebase files and missing module resolution base URL properties.
- **Files Modified**:
  - [project/tsconfig.json](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/tsconfig.json): Added `"**/*.js"` and `"**/*.jsx"` to the `"include"` array so the TypeScript server correctly parses Javascript pages/components alongside TypeScript helpers like `lib/utils.ts`. Configured `"baseUrl": "."` to stabilize `@/*` path alias resolution, and enabled `"checkJs": false` to suppress redundant static type errors on untyped JS components.
- **Status**: Completely cleared project-wide IDE and TypeScript compilation discrepancies while maintaining mixed JS/TS compatibility.

### [2026-07-25] - Resolved TypeScript Context Inference Error on useEnquiry Hook
- **Action**: Fixed two `TS2349: This expression is not callable. Type 'never' has no call signatures` compilation errors in TypeScript components (`HomeClientButtons.tsx`) caused by strict `null` initial context evaluation when importing JavaScript React context into TypeScript files.
- **Files Modified**:
  - [project/components/EnquiryContext.jsx](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/components/EnquiryContext.jsx): Initialized `createContext()` with a fully structured default fallback object (`{ open: false, prefill: '', openModal: () => {}, closeModal: () => {} }`) instead of `null`. This allows TypeScript's type inference engine to cleanly recognize `openModal` and `closeModal` as callable function interfaces without requiring type casting or file extension conversion.
- **Status / Verification**: Verified with `npx tsc --noEmit` which completed with code 0 and zero compilation errors.

### [2026-07-25] - Reversion of tsconfig.json Modifications
- **Action**: User reverted all custom changes to `tsconfig.json` back to the default Next.js configuration (`"include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]`).
- **Files Modified**:
  - [project/tsconfig.json](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/tsconfig.json): Reverted to clean defaults.
- **Status**: With the root-cause `EnquiryContext.jsx` type inference fix remaining active, verification via `npx tsc --noEmit` confirmed the project compiles with **0 errors**.

### [2026-07-25] - Root Repository .gitignore Configuration
- **Action**: Created a comprehensive repository root `.gitignore` file to ensure sensitive environment credentials (`.env`, `.env.*`) and ephemeral build artifacts are systematically excluded from version control at the root level.
- **Files Created / Modified**:
  - [.gitignore](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/.gitignore): Created root Git exclusion rules covering `.env` files, `node_modules/`, Next.js build directories (`.next/`, `out/`), and debug logs.
- **Status**: Complete Git exclusion configuration preventing accidental credential leaks across both root and subdirectory boundaries.

### [2026-07-25] - Resolved PostCSS Build Failure for Vercel Deployment
- **Action**: Fixed production build crashes (`npm run build`) caused by a missing `'postcss-nesting'` npm package reference in the PostCSS configuration during Next.js Webpack CSS optimization.
- **Files Modified**:
  - [project/postcss.config.js](file:///C:/Users/JitenderSingh/Downloads/travel-portal-ui/project/postcss.config.js): Replaced the uninstalled `'postcss-nesting'` plugin with `'tailwindcss/nesting'`. Because `tailwindcss/nesting` comes pre-bundled within the installed Tailwind CSS library, it resolves CSS nesting syntax (such as in Swiper UI module stylesheets) natively without requiring additional external dependency installations.
- **Status / Verification**: Confirmed via local `npm run build` which succeeded with zero warnings and zero Webpack errors. Ready for clean Vercel deployment.
