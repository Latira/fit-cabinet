import { el, createBtn, createInput } from '../../utils/tags';
import { type ControlsCallbacks, type FilterType, type SortType } from './types';

function createSearchControl(onSearchChange: (query: string) => void): HTMLInputElement {
  const searchInput = createInput(
    'gear-wish-list__search',
    'text',
    'Search gear by name...',
    'wishlist-search'
  );

  searchInput.addEventListener('input', () => {
    onSearchChange(searchInput.value);
  });

  return searchInput;
}

function createFilterButtonsControl(onFilterChange: (filter: FilterType) => void): HTMLElement {
  const filterBtnsWrap = el('div', 'gear-wish-list__filters');
  let activeFilter: FilterType = 'ALL';

  const filterOptions: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'ALL' },
    { label: 'With price', value: 'WITH_PRICE' },
    { label: 'With link', value: 'WITH_LINK' },
  ];

  const renderButtons = () => {
    filterBtnsWrap.replaceChildren();
    filterOptions.forEach((opt) => {
      const isActive = activeFilter === opt.value;
      const btn = createBtn(`gear-wish-list__filter-btn ${isActive ? 'is-active' : ''}`, opt.label);

      btn.addEventListener('click', () => {
        activeFilter = opt.value;
        renderButtons();
        onFilterChange(opt.value);
      });

      filterBtnsWrap.append(btn);
    });
  };

  renderButtons();
  return filterBtnsWrap;
}

function createSortControl(onSortChange: (sort: SortType) => void): HTMLSelectElement {
  const sortSelect = document.createElement('select');
  sortSelect.className = 'gear-wish-list__sort';
  sortSelect.setAttribute('aria-label', 'Sort wishlist items');

  const sortOptions: { label: string; value: SortType }[] = [
    { label: 'Newest first', value: 'NEWEST' },
    { label: 'Price: low to high', value: 'PRICE_ASC' },
    { label: 'Price: high to low', value: 'PRICE_DESC' },
  ];

  sortOptions.forEach((opt) => {
    const optionEl = document.createElement('option');
    optionEl.value = opt.value;
    optionEl.textContent = opt.label;
    sortSelect.append(optionEl);
  });

  sortSelect.addEventListener('change', () => {
    onSortChange(sortSelect.value as SortType);
  });

  return sortSelect;
}

export function createWishlistControls(callbacks: ControlsCallbacks): HTMLElement {
  const controlsBar = el('div', 'gear-wish-list__controls');

  const searchInput = createSearchControl(callbacks.onSearchChange);
  const filterButtons = createFilterButtonsControl(callbacks.onFilterChange);
  const sortSelect = createSortControl(callbacks.onSortChange);

  controlsBar.append(searchInput, filterButtons, sortSelect);
  return controlsBar;
}
