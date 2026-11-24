// @vitest-environment jsdom
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { signInWithPopup } from 'firebase/auth';
import { createSecurityTab } from '../src/pages/settings/security-tab';
import {
    getCurrentUser,
    updateUserProviders,
    type AuthUser,
} from '../src/components/authModal';
import { githubProvider } from '../src/utils/firebase';

vi.mock('firebase/auth', () => ({
    signInWithPopup: vi.fn(),
}));

vi.mock('../src/utils/firebase', () => ({
    auth: {},
    googleProvider: { providerId: 'google.com' },
    githubProvider: { providerId: 'github.com' },
}));

vi.mock('../src/components/authModal', () => ({
    getCurrentUser: vi.fn(),
    updateUserProviders: vi.fn(),
}));

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('createSecurityTab', () => {
    beforeEach(() => {
        document.body.replaceChildren();
        vi.clearAllMocks();
    });

    test('renders NOT SIGNED IN when user is null', () => {
        vi.mocked(getCurrentUser).mockReturnValue(null);

        const tab = createSecurityTab();
        document.body.append(tab);

        const rows = tab.querySelectorAll('.settings-security__row');
        expect(rows).toHaveLength(1);
        expect(tab.querySelector('.settings-security__value')?.textContent).toBe('NOT SIGNED IN');
    });

    test('renders primary sign-in method and link buttons for unlinked providers', () => {
        const mockUser: AuthUser = {
            name: 'Darya',
            email: 'darya@gmail.com',
            provider: 'google',
            linkedProviders: ['google'],
        };
        vi.mocked(getCurrentUser).mockReturnValue(mockUser);

        const tab = createSecurityTab();
        document.body.append(tab);

        const rows = tab.querySelectorAll('.settings-security__row');
        expect(rows).toHaveLength(3);

        expect(rows.item(0).querySelector('.settings-security__value')?.textContent).toBe('GOOGLE');

        const actionBtns = Array.from(tab.querySelectorAll('.settings-security__action')).map(
            (btn) => btn.textContent
        );
        expect(actionBtns).toEqual(['GITHUB', 'EMAIL']);
    });

    test('shows checkmark badge for already linked accounts', () => {
        const mockUser: AuthUser = {
            name: 'Darya',
            email: 'darya@gmail.com',
            provider: 'google',
            linkedProviders: ['google', 'github'],
        };
        vi.mocked(getCurrentUser).mockReturnValue(mockUser);

        const tab = createSecurityTab();
        document.body.append(tab);

        const rows = tab.querySelectorAll('.settings-security__row');
        const githubRow = rows.item(1);

        expect(githubRow.querySelector('.settings-security__label')?.textContent).toBe('Linked account:');
        expect(githubRow.querySelector('.settings-security__value')?.textContent).toBe('GITHUB ✓');
        expect(githubRow.querySelector('.settings-security__action')).toBeNull();
    });

    test('opens modal and links email provider on valid form submission', () => {
        const mockUser: AuthUser = {
            name: 'Darya',
            email: 'darya@gmail.com',
            provider: 'google',
            linkedProviders: ['google'],
        };
        vi.mocked(getCurrentUser).mockReturnValue(mockUser);

        const tab = createSecurityTab();
        document.body.append(tab);

        const emailBtn = Array.from(tab.querySelectorAll<HTMLButtonElement>('.settings-security__action')).find(
            (b) => b.textContent === 'EMAIL'
        );
        emailBtn?.click();

        const modal = document.querySelector('.link-email-modal');
        expect(modal).not.toBeNull();

        const emailInput = modal!.querySelector<HTMLInputElement>('input[type="email"]')!;
        const passInput = modal!.querySelector<HTMLInputElement>('input[type="password"]')!;
        const form = modal!.querySelector<HTMLFormElement>('#link-email-form')!;

        emailInput.value = 'darya@test.com';
        passInput.value = '12345';
        form.dispatchEvent(new Event('submit', { cancelable: true }));

        expect(updateUserProviders).toHaveBeenCalledWith('email', 'darya@test.com');
        expect(document.querySelector('.link-email-modal')).toBeNull();
    });

    test('links GitHub account via Firebase signInWithPopup', async () => {
        const mockUser: AuthUser = {
            name: 'Darya',
            email: 'darya@gmail.com',
            provider: 'google',
            linkedProviders: ['google'],
        };
        vi.mocked(getCurrentUser).mockReturnValue(mockUser);
        vi.mocked(signInWithPopup).mockResolvedValue({
            user: { email: 'darya@github.com' },
        } as never);

        const tab = createSecurityTab();
        document.body.append(tab);

        const githubBtn = Array.from(tab.querySelectorAll<HTMLButtonElement>('.settings-security__action')).find(
            (b) => b.textContent === 'GITHUB'
        );
        githubBtn?.click();

        await flushPromises();

        expect(signInWithPopup).toHaveBeenCalledWith({}, githubProvider);
        expect(updateUserProviders).toHaveBeenCalledWith('github', 'darya@github.com');
    });
});
