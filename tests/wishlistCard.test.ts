// @vitest-environment jsdom
import { describe, test, expect, vi } from 'vitest';
import { createWishCard } from '../src/pages/gearWishlist/wishlistCard';
import { type WishItem } from '../src/pages/gearWishlist/types';

describe('createWishCard', () => {
  test('renders full wish card with image, title, price and external link', () => {
    const fullItem: WishItem = {
      id: 1,
      title: 'Kettlebell 16kg',
      image: 'https://test-cdn.local',
      price: '$45',
      link: 'https://test-store.local',
    };

    const card = createWishCard(fullItem, vi.fn(), vi.fn());

    const img = card.querySelector<HTMLImageElement>('.gear-wish-list__card-img');
    expect(img).not.toBeNull();
    expect(img?.src).toContain('test-cdn.local');
    expect(img?.alt).toBe('Kettlebell 16kg');

    expect(card.querySelector('.gear-wish-list__card-title')?.textContent).toBe('Kettlebell 16kg');
    expect(card.querySelector('.gear-wish-list__card-price')?.textContent).toBe('$45');

    const link = card.querySelector<HTMLAnchorElement>('.gear-wish-list__card-link');
    expect(link).not.toBeNull();
    expect(link?.href).toContain('test-store.local');
    expect(link?.target).toBe('_blank');
    expect(link?.rel).toBe('noopener noreferrer');
    expect(link?.textContent).toBe('Open link ↗');
  });

  test('omits image wrapper and meta block when optional fields are missing', () => {
    const minimalItem: WishItem = {
      id: 2,
      title: 'Jump Rope',
    } as WishItem;

    const card = createWishCard(minimalItem, vi.fn(), vi.fn());

    expect(card.querySelector('.gear-wish-list__card-img-wrap')).toBeNull();
    expect(card.querySelector('.gear-wish-list__card-meta')).toBeNull();
    expect(card.querySelector('.gear-wish-list__card-title')?.textContent).toBe('Jump Rope');
    expect(card.querySelectorAll('button')).toHaveLength(2);
  });

  test('triggers onEdit and onDelete callbacks with correct arguments on button clicks', () => {
    const item: WishItem = {
      id: 42,
      title: 'Yoga Mat',
      price: '$30',
    } as WishItem;

    const onEdit = vi.fn();
    const onDelete = vi.fn();

    const card = createWishCard(item, onEdit, onDelete);

    card.querySelector<HTMLButtonElement>('.gear-wish-list__change-btn')?.click();
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(item);

    card.querySelector<HTMLButtonElement>('.gear-wish-list__delete-btn')?.click();
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(42);
  });
});
