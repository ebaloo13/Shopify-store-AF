### Cursor AI Prompt: Refactor Shopify Horizon Theme with Modern Build Tooling

#### Project Overview
I have cloned the official Shopify Horizon theme from https://github.com/Shopify/horizon/tree/main and need to refactor it to use modern build tooling while maintaining full compatibility with Shopify's theme structure. This refactor will enable component-based development with web components, automated testing, and modern styling approaches.

#### Current State
* Vanilla Shopify Horizon theme (buildless by default)
* Liquid templates with inline JavaScript
* Traditional CSS in assets folder
* Flat file structure in assets/ (no subdirectories allowed by Shopify)
* No testing infrastructure
* No component system

#### Desired State
* **Lit** for web components (chosen for beginner-friendliness, small bundle size ~5KB, and true web standards)
* **Vite** as build tool with vite-plugin-shopify for Shopify integration
* **Vitest** for automated testing
* **CSS Custom Properties** for styling (NOT Tailwind due to Shadow DOM complications)
* Organized source code structure in frontend/ folder
* Compiled output to Shopify's required flat assets/ folder
* Hot module replacement during development
* Automated build process

#### Technology Stack Rationale
##### Why Lit?
* True standards-compliant web components (works anywhere)
* Minimal learning curve for beginners
* Small footprint (~5KB)
* Excellent VS Code integration with lit-plugin
* Reactive properties and declarative templates built-in
* Much less boilerplate than vanilla web components

##### Why Vite?
* Lightning-fast hot module replacement
* Minimal configuration required
* Perfect plugin exists for Shopify (vite-plugin-shopify)
* Handles the complexity of outputting to Shopify's flat structure
* Supports ES modules natively

#### Required Project Structure
We need a "Parallel Architecture". Keep existing files in `assets/` UNTOUCHED.
Create a new `frontend/` directory for all new modern code.
Vite should compile `frontend/` code and output it into `assets/` alongside the old files.

#### Step-by-Step Implementation Instructions

##### Step 1: Initialize Node.js Project
Create a package.json with the following exact configuration:
**CRITICAL**: The "type": "module" field is mandatory. Without it, ES module imports will fail.

##### Step 2: Create Vite Configuration
Create vite.config.js:
**WARNING**: emptyOutDir: false is critical. Setting it to true will delete all existing Shopify theme assets during build.

##### Step 3: Create Vitest Configuration
Create vitest.config.js for unit testing.

##### Step 4: Create Frontend Entry Points
Create frontend/entrypoints/theme.ts
Create frontend/entrypoints/theme.scss

##### Step 5: Create Example Lit Component
Create frontend/components/product-card.ts as a test component.

##### Step 6: Create Test for Component
Create test/components/product-card.test.ts

#### Critical Best Practices
1. **Component Registration Pattern**: Always import components at the top level for side-effect registration.
2. **CSS Variable Theming Pattern**: All component styles should use CSS custom properties with fallbacks.
3. **Progressive Enhancement Pattern**: Web components should enhance Liquid templates, not replace them.
4. **Testing Pattern**: Every component should have accompanying tests.

#### Success Criteria
You'll know the refactor is successful when:
* ✅ npm run dev starts both Vite and Shopify CLI
* ✅ Hot module replacement works in development
* ✅ npm test runs all tests successfully
* ✅ npm run build compiles without errors
* ✅ Compiled assets appear in flat assets/ folder
* ✅ Theme works in Shopify preview