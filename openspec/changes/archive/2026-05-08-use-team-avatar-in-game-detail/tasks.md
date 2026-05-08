## 1. Game Detail Screen

- [x] 1.1 Replace `ImageFetcher` import with `TeamAvatar` in `src/app/(app)/home/leagues/[id]/games/[gameId].tsx`
- [x] 1.2 Replace home team `<ImageFetcher>` with `<TeamAvatar logoUrl={homeTeam.logoUrl} name={homeTeam.name} size={screenHeight * 0.1} />`
- [x] 1.3 Replace away team `<ImageFetcher>` with `<TeamAvatar logoUrl={awayTeam.logoUrl} name={awayTeam.name} size={screenHeight * 0.1} />`
- [x] 1.4 Remove unused `teamLogoImage` style from the stylesheet

## 2. Cleanup

- [x] 2.1 Remove `TEAM_LOGO` entry from `constants/Assets.ts`
- [x] 2.2 Remove `DEFAULT_IMAGES` import from `[gameId].tsx` if no longer used (verify `FIELD_BG` and `SOCCER_BALL` still reference it)
