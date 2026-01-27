import { describe, it, expect, beforeEach } from 'vitest';

// Import the component to trigger side-effect registration
import '../../frontend/components/product-card';
import type { ModernProductCard } from '../../frontend/components/product-card';

describe('ModernProductCard', () => {
  let element: ModernProductCard;

  beforeEach(async () => {
    // Clean up any previous test elements
    document.body.innerHTML = '';
    
    // Create a new component instance
    element = document.createElement('modern-product-card') as ModernProductCard;
    document.body.appendChild(element);
    
    // Wait for Lit to complete the first update
    await element.updateComplete;
  });

  it('should be defined as a custom element', () => {
    expect(customElements.get('modern-product-card')).toBeDefined();
  });

  it('should render with default empty state', async () => {
    const shadowRoot = element.shadowRoot;
    expect(shadowRoot).not.toBeNull();
    
    const card = shadowRoot?.querySelector('.card');
    expect(card).not.toBeNull();
  });

  it('should render product title when provided', async () => {
    element.productTitle = 'Test Product';
    await element.updateComplete;

    const title = element.shadowRoot?.querySelector('.card__title');
    expect(title?.textContent?.trim()).toBe('Test Product');
  });

  it('should render product price when provided', async () => {
    element.productPrice = '$29.99';
    await element.updateComplete;

    const price = element.shadowRoot?.querySelector('.card__price');
    expect(price?.textContent?.trim()).toBe('$29.99');
  });

  it('should render image when imageUrl is provided', async () => {
    element.imageUrl = 'https://example.com/image.jpg';
    element.productTitle = 'Test Product';
    await element.updateComplete;

    const img = element.shadowRoot?.querySelector('.card__image') as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img?.src).toBe('https://example.com/image.jpg');
    expect(img?.alt).toBe('Test Product'); // Falls back to productTitle
  });

  it('should use imageAlt when provided', async () => {
    element.imageUrl = 'https://example.com/image.jpg';
    element.imageAlt = 'Custom alt text';
    await element.updateComplete;

    const img = element.shadowRoot?.querySelector('.card__image') as HTMLImageElement;
    expect(img?.alt).toBe('Custom alt text');
  });

  it('should render product link when productUrl is provided', async () => {
    element.productTitle = 'Test Product';
    element.productUrl = '/products/test-product';
    await element.updateComplete;

    const link = element.shadowRoot?.querySelector('.card__title a') as HTMLAnchorElement;
    expect(link).not.toBeNull();
    expect(link?.href).toContain('/products/test-product');
  });

  it('should not render image wrapper when imageUrl is empty', async () => {
    element.productTitle = 'Test Product';
    element.imageUrl = '';
    await element.updateComplete;

    const imageWrapper = element.shadowRoot?.querySelector('.card__image-wrapper');
    expect(imageWrapper).toBeNull();
  });

  it('should accept attributes in kebab-case', async () => {
    document.body.innerHTML = '';
    
    const el = document.createElement('modern-product-card');
    el.setAttribute('product-title', 'Attribute Test');
    el.setAttribute('product-price', '$19.99');
    el.setAttribute('product-url', '/test');
    el.setAttribute('image-url', 'https://example.com/test.jpg');
    el.setAttribute('image-alt', 'Test image');
    document.body.appendChild(el);
    
    await (el as ModernProductCard).updateComplete;

    expect((el as ModernProductCard).productTitle).toBe('Attribute Test');
    expect((el as ModernProductCard).productPrice).toBe('$19.99');
    expect((el as ModernProductCard).productUrl).toBe('/test');
    expect((el as ModernProductCard).imageUrl).toBe('https://example.com/test.jpg');
    expect((el as ModernProductCard).imageAlt).toBe('Test image');
  });
});
