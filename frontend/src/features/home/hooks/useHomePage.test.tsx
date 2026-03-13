import React from 'react';
import { renderHook, act } from '@testing-library/react';

import { useHomePage } from './useHomePage';

describe('useHomePage', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('builds styles and starts with closed nav menu', () => {
    const { result } = renderHook(() => useHomePage());

    expect(result.current.styles.heroTitleSx).toBeDefined();
    expect(result.current.styles.heroTaglineSx).toBeDefined();
    expect(result.current.navAnchorEl).toBeNull();
    expect(result.current.navMenuOpen).toBe(false);
  });

  it('opens and closes the nav menu', () => {
    const { result } = renderHook(() => useHomePage());

    const anchor = document.createElement('button');

    act(() => {
      result.current.openNavMenu({
        currentTarget: anchor,
      } as unknown as React.MouseEvent<HTMLElement>);
    });

    expect(result.current.navAnchorEl).toBe(anchor);
    expect(result.current.navMenuOpen).toBe(true);

    act(() => {
      result.current.closeNavMenu();
    });

    expect(result.current.navAnchorEl).toBeNull();
    expect(result.current.navMenuOpen).toBe(false);
  });

  it('scrolls to a section on nav', () => {
    const { result } = renderHook(() => useHomePage());

    const el = document.createElement('div');
    el.id = 'features';
    el.scrollIntoView = jest.fn();
    document.body.appendChild(el);

    act(() => {
      result.current.onNav('features');
    });

    expect(el.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('scrolls and closes on mobile nav action', () => {
    const { result } = renderHook(() => useHomePage());

    const anchor = document.createElement('button');
    const el = document.createElement('div');
    el.id = 'faq';
    el.scrollIntoView = jest.fn();
    document.body.appendChild(el);

    act(() => {
      result.current.openNavMenu({
        currentTarget: anchor,
      } as unknown as React.MouseEvent<HTMLElement>);
    });

    expect(result.current.navMenuOpen).toBe(true);

    act(() => {
      result.current.onNavAndClose('faq');
    });

    expect(el.scrollIntoView).toHaveBeenCalled();
    expect(result.current.navMenuOpen).toBe(false);
  });

  it('does nothing when target section does not exist', () => {
    const { result } = renderHook(() => useHomePage());

    expect(() => {
      act(() => {
        result.current.onNav('plans');
      });
    }).not.toThrow();
  });
});