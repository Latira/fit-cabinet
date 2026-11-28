// @vitest-environment jsdom
import { describe, test, expect, vi } from 'vitest';
import { createWishlistControls } from '../src/pages/gearWishlist/wishlistControls';
import { type ControlsCallbacks } from '../src/pages/gearWishlist/types';

function createCallbacks(): ControlsCallbacks {
    return {
        onSearchChange: vi.fn(),
        onFilterChange: vi.fn(),
        onSortChange: vi.fn(),
    };
}

describe('createWishlistControls', () => {
    test('renders search input, filter buttons with All active by default, and sort select', () => {
        const callbacks = createCallbacks();
        const controls = createWishlistControls(callbacks);

        const searchInput = controls.querySelector<HTMLInputElement>('.gear-wish-list__search');
        expect(searchInput).not.toBeNull();
        expect(searchInput?.placeholder).toBe('Search gear by name...');

        const filterBtns = Array.from(
            controls.querySelectorAll<HTMLButtonElement>('.gear-wish-list__filter-btn')
        );
        expect(filterBtns).toHaveLength(3);
        expect(filterBtns.map((b) => b.textContent)).toEqual(['All', 'With price', 'With link']);
        expect(filterBtns.at(0)?.classList.contains('is-active')).toBe(true);

        const sortSelect = controls.querySelector<HTMLSelectElement>('.gear-wish-list__sort');
        expect(sortSelect).not.toBeNull();
        expect(sortSelect?.value).toBe('NEWEST');
        expect(Array.from(sortSelect!.options).map((o) => o.value)).toEqual([
            'NEWEST',
            'PRICE_ASC',
            'PRICE_DESC',
        ]);
    });

    test('triggers onSearchChange callback when typing in search input', () => {
        const callbacks = createCallbacks();
        const controls = createWishlistControls(callbacks);

        const searchInput = controls.querySelector<HTMLInputElement>('.gear-wish-list__search')!;
        searchInput.value = 'dumbbells';
        searchInput.dispatchEvent(new Event('input'));

        expect(callbacks.onSearchChange).toHaveBeenCalledTimes(1);
        expect(callbacks.onSearchChange).toHaveBeenCalledWith('dumbbells');
    });

    test('updates active filter class and triggers onFilterChange on button click', () => {
        const callbacks = createCallbacks();
        const controls = createWishlistControls(callbacks);

        const filterBtns = Array.from(
            controls.querySelectorAll<HTMLButtonElement>('.gear-wish-list__filter-btn')
        );

        filterBtns.at(1)?.click();

        const updatedBtns = Array.from(
            controls.querySelectorAll<HTMLButtonElement>('.gear-wish-list__filter-btn')
        );
        expect(updatedBtns.at(0)?.classList.contains('is-active')).toBe(false);
        expect(updatedBtns.at(1)?.classList.contains('is-active')).toBe(true);
        expect(callbacks.onFilterChange).toHaveBeenCalledWith('WITH_PRICE');

        // Клик по "With link"
        updatedBtns.at(2)?.click();
        expect(callbacks.onFilterChange).toHaveBeenCalledWith('WITH_LINK');
    });

    test('triggers onSortChange callback when sort option is changed', () => {
        const callbacks = createCallbacks();
        const controls = createWishlistControls(callbacks);

        const sortSelect = controls.querySelector<HTMLSelectElement>('.gear-wish-list__sort')!;
        sortSelect.value = 'PRICE_DESC';
        sortSelect.dispatchEvent(new Event('change'));

        expect(callbacks.onSortChange).toHaveBeenCalledTimes(1);
        expect(callbacks.onSortChange).toHaveBeenCalledWith('PRICE_DESC');
    });
});
