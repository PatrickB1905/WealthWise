describe('shared/ui/index', () => {
  it('re-exports layout components', async () => {
    const mod = await import('./index');
    const navbar = await import('./layout/Navbar');
    const sidebar = await import('./layout/Sidebar');

    expect(mod.Navbar).toBe(navbar.default);
    expect(mod.Sidebar).toBe(sidebar.default);
  });

  it('re-exports primitive styled helpers used across features', async () => {
    const mod = await import('./index');

    expect(mod.PageCard).toBeDefined();
    expect(mod.SectionHeader).toBeDefined();
    expect(mod.SectionContent).toBeDefined();
    expect(mod.StyledContainer).toBeDefined();
    expect(mod.KpiInfoButton).toBeDefined();
    expect(mod.QuoteFreshDot).toBeDefined();
  });
});