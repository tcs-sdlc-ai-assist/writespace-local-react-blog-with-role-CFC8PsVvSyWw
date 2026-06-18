import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('rendering', () => {
    it('renders the login form with username and password fields', () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('renders the WriteSpace branding', () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('WriteSpace')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    });

    it('renders a link to the register page', () => {
      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Register')).toBeInTheDocument();
      expect(screen.getByText(/Don't have an account\?/)).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('shows error when username and password are empty', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Username and password are required.')).toBeInTheDocument();
    });

    it('shows error when username is empty', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Password'), 'somepassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Username and password are required.')).toBeInTheDocument();
    });

    it('shows error when password is empty', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Username'), 'someuser');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Username and password are required.')).toBeInTheDocument();
    });

    it('shows error when only whitespace is entered', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Username'), '   ');
      await user.type(screen.getByLabelText('Password'), '   ');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Username and password are required.')).toBeInTheDocument();
    });
  });

  describe('invalid credentials', () => {
    it('shows error for invalid username and password', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Username'), 'nonexistent');
      await user.type(screen.getByLabelText('Password'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    });

    it('shows error for correct username but wrong password', async () => {
      const user = userEvent.setup();

      const mockUsers = [
        {
          id: 'user1',
          displayName: 'Alice',
          username: 'alice',
          password: 'correctpassword',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Username'), 'alice');
      await user.type(screen.getByLabelText('Password'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    });

    it('shows error for admin username with wrong password', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Username'), 'admin');
      await user.type(screen.getByLabelText('Password'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    });
  });

  describe('admin login', () => {
    it('redirects to /admin on successful admin login', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Username'), 'admin');
      await user.type(screen.getByLabelText('Password'), 'admin');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('sets admin session in localStorage on successful admin login', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Username'), 'admin');
      await user.type(screen.getByLabelText('Password'), 'admin');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      const session = JSON.parse(localStorage.getItem('writespace_session'));
      expect(session).toEqual({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
    });
  });

  describe('registered user login', () => {
    it('redirects to /blogs on successful user login', async () => {
      const user = userEvent.setup();

      const mockUsers = [
        {
          id: 'user1',
          displayName: 'Alice',
          username: 'alice',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Username'), 'alice');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
    });

    it('sets user session in localStorage on successful user login', async () => {
      const user = userEvent.setup();

      const mockUsers = [
        {
          id: 'user1',
          displayName: 'Alice',
          username: 'alice',
          password: 'pass123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Username'), 'alice');
      await user.type(screen.getByLabelText('Password'), 'pass123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      const session = JSON.parse(localStorage.getItem('writespace_session'));
      expect(session).toEqual({
        userId: 'user1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });
    });

    it('redirects to /admin on successful login for a registered admin user', async () => {
      const user = userEvent.setup();

      const mockUsers = [
        {
          id: 'user-admin-2',
          displayName: 'Super Admin',
          username: 'superadmin',
          password: 'adminpass',
          role: 'admin',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Username'), 'superadmin');
      await user.type(screen.getByLabelText('Password'), 'adminpass');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });
  });

  describe('already authenticated redirect', () => {
    it('redirects authenticated admin to /admin', () => {
      const adminSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(adminSession));

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
    });

    it('redirects authenticated user to /blogs', () => {
      const userSession = {
        userId: 'user1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(userSession));

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
    });
  });

  describe('error clearing', () => {
    it('clears previous error on new submission attempt', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
          </Routes>
        </MemoryRouter>
      );

      // First attempt with empty fields
      await user.click(screen.getByRole('button', { name: 'Sign In' }));
      expect(screen.getByText('Username and password are required.')).toBeInTheDocument();

      // Second attempt with valid admin credentials
      await user.type(screen.getByLabelText('Username'), 'admin');
      await user.type(screen.getByLabelText('Password'), 'admin');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.queryByText('Username and password are required.')).not.toBeInTheDocument();
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles corrupted users in localStorage gracefully', async () => {
      const user = userEvent.setup();

      localStorage.setItem('writespace_users', '{not valid json!!!');

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Username'), 'someuser');
      await user.type(screen.getByLabelText('Password'), 'somepass');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    });

    it('admin hard-coded credentials take priority over localStorage users', async () => {
      const user = userEvent.setup();

      // Even if there's a user named "admin" in localStorage, the hard-coded check should win
      const mockUsers = [
        {
          id: 'fake-admin',
          displayName: 'Fake Admin',
          username: 'admin',
          password: 'differentpassword',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      render(
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      await user.type(screen.getByLabelText('Username'), 'admin');
      await user.type(screen.getByLabelText('Password'), 'admin');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });
  });
});