# Homepage Module Overview

This document describes the user homepage components.

- `HomePage` combines several small card components to keep the codebase easy to maintain.
- Each card component lives under `src/features/homepage/components/user/cards/`.
- These cards include appointments, doctor notes, conditions, messages, and blog posts.
- The dashboard layout is provided by `HomePageLayout`. Admin routes use the same
  layout and render the `AdminDashboard` component.

Splitting the previous large file into separate components helps future expansion and readability.
- The admin dashboard displays a weekly schedule via a dedicated `ScheduleGrid` component.
