# Shoppable Look Block

## Overview

Shows a large outfit image with numbered hotspots next to the list of products that make up the look, each with a thumbnail, name, details, price and a view button, followed by an optional call to action.

## Configuration

No variants.

## Authoring

| shoppable-look |  |
|---|---|
| main image | heading and description |
| product thumbnail | product details |
| product thumbnail | product details |
| | **Shop the complete look** (bold link) |

Product details: a heading (or link) with the product name and link, any plain lines (shown as details, for example `Shirt · Full Sleeves`), and optional `Label: value` lines:

- `Price: 459` - price in SAR
- `Hotspot: 43.4%, 19.4%` - position of the numbered marker on the main image (left, top as a percentage of the image)

A row that only contains one link becomes the call to action. Products are numbered in order.

## Integration

### URL Parameters / Local Storage

None.

### Events

- `mouseenter`/`focusin` and `mouseleave`/`focusout` on a hotspot or list item highlight the matching pair (`is-active`).

## Behavior Patterns

- **Desktop (900px and wider)**: the image takes 48.86% of the block and reaches the left edge of the window; the content is vertically centred next to it.
- **Mobile**: the image is shown full width above the content; hotspots shrink to 32px.
- Hotspots and the view (eye) buttons link to the product page.

## Error Handling

- Missing or invalid hotspot values: no marker is shown for that product.
- Product without a link: no view button and a non-interactive marker.
- Product without a price: the price line is omitted.

## Accessibility

- Hotspots have an `aria-label` such as "1: Sand Open Crepe Abaya"; view buttons "View Sand Open Crepe Abaya".
- Prices include visually hidden "SAR" text.
