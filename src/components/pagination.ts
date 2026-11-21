import { el, createBtn } from '../utils/tags';

export interface PaginationOptions {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    pageSizeOptions?: number[];
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export function createPagination(options: PaginationOptions): HTMLElement {
    const {
        totalItems,
        currentPage,
        pageSize,
        pageSizeOptions = [10, 20, 50],
        onPageChange,
        onPageSizeChange,
    } = options;

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(Math.max(1, currentPage), totalPages);

    const wrapper = el('div', 'pagination');

    const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const endItem = Math.min(safePage * pageSize, totalItems);
    const info = el('span', 'pagination__info', `Showing ${startItem}–${endItem} of ${totalItems}`);

    const sizeControl = el('div', 'pagination__size');
    const sizeLabel = el('span', 'pagination__size-label', 'Per page:');
    const sizeSelect = document.createElement('select');
    sizeSelect.className = 'pagination__select';

    pageSizeOptions.forEach((opt: number) => {
        const option = document.createElement('option');
        option.value = String(opt);
        option.textContent = String(opt);
        if (opt === pageSize) option.selected = true;
        sizeSelect.append(option);
    });

    sizeSelect.addEventListener('change', () => {
        onPageSizeChange(Number(sizeSelect.value));
    });

    sizeControl.append(sizeLabel, sizeSelect);

    const nav = el('div', 'pagination__nav');

    const prevBtn = createBtn('pagination__btn pagination__btn--arrow', '‹');
    prevBtn.disabled = safePage <= 1;
    prevBtn.addEventListener('click', () => onPageChange(safePage - 1));
    nav.append(prevBtn);

    const pages = getPageNumbers(safePage, totalPages);
    pages.forEach((p: number | '...') => {
        if (p === '...') {
            nav.append(el('span', 'pagination__dots', '...'));
        } else {
            const pageBtn = createBtn(
                `pagination__btn ${p === safePage ? 'is-active' : ''}`,
                String(p)
            );
            pageBtn.addEventListener('click', () => onPageChange(p));
            nav.append(pageBtn);
        }
    });

    const nextBtn = createBtn('pagination__btn pagination__btn--arrow', '›');
    nextBtn.disabled = safePage >= totalPages;
    nextBtn.addEventListener('click', () => onPageChange(safePage + 1));
    nav.append(nextBtn);

    wrapper.append(info, sizeControl, nav);
    return wrapper;
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
    if (total <= 5) {
        return Array.from({ length: total }, (_: unknown, i: number) => i + 1);
    }
    if (current <= 3) {
        return [1, 2, 3, '...', total];
    }
    if (current >= total - 2) {
        return [1, '...', total - 2, total - 1, total];
    }
    return [1, '...', current, '...', total];
}
