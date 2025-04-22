# Generic E-commerce Website Generator

This project is a data-driven e-commerce website generator. All content, layout, and styling are defined in JSON configuration files, making it easy to adapt to different niches without changing the codebase.

## Key Features

- Fully data-driven architecture
- Configurable through JSON files
- Variant system for components (Hero, ProductGrid, Reviews)
- Dynamic content sections

## Content Structure

The content is organized as follows:

```
public/content/
├── site.json            # Global site configuration
├── hero/
│   └── hero.json        # Hero section configuration
└── sections/
    ├── features.json           # Feature grid (replaces niche-specific names)
    ├── sales-promotion.json    # Promotion countdown (replaces niche-specific names)
    ├── product-grid-variant1.json
    ├── reviews.json
    ├── faq-section.json
    └── newsletter-signup.json
```

## Working With Content

### Using Generic Sections

Always use generic naming for section files to make the site adaptable to different niches. For example:

- Use `features.json` instead of `eyewear-features.json`
- Use `sales-promotion.json` instead of `black-friday-countdown.json`

## Site Configuration

The `site.json` file controls the global site configuration:

- Theme (colors, fonts, etc.)
- Component variants to use
- UI text and translations
- Layout settings

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Adding New Sections

1. Create a new JSON file in `public/content/sections/`
2. Update the `sectionFiles` array in `app/page.tsx`
3. Create a React component for the section if needed
4. Add the component to the `sectionComponents` mapping in `app/page.tsx`

### Troubleshooting

If you encounter build issues like chunk loading errors, try cleaning the Next.js cache:

```bash
# Clean the Next.js cache
npm run clean

# Clean and restart the dev server
npm run clean:start
```

When renaming or modifying JSON files, always update all references in code to maintain consistency.