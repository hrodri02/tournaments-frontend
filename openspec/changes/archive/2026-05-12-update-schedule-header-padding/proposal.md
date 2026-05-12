## Why

The "Schedule" section title in the league detail screen renders flush against the left edge of the screen. The game rows beneath it include horizontal padding, so the heading visually misaligns with the content it labels. This makes the section feel detached and inconsistent.

## What Changes

- Add horizontal padding to the `header` style in `src/app/(app)/home/leagues/[id]/index.tsx` so the "Schedule" title aligns with the content rows below it.

## Capabilities

### Modified Capabilities

- `league-schedule-view`: The schedule section header now has consistent horizontal spacing that matches the surrounding list content, improving visual alignment.

## Impact

- **Screens changed**: `src/app/(app)/home/leagues/[id]/index.tsx`
- **No component, store, or API changes** — single style adjustment
