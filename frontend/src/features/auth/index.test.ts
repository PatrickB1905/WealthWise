describe('features/auth/index', () => {
  it('re-exports auth pages and contracts', async () => {
    const mod = await import('./index');
    const loginPage = await import('./pages/LoginPage');
    const profilePage = await import('./pages/ProfilePage');
    const registerPage = await import('./pages/RegisterPage');
    const provider = await import('./context/authProvider');
    const protectedRoute = await import('./routing/protected-route');
    const useAuth = await import('./hooks/useAuth');

    expect(mod.LoginPage).toBe(loginPage.default);
    expect(mod.ProfilePage).toBe(profilePage.default);
    expect(mod.RegisterPage).toBe(registerPage.default);
    expect(mod.AuthProvider).toBe(provider.AuthProvider);
    expect(mod.ProtectedRoute).toBe(protectedRoute.default);
    expect(mod.useAuth).toBe(useAuth.useAuth);
  });
});