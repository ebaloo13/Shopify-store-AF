---
name: Custom Trips Landing Page
overview: Build a schema-driven "Custom Trips" landing page with 4 new sections and 1 JSON template, enabling two lead-capture paths (build from scratch / customize existing) using Shopify's built-in contact form endpoint, CSS-only conditional display via :has(), and merchant-editable blocks for events, destinations, packages, and extras.
todos:
  - id: hero-section
    content: Create sections/custom-trips-hero.liquid with image, overlay, CTA, CSS vars, mobile controls
    status: completed
  - id: faq-section
    content: Create sections/custom-trips-faq.liquid with details/summary accordion and trust badge blocks
    status: completed
  - id: form-section
    content: Create sections/custom-trips-form.liquid with contact form, CSS :has() toggle, all fields, and block types (event, destination, package, extra)
    status: completed
  - id: paths-section
    content: Create sections/custom-trips-paths.liquid with two cards, anchor links, and inline JS for radio preselection
    status: completed
  - id: template-json
    content: Create templates/page.custom-trips.json wiring all 4 sections with preset defaults and sample blocks
    status: completed
  - id: translations
    content: Add schema translation keys to locales/en.default.schema.json (names + settings)
    status: completed
isProject: false
---

# Custom Trips Landing Page - Implementation Plan

## Architecture Overview

```mermaid
flowchart TD
    Template["templates/page.custom-trips.json"] --> Hero["Section 1: custom-trips-hero.liquid"]
    Template --> Paths["Section 2: custom-trips-paths.liquid"]
    Template --> Form["Section 3: custom-trips-form.liquid"]
    Template --> FAQ["Section 4: custom-trips-faq.liquid"]

    Paths -->|"anchor + JS preselect"| Form

    Form -->|"{% form 'contact' %}"| Shopify["Shopify Contact Email"]

    subgraph FormBlocks ["Form Section Blocks"]
        EvtBlock["event blocks -> checkboxes"]
        DestBlock["destination blocks -> checkboxes"]
        PkgBlock["package blocks -> dropdown"]
        ExtraBlock["extra blocks -> checkboxes"]
    end

    Form --> FormBlocks
```



---

## 1. Template

**File:** `templates/page.custom-trips.json`

Standard JSON template referencing the 4 sections in order. Assign to a page titled "Custom Trips" in the Shopify admin.

```json
{
  "sections": {
    "hero": { "type": "custom-trips-hero", "settings": { ... } },
    "paths": { "type": "custom-trips-paths", "settings": { ... } },
    "form": { "type": "custom-trips-form", "settings": { ... }, "blocks": { ... } },
    "faq": { "type": "custom-trips-faq", "settings": { ... }, "blocks": { ... } }
  },
  "order": ["hero", "paths", "form", "faq"]
}
```

---

## 2. Section 1: Custom Trips Hero

**File:** [sections/custom-trips-hero.liquid](sections/custom-trips-hero.liquid)

Full-width hero banner with image, overlay, text content, and CTA.

### Schema Settings


| Group       | ID                  | Type                       | Label             | Default                                              |
| ----------- | ------------------- | -------------------------- | ----------------- | ---------------------------------------------------- |
| **Media**   | `image`             | `image_picker`             | Background Image  | -                                                    |
|             | `image_mobile`      | `image_picker`             | Mobile Image      | -                                                    |
|             | `min_height`        | `range` (200-800, step 50) | Min Height (px)   | 500                                                  |
|             | `min_height_mobile` | `range` (200-600, step 50) | Mobile Min Height | 400                                                  |
| **Overlay** | `overlay_color`     | `color`                    | Overlay Color     | `#000000`                                            |
|             | `overlay_opacity`   | `range` (0-100)            | Overlay Opacity   | 40                                                   |
| **Content** | `heading`           | `text`                     | Heading           | "Design Your Dream MTB Trip"                         |
|             | `subheading`        | `textarea`                 | Subheading        | "From single-day events to multi-week adventures..." |
|             | `text_alignment`    | `select`                   | Text Alignment    | center                                               |
|             | `text_color`        | `color`                    | Text Color        | `#ffffff`                                            |
| **Button**  | `button_label`      | `text`                     | Button Label      | "Start Planning"                                     |
|             | `button_link`       | `url`                      | Button Link       | (defaults to `#custom-trip-form`)                    |
| **Spacing** | `padding_top`       | `range`                    | Top Padding       | 0                                                    |
|             | `padding_bottom`    | `range`                    | Bottom Padding    | 0                                                    |
|             | `color_scheme`      | `color_scheme`             | Color Scheme      | scheme-1                                             |


### CSS Variables (section-scoped)

- `--cth-min-height`, `--cth-min-height-mobile`, `--cth-overlay-color`, `--cth-overlay-opacity`, `--cth-text-color`

### Markup Pattern

- `<section>` with background image via `<img>` (not CSS background, for lazy loading)
- Overlay `<div>` with rgba color
- Content container with heading (`<h1>`), subheading (`<p>`), CTA (`<a>` styled as button)
- Responsive: stacks naturally, mobile image swap via `<picture>` element

---

## 3. Section 2: Two-Path Selector

**File:** [sections/custom-trips-paths.liquid](sections/custom-trips-paths.liquid)

Two side-by-side cards, each representing a path. Cards link to the form section anchor and pre-select the correct radio via minimal inline JS.

### Schema Settings


| Group       | ID                               | Type           | Label              | Default                                      |
| ----------- | -------------------------------- | -------------- | ------------------ | -------------------------------------------- |
| **Section** | `heading`                        | `text`         | Section Heading    | "How Would You Like to Start?"               |
|             | `subheading`                     | `textarea`     | Description        | -                                            |
|             | `color_scheme`                   | `color_scheme` | Color Scheme       | scheme-1                                     |
| **Card A**  | `card_a_title`                   | `text`         | Card 1 Title       | "Build from Scratch"                         |
|             | `card_a_description`             | `textarea`     | Card 1 Description | "Choose your events, destinations, dates..." |
|             | `card_a_image`                   | `image_picker` | Card 1 Image       | -                                            |
|             | `card_a_button_label`            | `text`         | Card 1 Button      | "Start Building"                             |
| **Card B**  | `card_b_title`                   | `text`         | Card 2 Title       | "Customize a Package"                        |
|             | `card_b_description`             | `textarea`     | Card 2 Description | "Take one of our existing packages..."       |
|             | `card_b_image`                   | `image_picker` | Card 2 Image       | -                                            |
|             | `card_b_button_label`            | `text`         | Card 2 Button      | "Choose a Package"                           |
| **Spacing** | `padding_top` / `padding_bottom` | `range`        | Padding            | 48                                           |


### Behavior

- Each card is a clickable `<a>` pointing to `#custom-trip-form`
- Tiny inline `<script>` (8 lines) on this section: on card click, sets `data-path` attribute on the form section and checks the correct radio button, then smooth-scrolls to form
- Progressive enhancement: without JS, links still scroll to the form; user picks the radio manually

---

## 4. Section 3: Custom Trip Form (The Core)

**File:** [sections/custom-trips-form.liquid](sections/custom-trips-form.liquid)

This is the most complex section. Uses Shopify's `{% form 'contact' %}` tag. Two conditional fieldsets toggled via **CSS `:has()` pseudo-class** (no JS required for toggle).

### Conditional Display Mechanism

```css
/* Default: hide both path-specific fieldsets */
.ct-form__scratch-fields,
.ct-form__customize-fields { display: none; }

/* Show based on which radio is checked */
.ct-form:has(#ct-path-scratch:checked) .ct-form__scratch-fields { display: block; }
.ct-form:has(#ct-path-customize:checked) .ct-form__customize-fields { display: block; }

/* Also toggle shared fields visibility after a path is chosen */
.ct-form:has(input[name="contact[request_type]"]:checked) .ct-form__shared-fields { display: block; }
```

`:has()` has universal browser support as of 2024+ (Chrome 105, Firefox 121, Safari 15.4). No JS fallback needed.

### HTML Structure

```
<section id="custom-trip-form">
  <form 'contact'>
    <input type="hidden" name="contact[subject]" value="Custom Trip Request">

    <!-- Step 1: Path selector (radios) -->
    <fieldset class="ct-form__type-selector">
      <legend>What would you like to do?</legend>
      <label for="ct-path-scratch">
        <input type="radio" id="ct-path-scratch" name="contact[request_type]" value="Build from Scratch">
        Build a Trip from Scratch
      </label>
      <label for="ct-path-customize">
        <input type="radio" id="ct-path-customize" name="contact[request_type]" value="Customize a Package">
        Customize an Existing Package
      </label>
    </fieldset>

    <!-- Path A fields (shown when "scratch" selected) -->
    <div class="ct-form__scratch-fields">
      events checkboxes, destinations checkboxes, dates
    </div>

    <!-- Path B fields (shown when "customize" selected) -->
    <div class="ct-form__customize-fields">
      package dropdown, customization checkboxes, dates
    </div>

    <!-- Shared fields (shown when any path selected) -->
    <div class="ct-form__shared-fields">
      rider level, group size, budget, extras, notes, contact info
    </div>

    <button type="submit">Submit Request</button>
  </form>
</section>
```

### Schema Settings (Section-level)


| Group       | ID                               | Type           | Label              | Default                                 |
| ----------- | -------------------------------- | -------------- | ------------------ | --------------------------------------- |
| **Content** | `heading`                        | `text`         | Form Heading       | "Tell Us About Your Dream Trip"         |
|             | `description`                    | `textarea`     | Form Description   | -                                       |
|             | `submit_label`                   | `text`         | Submit Button Text | "Send My Request"                       |
|             | `success_message`                | `textarea`     | Success Message    | "Thanks! We'll be in touch within 24h." |
| **Labels**  | `scratch_label`                  | `text`         | Path A Label       | "Build from Scratch"                    |
|             | `customize_label`                | `text`         | Path B Label       | "Customize a Package"                   |
| **Colors**  | `color_scheme`                   | `color_scheme` | Color Scheme       | scheme-1                                |
|             | `accent_color`                   | `color`        | Accent Color       | `#2563eb`                               |
| **Spacing** | `padding_top` / `padding_bottom` | `range`        | Padding            | 48                                      |


### Schema Blocks (Merchant-Editable Lists)

**Block type: `event**` (limit: 20)


| ID          | Type   | Label                | Default               |
| ----------- | ------ | -------------------- | --------------------- |
| `name`      | `text` | Event Name           | "Enduro World Series" |
| `date_hint` | `text` | Date Hint (optional) | "June 2026"           |


**Block type: `destination**` (limit: 20)


| ID       | Type   | Label             | Default         |
| -------- | ------ | ----------------- | --------------- |
| `name`   | `text` | Destination Name  | "Whistler, BC"  |
| `region` | `text` | Region (optional) | "North America" |


**Block type: `package**` (limit: 10)


| ID            | Type   | Label             | Default                |
| ------------- | ------ | ----------------- | ---------------------- |
| `name`        | `text` | Package Name      | "Whistler Enduro Week" |
| `description` | `text` | Short Description | "7 days / 6 nights"    |
| `price_hint`  | `text` | Price Hint        | "From $2,400"          |


**Block type: `extra**` (limit: 15)


| ID            | Type   | Label                  | Default                       |
| ------------- | ------ | ---------------------- | ----------------------------- |
| `name`        | `text` | Extra Name             | "Bike Rental"                 |
| `description` | `text` | Description (optional) | "Full-suspension enduro bike" |


### Complete Form Fields Spec

**Hidden fields (always submitted):**

- `contact[subject]` = "Custom Trip Request" (hidden input, value from setting)
- `contact[request_type]` = value of selected radio

**Path A: Build from Scratch**


| Field ID          | HTML Type  | Name Attribute             | Label           | Notes                              |
| ----------------- | ---------- | -------------------------- | --------------- | ---------------------------------- |
| `ct-events`       | checkboxes | `contact[events]`          | Events          | One per event block; values joined |
| `ct-destinations` | checkboxes | `contact[destinations]`    | Destinations    | One per destination block          |
| `ct-dates`        | text       | `contact[preferred_dates]` | Preferred Dates | Free text, v1                      |


**Path B: Customize Package**


| Field ID          | HTML Type  | Name Attribute             | Label           | Notes                                                           |
| ----------------- | ---------- | -------------------------- | --------------- | --------------------------------------------------------------- |
| `ct-package`      | select     | `contact[base_package]`    | Base Package    | Options from package blocks                                     |
| `ct-custom-type`  | checkboxes | `contact[customization]`   | What to Change  | Extend duration, Shorten, Add destinations, Change dates, Other |
| `ct-custom-dates` | text       | `contact[preferred_dates]` | Preferred Dates | Free text                                                       |


**Shared Fields (both paths)**


| Field ID         | HTML Type  | Name Attribute          | Label            | Notes                                                   |
| ---------------- | ---------- | ----------------------- | ---------------- | ------------------------------------------------------- |
| `ct-rider-level` | select     | `contact[rider_level]`  | Rider Level      | Beginner / Intermediate / Advanced / Expert             |
| `ct-group-size`  | select     | `contact[group_size]`   | Group Size       | Solo / 2 / 3-4 / 5-8 / 8+                               |
| `ct-budget`      | select     | `contact[budget_range]` | Budget Range     | <$1k / $1k-2.5k / $2.5k-5k / $5k-10k / $10k+ / Flexible |
| `ct-extras`      | checkboxes | `contact[extras]`       | Extras           | One per extra block                                     |
| `ct-notes`       | textarea   | `contact[body]`         | Additional Notes | Maps to Shopify's default body field                    |
| `ct-name`        | text       | `contact[name]`         | Full Name        | required                                                |
| `ct-email`       | email      | `contact[email]`        | Email Address    | required (Shopify mandates this)                        |
| `ct-phone`       | tel        | `contact[phone]`        | WhatsApp / Phone | with country code hint                                  |
| `ct-country`     | text       | `contact[country]`      | Country          | Free text input                                         |
| `ct-timezone`    | select     | `contact[timezone]`     | Timezone         | UTC offsets or IANA zones                               |


### Checkbox Handling for Email

Shopify contact form sends all `contact[*]` fields in the notification email. For checkbox groups (events, destinations, extras), use this pattern:

```liquid
{% for block in section.blocks %}
  {% if block.type == 'event' %}
    <label>
      <input type="checkbox" name="contact[events]" value="{{ block.settings.name }}">
      {{ block.settings.name }}
    </label>
  {% endif %}
{% endfor %}
```

Multiple checkboxes with the same `name` attribute send comma-separated values in the email. The merchant receives a structured email like:

```
Subject: Custom Trip Request
Request Type: Build from Scratch
Events: Enduro World Series, Red Bull Rampage
Destinations: Whistler BC, Moab UT
Preferred Dates: Late June 2026
Rider Level: Advanced
Group Size: 3-4
Budget Range: $2.5k-5k
Extras: Bike Rental, Guided Park Day, Lodging Upgrade
Notes: We'd love a rest day mid-trip for exploring town...
Name: John Doe
Email: john@example.com
Phone: +1 555 123 4567
Country: United States
Timezone: UTC-7 (Mountain)
```

---

## 5. Section 4: FAQ / Trust

**File:** [sections/custom-trips-faq.liquid](sections/custom-trips-faq.liquid)

Accordion-style FAQ with merchant-editable blocks. Uses `<details>`/`<summary>` for native HTML accordion (no JS).

### Schema Settings


| ID                               | Type           | Label           | Default                      |
| -------------------------------- | -------------- | --------------- | ---------------------------- |
| `heading`                        | `text`         | Section Heading | "Frequently Asked Questions" |
| `subheading`                     | `textarea`     | Description     | -                            |
| `color_scheme`                   | `color_scheme` | Color Scheme    | scheme-1                     |
| `padding_top` / `padding_bottom` | `range`        | Padding         | 48                           |


### Schema Blocks

**Block type: `faq**` (limit: 20)


| ID         | Type       | Label    |
| ---------- | ---------- | -------- |
| `question` | `text`     | Question |
| `answer`   | `richtext` | Answer   |


**Block type: `trust_badge**` (limit: 6)


| ID     | Type           | Label      |
| ------ | -------------- | ---------- |
| `icon` | `image_picker` | Icon       |
| `text` | `text`         | Badge Text |


### Markup

- `<details>` + `<summary>` for each FAQ block (native accordion, accessible, no JS)
- Trust badges rendered as a horizontal row below the FAQ

---

## 6. Events List: Recommendation

**v1 (Blocks):** Best merchant UX for a small catalog. Merchant adds/removes/reorders events directly in the theme editor. Each block type (`event`, `destination`, `package`, `extra`) has simple text settings. Rendered as form options (checkboxes/dropdowns). Limit: 20 per type is more than enough.

**v2 (Metaobjects):** For larger catalogs or when events need richer data (images, multi-day schedules, locations, capacity). Metaobject definitions for Event, Destination, Package. Form section uses metaobject list picker setting. Requires Shopify admin setup but scales better.

**Not recommended:** Schema textarea (comma-separated). Poor merchant UX, error-prone, no validation.

---

## 7. Submission Wiring

- Form uses `{% form 'contact' %}` Liquid tag (same as existing [blocks/contact-form.liquid](blocks/contact-form.liquid))
- Submits to Shopify's built-in `/contact` endpoint
- Email goes to the store owner (Settings > Notifications > Customer notifications > Contact form)
- Hidden field `contact[subject]` structures the email subject
- All `contact[*]` fields appear in the notification email body
- Success/error handling follows the existing pattern: `form.posted_successfully?` and `form.errors`
- For v2: Shopify Flow automation to route to CRM, Slack, etc.

---

## 8. Merchant-Friendliness

- **Presets**: Each section ships with a preset containing sensible defaults and sample blocks (3 events, 3 destinations, 3 packages, 6 extras)
- **Logical setting groups**: Headers separate Media, Content, Colors, Spacing in each section
- **Mobile controls**: Separate `min_height_mobile`, `image_mobile` on hero; form grid collapses to single column
- **Section-scoped CSS variables**: All colors, spacing, sizing driven by CSS vars set from schema settings via inline `style` attribute
- **No hard-coded text**: All labels come from schema settings, all form option text comes from blocks
- **Color scheme support**: Each section respects the theme's color scheme system

---

## 9. v1 vs v2 Upgrade Path

### v1 (This Implementation)

- 4 sections, 1 template
- Blocks for events/destinations/packages/extras
- CSS `:has()` for path toggling (no JS for toggle)
- Minimal JS only for path-selector card -> form radio preselect (~10 lines)
- Free-text date field
- Native `<details>` accordion for FAQ
- Shopify contact form email for submissions

### v2 (Future Enhancements)

- **Date picker**: Replace free-text with Flatpickr or native date inputs with range support
- **Metaobjects**: Replace blocks with metaobject entries for events/destinations (richer data, images, availability)
- **Multi-step form**: Break the form into a wizard with step indicators (JS web component)
- **File upload**: Allow riders to attach route GPX files or reference images
- **Shopify Flow**: Auto-create draft orders, send to CRM, trigger Slack notifications
- **Dynamic pricing**: Show estimated price range based on selections
- **Calendar integration**: Show event calendar with available dates
- **AJAX submission**: Submit without page reload, show inline success

---

## 10. Execution Order

Files to create, in order of implementation:

1. `sections/custom-trips-hero.liquid` (simplest, establishes CSS variable pattern)
2. `sections/custom-trips-faq.liquid` (standalone, no dependencies)
3. `sections/custom-trips-form.liquid` (the core, most complex)
4. `sections/custom-trips-paths.liquid` (depends on form section's radio IDs)
5. `templates/page.custom-trips.json` (wire everything together with presets)
6. Add translation keys to `locales/en.default.schema.json` if using `t:` keys (optional for v1; can use raw strings)

### Accessibility Checklist (per workspace rules)

- All form inputs have associated `<label>` elements (visible, not just `aria-label`)
- `aria-required="true"` on email and name fields
- `aria-invalid` + `aria-describedby` for error states
- `<fieldset>` + `<legend>` for radio and checkbox groups
- Focus management on form success/error (existing pattern from contact-form block)
- Skip link target on form section (`id="custom-trip-form"`, `tabindex="-1"`)
- Color contrast minimum 4.5:1 for all text
- `:focus-visible` styles on all interactive elements

