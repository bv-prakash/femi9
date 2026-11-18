import { createOptimizedPicture } from '../../scripts/aem.js';
import { CORE_FETCH_GRAPHQL, fetchPlaceholders } from '../../scripts/commerce.js';

const SUBSCRIBE = `mutation SubscribeEmailToNewsletter($email: String!) {
  subscribeEmailToNewsletter(email: $email) { status }
}`;

let formId = 0;

function buildForm(labels) {
  formId += 1;
  const id = `newsletter-email-${formId}`;
  const form = document.createElement('form');
  form.className = 'newsletter-form';
  form.noValidate = true;
  form.innerHTML = `
    <label class="newsletter-label" for="${id}">${labels.email}</label>
    <div class="newsletter-field">
      <input id="${id}" type="email" name="email" autocomplete="email" required placeholder="${labels.email}">
      <button type="submit">${labels.submit}</button>
    </div>
    <p class="newsletter-status" role="status" aria-live="polite"></p>`;

  const input = form.querySelector('input');
  const button = form.querySelector('button');
  const status = form.querySelector('.newsletter-status');
  const setStatus = (text, state) => {
    status.textContent = text;
    status.dataset.state = state;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (!input.checkValidity() || !email) {
      setStatus(labels.invalid, 'error');
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    input.removeAttribute('aria-invalid');
    button.disabled = true;
    setStatus('', '');
    try {
      const { errors } = await CORE_FETCH_GRAPHQL.fetchGraphQl(SUBSCRIBE, { variables: { email } });
      if (errors?.length) throw new Error(errors[0].message);
      form.reset();
      setStatus(labels.success, 'success');
    } catch (error) {
      setStatus(error?.message || labels.failure, 'error');
    } finally {
      button.disabled = false;
    }
  });
  return form;
}

/**
 * Newsletter signup: image next to an eyebrow, heading, text, email form and note.
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const placeholders = await fetchPlaceholders();
  const labels = {
    email: placeholders.Global?.NewsletterEmail ?? 'Email address',
    submit: placeholders.Global?.NewsletterSubscribe ?? 'Subscribe',
    invalid: placeholders.Global?.NewsletterInvalid ?? 'Please enter a valid email address.',
    success: placeholders.Global?.NewsletterSuccess ?? 'Thanks for subscribing!',
    failure: placeholders.Global?.NewsletterFailure ?? 'Something went wrong. Please try again.',
  };

  const cells = [...block.querySelectorAll(':scope > div > div')];
  const picCell = cells.find((c) => c.querySelector('picture') && !c.querySelector('h1, h2, h3'));
  const textCell = cells.find((c) => c !== picCell) || document.createElement('div');

  const media = document.createElement('div');
  media.className = 'newsletter-media';
  const img = picCell?.querySelector('img');
  if (img) media.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]));

  const content = document.createElement('div');
  content.className = 'newsletter-content';
  const heading = textCell.querySelector('h1, h2, h3, h4');
  const children = [...textCell.children];
  const headingIndex = children.indexOf(heading);
  children.forEach((el, i) => {
    if (heading && i < headingIndex && el.tagName === 'P') el.classList.add('newsletter-eyebrow');
    content.append(el);
  });

  // form goes after the first paragraph that follows the heading; later paragraphs are notes
  const after = [...content.children].slice(headingIndex + 1);
  const description = after.find((el) => el.tagName === 'P');
  const form = buildForm(labels);
  if (description) description.after(form);
  else content.append(form);
  after.filter((el) => el !== description && el.tagName === 'P').forEach((el) => el.classList.add('newsletter-note'));

  block.replaceChildren(...(media.children.length ? [media] : []), content);
  if (!media.children.length) block.classList.add('no-media');
}
