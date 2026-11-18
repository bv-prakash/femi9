# UGC Gallery Block

## Overview

User-generated content gallery: a tall feature image with a social handle link on top of it, and a horizontally scrolling row of video or photo tiles with a play icon. On desktop the tile row starts lower and overlaps the feature image.

## Configuration

No variants. A paragraph and heading placed before the block in the same section (for example `#FEMI9WOMAN` and `Styled by you`) are styled as the eyebrow and section title.

## Authoring

| ugc-gallery |  |
|---|---|
| feature image | link to the social profile (for example `@femi9fashion`) |
| tile image | link to the post or video (optional) |
| tile image | link |

Tiles without a link use the profile link from the first row. Links to Instagram, TikTok or YouTube open in a new tab.

## Integration

### URL Parameters / Local Storage / Events

None. The tiles are links; there is no in-page video player.

## Behavior Patterns

- **Desktop (900px and wider)**: feature image 27.43% wide (384px at 1440), tile row offset 122px down and overlapping the image by 39px, about 4.3 tiles visible.
- **Mobile**: the feature image is full width (4:5), tiles below at 56% width; swipe to scroll.

## Error Handling

- No feature image: only the tile row is shown.
- Rows without an image are ignored.

## Accessibility

- Each tile link has an `aria-label` (its link text or image alt text); the play icon is decorative.
