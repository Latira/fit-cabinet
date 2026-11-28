import { type WishItem, type FilterType, type SortType } from './types';

export function parsePrice(priceStr?: string): number {
  if (!priceStr) return Infinity;
  const cleaned = priceStr.replace(/[^\d.,]/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? Infinity : num;
}

export function getFilteredAndSortedItems(
  items: WishItem[],
  searchQuery: string,
  activeFilter: FilterType,
  activeSort: SortType
): WishItem[] {
  const query = searchQuery.trim().toLowerCase();

  const filtered = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(query);
    if (!matchesSearch) return false;

    if (activeFilter === 'WITH_PRICE') return Boolean(item.price?.trim());
    if (activeFilter === 'WITH_LINK') return Boolean(item.link?.trim());
    return true;
  });

  const sorted = [...filtered];
  if (activeSort === 'NEWEST') {
    sorted.sort((a, b) => b.id - a.id);
  } else if (activeSort === 'PRICE_ASC') {
    sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  } else if (activeSort === 'PRICE_DESC') {
    sorted.sort((a, b) => {
      const priceA = parsePrice(a.price);
      const priceB = parsePrice(b.price);
      if (priceA === Infinity && priceB === Infinity) return 0;
      if (priceA === Infinity) return 1;
      if (priceB === Infinity) return -1;
      return priceB - priceA;
    });
  }

  return sorted;
}
