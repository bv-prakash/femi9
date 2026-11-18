# Hero Block

## Overview

A large image with text on top. The block has no JavaScript; layout comes from CSS. The image is positioned behind the text and covers the whole block.

## Configuration

| Variant | Effect |
|---------|--------|
| *(none)* | Default boilerplate hero: image behind a heading, 300px minimum height |
| `banner` | Full-width promotional banner (Femi9 design): 1440:726 on desktop with the text block starting at 64.8% from the left; on mobile the text sits at the bottom over a dark gradient |

## Authoring (`banner`)

One cell containing, in order:

1. the image
2. a paragraph - large first line (for example `30% OFF`)
3. a heading - second line (for example `The Classics`)
4. a paragraph with **bold** text - large red uppercase line (for example `On Sale`)
5. a paragraph with a **bold** link - dark button with an arrow (for example `Shop Now`)

The banner runs edge to edge (it ignores the page container).

## Integration

No URL parameters, localStorage or events.

## Behavior Patterns

- **Desktop (900px and wider)**: fixed 1440:726 aspect ratio; text sizes scale with the viewport between their minimum and design sizes.
- **Mobile**: at least 520px tall, the image is focused at 30% from the left and the text is placed at the bottom over a gradient so it stays readable.

## Error Handling

- Missing image: the text is shown on the page background.
- Missing lines: each line is optional; the remaining ones keep their styles.
