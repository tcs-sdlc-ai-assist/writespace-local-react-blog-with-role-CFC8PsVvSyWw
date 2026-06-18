import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';

describe('LandingPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('hero section', () => {
    it('renders the hero heading with WriteSpace title', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      const headings = screen.getAllByText('WriteSpace');
      expect(headings.length).toBeGreaterThanOrEqual(1);
    });

    it('renders the hero description text', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      expect(
        screen.getByText(/A modern writing platform where ideas come to life/)
      ).toBeInTheDocument();
    });

    it('renders Get Started and Login CTA buttons in hero', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      const getStartedLinks = screen.getAllByText('Get Started');
      expect(getStartedLinks.length).toBeGreaterThanOrEqual(1);

      const loginLinks = screen.getAllByText('Login');
      expect(loginLinks.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('features section', () => {
    it('renders the "Why WriteSpace?" heading', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      expect(screen.getByText('Why WriteSpace?')).toBeInTheDocument();
    });

    it('renders all three feature cards', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      expect(screen.getByText('Write Freely')).toBeInTheDocument();
      expect(screen.getByText('Role-Based Access')).toBeInTheDocument();
      expect(screen.getByText('Instant & Local')).toBeInTheDocument();
    });

    it('renders feature descriptions', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      expect(
        screen.getByText(/Create and publish your thoughts with a clean/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Manage your platform with admin and user roles/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/No server needed/)
      ).toBeInTheDocument();
    });
  });

  describe('latest posts section', () => {
    it('renders the "Latest Posts" heading', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      expect(screen.getByText('Latest Posts')).toBeInTheDocument();
    });

    it('renders empty state message when no posts exist', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      expect(
        screen.getByText('No posts yet. Be the first to write something!')
      ).toBeInTheDocument();
      expect(screen.getByText('Start Writing')).toBeInTheDocument();
    });

    it('renders up to 3 latest posts from localStorage', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'First Post',
          content: 'Content of the first post',
          authorId: 'user1',
          authorName: 'Alice',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Second Post',
          content: 'Content of the second post',
          authorId: 'user2',
          authorName: 'Bob',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
        {
          id: '3',
          title: 'Third Post',
          content: 'Content of the third post',
          authorId: 'admin',
          authorName: 'Admin',
          createdAt: '2024-01-03T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.getByText('Third Post')).toBeInTheDocument();
    });

    it('renders only the 3 most recent posts when more than 3 exist', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Oldest Post',
          content: 'Old content',
          authorId: 'user1',
          authorName: 'Alice',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Second Post',
          content: 'Second content',
          authorId: 'user2',
          authorName: 'Bob',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
        {
          id: '3',
          title: 'Third Post',
          content: 'Third content',
          authorId: 'user3',
          authorName: 'Charlie',
          createdAt: '2024-01-03T00:00:00.000Z',
        },
        {
          id: '4',
          title: 'Newest Post',
          content: 'Newest content',
          authorId: 'user4',
          authorName: 'Diana',
          createdAt: '2024-01-04T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      expect(screen.getByText('Newest Post')).toBeInTheDocument();
      expect(screen.getByText('Third Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.queryByText('Oldest Post')).not.toBeInTheDocument();
    });

    it('renders posts sorted by newest first', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Older Post',
          content: 'Older content',
          authorId: 'user1',
          authorName: 'Alice',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          title: 'Newer Post',
          content: 'Newer content',
          authorId: 'user2',
          authorName: 'Bob',
          createdAt: '2024-06-15T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      expect(screen.getByText('Newer Post')).toBeInTheDocument();
      expect(screen.getByText('Older Post')).toBeInTheDocument();
    });

    it('does not render empty state when posts exist', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'A Post',
          content: 'Some content',
          authorId: 'user1',
          authorName: 'Alice',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      expect(
        screen.queryByText('No posts yet. Be the first to write something!')
      ).not.toBeInTheDocument();
    });
  });

  describe('footer', () => {
    it('renders the footer with WriteSpace branding', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      expect(
        screen.getByText('A modern writing platform.')
      ).toBeInTheDocument();
    });

    it('renders footer navigation links', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      expect(screen.getByText('Register')).toBeInTheDocument();
      expect(screen.getByText('Blogs')).toBeInTheDocument();
    });

    it('renders copyright text with current year', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      const currentYear = new Date().getFullYear();
      expect(
        screen.getByText(`© ${currentYear} WriteSpace. All rights reserved.`)
      ).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles corrupted localStorage posts gracefully', () => {
      localStorage.setItem('writespace_posts', '{not valid json!!!');

      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      expect(
        screen.getByText('No posts yet. Be the first to write something!')
      ).toBeInTheDocument();
    });

    it('handles non-array localStorage posts gracefully', () => {
      localStorage.setItem('writespace_posts', JSON.stringify({ key: 'value' }));

      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      expect(
        screen.getByText('No posts yet. Be the first to write something!')
      ).toBeInTheDocument();
    });
  });
});