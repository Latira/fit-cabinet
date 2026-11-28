// @vitest-environment jsdom
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderWishlistGrid } from '../src/pages/gearWishlist/wishlistGrid';
import { createWishCard } from '../src/pages/gearWishlist/wishlistCard';
import { WISHLIST_MESSAGES } from '../src/pages/gearWishlist/wishlistEmptyState';
import { type WishItem } from '../src/pages/gearWishlist/types';

vi.mock('../src/pages/gearWishlist/wishlistCard', () => ({
  createWishCard: vi.fn((item: WishItem) => {
    const card = document.createElement('div');
    card.className = 'mock-wish-card';
    card.textContent = item.title;
    return card;
  }),
}));

const makeItems = (count: number): WishItem[] =>
  Array.from({ length: count }, (_, idx) => ({
    id: idx + 1,
    title: `Gear ${idx + 1}`,
  }));

describe('renderWishlistGrid', () => {
  let gridContainer: HTMLElement;
  let cardAdd: HTMLElement;
  let showMoreBtn: HTMLButtonElement;

  beforeEach(() => {
    gridContainer = document.createElement('div');
    cardAdd = document.createElement('div');
    cardAdd.className = 'card-add';
    showMoreBtn = document.createElement('button');
    document.body.replaceChildren(gridContainer, showMoreBtn);
    vi.clearAllMocks();
  });

  test('renders EMPTY message and hides showMoreBtn when totalItemsCount is 0', () => {
    renderWishlistGrid({
      gridContainer,
      cardAdd,
      showMoreBtn,
      totalItemsCount: 0,
      filteredItems: [],
      isExpanded: false,
      visibleLimit: 3,
      onEdit: vi.fn(),
      onDelete: vi.fn(),
    });

    expect(gridContainer.firstElementChild).toBe(cardAdd);
    expect(gridContainer.querySelector('.gear-wish-list__empty')?.textContent).toBe(
      WISHLIST_MESSAGES.EMPTY
    );
    expect(showMoreBtn.hidden).toBe(true);
  });

  test('renders NO_MATCH message and hides showMoreBtn when filter returns empty list', () => {
    renderWishlistGrid({
      gridContainer,
      cardAdd,
      showMoreBtn,
      totalItemsCount: 5,
      filteredItems: [],
      isExpanded: false,
      visibleLimit: 3,
      onEdit: vi.fn(),
      onDelete: vi.fn(),
    });

    expect(gridContainer.firstElementChild).toBe(cardAdd);
    expect(gridContainer.querySelector('.gear-wish-list__empty')?.textContent).toBe(
      WISHLIST_MESSAGES.NO_MATCH
    );
    expect(showMoreBtn.hidden).toBe(true);
  });

  test('slices items to visibleLimit and sets Show more when collapsed', () => {
    const items = makeItems(5);
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    renderWishlistGrid({
      gridContainer,
      cardAdd,
      showMoreBtn,
      totalItemsCount: 5,
      filteredItems: items,
      isExpanded: false,
      visibleLimit: 3,
      onEdit,
      onDelete,
    });

    const renderedCards = gridContainer.querySelectorAll('.mock-wish-card');
    expect(renderedCards).toHaveLength(3);
    expect(createWishCard).toHaveBeenCalledTimes(3);
    expect(showMoreBtn.hidden).toBe(false);
    expect(showMoreBtn.textContent).toBe('Show more');
  });

  test('renders all items and sets Show less when expanded', () => {
    const items = makeItems(5);

    renderWishlistGrid({
      gridContainer,
      cardAdd,
      showMoreBtn,
      totalItemsCount: 5,
      filteredItems: items,
      isExpanded: true,
      visibleLimit: 3,
      onEdit: vi.fn(),
      onDelete: vi.fn(),
    });

    expect(gridContainer.querySelectorAll('.mock-wish-card')).toHaveLength(5);
    expect(showMoreBtn.hidden).toBe(false);
    expect(showMoreBtn.textContent).toBe('Show less');
  });

  test('hides showMoreBtn when filteredItems count does not exceed visibleLimit', () => {
    const items = makeItems(3);

    renderWishlistGrid({
      gridContainer,
      cardAdd,
      showMoreBtn,
      totalItemsCount: 3,
      filteredItems: items,
      isExpanded: false,
      visibleLimit: 3,
      onEdit: vi.fn(),
      onDelete: vi.fn(),
    });

    expect(gridContainer.querySelectorAll('.mock-wish-card')).toHaveLength(3);
    expect(showMoreBtn.hidden).toBe(true);
  });
});
