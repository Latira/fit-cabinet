import { describe, test, expect } from 'vitest';
import {
    parsePrice,
    getFilteredAndSortedItems,
} from '../src/pages/gearWishlist/wishlistFilterLogic';
import { type WishItem } from '../src/pages/gearWishlist/types';

const mockItems: WishItem[] = [
    {
        id: 1,
        title: 'Kettlebell 16kg',
        price: '$45',
        link: 'https://store.local',
    },
    {
        id: 2,
        title: 'Yoga Mat',
        price: '19,99 €',
    },
    {
        id: 3,
        title: 'Jump Rope',
        link: 'https://store.local',
    },
    {
        id: 4,
        title: 'Foam Roller',
        price: '   ',
    },
];

describe('parsePrice', () => {
    test('parses numeric values with currency symbols and comma decimals', () => {
        expect(parsePrice('$45')).toBe(45);
        expect(parsePrice('19,99 €')).toBe(19.99);
        expect(parsePrice('120.50 USD')).toBe(120.5);
    });

    test('returns Infinity for empty, undefined or non-numeric strings', () => {
        expect(parsePrice()).toBe(Infinity);
        expect(parsePrice('')).toBe(Infinity);
        expect(parsePrice('Free')).toBe(Infinity);
    });
});

describe('getFilteredAndSortedItems', () => {
    test('filters by searchQuery case-insensitively and trims whitespace', () => {
        const result = getFilteredAndSortedItems(mockItems, '  yoga  ', 'ALL', 'NEWEST');
        expect(result).toHaveLength(1);
        expect(result.at(0)?.title).toBe('Yoga Mat');
    });

    test('filters by WITH_PRICE and WITH_LINK ignoring whitespace-only values', () => {
        const withPrice = getFilteredAndSortedItems(mockItems, '', 'WITH_PRICE', 'NEWEST');
        expect(withPrice.map((i) => i.id)).toEqual([2, 1]);

        const withLink = getFilteredAndSortedItems(mockItems, '', 'WITH_LINK', 'NEWEST');
        expect(withLink.map((i) => i.id)).toEqual([3, 1]);
    });

    test('sorts by NEWEST (descending id) without mutating original array', () => {
        const snapshot = [...mockItems];
        const sorted = getFilteredAndSortedItems(mockItems, '', 'ALL', 'NEWEST');

        expect(sorted.map((i) => i.id)).toEqual([4, 3, 2, 1]);
        expect(mockItems).toEqual(snapshot);
    });

    test('sorts by PRICE_ASC placing items without price at the end', () => {
        const sorted = getFilteredAndSortedItems(mockItems, '', 'ALL', 'PRICE_ASC');
        expect(sorted.map((i) => i.id)).toEqual([2, 1, 3, 4]);
    });

    test('sorts by PRICE_DESC placing items without price at the end', () => {
        const sorted = getFilteredAndSortedItems(mockItems, '', 'ALL', 'PRICE_DESC');
        expect(sorted.map((i) => i.id)).toEqual([1, 2, 3, 4]);
    });
});
