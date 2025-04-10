import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuthContext } from './AuthContext';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthDispatch } from './actions/AuthActions';
import '@testing-library/jest-dom';

// Mock useAuth0
vi.mock('@auth0/auth0-react', () => ({
    useAuth0: vi.fn()
}));

// Mock config
vi.mock('../config', () => ({
    getConfig: () => ({
        apiOrigin: 'http://localhost:3000',
        apiKey: 'test-api-key'
    })
}));

const TestComponent = () => {
    const { auth } = useAuthContext();
    const dispatch = useAuthDispatch();
    return (
        <>
            <div>{auth?.isSignedIn ? 'signed in' : 'not signed in'}</div>
            <button onClick={() => dispatch && dispatch({ type: 'CLEAR_AUTH' })}>Sign out</button>
        </>
    )
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset global variables
        vi.resetModules();
    });

    it('provides authentication context to children', () => {
        (useAuth0 as Mock).mockReturnValue({
            isAuthenticated: false,
            getAccessTokenSilently: vi.fn()
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByText('not signed in')).toBeInTheDocument();
    });

    it('calls sign in when authenticated', async () => {
        const mockToken = 'test-token';
        const mockResponse = {
            token: mockToken,
            userProfileId: 'test-user-profile-id',
            walletId: 'test-wallet-id',
            walletAddress: 'test-wallet-address'
        };

        (useAuth0 as Mock).mockReturnValue({
            isAuthenticated: true,
            getAccessTokenSilently: vi.fn().mockResolvedValue(mockToken)
        });

        (global.fetch as Mock) = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            }),
        );

        const TestComponent = () => {
            const { auth } = useAuthContext();
            return <div>{auth?.isSignedIn ? 'signed in' : 'not signed in'}</div>;
        };

        await act(async () => {
            render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            );
        });

        expect(screen.getByText('signed in')).toBeInTheDocument();
    });

    it('calls sign out', async () => {
        (useAuth0 as Mock).mockReturnValue({
            isAuthenticated: true,
            getAccessTokenSilently: vi.fn().mockResolvedValue('test-token')
        });

        await act(async () => {
            render(
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            );
        });

        expect(screen.getByText('signed in')).toBeInTheDocument();

        await act(async () => {
            screen.getByText('Sign out').click();
        });

        await waitFor(() => {
            expect(screen.queryByText('not signed in')).toBeInTheDocument();
        });
    });

    it('handles API call errors', async () => {
        const mockToken = 'test-token';
        
        (useAuth0 as Mock).mockReturnValue({
            isAuthenticated: true,
            getAccessTokenSilently: vi.fn().mockResolvedValue(mockToken)
        });

        (global.fetch as Mock) = vi.fn(() =>
            Promise.reject(new Error('API Error')),
        );

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByText('not signed in')).toBeInTheDocument();
    });
});
