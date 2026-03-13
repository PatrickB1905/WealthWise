import {
  FAQS,
  FEATURE_CARDS,
  HIGHLIGHTS,
  STEPS,
  TRUST_ITEMS,
  VALUE_PROPS,
} from './constants';

describe('home/constants', () => {
  it('exports stable marketing collections', () => {
    expect(FEATURE_CARDS.length).toBe(3);
    expect(STEPS.length).toBe(3);
    expect(FAQS.length).toBe(4);
    expect(VALUE_PROPS.length).toBe(3);
    expect(HIGHLIGHTS.length).toBe(3);
    expect(TRUST_ITEMS.length).toBe(3);
  });

  it('contains the expected core titles', () => {
    expect(FEATURE_CARDS[0]?.title).toBe('Position-Based Portfolio Tracking');
    expect(STEPS[0]?.title).toBe('Create Your Account');
    expect(FAQS[0]?.q).toContain('How does WealthWise calculate portfolio performance');
    expect(VALUE_PROPS[0]?.title).toBe('Real-Time Portfolio View');
    expect(HIGHLIGHTS[0]?.title).toBe('Exposure Breakdown');
    expect(TRUST_ITEMS[0]?.title).toBe('Structured Data Modeling');
  });

  it('attaches icon specs to all card-like items', () => {
    for (const item of FEATURE_CARDS) {
      expect(item.accentIcon.Icon).toBeDefined();
    }

    for (const item of VALUE_PROPS) {
      expect(item.icon.Icon).toBeDefined();
    }

    for (const item of HIGHLIGHTS) {
      expect(item.icon.Icon).toBeDefined();
    }

    for (const item of TRUST_ITEMS) {
      expect(item.icon.Icon).toBeDefined();
    }
  });
});