import { el } from '../utils/tags';

export function createFooter(): HTMLElement {
    const footer = el('footer');
    const footerWrapper = el('div', 'wrapper');
    const footerLogoLink = el('a', 'footer__logo-link');
    footerLogoLink.href = 'https://rs.school/';
    footerLogoLink.target = '_blank';
    const footerLogo = el('div', 'footer__logo');
    footerLogoLink.append(footerLogo);
    const footerCopyright = el('h3', 'footer__copyright', 'ⓒ FitCabinet 2026');
    const footerContent = el('div', 'footer__content');
    const footerIcon = el('div', 'footer__social-icon');
    const footerLinks = el('div', 'footer__links');
    const footerLinkLatira = el('a', 'footer__link', 'Latira');
    footerLinkLatira.href = 'https://github.com/Latira';
    footerLinkLatira.target = '_blank';
    const footerLinkDarya = el('a', 'footer__link', 'DaryaDudkova');
    footerLinkDarya.href = 'https://github.com/DaryaDudkova98';
    footerLinkDarya.target = '_blank';
    footerLinks.append(footerLinkLatira, footerLinkDarya);
    footerContent.append(footerIcon, footerLinks);    
    footerWrapper.append(footerLogoLink, footerCopyright, footerContent);
    footer.append(footerWrapper);
    return footer;
}