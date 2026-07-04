# Slide Catalog

Boring, predictable primitives. Every slide composes from these first. Only
invent new components when nothing here fits — and then promote the new
component into the catalog before reuse.

| Primitive         | When to reach for it                                  |
| ----------------- | ----------------------------------------------------- |
| `SlideFrame`      | Every slide's outer container. Owns safe area + bg.   |
| `TitleCard`       | Episode / segment title. One per segment.             |
| `StillZoomable`   | Any image the host wants to pinch-zoom on camera.     |
| `ComparatorPanel` | Two-column A/B compare (e.g. Lovable vs local LLM).   |
| `CalloutBadge`    | Small inline emphasis chip — sparingly.               |
| `BigNumber`       | Oversized statistic with caption.                     |
| `CodeBlockStill`  | Static code screenshot / snippet with mono font.      |

Each primitive lives in `primitives/<Name>/` with its own `.tsx`, `.types.ts`,
and (when useful) local utilities. No re-exports.
