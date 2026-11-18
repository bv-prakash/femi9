import { createOptimizedPicture } from '../../scripts/aem.js';

const FIELDS = ['price', 'was', 'discount', 'rating', 'colors', 'colours', 'delivery', 'badge'];

/**
 * Reads "Label: value" paragraphs from a product details cell.
 * @param {Element} cell The details cell
 * @returns {Object} field values keyed by lower-case label
 */
function readFields(cell) {
  const fields = {};
  cell.querySelectorAll('p').forEach((p) => {
    const match = p.textContent.trim().match(/^([a-z ]+?)\s*:\s*(.+)$/i);
    if (!match) return;
    const key = match[1].toLowerCase().trim();
    if (!FIELDS.includes(key)) return;
    fields[key === 'colours' ? 'colors' : key] = match[2].trim();
  });
  return fields;
}

function priceElement(value, className) {
  const el = document.createElement(className === 'was' ? 's' : 'span');
  el.className = `product-card-${className}`;
  const currency = document.createElement('span');
  currency.className = 'product-card-currency';
  currency.setAttribute('aria-hidden', 'true');
  const sr = document.createElement('span');
  sr.className = 'product-card-sr';
  sr.textContent = 'SAR ';
  el.append(currency, sr, value);
  return el;
}

function buildCard(row) {
  const cells = [...row.children];
  const pictureCell = cells.find((c) => c.querySelector('picture'));
  const detailsCell = cells.find((c) => c !== pictureCell) || document.createElement('div');
  const fields = readFields(detailsCell);
  const link = detailsCell.querySelector('a');
  const heading = detailsCell.querySelector('h1, h2, h3, h4, h5, h6');
  const name = (heading || link || detailsCell.querySelector('p'))?.textContent.trim() || '';
  const href = link?.href;

  const li = document.createElement('li');
  li.className = 'product-card';

  const media = document.createElement(href ? 'a' : 'div');
  media.className = 'product-card-media';
  if (href) {
    media.href = href;
    media.tabIndex = -1;
    media.setAttribute('aria-hidden', 'true');
  }
  const img = pictureCell?.querySelector('img');
  if (img) {
    media.append(createOptimizedPicture(img.src, img.alt || name, false, [{ width: '480' }]));
  }
  if (fields.badge) {
    const badge = document.createElement('span');
    badge.className = 'product-card-badge';
    badge.textContent = fields.badge;
    media.append(badge);
  }
  li.append(media);

  const info = document.createElement('div');
  info.className = 'product-card-info';

  const title = document.createElement('h3');
  title.className = 'product-card-name';
  if (href) {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = name;
    title.append(a);
  } else {
    title.textContent = name;
  }
  info.append(title);

  if (fields.price || fields.rating) {
    const meta = document.createElement('div');
    meta.className = 'product-card-meta';
    if (fields.price) {
      const prices = document.createElement('p');
      prices.className = 'product-card-prices';
      const now = priceElement(fields.price, 'price');
      if (fields.was) {
        prices.classList.add('is-discounted');
        prices.append(now, ' ', priceElement(fields.was, 'was'));
      } else {
        prices.append(now);
      }
      if (fields.discount) {
        const discount = document.createElement('span');
        discount.className = 'product-card-discount';
        discount.textContent = fields.discount;
        prices.append(' ', discount);
      }
      meta.append(prices);
    }
    if (fields.rating) {
      const rating = document.createElement('p');
      rating.className = 'product-card-rating';
      rating.setAttribute('aria-label', `Rated ${fields.rating} out of 5`);
      rating.textContent = fields.rating;
      meta.append(rating);
    }
    info.append(meta);
  }

  if (fields.colors) {
    const colors = document.createElement('ul');
    colors.className = 'product-card-colors';
    colors.setAttribute('aria-label', 'Available colours');
    fields.colors.split(',').map((c) => c.trim()).filter(Boolean).forEach((color, i) => {
      const swatch = document.createElement('li');
      swatch.style.setProperty('--swatch', color);
      swatch.title = color;
      if (i === 0) swatch.classList.add('is-selected');
      colors.append(swatch);
    });
    info.append(colors);
  }

  if (fields.delivery) {
    const delivery = document.createElement('p');
    delivery.className = 'product-card-delivery';
    delivery.textContent = fields.delivery;
    info.append(delivery);
  }

  li.append(info);
  return li;
}

function buildControls(track) {
  const controls = document.createElement('div');
  controls.className = 'product-showcase-controls';
  [['prev', 'Previous products'], ['next', 'Next products']].forEach(([dir, label]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `product-showcase-${dir}`;
    button.setAttribute('aria-label', label);
    button.addEventListener('click', () => {
      const card = track.querySelector('.product-card');
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const step = card ? card.getBoundingClientRect().width + gap : track.clientWidth;
      track.scrollBy({ left: dir === 'next' ? step : -step, behavior: 'smooth' });
    });
    controls.append(button);
  });

  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 1;
    controls.querySelector('.product-showcase-prev').disabled = track.scrollLeft <= 0;
    controls.querySelector('.product-showcase-next').disabled = track.scrollLeft >= max;
    controls.hidden = max <= 0;
  };
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  requestAnimationFrame(update);
  return controls;
}

/**
 * Product showcase: side image, category tabs, View All link and a product slider.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const media = document.createElement('div');
  media.className = 'product-showcase-media';
  const head = document.createElement('div');
  head.className = 'product-showcase-head';
  const track = document.createElement('ul');
  track.className = 'product-showcase-track';

  rows.forEach((row) => {
    const pictures = row.querySelectorAll('picture');
    const hasText = row.textContent.trim().length > 0;
    if (row.querySelector('ul') && !pictures.length) {
      // tabs row: list of category links, optional View All link
      const nav = document.createElement('nav');
      nav.className = 'product-showcase-tabs';
      nav.setAttribute('aria-label', 'Categories');
      const list = row.querySelector('ul');
      list.querySelector('li')?.classList.add('is-active');
      list.querySelector('li > a')?.setAttribute('aria-current', 'page');
      nav.append(list);
      head.append(nav);
      const all = [...row.querySelectorAll('a')].find((a) => !nav.contains(a));
      if (all) {
        all.className = 'product-showcase-all';
        head.append(all);
      }
    } else if (pictures.length === 1 && !hasText && !media.children.length) {
      // side image row
      const img = pictures[0].querySelector('img');
      media.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '1000' }]));
    } else if (pictures.length || hasText) {
      track.append(buildCard(row));
    }
  });

  const main = document.createElement('div');
  main.className = 'product-showcase-main';
  if (head.children.length) main.append(head);
  main.append(track, buildControls(track));

  block.replaceChildren(...(media.children.length ? [media] : []), main);
  if (!media.children.length) block.classList.add('no-media');
}
