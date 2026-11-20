import { el, createBtn } from '../../utils/tags';

export function createSecurityTab(): HTMLElement {
    const security = el('div', 'settings-security');

    const signInRow = el('div', 'settings-security__row');
    const signInLabel = el('span', 'settings-security__label', 'Sign-in method:');
    const signInValue = el('span', 'settings-security__value', 'GOOGLE');
    signInRow.append(signInLabel, signInValue);

    const githubRow = el('div', 'settings-security__row');
    const githubLabel = el('span', 'settings-security__label', 'Link account:');
    const githubBtn = createBtn('settings-security__action', 'GITHUB');
    githubRow.append(githubLabel, githubBtn);

    const emailRow = el('div', 'settings-security__row');
    const emailLabel = el('span', 'settings-security__label', 'Link account:');
    const emailBtn = createBtn('settings-security__action', 'EMAIL');
    emailRow.append(emailLabel, emailBtn);

    security.append(signInRow, githubRow, emailRow);
    return security;
}
