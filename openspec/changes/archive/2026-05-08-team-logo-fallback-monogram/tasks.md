## 1. TeamMonogram component

- [x] 1.1 Create `components/TeamMonogram.tsx` with a colored circle and 1–2 letter initials
- [x] 1.2 Implement `hashColor(name, palette)` utility inside the component to derive a stable background color from the team name
- [x] 1.3 Implement `getInitials(name)` utility: first letter of first word + first letter of second word (if present), uppercased

## 2. TeamAvatar component

- [x] 2.1 Create `components/TeamAvatar.tsx` that accepts `logoUrl`, `name`, and `size` props
- [x] 2.2 Render `ImageFetcher` when `logoUrl` is truthy, otherwise render `TeamMonogram`
- [x] 2.3 Pass matching `size` to both `ImageFetcher` (via `imageStyle`) and `TeamMonogram` so they occupy the same space

## 3. Wire up in GameExcerpt

- [x] 3.1 Replace the two `ImageFetcher` usages in `store/leagues/GameExcerpt.tsx` with `TeamAvatar`, passing `logoUrl` and `name` for each team
- [x] 3.2 Remove the now-unused `DEFAULT_IMAGES.TEAM_LOGO` import from `GameExcerpt.tsx` if nothing else references it there
