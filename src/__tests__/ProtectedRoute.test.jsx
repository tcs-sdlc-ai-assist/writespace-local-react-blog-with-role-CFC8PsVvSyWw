import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import * as auth from '../utils/auth';

vi.mock('../utils/auth', () => ({
  getSession: vi.fn(),
  setSession: vi.fn(),
  clearSession: vi.fn(),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('guest (no session)', () => {
    it('redirects to /login when user is not authenticated', () => {
      auth.getSession.mockReturnValue(null);

      render(
        <MemoryRouter initialEntries={['/blogs']}>
          <Routes>
            <Route
              path="/blogs"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('redirects to /login when guest accesses admin route', () => {
      auth.getSession.mockReturnValue(null);

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <div>Admin Dashboard</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    });
  });

  describe('authenticated user (role: user)', () => {
    it('renders children when user accesses a non-admin protected route', () => {
      auth.getSession.mockReturnValue({
        userId: 'user1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      render(
        <MemoryRouter initialEntries={['/blogs']}>
          <Routes>
            <Route
              path="/blogs"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });

    it('redirects non-admin user to /blogs when accessing admin route', () => {
      auth.getSession.mockReturnValue({
        userId: 'user1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <div>Admin Dashboard</div>
                </ProtectedRoute>
              }
            />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    });
  });

  describe('authenticated admin (role: admin)', () => {
    it('renders children when admin accesses admin route', () => {
      auth.getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <div>Admin Dashboard</div>
                </ProtectedRoute>
              }
            />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Blogs Page')).not.toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });

    it('renders children when admin accesses a non-admin protected route', () => {
      auth.getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      render(
        <MemoryRouter initialEntries={['/blogs']}>
          <Routes>
            <Route
              path="/blogs"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });
  });
});