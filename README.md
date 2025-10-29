# Goal Institute API Admin Dashboard

This is a separate API administrative dashboard for Goal Institute, built with Next.js 14 and TypeScript.

## Features

- **Dashboard Layout**: Complete dashboard layout with sidebar navigation and header
- **Authentication**: Login system with JWT token management
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **UI Components**: Reusable UI components built with Radix UI
- **TypeScript**: Full TypeScript support for type safety

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp env.example .env.local
```

3. Update the environment variables in `.env.local`:

```env
API_BASE_URL=http://localhost:3000/api
ADMIN_EMAIL=admin@goalinstitute.com
ADMIN_PASSWORD=admin123
JWT_SECRET=goalsecrete@123@321
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3002](http://localhost:3002)

### Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```
api-admin/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── login/              # Login page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── dashboard/          # Dashboard components
│   │   ├── providers/          # Context providers
│   │   └── ui/                 # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   └── lib/                    # Utility functions
├── public/                     # Static assets
└── ...config files
```

## Dashboard Layout

The dashboard includes:

- **Sidebar Navigation**: Collapsible sidebar with navigation menu
- **Header**: Top header with search, notifications, and user info
- **Main Content Area**: Scrollable content area for dashboard pages
- **Mobile Responsive**: Mobile-friendly design with hamburger menu

## Authentication

The dashboard uses JWT-based authentication:

- Login with email/password
- Token stored in localStorage
- Automatic redirect to login if not authenticated
- Protected routes with authentication checks

## Available Scripts

- `npm run dev` - Start development server on port 3002
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Authentication**: JWT
- **State Management**: React Context

## Notes

This is a layout-only implementation. The actual dashboard pages and functionality need to be implemented based on your specific requirements. The structure is set up to easily add new pages and components following the same patterns as the admin-dashboard.
