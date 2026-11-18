# Newsletter Block

## Overview

Newsletter signup: an image next to an eyebrow, heading, description, an email form and a small note. The form subscribes the address through the Adobe Commerce `subscribeEmailToNewsletter` GraphQL mutation.

## Configuration

No variants. The block sits on a full-width white band.

## Authoring

| newsletter |  |
|---|---|
| image | text |

Text cell, in order:

1. paragraph before the heading - eyebrow (for example `Stay up to date`)
2. heading
3. first paragraph after the heading - description; the form is inserted after it
4. any later paragraphs - small notes under the form (for example the privacy policy link)

## Integration

### Placeholders

Labels come from `Global` placeholders, with English defaults:

- `NewsletterEmail` (Email address), `NewsletterSubscribe` (Subscribe)
- `NewsletterInvalid`, `NewsletterSuccess`, `NewsletterFailure` - status messages

### API

`CORE_FETCH_GRAPHQL.fetchGraphQl` with `subscribeEmailToNewsletter(email)`. Requires the Commerce core endpoint to be configured (as for the rest of the storefront) and newsletter subscriptions to be enabled in Commerce (guest subscriptions for signed-out shoppers).

### URL Parameters / Local Storage / Events

None.

## Behavior Patterns

- Submitting validates the email address first, disables the button while the request runs, then shows the result in a live status message and clears the field on success.
- **Desktop (900px and wider)**: image 52.5% wide, 72px gap, 120px vertical padding.
- **Mobile**: stacked, 64px vertical padding.

## Error Handling

- Invalid email: message shown, field marked `aria-invalid`, focus returned to the field.
- GraphQL errors: the first error message from Commerce is shown; network failures show the generic failure message.
- No image: single-column layout (`no-media`).
