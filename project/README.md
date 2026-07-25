# GoonnexTrip

GoonnexTrip is a modern web application built for exploring and booking the best tour packages, destinations, and treks across India. It features a rich user interface, dynamic data fetching, and a seamless travel enquiry system.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) / shadcn/ui
- **Backend & Database:** [Supabase](https://supabase.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 📁 Project Structure

- `app/`: Contains the Next.js App Router pages and global layouts.
  - `page.tsx`: The main landing page.
  - `layout.tsx`: Global layout containing Navbar, Footer, and the Enquiry context provider.
  - `/destinations`, `/packages`, `/treks`: Dedicated routes for different sections.
- `components/`: Reusable React components (UI elements, Cards, Modals).
- `lib/`: Utility functions and database logic.
  - `queries.js`: All Supabase queries for fetching destinations, packages, treks, and submitting enquiries.
  - `supabase.js`: Supabase client initialization.

## ✨ Features

- **Dynamic Data Rendering:** Fetches real-time destinations, packages, treks, and reviews from Supabase.
- **Interactive UI:** Features sleek animations, modern layout, and responsive design using Tailwind CSS.
- **Global Enquiry System:** A robust contextual modal that allows users to submit travel enquiries from anywhere within the app.
- **Responsive Design:** Completely optimized for both mobile and desktop screens.

## 🛠️ Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Navigate to the project directory:
   ```bash
   cd project
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` or `.env.local` file in the root of your project and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```
