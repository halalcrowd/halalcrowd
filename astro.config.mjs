import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://halalcrowd.sg",
  integrations: [
    tailwind({
      applyBaseStyles: false
    })
  ]
});
