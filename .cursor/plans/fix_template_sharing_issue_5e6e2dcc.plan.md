---
name: Fix Template Sharing Issue
overview: Create a dedicated About template to separate it from Custom Trips, ensuring each page uses its own independent template and sections in the Theme Editor.
todos:
  - id: create-about-template
    content: Create templates/page.about.json with main-page section only
    status: completed
  - id: deploy-theme
    content: Deploy theme with shopify theme push
    status: completed
  - id: assign-custom-trips-template
    content: In Shopify Admin, assign Custom Trips page to page.custom-trips template
    status: completed
  - id: assign-about-template
    content: In Shopify Admin, assign About Us page to page.about template
    status: completed
  - id: verify-separation
    content: Verify both pages show independent sections in Theme Editor
    status: completed
isProject: false
---

# Fix Custom Trips and About Us Template Sharing Issue

## Why This Issue Happens

In Shopify, **all pages using the same template share the same section configuration**. If both "Custom Trips" and "About Us" are assigned to the default `page` template (or if Custom Trips hasn't been assigned to its dedicated template), any changes made in the Theme Editor affect both pages.

**Current state:**

- `page.custom-trips.json` exists and is valid with 4 sections: hero, paths, form, faq
- All custom-trips section files exist in `/sections/`
- No `page.about.json` exists - About Us uses the default template
- `.shopifyignore` does NOT block templates (safe to deploy)

## Task 1: Verify `page.custom-trips.json` (Already Complete)

The file [templates/page.custom-trips.json](templates/page.custom-trips.json) is valid and contains ONLY custom-trips sections:

```json
{
  "sections": {
    "hero":  { "type": "custom-trips-hero",  ... },
    "paths": { "type": "custom-trips-paths", ... },
    "form":  { "type": "custom-trips-form",  ... },
    "faq":   { "type": "custom-trips-faq",   ... }
  },
  "order": ["hero", "paths", "form", "faq"]
}
```

No changes needed here.

---

## Task 2: Create `templates/page.about.json`

Create a dedicated About template using the theme's existing `main-page` section (same structure as the default page template).

**File to create:** `templates/page.about.json`

```json
{
  "sections": {
    "main": {
      "type": "main-page",
      "blocks": {
        "heading": {
          "type": "text",
          "name": "Title",
          "settings": {
            "text": "<h1>{{ closest.page.title }}</h1>",
            "width": "100%",
            "max_width": "normal",
            "alignment": "left",
            "type_preset": "h2",
            "font": "var(--font-primary--family)",
            "font_size": "",
            "line_height": "normal",
            "letter_spacing": "normal",
            "case": "none",
            "wrap": "pretty",
            "color": "",
            "background": false,
            "background_color": "#00000026",
            "corner_radius": 0,
            "padding-block-start": 0,
            "padding-block-end": 0,
            "padding-inline-start": 0,
            "padding-inline-end": 0
          },
          "blocks": {}
        },
        "page-content": {
          "type": "page-content",
          "settings": {},
          "blocks": {}
        }
      },
      "block_order": ["heading", "page-content"],
      "settings": {
        "content_direction": "column",
        "gap": 32,
        "color_scheme": "scheme-3",
        "padding-block-start": 40,
        "padding-block-end": 80
      }
    }
  },
  "order": ["main"]
}
```

This template:

- Uses the same `main-page` section as the default
- Does NOT include any custom-trips sections
- Can be customized independently in the Theme Editor

---

## Task 3: Confirm `.shopifyignore` Allows Templates

The [.shopifyignore](.shopifyignore) file does NOT contain any rules blocking `templates/*.json`:

- No `templates/` entry
- No `*.json` entry

Templates will deploy correctly with `shopify theme push`.

---

## Task 4: Shopify Admin Steps to Assign Templates

After deploying the theme, assign templates in Shopify Admin:

**For Custom Trips page:**

1. Go to **Online Store** > **Pages**
2. Click on **Custom Trips**
3. In the right sidebar, find **Theme template**
4. Select **page.custom-trips** from the dropdown
5. Click **Save**

**For About Us page:**

1. Go to **Online Store** > **Pages**
2. Click on **About Us**
3. In the right sidebar, find **Theme template**
4. Select **page.about** from the dropdown (or keep "Default page" if preferred)
5. Click **Save**

---

## Task 5: Verification Checklist

After deployment and template assignment:

- **Theme Editor for Custom Trips** shows template `page.custom-trips` in the header
- **Theme Editor for Custom Trips** displays only: Hero, Paths, Form, FAQ sections
- **Theme Editor for About Us** shows template `page.about` (or Default page)
- **Theme Editor for About Us** displays only: Main section (with Title + Page Content)
- Adding a section to Custom Trips does NOT appear on About Us
- Removing a section from About Us does NOT affect Custom Trips

---

## Summary of Changes


| Action | File                               | Description                                  |
| ------ | ---------------------------------- | -------------------------------------------- |
| Verify | `templates/page.custom-trips.json` | Already correct - no changes needed          |
| Create | `templates/page.about.json`        | New dedicated template for About Us          |
| Verify | `.shopifyignore`                   | Already allows templates - no changes needed |


