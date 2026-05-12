## Context

`LeagueScreen` in `src/app/(app)/home/leagues/[id]/index.tsx` renders a `FlatList` whose `ListHeaderComponent` is a `<Text>` styled with the `header` style. The current `header` style has `paddingTop: 2`, `paddingLeft: 10`, `paddingRight: 10`, and `paddingBottom: 2`. The `paddingLeft`/`paddingRight` values of 10 are noticeably narrower than the visual indentation the game rows appear to have, causing the heading to sit closer to the screen edge than the content beneath it.

The `GameExcerpt` component renders game rows. Inspecting game row layout will confirm the effective horizontal inset used there; the header padding should match that value.

## Goals / Non-Goals

**Goals:**
- Increase `paddingLeft` and `paddingRight` in the `header` StyleSheet entry so the "Schedule" title aligns horizontally with the game row content.

**Non-Goals:**
- Changing font size, weight, border, or vertical padding of the header.
- Modifying `GameExcerpt` layout.
- Introducing a shared spacing constant or design token.

## Decisions

### Adjust existing padding values — no new props or components
The fix is a one-line style change inside the existing `StyleSheet.create` block. No new abstractions are needed.

### Target value: 16
React Native's default list content inset is effectively 0, but `GameExcerpt` rows visually sit at ~16 dp from the edge (common RN convention). Updating `paddingLeft` and `paddingRight` from `10` to `16` brings the header into alignment.

*Alternative considered*: Match whatever explicit padding `GameExcerpt` uses by reading its source first, then set an identical value. This is the correct approach — the task step below calls for reading `GameExcerpt` before committing to a number.

## Risks / Trade-offs

- **Visual regression**: The header bottom border (`borderBottomWidth: 1`) spans the full row width and is unaffected by padding changes — it will still run edge-to-edge. This is acceptable; section separators commonly span full width.
- **Value disagreement across platforms**: padding of 16 is a safe cross-platform choice matching Material / HIG list inset conventions.
