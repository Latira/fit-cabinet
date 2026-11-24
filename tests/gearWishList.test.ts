// @vitest-environment jsdom
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { createWishlist } from '../src/pages/gearWishList';
import { type WishItem } from '../src/pages/gearWishlist/types';

vi.mock('../../img/icon--add-card.svg?raw', () => ({
    default: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
}));

const STORAGE_KEY = 'gear_wishlist';

describe('createWishlist page', () => {
    beforeEach(() => {
        localStorage.clear();
        document.body.replaceChildren();
    });

    test('renders heading, add card, and empty message when localStorage is empty', () => {
        const page = createWishlist();
        document.body.append(page);

        expect(page.querySelector('.gear-wish-list__title')?.textContent).toBe('Gear Wish List');
        expect(page.querySelector('.gear-wish-list__card-add')).not.toBeNull();
        expect(page.querySelector('.gear-wish-list__empty')?.textContent).toBe(
            'Your wishlist is empty. Add something!'
        );

        const showMoreBtn = page.querySelector<HTMLButtonElement>('.gear-wish-list__show-more');
        expect(showMoreBtn?.hidden).toBe(true);
    });

    test('opens modal and adds a new item to the grid and localStorage', () => {
        const page = createWishlist();
        document.body.append(page);

        const addBtn = page.querySelector<HTMLButtonElement>('.gear-wish-list__add-btn');
        addBtn?.click();

        const modal = document.querySelector('.modal-overlay');
        expect(modal).not.toBeNull();

        const titleInput = document.querySelector<HTMLInputElement>('#wishlist-item-title');
        const priceInput = document.querySelector<HTMLInputElement>('#wishlist-item-price');
        const linkInput = document.querySelector<HTMLInputElement>('#wishlist-item-link');
        const form = document.querySelector<HTMLFormElement>('#wishlist-item-form');

        titleInput!.value = 'Running Shoes';
        priceInput!.value = '$120';
        linkInput!.value = 'https://example.com';

        form?.dispatchEvent(new Event('submit', { cancelable: true }));

        expect(document.querySelector('.modal-overlay')).toBeNull();
        const cards = page.querySelectorAll('.gear-wish-list__card-item');
        expect(cards).toHaveLength(1);
        expect(cards[0].querySelector('.gear-wish-list__card-title')?.textContent).toBe('Running Shoes');
        expect(cards[0].querySelector('.gear-wish-list__card-price')?.textContent).toBe('$120');

        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as WishItem[];
        expect(saved).toHaveLength(1);
        expect(saved[0].title).toBe('Running Shoes');
    });

    test('edits an existing item when clicking Change', () => {
        const initialItems: WishItem[] = [
            { id: 1, title: 'Old Mat', price: '$30' },
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialItems));

        const page = createWishlist();
        document.body.append(page);

        const changeBtn = page.querySelector<HTMLButtonElement>('.gear-wish-list__change-btn');
        changeBtn?.click();

        const titleInput = document.querySelector<HTMLInputElement>('#wishlist-item-title');
        expect(titleInput?.value).toBe('Old Mat');

        titleInput!.value = 'Pro Yoga Mat';
        const form = document.querySelector<HTMLFormElement>('#wishlist-item-form');
        form?.dispatchEvent(new Event('submit', { cancelable: true }));

        expect(page.querySelector('.gear-wish-list__card-title')?.textContent).toBe('Pro Yoga Mat');
    });

    test('deletes an item and restores empty state when last item is removed', () => {
        const initialItems: WishItem[] = [{ id: 10, title: 'Kettlebell' }];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialItems));

        const page = createWishlist();
        document.body.append(page);

        const deleteBtn = page.querySelector<HTMLButtonElement>('.gear-wish-list__delete-btn');
        deleteBtn?.click();

        expect(page.querySelectorAll('.gear-wish-list__card-item')).toHaveLength(0);
        expect(page.querySelector('.gear-wish-list__empty')).not.toBeNull();
        expect(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')).toHaveLength(0);
    });

    test('filters items by search query and filter buttons', () => {
        const initialItems: WishItem[] = [
            { id: 1, title: 'Dumbbells', price: '$50' },
            { id: 2, title: 'Jump Rope', link: 'https://example.com' },
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialItems));

        const page = createWishlist();
        document.body.append(page);

        const searchInput = page.querySelector<HTMLInputElement>('.gear-wish-list__search');
        searchInput!.value = 'rope';
        searchInput?.dispatchEvent(new Event('input'));

        expect(page.querySelectorAll('.gear-wish-list__card-item')).toHaveLength(1);
        expect(page.querySelector('.gear-wish-list__card-title')?.textContent).toBe('Jump Rope');

        searchInput!.value = '';
        searchInput?.dispatchEvent(new Event('input'));

        const filterBtns = page.querySelectorAll<HTMLButtonElement>('.gear-wish-list__filter-btn');
        const withPriceBtn = Array.from(filterBtns).find((b) => b.textContent === 'With price');
        withPriceBtn?.click();

        expect(page.querySelectorAll('.gear-wish-list__card-item')).toHaveLength(1);
        expect(page.querySelector('.gear-wish-list__card-title')?.textContent).toBe('Dumbbells');
    });

    test('limits visible cards to 8 and toggles Show more / Show less', () => {
        const manyItems: WishItem[] = Array.from({ length: 10 }, (_, idx) => ({
            id: idx + 1,
            title: `Gear #${idx + 1}`,
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(manyItems));

        const page = createWishlist();
        document.body.append(page);

        const showMoreBtn = page.querySelector<HTMLButtonElement>('.gear-wish-list__show-more');
        expect(showMoreBtn?.hidden).toBe(false);
        expect(showMoreBtn?.textContent).toBe('Show more');
        expect(page.querySelectorAll('.gear-wish-list__card-item')).toHaveLength(8);

        showMoreBtn?.click();
        expect(page.querySelectorAll('.gear-wish-list__card-item')).toHaveLength(10);
        expect(showMoreBtn?.textContent).toBe('Show less');

        showMoreBtn?.click();
        expect(page.querySelectorAll('.gear-wish-list__card-item')).toHaveLength(8);
        expect(showMoreBtn?.textContent).toBe('Show more');
    });
});
