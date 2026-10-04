import {
  chooseOption,
  expectBannerProductChange,
  replaceField,
  startBanner,
} from "./app-banner-test-support";
import { test } from "./toolcraft-product-test";

test("browser: banner controls change the poster", async ({ page }) => {
  const session = await startBanner(page);

  await expectBannerProductChange(
    session,
    "brief.category",
    (control) => chooseOption(control, page, "Event"),
    "brief.category",
  );
  await expectBannerProductChange(
    session,
    "brief.platform",
    (control) => chooseOption(control, page, "Story"),
    "brief.platform",
  );
  await expectBannerProductChange(
    session,
    "copy.headline",
    (control) => replaceField(control, "Ship the work"),
    "brief.headline",
  );
  await expectBannerProductChange(
    session,
    "copy.support",
    (control) => replaceField(control, "A shorter supporting line"),
    "brief.support",
  );
  await expectBannerProductChange(
    session,
    "copy.cta",
    (control) => replaceField(control, "Join"),
    "brief.cta",
  );
});
