/**
 * Theme Entry Point
 *
 * This is the main entry point for all modern frontend code.
 * Import global styles and register web components via side effects here.
 */

// Import global styles (processed by Vite/Sass)
import './theme.scss';

// Import components for side-effect registration
// Each component self-registers its custom element when imported
import '@components/product-card';

