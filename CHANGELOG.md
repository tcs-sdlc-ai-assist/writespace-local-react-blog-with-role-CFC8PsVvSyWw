# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added

- **Public Landing Page** — Hero section with gradient background, feature highlights (Write Freely, Role-Based Access, Instant & Local), latest posts preview (up to 3), and footer with navigation links and copyright.
- **User Registration** — Registration form with display name, username, password, and confirm password fields. Validates all fields, checks password match, prevents duplicate usernames (including reserved `admin`). Automatically logs in and redirects to `/blogs` on success.
- **User Login** — Login form with username and password fields. Authenticates against hard-coded admin credentials first, then localStorage users. Redirects admin to `/admin` and regular users to `/blogs`. Already-authenticated users are redirected automatically.
- **Hard-Coded Admin Account** — Built-in admin account with username `admin` and password `admin`. Does not appear in `writespace_users` localStorage. Takes priority over any localStorage user with the same username.
- **Role-Based Access Control** — `ProtectedRoute` component guards authenticated and admin-only routes. Unauthenticated users are redirected to `/login`. Non-admin users accessing admin routes are redirected to `/blogs`.
- **Blog Post CRUD** — Create new posts via `/write` and edit existing posts via `/edit/:id`. Title (max 200 chars) and content (max 10,000 chars) fields with character counters and validation. Posts saved to localStorage with UUID v4 IDs and ISO 8601 timestamps.
- **Post Ownership** — Regular users can only edit and delete their own posts. Admin users can edit and delete any post. Edit/delete buttons conditionally rendered based on ownership and role.
- **Single Post View** — Full post reading page at `/blogs/:id` with title, author avatar, formatted date, and full content. Edit and delete actions for authorized users. Handles missing posts with "Post not found" message.
- **Blog Listing Page** — Authenticated blog list at `/blogs` displaying all posts in a responsive grid of `BlogCard` components, sorted newest first. Empty state with call-to-action when no posts exist.
- **Admin Dashboard** — Platform overview at `/admin` with gradient welcome banner, stat cards (total posts, total users, admin count, user count), quick-action buttons (Write Post, Manage Users), and list of 5 most recent posts with edit/delete actions.
- **User Management** — Admin page at `/admin/users` with create user form (display name, username, password, role selector) and full user list including hard-coded admin. Delete with confirmation dialog. Hard-coded admin and self-deletion are prevented.
- **Avatar System** — Role-based avatar component displaying 👑 for admin users and 📖 for regular users with color-coded backgrounds (violet for admin, indigo for user).
- **BlogCard Component** — Reusable post card with cycling border colors, truncated content (150 chars), formatted date, author avatar, and conditional edit link.
- **StatCard Component** — Reusable stat display card with emoji icon, label, value, and configurable color scheme (blue, green, purple, orange, red, indigo).
- **UserRow Component** — Reusable user display component rendering as table row on desktop and stacked card on mobile. Shows avatar, display name, username, role badge, created date, and delete button.
- **Navigation Components** — `Navbar` for authenticated users with role-based links, avatar dropdown, and mobile hamburger menu. `PublicNavbar` for guests with Login/Get Started buttons or authenticated user chip with dashboard link.
- **localStorage Persistence** — All data stored client-side under `writespace_session`, `writespace_users`, and `writespace_posts` keys. Utility modules (`auth.js`, `storage.js`) with graceful error handling for corrupted data.
- **Session Management** — `getSession`, `setSession`, and `clearSession` utilities for managing authentication state in localStorage. Validates session data type on retrieval.
- **Storage Utilities** — `getPosts`, `savePosts`, `getUsers`, and `saveUsers` functions with JSON parse/stringify, array validation, and error recovery.
- **Responsive Design** — Mobile-first layout with Tailwind CSS responsive prefixes. All pages and components adapt to mobile, tablet, and desktop viewports.
- **Custom Tailwind Theme** — Extended color palette with `primary` and `neutral` scales, custom font families (Inter, Merriweather, Fira Code), and additional spacing/max-width values.
- **Vercel Deployment** — `vercel.json` configuration with SPA rewrite rule for client-side routing support.
- **Test Suite** — Unit tests for auth utilities, storage utilities, and key pages (Home, LandingPage, LoginPage, RegisterPage, ProtectedRoute) using Vitest and Testing Library with localStorage mock.
- **Client-Side Routing** — React Router v6 with 10 routes covering public pages, authenticated pages, and admin-only pages.