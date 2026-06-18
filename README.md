# WriteSpace

A modern writing platform built with React where ideas come to life. Share your stories, manage your content, and connect with readers — all powered by localStorage with no backend required.

## Tech Stack

- **React 18** — UI library
- **React Router v6** — Client-side routing
- **Tailwind CSS 3** — Utility-first styling
- **Vite 5** — Build tool and dev server
- **Vitest** — Unit testing framework
- **Testing Library** — React component testing utilities
- **PropTypes** — Runtime prop validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

Production output is written to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Testing

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

## Folder Structure

```
writespace/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vercel.json                 # Vercel deployment config
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Root component with router
│   ├── index.css               # Tailwind directives
│   ├── components/
│   │   ├── Avatar.jsx          # Role-based avatar component
│   │   ├── BlogCard.jsx        # Reusable blog post card
│   │   ├── Navbar.jsx          # Authenticated navigation bar
│   │   ├── ProtectedRoute.jsx  # Route guard (auth + role)
│   │   ├── PublicNavbar.jsx    # Public/guest navigation bar
│   │   ├── StatCard.jsx        # Admin dashboard stat card
│   │   └── UserRow.jsx         # User management row/card
│   ├── pages/
│   │   ├── AdminDashboard.jsx  # Admin overview page
│   │   ├── Home.jsx            # Blog listing page
│   │   ├── LandingPage.jsx     # Public landing page
│   │   ├── LoginPage.jsx       # Login form
│   │   ├── ReadBlog.jsx        # Single post view
│   │   ├── RegisterPage.jsx    # Registration form
│   │   ├── UserManagement.jsx  # Admin user CRUD page
│   │   └── WriteBlog.jsx       # Create/edit post page
│   ├── utils/
│   │   ├── auth.js             # Session management utilities
│   │   └── storage.js          # localStorage CRUD utilities
│   └── __tests__/
│       ├── setup.js            # Test setup and localStorage mock
│       ├── auth.test.js        # Auth utility tests
│       ├── storage.test.js     # Storage utility tests
│       ├── Home.test.jsx       # Home page tests
│       ├── LandingPage.test.jsx# Landing page tests
│       ├── LoginPage.test.jsx  # Login page tests
│       ├── ProtectedRoute.test.jsx # Route guard tests
│       └── RegisterPage.test.jsx   # Register page tests
└── dist/                       # Production build output
```

## Features

- **Public Landing Page** — Hero section, feature highlights, and latest posts preview
- **User Registration** — Create an account with display name, username, and password
- **User Login** — Authenticate with username and password
- **Hard-coded Admin** — Built-in admin account (`admin` / `admin`)
- **Role-Based Access Control** — Admin and user roles with tailored permissions
- **Blog Post CRUD** — Create, read, update, and delete blog posts
- **Post Ownership** — Users can only edit/delete their own posts; admins can manage all
- **Admin Dashboard** — Platform overview with stats, recent posts, and quick actions
- **User Management** — Admins can create and delete user accounts
- **Responsive Design** — Mobile-first layout with Tailwind CSS
- **Client-Side Storage** — All data persisted in localStorage

## Route Map

| Path             | Component         | Access       | Description                    |
| ---------------- | ----------------- | ------------ | ------------------------------ |
| `/`              | LandingPage       | Public       | Landing page with hero/features|
| `/login`         | LoginPage         | Public       | Login form                     |
| `/register`      | RegisterPage      | Public       | Registration form              |
| `/blogs`         | Home              | Authenticated | All posts listing             |
| `/blogs/:id`     | ReadBlog          | Authenticated | Single post view              |
| `/write`         | WriteBlog         | Authenticated | Create new post               |
| `/edit/:id`      | WriteBlog         | Authenticated | Edit existing post            |
| `/admin`         | AdminDashboard    | Admin only   | Admin overview dashboard       |
| `/admin/users`   | UserManagement    | Admin only   | User CRUD management           |

## localStorage Schema

All data is stored in the browser's localStorage under the following keys:

### `writespace_session`

Current authenticated user session.

```json
{
  "userId": "string",
  "username": "string",
  "displayName": "string",
  "role": "admin | user"
}
```

### `writespace_users`

Array of registered user accounts.

```json
[
  {
    "id": "string (UUID v4)",
    "displayName": "string",
    "username": "string",
    "password": "string (plaintext)",
    "role": "admin | user",
    "createdAt": "string (ISO 8601)"
  }
]
```

### `writespace_posts`

Array of blog posts.

```json
[
  {
    "id": "string (UUID v4)",
    "title": "string",
    "content": "string",
    "authorId": "string",
    "authorName": "string",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601, optional)"
  }
]
```

### Default Admin Credentials

The admin account is hard-coded and does not appear in `writespace_users`:

- **Username:** `admin`
- **Password:** `admin`

## Deployment

### Vercel

The project includes a `vercel.json` configuration for single-page application routing.

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the project in [Vercel](https://vercel.com).
3. Vercel will auto-detect the Vite framework preset.
4. Build settings (auto-detected):
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Deploy. All client-side routes are rewritten to `index.html` via `vercel.json`.

### Manual / Other Platforms

```bash
npm install
npm run build
```

Serve the `dist/` directory with any static file server. Ensure all routes fall back to `index.html` for client-side routing.

## License

This project is private and proprietary. All rights reserved. No part of this software may be reproduced, distributed, or transmitted in any form without prior written permission.