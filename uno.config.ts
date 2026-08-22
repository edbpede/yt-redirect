import { defineConfig, presetWind4, transformerVariantGroup } from "unocss";

/**
 * UnoCSS is the styling engine — there is no tailwind.config.js in this stack.
 *
 * presetWind4 is the current Tailwind-v4-compatible preset; its predecessors are
 * superseded and must not appear here.
 *
 * The sibling repos also load presetAnimations, presetShadcn and presetIcons.
 * None is here, because none has a consumer on this page: there is no `animate-*`
 * utility, no `i-*` utility and no @iconify-json collection for presetIcons to
 * resolve against (every icon here is an inline SVG carried over verbatim from the
 * pre-migration markup), and no shadcn-svelte component, components.json or cn()
 * helper for presetShadcn to serve. presetShadcn is not free when unused: it emits
 * four @keyframes referencing --radix-* variables nothing here can define. Add one
 * back in the shape faktalink uses at the moment something needs it.
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
