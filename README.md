# AI SaaS Frontend Kit

A polished React + TypeScript starter for building AI-powered SaaS products. It ships with a realistic support-operations workspace, reusable UI primitives, dark mode, Arabic/English RTL support, mock data, and a clean data-source boundary for connecting your own backend.

## What's included

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- SaaS application shell with URL-driven navigation
- Inbox, dashboard, customers, tickets, knowledge base, analytics, AI studio, integrations, team, billing, and settings views
- Marketing landing page, design-system view, and public help center
- Dark/light themes
- English/Arabic with LTR/RTL support
- Command palette and notifications drawer
- Mock repository/data layer for demos
- `SupportDataSource` contract so the mock layer can be replaced with a real API
- Vite asset imports for production-safe image handling

## Requirements

- Node.js 20+
- npm 10+

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Production build

```bash
npm run lint
npm run build
npm run preview
```

## Architecture

```text
src/
├── components/       # Shared layout + UI primitives
├── features/         # Feature-level screens
├── lib/              # Theme, i18n, routing, shared utilities
├── mocks/             # Demo data only
├── services/          # Data-source contracts + mock implementation
├── types/             # Domain models
└── assets/            # Bundled images/fonts/etc.
```

### Replacing mock data

The UI talks to `SupportDataSource` rather than depending on a specific backend implementation.

1. Keep `src/services/supportDataSource.ts` as the contract.
2. Implement the same interface with your REST, GraphQL, Supabase, Firebase, or custom API client.
3. Replace the exported `supportRepository` instance in `src/services/supportRepository.ts` (or introduce a dependency-injection provider).
4. Keep mock data for local demos and Storybook-style development.

This keeps feature components independent from the persistence layer.

## AI integration

`AiStudioView` is intentionally demo-safe and does not require a provider secret in the browser. For a real product, route AI requests through your server/API gateway and expose only a public API base URL to the frontend.

**Do not put OpenAI, Gemini, Anthropic, or other provider secrets in `VITE_*` variables.** Vite embeds those values into the client bundle.

A recommended production boundary is:

```text
Browser → Your API / AI gateway → Model provider
```

## Routing

The kit uses clean browser URLs without adding a router dependency:

- `/app/inbox`
- `/app/dashboard`
- `/app/customers`
- `/app/tickets`
- `/app/knowledge-base`
- `/app/analytics`
- `/app/ai-studio`
- `/app/integrations`
- `/app/team`
- `/app/billing`
- `/app/settings`
- `/marketing`
- `/docs`
- `/help`
- `/app/inbox/:conversationId`

If your hosting provider does not automatically serve `index.html` for unknown paths, enable SPA fallback/rewrites for these routes.

## Theming and localization

Use the existing theme context and CSS variables for brand customization. Language switching supports English and Arabic, including RTL layout direction.

## Important scope

This is a **frontend starter kit**, not a complete SaaS backend. Billing, authentication, persistence, file uploads, and model calls are integration points for the application you build on top of the kit.

## v1.1 improvements

- Persistent language preference (EN/AR) and theme/density preferences.
- Keyboard navigation: `⌘K` / `Ctrl+K` opens global search and `Escape` closes transient overlays.
- Mobile navigation closes automatically after route selection.
- Active navigation items expose `aria-current="page"` for assistive technology.
- Added a global React error boundary with a safe recovery screen.
- Public Help Center now navigates back through the router instead of mutating view state directly.
- Version bumped to `1.1.0`.

## v1.2 architecture additions

- `src/components/ui/FileUpload.tsx` provides a real browser-side file picker with validation and removable file state. It intentionally does not upload files; connect its `onChange` callback to your storage provider.
- `src/services/examples/apiSupportDataSource.ts` contains a small `fetch`-based API client reference for wiring the kit to a real backend.
- Keep the bundled `SupportDataSource` contract as the boundary between feature UI and data access.
- For async production data, use an async server-state layer such as TanStack Query or SWR rather than making every view own its own request lifecycle.


## Release status

**v1.3.0** is the release-hardening build. It includes optimized avatar assets and a warning-free Vite config for modern Node/Vite environments.
