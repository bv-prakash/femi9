import { createOptimizedPicture, decorateIcons } from '../../scripts/aem.js';

/**
 * UGC gallery: a tall feature image with a social handle link, and a scrolling row of
 * video/photo tiles that overlaps it.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const feature = document.createElement('div');
  feature.className = 'ugc-gallery-feature';
  const track = document.createElement('ul');
  track.className = 'ugc-gallery-track';
  let handleHref;

  rows.forEach((row, i) => {
    const img = row.querySelector('picture img');
    const link = row.querySelector('a');
    if (i === 0) {
      if (img) feature.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '800' }]));
      if (link) {
        handleHref = link.href;
        const handle = document.createElement('a');
        handle.className = 'ugc-gallery-handle';
        handle.href = link.href;
        handle.target = '_blank';
        handle.rel = 'noopener';
        handle.innerHTML = '<span class="icon icon-femi-instagram"></span>';
        handle.append(link.textContent.trim());
        feature.append(handle);
      }
      return;
    }
    if (!img) return;
    const li = document.createElement('li');
    const tile = document.createElement('a');
    tile.className = 'ugc-gallery-tile';
    tile.href = link?.href || handleHref || '#';
    if (/instagram\.com|tiktok\.com|youtube\.com|youtu\.be/.test(tile.href)) {
      tile.target = '_blank';
      tile.rel = 'noopener';
    }
    const label = link?.textContent.trim() || img.alt || 'Watch video';
    tile.setAttribute('aria-label', label);
    tile.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '500' }]));
    const play = document.createElement('span');
    play.className = 'ugc-gallery-play';
    play.setAttribute('aria-hidden', 'true');
    tile.append(play);
    li.append(tile);
    track.append(li);
  });

  block.replaceChildren(...(feature.children.length ? [feature] : []), track);
  decorateIcons(feature);
}
