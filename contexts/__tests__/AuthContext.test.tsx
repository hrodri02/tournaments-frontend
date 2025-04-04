import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';
import { Text, Pressable } from 'react-native';

global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

function TestComponent() {
  const { login, isAuthenticated, error } = useAuth();

  return (
    <>
      <Text testID="auth-status">{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</Text>
      {error && <Text testID="error-message">{error}</Text>}
      <Pressable
        testID="login-button"
        onPress={() => login({ email: 'test@example.com', password: 'password123' })}
      >
        <Text>Login</Text>
      </Pressable>
    </>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('handles successful login', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: mockUser, token: 'fake-token' }),
      })
    );

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('auth-status')).toHaveTextContent('Not authenticated');

    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
      expect(getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
  });

  it('handles login failure', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.press(getByTestId('login-button'));

    await waitFor(() => {
      expect(getByTestId('error-message')).toHaveTextContent('Invalid credentials');
    });
  });
}); 