import { describe, it, expect, beforeEach } from 'vitest';
import { getSession, setSession, clearSession } from '../utils/auth';

describe('auth utility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getSession', () => {
    it('returns null when localStorage has no session', () => {
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns stored session when valid data exists', () => {
      const mockSession = {
        userId: 'user1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));

      const session = getSession();
      expect(session).toEqual(mockSession);
    });

    it('returns an admin session correctly', () => {
      const mockSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));

      const session = getSession();
      expect(session).toEqual(mockSession);
      expect(session.role).toBe('admin');
    });

    it('returns null when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_session', '{not valid json!!!');

      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns null when localStorage contains an array', () => {
      localStorage.setItem('writespace_session', JSON.stringify([1, 2, 3]));

      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns null when localStorage contains a string value', () => {
      localStorage.setItem('writespace_session', JSON.stringify('just a string'));

      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns null when localStorage contains null', () => {
      localStorage.setItem('writespace_session', JSON.stringify(null));

      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns null when localStorage contains a number', () => {
      localStorage.setItem('writespace_session', JSON.stringify(42));

      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns null when localStorage contains a boolean', () => {
      localStorage.setItem('writespace_session', JSON.stringify(true));

      const session = getSession();
      expect(session).toBeNull();
    });
  });

  describe('setSession', () => {
    it('saves session to localStorage', () => {
      const mockSession = {
        userId: 'user1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };

      setSession(mockSession);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(mockSession);
    });

    it('saves an admin session to localStorage', () => {
      const mockSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };

      setSession(mockSession);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(mockSession);
      expect(stored.role).toBe('admin');
    });

    it('overwrites existing session in localStorage', () => {
      const initialSession = {
        userId: 'user1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      setSession(initialSession);

      const newSession = {
        userId: 'user2',
        username: 'bob',
        displayName: 'Bob',
        role: 'user',
      };
      setSession(newSession);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(newSession);
    });

    it('persists session that can be retrieved by getSession', () => {
      const mockSession = {
        userId: 'roundtrip-user',
        username: 'roundtrip',
        displayName: 'Roundtrip User',
        role: 'user',
      };

      setSession(mockSession);
      const retrieved = getSession();
      expect(retrieved).toEqual(mockSession);
    });
  });

  describe('clearSession', () => {
    it('removes session from localStorage', () => {
      const mockSession = {
        userId: 'user1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      setSession(mockSession);

      clearSession();

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBeNull();
    });

    it('returns null from getSession after clearing', () => {
      const mockSession = {
        userId: 'user1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      setSession(mockSession);

      clearSession();

      const session = getSession();
      expect(session).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });

    it('does not affect other localStorage keys', () => {
      localStorage.setItem('writespace_posts', JSON.stringify([{ id: '1' }]));
      const mockSession = {
        userId: 'user1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      setSession(mockSession);

      clearSession();

      const posts = localStorage.getItem('writespace_posts');
      expect(posts).not.toBeNull();
      expect(JSON.parse(posts)).toEqual([{ id: '1' }]);
    });
  });
});