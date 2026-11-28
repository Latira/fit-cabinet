import { el, createBtn, createSvgIcon } from '../utils/tags';
import iconAddSvg from '../img/icon--add-card.svg?raw';
import { type WishItem, type FilterType, type SortType } from './gearWishlist/types';
import { createWishlistControls } from './gearWishlist/wishlistControls';
import { getFilteredAndSortedItems } from './gearWishlist/wishlistFilterLogic';
import { openWishItemModal } from './gearWishlist/wishlistModal';
import { renderWishlistGrid } from './gearWishlist/wishlistGrid';

const INITIAL_VISIBLE_ITEMS = 8;
const STORAGE_KEY = 'gear_wishlist';

export function createWishlist(): HTMLElement {
  const wishList = el('main', 'gear-wish-list');
  const heading = el('h1', 'gear-wish-list__title', 'Gear Wish List');
  const gridContainer = el('div', 'gear-wish-list__grid');
  const showMoreBtn = createBtn('gear-wish-list__show-more', 'Show more');

  const savedStr = localStorage.getItem(STORAGE_KEY);
  let items: WishItem[] = savedStr ? JSON.parse(savedStr) : [];
  let isExpanded = false;
  let searchQuery = '';
  let activeFilter: FilterType = 'ALL';
  let activeSort: SortType = 'NEWEST';

  const saveItems = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const cardAdd = el('div', 'gear-wish-list__card-add');
  const addBtn = createBtn('gear-wish-list__add-btn');
  addBtn.type = 'button';
  addBtn.setAttribute('aria-label', 'Add item');

  const iconSvg = createSvgIcon(iconAddSvg, 'gear-wish-list__img');
  addBtn.append(iconSvg);
  cardAdd.append(addBtn);

  const handleSaveItem = (itemData: Omit<WishItem, 'id'>, existingId?: number) => {
    if (existingId !== undefined) {
      items = items.map((i) => (i.id === existingId ? { ...i, ...itemData } : i));
    } else {
      items.push({ id: Date.now(), ...itemData });
    }
    saveItems();
    updateGrid();
  };

  const handleDeleteItem = (id: number) => {
    items = items.filter((i) => i.id !== id);
    saveItems();
    const remainingCount = getFilteredAndSortedItems(
      items,
      searchQuery,
      activeFilter,
      activeSort
    ).length;
    if (remainingCount <= INITIAL_VISIBLE_ITEMS) {
      isExpanded = false;
    }
    updateGrid();
  };

  const updateGrid = () => {
    const filteredItems = getFilteredAndSortedItems(items, searchQuery, activeFilter, activeSort);

    renderWishlistGrid({
      gridContainer,
      cardAdd,
      showMoreBtn,
      totalItemsCount: items.length,
      filteredItems,
      isExpanded,
      visibleLimit: INITIAL_VISIBLE_ITEMS,
      onEdit: (item) => openWishItemModal(handleSaveItem, item),
      onDelete: handleDeleteItem,
    });
  };

  const controlsBar = createWishlistControls({
    onSearchChange: (query) => {
      searchQuery = query;
      isExpanded = false;
      updateGrid();
    },
    onFilterChange: (filter) => {
      activeFilter = filter;
      isExpanded = false;
      updateGrid();
    },
    onSortChange: (sort) => {
      activeSort = sort;
      updateGrid();
    },
  });

  showMoreBtn.addEventListener('click', () => {
    isExpanded = !isExpanded;
    updateGrid();
  });

  addBtn.addEventListener('click', () => openWishItemModal(handleSaveItem));

  updateGrid();
  wishList.append(heading, controlsBar, gridContainer, showMoreBtn);
  return wishList;
}
