import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Splits a "Label: value" paragraph.
 * @param {Element} p paragraph
 * @returns {[string, string]|null} lower-case label and value
 */
function field(p) {
  const match = p.textContent.trim().match(/^(price|hotspot)\s*:\s*(.+)$/i);
  return match ? [match[1].toLowerCase(), match[2].trim()] : null;
}

function buildItem(row, index) {
  const cells = [...row.children];
  const thumbCell = cells.find((c) => c.querySelector('picture'));
  const info = cells.find((c) => c !== thumbCell) || document.createElement('div');
  const link = info.querySelector('a');
  const heading = info.querySelector('h1, h2, h3, h4, h5, h6');
  const name = (heading || link || info.querySelector('p'))?.textContent.trim() || '';
  const details = [];
  let price;
  let hotspot;
  info.querySelectorAll('p').forEach((p) => {
    if (p.contains(link) || p === heading) return;
    const f = field(p);
    if (f?.[0] === 'price') [, price] = f;
    else if (f?.[0] === 'hotspot') [, hotspot] = f;
    else if (p.textContent.trim()) details.push(p.textContent.trim());
  });

  const li = document.createElement('li');
  li.className = 'shoppable-look-item';
  li.dataset.index = index;

  const number = document.createElement('span');
  number.className = 'shoppable-look-number';
  number.setAttribute('aria-hidden', 'true');
  number.textContent = index;
  li.append(number);

  const thumb = document.createElement('div');
  thumb.className = 'shoppable-look-thumb';
  const img = thumbCell?.querySelector('img');
  if (img) thumb.append(createOptimizedPicture(img.src, img.alt || name, false, [{ width: '160' }]));
  li.append(thumb);

  const text = document.createElement('div');
  text.className = 'shoppable-look-info';
  const title = document.createElement('h3');
  title.className = 'shoppable-look-name';
  if (link) {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = name;
    title.append(a);
  } else {
    title.textContent = name;
  }
  text.append(title);
  details.forEach((d) => {
    const p = document.createElement('p');
    p.className = 'shoppable-look-detail';
    p.textContent = d;
    text.append(p);
  });
  if (price) {
    const p = document.createElement('p');
    p.className = 'shoppable-look-price';
    p.innerHTML = '<span class="shoppable-look-currency" aria-hidden="true"></span><span class="shoppable-look-sr">SAR </span>';
    p.append(price);
    text.append(p);
  }
  li.append(text);

  if (link) {
    const view = document.createElement('a');
    view.className = 'shoppable-look-view';
    view.href = link.href;
    view.setAttribute('aria-label', `View ${name}`);
    li.append(view);
  }

  let spot;
  if (hotspot) {
    const [x, y] = hotspot.split(',').map((v) => parseFloat(v));
    if (Number.isFinite(x) && Number.isFinite(y)) {
      spot = document.createElement(link ? 'a' : 'span');
      spot.className = 'shoppable-look-hotspot';
      if (link) spot.href = link.href;
      spot.style.left = `${Math.min(Math.max(x, 0), 100)}%`;
      spot.style.top = `${Math.min(Math.max(y, 0), 100)}%`;
      spot.textContent = index;
      spot.setAttribute('aria-label', `${index}: ${name}`);
      spot.dataset.index = index;
    }
  }
  return { li, spot };
}

/**
 * Shoppable look: image with numbered hotspots next to a list of the products in the look.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const media = document.createElement('div');
  media.className = 'shoppable-look-media';
  const content = document.createElement('div');
  content.className = 'shoppable-look-content';
  const list = document.createElement('ol');
  list.className = 'shoppable-look-items';
  let cta;

  rows.forEach((row, i) => {
    const hasPicture = !!row.querySelector('picture');
    if (i === 0 && hasPicture) {
      // first row: main image + intro text
      const cells = [...row.children];
      const picCell = cells.find((c) => c.querySelector('picture'));
      const img = picCell.querySelector('img');
      media.append(createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 900px)', width: '1000' }, { width: '750' }]));
      const intro = document.createElement('div');
      intro.className = 'shoppable-look-intro';
      cells.filter((c) => c !== picCell).forEach((c) => intro.append(...c.childNodes));
      content.append(intro);
    } else if (!hasPicture && row.querySelectorAll('a').length === 1
      && !row.textContent.replace(row.querySelector('a').textContent, '').trim()) {
      // a row with only a link: call to action
      cta = document.createElement('p');
      cta.className = 'shoppable-look-cta';
      const a = row.querySelector('a');
      a.className = 'button';
      cta.append(a);
    } else if (row.textContent.trim() || hasPicture) {
      const { li, spot } = buildItem(row, list.children.length + 1);
      list.append(li);
      if (spot) media.append(spot);
    }
  });

  content.append(list);
  if (cta) content.append(cta);

  // highlight the matching list item while a hotspot is hovered or focused, and vice versa
  const toggle = (index, on) => {
    block.querySelectorAll(`[data-index="${index}"]`).forEach((el) => el.classList.toggle('is-active', on));
  };
  [...media.querySelectorAll('.shoppable-look-hotspot'), ...list.children].forEach((el) => {
    ['mouseenter', 'focusin'].forEach((e) => el.addEventListener(e, () => toggle(el.dataset.index, true)));
    ['mouseleave', 'focusout'].forEach((e) => el.addEventListener(e, () => toggle(el.dataset.index, false)));
  });

  block.replaceChildren(media, content);
}
