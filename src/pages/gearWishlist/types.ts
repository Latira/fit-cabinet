export interface WishItem {
    id: number;
    title: string;
    price?: string;
    link?: string;
    image?: string;
}

export type FilterType = 'ALL' | 'WITH_PRICE' | 'WITH_LINK';
export type SortType = 'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC';

export interface RenderGridOptions {
    gridContainer: HTMLElement;
    cardAdd: HTMLElement;
    showMoreBtn: HTMLButtonElement;
    totalItemsCount: number;
    filteredItems: WishItem[];
    isExpanded: boolean;
    visibleLimit: number;
    onEdit: (item: WishItem) => void;
    onDelete: (id: number) => void;
}

export interface ControlsCallbacks {
    onSearchChange: (query: string) => void;
    onFilterChange: (filter: FilterType) => void;
    onSortChange: (sort: SortType) => void;
}
