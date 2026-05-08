## 1. Teams List Screen

- [x] 1.1 Replace `ImageFetcher` import with `TeamAvatar` in `src/app/(app)/teams/index.tsx`
- [x] 1.2 Remove `DEFAULT_IMAGES` import from `src/app/(app)/teams/index.tsx`
- [x] 1.3 Replace `<ImageFetcher>` usage with `<TeamAvatar logoUrl={item.logoUrl} name={item.name} size={...} />` in the team row

## 2. Team Detail Screen

- [x] 2.1 Add `TeamAvatar` import to `src/app/(app)/teams/[id]/index.tsx`
- [x] 2.2 Remove `DEFAULT_IMAGES` import from `src/app/(app)/teams/[id]/index.tsx`
- [x] 2.3 Replace the existing image rendering with `<TeamAvatar logoUrl={team.logoUrl} name={team.name} size={...} />`
