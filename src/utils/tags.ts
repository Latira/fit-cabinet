export const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  text = ''
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
};

export const createBtn = (
  className: string,
  text = '',
  type: 'button' | 'submit' | 'reset' = 'button'
): HTMLButtonElement => {
  const btn = el('button', className, text);
  btn.type = type;
  return btn;
};

export const createImg = (
  className: string,
  src: string,
  alt = ' '
): HTMLImageElement => {
  const img = el('img', className);
  img.src = src;
  img.alt = alt;
  return img;
}