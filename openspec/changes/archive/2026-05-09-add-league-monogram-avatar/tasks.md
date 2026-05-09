## 1. Rename Generic Components

- [x] 1.1 Rename `components/TeamMonogram.tsx` → `components/Monogram.tsx`, rename export `TeamMonogram` → `Monogram`, rename type `TeamMonogramProps` → `MonogramProps`
- [x] 1.2 Rename `components/TeamAvatar.tsx` → `components/Avatar.tsx`, rename export `TeamAvatar` → `Avatar`, rename type `TeamAvatarProps` → `AvatarProps`, update import from `Monogram`

## 2. Update Existing TeamAvatar / TeamMonogram Import Sites

- [x] 2.1 Update `store/leagues/GameExcerpt.tsx` to import `Avatar` from `@/components/Avatar`
- [x] 2.2 Update `src/app/(app)/teams/index.tsx` to import `Avatar` from `@/components/Avatar`
- [x] 2.3 Update `src/app/(app)/home/leagues/[id]/games/[gameId].tsx` to import `Avatar` from `@/components/Avatar`
- [x] 2.4 Update `src/app/(app)/teams/[id]/index.tsx` to import `Avatar` from `@/components/Avatar`

## 3. Update LeagueExcerpt

- [x] 3.1 In `store/leagues/LeagueExcerpt.tsx`, replace `ImageFetcher` + `DEFAULT_IMAGES.LEAGUE_LOGO` with `Avatar` (passing `logoUrl={league.logoUrl}`, `name={league.name}`, `size={imageSideLength}`)
- [x] 3.2 Remove unused `ImageFetcher` and `DEFAULT_IMAGES` imports from `LeagueExcerpt.tsx`

## 4. Update CustomHeader

- [x] 4.1 Add optional `name?: string` prop to `CustomHeader`
- [x] 4.2 When `imageUrl` is absent and `name` is provided, render `Monogram` (40×40) instead of the static `defaultSource` image

## 5. Update League Detail Screens

- [x] 5.1 In `src/app/(app)/home/leagues/[id]/index.tsx`, pass `name={league.name}` to `CustomHeader` and remove the `DEFAULT_IMAGES` import if no longer used
- [x] 5.2 In `src/app/(app)/home/leagues/[id]/upcoming-league/index.tsx`, pass `name={league.name}` to `CustomHeader` and remove the `DEFAULT_IMAGES` import if no longer used
