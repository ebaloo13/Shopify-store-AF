# Andes Freeride Storefront

A custom Shopify storefront for Andes Freeride, a mountain bike travel company offering guided experiences in Chile.

The project extends Shopify's Horizon theme with branded landing pages, travel-package discovery, custom-trip lead capture, modern frontend tooling, automated validation, and controlled theme deployments.

## Product Features

- Branded homepage and travel-package presentation
- Featured trip cards with pricing, variant, and quantity controls
- Custom Trips landing page with configurable destinations, events, packages, extras, and FAQ content
- Lead capture through Shopify's native contact-form workflow
- Responsive, accessible Shopify sections and blocks
- Theme-editor-managed content and settings

## Custom-Built Work

The following functionality was built specifically for Andes Freeride:

- Custom Trips page template and its hero, path-selection, form, and FAQ sections
- Featured Trips section and trip-focused product-card experience
- Andes Freeride hero and branded storefront content
- Dedicated About page template
- Vite, TypeScript, Lit, Sass, and Vitest integration
- GitHub Actions validation and DEV/LIVE deployment workflow

## Horizon Foundation

This storefront is based on Shopify's open-source [Horizon theme](https://github.com/Shopify/horizon). Horizon provides the core Shopify theme architecture, standard sections, blocks, snippets, assets, localization files, and storefront behavior.

The inherited theme structure remains compatible with Shopify's theme editor. Custom functionality is added through dedicated sections and templates, while modern frontend source is isolated in `frontend/`.

## Engineering Decisions

### Preserve Shopify-native behavior

The theme remains a standard Shopify Liquid theme. Custom sections use Shopify schemas and native forms so merchants can manage content without a separate application or CMS.

### Isolate modern frontend source

`frontend/` contains TypeScript, Lit components, and Sass source. Vite compiles those entrypoints into Shopify's flat `assets/` directory without deleting inherited theme assets.

### Use progressive enhancement

Modern components enhance Liquid-rendered storefront behavior rather than replacing Shopify's server-rendered theme architecture.

### Separate development and production deployment

Pushes to `main` deploy to the Shopify development theme after validation. Production deployment is manual and runs through the protected GitHub `production` environment.

## Technical Challenges

- Added modern build tooling without disrupting Shopify's required theme structure
- Preserved inherited assets while generating new frontend bundles
- Built configurable travel lead-capture flows using Shopify-native forms
- Separated page templates to prevent shared Theme Editor configuration
- Automated Theme Check, frontend build, tests, and environment-specific deployments

## Architecture

| Path | Responsibility |
| --- | --- |
| `assets/` | Inherited Shopify assets and generated frontend bundles |
| `blocks/` | Reusable Shopify theme blocks |
| `config/` | Theme settings schema and current theme settings |
| `frontend/` | TypeScript, Lit, and Sass source |
| `layout/` | Shopify theme layouts |
| `locales/` | Theme translations |
| `sections/` | Merchant-configurable storefront sections |
| `snippets/` | Reusable Liquid snippets |
| `templates/` | Shopify JSON and Liquid templates |
| `test/` | Vitest component tests |

## Technology

- Shopify Liquid and Theme Editor schemas
- TypeScript and Lit
- Vite and Sass
- Vitest and jsdom
- Shopify Theme Check
- GitHub Actions

## Local Development

### Prerequisites

- Node.js 22
- npm
- Shopify CLI
- Access to a Shopify development store or theme

### Setup

```bash
npm ci
shopify auth login
```

Run the frontend compiler and Shopify theme preview in separate terminals:

```bash
npm run dev
```

```bash
shopify theme dev --store your-store.myshopify.com
```

### Commands

| Command | Purpose |
| --- | --- |
| `npm run check` | Build assets, run tests, and validate the Shopify theme |
| `npm run dev` | Start Vite with hot module replacement |
| `npm run build` | Compile frontend source into Shopify assets |
| `npm test` | Run the Vitest suite |
| `npm run test:watch` | Run Vitest in watch mode |
| `npx --yes @shopify/cli@3.92.1 theme check --path . --fail-level error` | Validate Liquid and theme schemas |

## CI/CD

The `Shopify Theme CI/CD` workflow is the single deployment path.

| Trigger | Validation | Development deploy | Production deploy |
| --- | --- | --- | --- |
| Pull request to `main` | Yes | No | No |
| Push to `main` | Yes | Yes | No |
| Manual dispatch | Yes | No | Yes |

Validation runs:

1. `npm ci`
2. `npm run check`

### GitHub Environments

Configure these environments under **Settings > Environments**:

- `development`: used for automatic DEV-theme deployments
- `production`: used for manual LIVE-theme deployments; configure required reviewers before public release

### Required GitHub Secrets

The workflow reads all deployment configuration from GitHub Secrets:

| Secret | Purpose |
| --- | --- |
| `SHOPIFY_THEME_TOKEN` | Shopify Theme Access authentication token |
| `SHOPIFY_STORE` | Store domain, such as `your-store.myshopify.com` |
| `SHOPIFY_DEV_THEME_ID` | Development theme ID |
| `SHOPIFY_LIVE_THEME_ID` | Live production theme ID |

No secret values belong in the repository.

## Source and Generated Files

- `frontend/` is the source of modern frontend code.
- `assets/theme.js` and `assets/theme.css` are generated and ignored by Git.
- `.shopify/`, `.env*`, editor configuration, caches, and local credentials are ignored.
- `.shopifyignore` prevents development-only files from being uploaded with the theme.

## Attribution

Based on Shopify's [Horizon theme](https://github.com/Shopify/horizon). Review the upstream project for applicable licensing and attribution requirements.
