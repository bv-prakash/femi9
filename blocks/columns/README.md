# Columns Block

## Overview

Lays out the cells of each row side by side on desktop and stacked on mobile. Adds a `columns-{n}-cols` class and marks cells that contain only an image (`columns-img-col`).

## Configuration

| Variant | Effect |
|---------|--------|
| *(none)* | Equal columns, images first on mobile |
| `trust` | Full-width cream strip (`#fcf3e3`) with up to four items spread across 1226px, each with an icon, a bold uppercase title and a short line of text. Two per row on mobile |
| `collection` | Image, text, image (358 / 446 / 358 on desktop, 32px gaps, centred in 1226px). The middle cell is centred text: heading, paragraph and a **bold** link shown as a dark button. On mobile the text comes first and the two images sit side by side |

## Authoring

- `trust` - one row, one cell per item: `:femi-collect:` icon paragraph, **bold** title paragraph, text paragraph.
- `collection` - one row: image | text | image.

## Integration

No URL parameters, localStorage or events.

## Behavior Patterns

- Desktop breakpoint is 900px; below it all variants stack or wrap as described above.
- The `trust` strip and its background run edge to edge; its content stays within the container width.

## Error Handling

- Rows with a different number of cells than the first row still render; the class reflects the first row.
- Image-only cells are detected per cell, so mixed rows work.
