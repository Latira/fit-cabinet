// @vitest-environment jsdom
import { describe, test, expect } from 'vitest';
import {
  createWishlistEmptyState,
  WISHLIST_MESSAGES,
} from '../src/pages/gearWishlist/wishlistEmptyState';

describe('createWishlistEmptyState', () => {
  test('exposes expected default wishlist messages', () => {
    expect(WISHLIST_MESSAGES.EMPTY).toBe('Your wishlist is empty. Add something!');
    expect(WISHLIST_MESSAGES.NO_MATCH).toBe('No items match your current filter.');
  });

  test('renders empty state div with proper class and EMPTY message', () => {
    const emptyEl = createWishlistEmptyState(WISHLIST_MESSAGES.EMPTY);

    expect(emptyEl.tagName).toBe('DIV');
    expect(emptyEl.className).toBe('gear-wish-list__empty');
    expect(emptyEl.textContent).toBe('Your wishlist is empty. Add something!');
  });

  test('renders NO_MATCH message when filter returns no items', () => {
    const noMatchEl = createWishlistEmptyState(WISHLIST_MESSAGES.NO_MATCH);

    expect(noMatchEl.tagName).toBe('DIV');
    expect(noMatchEl.className).toBe('gear-wish-list__empty');
    expect(noMatchEl.textContent).toBe('No items match your current filter.');
  });
});
