import { defineConfig, presetIcons, presetWind4, transformerVariantGroup } from "unocss";
import presetAnimations from "unocss-preset-animations";
import { presetShadcn } from "unocss-preset-shadcn";

/**
 * UnoCSS is the styling engine — there is no tailwind.config.js in this stack.
 *
 * presetWind4 is the current Tailwind-v4-compatible preset; its predecessors are
 * superseded and must not appear here. presetAnimations supplies the animation
 * utilities that tw-animate-css provides in the Tailwind path, and presetShadcn
 * is the estate's token bridge, kept inert here (see below).
 */
export default defineConfig({
  presets: [
    presetWind4({
      /**
       * THE parity-critical line in this file.
       *
       * presetWind4 defaults to `dark: "class"`, which compiles every `dark:`
       * utility to a `.dark .foo` selector. This page has no theme toggle and no
       * `.dark` class anywhere: dark mode is the operating system's, announced by
       * `<meta name="color-scheme" content="light dark">` in src/pages/index.astro.
       * Under the default, all ~30 `dark:` utilities on this page would compile to
       * selectors that never match, and the site would silently be light-only.
       *
       * "media" emits `@media (prefers-color-scheme: dark)` instead, which is what
       * this page has always relied on. e2e/appearance.spec.ts asserts the rendered
       * result rather than trusting this comment.
       */
      dark: "media",
    }),
    presetAnimations(),
    presetShadcn(
      {
        // No shadcn-svelte component is installed in this repo (see AGENTS.md for
        // why), so there is nothing to consume the preset's token block. Emitting
        // it anyway would ship a dead `:root`/`.dark` palette — and that `.dark`
        // block is precisely the class-based dark mode this page must not have.
        color: false,
        radius: false,
      },
      // Same reasoning for the preset's global element rules: src/styles/global.css
      // owns the handful of base rules this page needs.
      { globals: false },
    ),
    // No @iconify-json collection is installed: every icon on this page is an
    // inline SVG carried over verbatim from the pre-migration markup. The preset
    // is here so that adding one is a dependency line and nothing else.
    presetIcons({
      scale: 1.2,
      extraProperties: { display: "inline-block", "vertical-align": "middle" },
    }),
  ],
  transformers: [transformerVariantGroup()],
  /**
   * `hidden` is toggled by Svelte's `class:hidden={…}` directive (the language
   * menu and the form's error box), and UnoCSS's default extractor does not read
   * class directives — it scans `class="…"` string literals. Verified by removing
   * this line: `.hidden{display:none}` then disappears from the built CSS and the
   * menu is permanently open. The alternative is repeating the literal in the
   * static class attribute, which puts a duplicate `hidden` in the rendered HTML.
   */
  safelist: ["hidden"],
  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // UnoCSS does not scan .ts/.js by default. Nothing in this repo keeps
        // class strings in TypeScript today, but the glob is the estate default
        // and the failure it prevents (silently unstyled components) is invisible
        // until someone hits it.
        "(components|src)/**/*.{js,ts}",
      ],
    },
  },
});
