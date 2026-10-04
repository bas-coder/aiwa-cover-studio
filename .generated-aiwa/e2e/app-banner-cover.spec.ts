import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  bannerBackdrop,
  bannerCoverSize,
  chooseOption,
  exportThrough,
  startBanner,
} from "./app-banner-test-support";
import { expect, test } from "./toolcraft-product-test";
import { runToolcraftBrowserAction } from "./browser-proof-session";

test("browser: cover captures the banner plate", async ({ page }) => {
  const session = await startBanner(page);
  await runToolcraftBrowserAction(
    session.controlAction("canvas.aspectRatio", (control) =>
      chooseOption(control, page, "16:9"),
    ),
  );
  await expect(
    page.locator('[data-toolcraft-control-target="canvas.size.width"] input'),
  ).toHaveValue(String(bannerCoverSize.width));
  await expect(
    page.locator('[data-toolcraft-control-target="canvas.size.height"] input'),
  ).toHaveValue(String(bannerCoverSize.height));
  const download = await exportThrough(session, page);
  const coverDirectory = path.join(process.cwd(), "public", "toolcraft");
  await mkdir(coverDirectory, { recursive: true });
  await download.saveAs(path.join(coverDirectory, "cover.png"));
  const coverState = {
    aspectRatio: "16:9",
    canvas: {
      height: bannerCoverSize.height,
      unit: "px",
      width: bannerCoverSize.width,
    },
    values: {
      "appearance.background": bannerBackdrop,
      "art.direction": "Soft orange light across a dark field",
      "brief.category": "brand",
      "brief.platform": "open-graph",
      "copy.cta": "Learn more",
      "copy.headline": "Build what matters",
      "export.includeBackground": true,
    },
  };
  await writeFile(
    path.join(process.cwd(), "app-cover-state.json"),
    `${JSON.stringify(coverState, null, 2)}\n`,
  );
  await writeFile(
    path.join(process.cwd(), "app-cover.json"),
    `${JSON.stringify(
      {
        asset: "public/toolcraft/cover.png",
        generation: {
          description:
            "Actual app result at the recorded settings; 16:9 output capture, no editor UI.",
          kind: "app-composition",
          source: "src/app/app-composition.tsx",
          state: "app-cover-state.json",
        },
        title: "AIWA Banners",
        version: 1,
      },
      null,
      2,
    )}\n`,
  );
});
