# 05: Refactor Dialogs & Loading States

**What to build:** The global alert and confirmation systems are updated to use sleek Shadcn Dialogs. Additionally, loading states are standardized with full-page spinners for major transitions and Skeleton components for loading data elements smoothly.

**Blocked by:** 01: Setup Infrastructure

**Status:** ready-for-agent

- [ ] Global `DialogProvider` is refactored to use Shadcn Dialog.
- [ ] Destructive actions use red (`destructive`) buttons in confirmations.
- [ ] Full-page loading uses a centered spinner.
- [ ] Lists and cards display a Shadcn Skeleton while data is loading.
