# Changelog

## 1.3.0 - Release hardening

- Removed the Vite config `__dirname` warning by using `import.meta.dirname`.
- Optimized bundled avatar assets from 1024px JPEGs to 512px WebP files for a much smaller production payload.
- Kept the existing frontend-only architecture, routing, upload flow, API adapter example, persistence, accessibility, and error boundary improvements from 1.2.x.

## 1.2.0
- Added a reusable frontend-only `FileUpload` component.
- Added a fetch-based API client reference for backend integration.
- Removed an `any` cast from Settings tabs.
- Documented the recommended async data integration pattern.
