# Product Showcase Block

## Overview

Shows a large lifestyle image next to a row of category tabs, a View All link and a horizontally scrolling row of authored product cards. On desktop the cards overlap the edge of the image; on mobile the image sits on top and the cards can be swiped.

## Configuration

| Variant | Effect |
|---------|--------|
| *(none)* | Image on the right, cards overlap its left edge, slider arrows on the right |
| `image-left` | Mirrored: image on the left, cards overlap its right edge, arrows on the left |

A heading placed in the same section, before the block (for example `## Best Sellers`), is styled as the section title.

## Authoring

| product-showcase |  |
|---|---|
| side image | |
| list of category links (first one is shown as the current tab) | View All link |
| product image | product details |
| product image | product details |

Product details are a heading (or link) with the product name and link, followed by optional `Label: value` lines:

- `Price: 469` - current price (in SAR)
- `Was: 555` - original price, shown struck through; the current price turns red
- `Discount: -30%` - discount label
- `Rating: 4.5` - star rating
- `Colors: #c3dcc7, #fec8f9` - colour swatches (any CSS colour, comma separated; the first one is shown as selected)
- `Delivery: Within 1 day` - delivery note with a truck icon
- `Badge: New` - badge in the top left corner of the image

Rows that are only an image become the side image (first one only); every other row with an image or text becomes a product card. Unknown labels are ignored.

## Integration

### URL Parameters

None.

### Local Storage

None.

### Events

- `click` on the previous/next buttons scrolls the slider by one card
- `scroll` on the slider and `resize` on the window update the disabled state of the buttons

## Behavior Patterns

- **Tabs** are links to category pages; the first one is marked as current (`aria-current="page"`). They do not switch the cards in place.
- **Slider** uses native horizontal scrolling with scroll snapping. The arrow buttons are hidden when all cards fit, and disabled at either end.
- **Desktop (900px and wider)**: three cards are visible, the image is 33% of the block and reaches the edge of the window.
- **Mobile**: the image is shown above in a 4:3 crop, the tabs scroll horizontally, cards are 72% wide and the arrows are hidden (swipe instead).

## Error Handling

- Missing side image: the block switches to a single column (`no-media`).
- Missing tabs row: no tab bar is rendered; the slider still works.
- Product without a link: the name and image are shown without links.
- Product without a price: the price row is omitted.

## Accessibility

- Prices include visually hidden "SAR" text; the riyal symbol is decorative.
- The rating has an `aria-label` ("Rated 4.5 out of 5"); swatches have the colour value as their title.
- Product images inside the card link are hidden from assistive technology so each card has one link (the product name).
