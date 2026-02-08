---
name: Update Trip Card Features
overview: Update the product-card-trip snippet to include compare-at pricing with discount badge, variant dropdown selector, quantity controls, and simple button feedback states.
todos:
  - id: price-badge
    content: Add compare-at price display and discount badge on image
    status: completed
  - id: variant-select
    content: Add variant dropdown selector (conditional)
    status: completed
  - id: quantity-controls
    content: Add quantity +/- controls
    status: completed
  - id: button-feedback
    content: Update button with loading/added feedback states
    status: completed
  - id: css-styles
    content: Add CSS for new elements in featured-trips.liquid
    status: completed
isProject: false
---

# Update Trip Product Card

## Files to Modify

- [snippets/product-card-trip.liquid](snippets/product-card-trip.liquid) - Main markup changes
- [sections/featured-trips.liquid](sections/featured-trips.liquid) - CSS additions

## Changes

### 1. Compare-at Price + Discount Badge (Image Corner)

Add to `trip-card__image-wrapper`:

```liquid
{% if variant.compare_at_price > variant.price %}
  {% assign discount = variant.compare_at_price | minus: variant.price | times: 100 | divided_by: variant.compare_at_price %}
  <span class="trip-card__badge">-{{ discount }}%</span>
{% endif %}
```

Add price display in content area:

```liquid
<div class="trip-card__price">
  {{ variant.price | money }}
  {% if variant.compare_at_price > variant.price %}
    <s class="trip-card__compare-price">{{ variant.compare_at_price | money }}</s>
  {% endif %}
</div>
```

### 2. Variant Dropdown Selector (if variants exist)

Only show when product has multiple variants:

```liquid
{% unless product.has_only_default_variant %}
  <select name="id" class="trip-card__variant-select" on:change="/updateVariant">
    {% for variant in product.variants %}
      <option value="{{ variant.id }}" {% if variant == product.selected_or_first_available_variant %}selected{% endif %}>
        {{ variant.title }} - {{ variant.price | money }}
      </option>
    {% endfor %}
  </select>
{% endunless %}
```

### 3. Quantity Selector (+/-)

Compact inline quantity control (no external snippet for minimal markup):

```liquid
<div class="trip-card__quantity">
  <button type="button" class="trip-card__qty-btn" on:click="/decreaseQty">−</button>
  <input type="number" name="quantity" value="1" min="1" class="trip-card__qty-input">
  <button type="button" class="trip-card__qty-btn" on:click="/increaseQty">+</button>
</div>
```

### 4. Button Feedback (Simple: cart emoji to checkmark)

Update existing button with data-state handling:

```liquid
<button type="submit" class="trip-card__cart-btn" aria-label="Add to cart">
  <span class="trip-card__btn-icon">🛒</span>
  <span class="trip-card__btn-loading" hidden>...</span>
  <span class="trip-card__btn-added" hidden>✓</span>
</button>
```

CSS handles visibility via `[data-loading]` and `[data-added]` attributes.

### 5. CSS Additions (in featured-trips.liquid)

- `.trip-card__badge` - Absolute positioned, top-left, red/orange background
- `.trip-card__price` - Flexbox row with current + compare-at prices
- `.trip-card__compare-price` - Muted color, strikethrough
- `.trip-card__variant-select` - Minimal styled dropdown
- `.trip-card__quantity` - Compact flex row with buttons and input
- `.trip-card__qty-btn` - Small circular buttons
- Button state styles for loading/added feedback

## Notes

- Variant selector updates the hidden `id` input via simple inline JS or web component event
- Quantity buttons use `on:click` events (theme already supports this pattern)
- Button states toggle via `data-loading` and `data-added` attributes (existing pattern in `product-form-component`)
- No new JavaScript files - leverages existing web components

