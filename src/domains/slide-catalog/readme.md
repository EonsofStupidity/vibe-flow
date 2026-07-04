# Slide catalog

Reusable slide primitives. A slide composes from these; **only promote a
pattern in here after using the same pattern in ≥ 2 slides**.

## Primitives (v1)

| Primitive       | Purpose                                       |
| --------------- | --------------------------------------------- |
| `SlideFrame`    | Outer container, safe-area padding, alignment |
| `TitleCard`     | Episode / segment opener                      |
| `CalloutBadge`  | Small emphasis chip (neutral / live)          |
| `StillZoomable` | Pinch-zoom stills with reset                  |
| `ComparatorPanel` | Side-by-side A/B panel                      |

## Rules

- Lowercase kebab-case folders and files. React component symbols stay PascalCase.
- Semantic tokens only (`bg-surface`, `text-ink`, `bg-brand`) — never primitive
  ramps (`--amber-500`) directly.
- Every primitive should be brand-agnostic: `bg-brand`, not `bg-amber-500`,
  so the same slide reads correctly under `data-brand="news"` or `vibes`.
