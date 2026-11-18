# Footer Block

## Overview

The Footer block loads the footer fragment and lays it out as a row of link columns followed by a legal row. It also adds a back-to-top button and, on multistore sites, a store switcher that opens in a modal.

## Integration

### Block Configuration

No block configuration is read via `readBlockConfig()`. The footer content comes from a fragment.

### URL Parameters

No URL parameters are read by the footer block.

### Local Storage

No localStorage keys are used by this block.

### Events

#### Event Listeners

- `click` on the back-to-top button scrolls the window to the top (instant when the user prefers reduced motion, smooth otherwise)
- `click` / `keydown` (Enter, Space) on store switcher regions toggle their store lists (multistore only)

#### Event Emitters

No events are emitted by this block.

### Metadata

- `footer` - Path to the footer fragment (default: `/footer`)

## Authoring

Each section of the footer document becomes one part of the footer:

1. **Columns** - every section except the last one is a column, shown side by side on desktop.
   - The **first column** (`footer-brand`) is wider. Its first paragraph is shown as a highlighted strip (used for payment method logos), followed by any other content (for example app store badges).
   - Other columns usually hold a heading and a list of links. List items can start with an icon (`:femi-phone:`, `:femi-mail:`, `:femi-location-white:`).
2. **Legal row** - the last section (when there is more than one) is shown under a divider: the first paragraph on the left and the remaining paragraph(s) on the right. Several links in one paragraph are separated by a thin divider.

A paragraph that contains only links, where every link contains an icon (social profiles, app store badges), is shown as a row of icons. The link text is kept but visually hidden so screen readers still announce it, for example `[:femi-facebook: Facebook](https://facebook.com/...)`.

## Behavior Patterns

### Page Context Detection

- **Desktop (900px and wider)**: columns in one row (first column 383px wide), legal row split left and right, back-to-top button at the top right.
- **Mobile**: first and last columns span the full width, the others sit two per row; the legal row stacks.
- **Multistore**: when `isMultistore()` is true, a store switcher button is rendered and the `/store-switcher` fragment is shown in a modal.

### User Interaction Flows

1. **Back to top**: the user selects the round button and the page scrolls to the top.
2. **Store switcher** (multistore only): the user opens the modal, expands a region and picks a store view.

## Error Handling

- **Store switcher fragment missing**: the error is logged with `console.error` and the footer stops rendering the switcher (the rest of the footer is not appended in this case, matching the previous behavior).
- **Single section footer**: when the fragment has only one section, it is treated as a column and no legal row is created.
- **Missing icons**: icon links without an icon are left as normal text links.

## Files

- `footer.js` - Loads the fragment, builds the columns and legal row, icon-link rows, back-to-top button and store switcher
- `footer.css` - Footer layout, column, legal row and back-to-top styles
