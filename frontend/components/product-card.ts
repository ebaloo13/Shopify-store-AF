import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Modern Product Card Component
 *
 * A Lit-based web component that enhances product display.
 * Follows progressive enhancement - works alongside existing Liquid templates.
 *
 * Usage in Liquid:
 * <modern-product-card
 *   product-title="{{ product.title }}"
 *   product-price="{{ product.price | money }}"
 *   product-url="{{ product.url }}"
 *   image-url="{{ product.featured_image | image_url: width: 400 }}"
 * ></modern-product-card>
 */
@customElement('modern-product-card')
export class ModernProductCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      container-type: inline-size;
    }

    .card {
      position: relative;
      display: flex;
      flex-direction: column;
      background: var(--color-background, #fff);
      border-radius: var(--modern-radius-md, 0.5rem);
      overflow: hidden;
      transition: box-shadow var(--modern-transition-base, 250ms ease);
    }

    .card:hover {
      box-shadow: var(--modern-shadow-md, 0 4px 6px rgb(0 0 0 / 10%));
    }

    .card__image-wrapper {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
      background: var(--color-background-secondary, #f5f5f5);
    }

    .card__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--modern-transition-slow, 350ms ease);
    }

    .card:hover .card__image {
      transform: scale(1.05);
    }

    .card__content {
      padding: var(--modern-spacing-md, 1rem);
    }

    .card__title {
      margin: 0 0 var(--modern-spacing-sm, 0.5rem);
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.4;
      color: var(--color-foreground, #000);
    }

    .card__title a {
      color: inherit;
      text-decoration: none;
    }

    .card__title a:hover {
      text-decoration: underline;
    }

    .card__title a:focus-visible {
      outline: 2px solid var(--color-focus, currentColor);
      outline-offset: 2px;
    }

    .card__price {
      font-size: 0.875rem;
      color: var(--color-foreground-secondary, #666);
    }

    /* Container query for responsive adjustments */
    @container (max-width: 200px) {
      .card__content {
        padding: var(--modern-spacing-sm, 0.5rem);
      }

      .card__title {
        font-size: 0.875rem;
      }

      .card__price {
        font-size: 0.75rem;
      }
    }
  `;

  @property({ type: String, attribute: 'product-title' })
  productTitle = '';

  @property({ type: String, attribute: 'product-price' })
  productPrice = '';

  @property({ type: String, attribute: 'product-url' })
  productUrl = '';

  @property({ type: String, attribute: 'image-url' })
  imageUrl = '';

  @property({ type: String, attribute: 'image-alt' })
  imageAlt = '';

  render() {
    return html`
      <article class="card">
        ${this.imageUrl
          ? html`
              <div class="card__image-wrapper">
                <img
                  class="card__image"
                  src="${this.imageUrl}"
                  alt="${this.imageAlt || this.productTitle}"
                  loading="lazy"
                />
              </div>
            `
          : ''}
        <div class="card__content">
          <h3 class="card__title">
            ${this.productUrl
              ? html`<a href="${this.productUrl}">${this.productTitle}</a>`
              : this.productTitle}
          </h3>
          ${this.productPrice
            ? html`<p class="card__price">${this.productPrice}</p>`
            : ''}
        </div>
      </article>
    `;
  }
}

// Type declaration for global registry
declare global {
  interface HTMLElementTagNameMap {
    'modern-product-card': ModernProductCard;
  }
}
