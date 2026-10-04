import { expectToolcraftAcceptanceOutcome } from "./browser-acceptance-outcome-helpers";
import {
  bannerStableProof,
  chooseOption,
  readCombobox,
  startBanner,
} from "./app-banner-test-support";
import { test } from "./toolcraft-product-test";

test("browser: image export settings select format and resolution", async ({ page }) => {
  const session = await startBanner(page);

  await expectToolcraftAcceptanceOutcome(
    () => readCombobox(page, "export.image.format"),
    session.controlAction("export.image.format", (control) =>
      chooseOption(control, page, "JPG"),
    ),
    {
      evidenceType: "command-side-effect",
      requirementId: "export.format",
      ...bannerStableProof,
    },
  );
  await expectToolcraftAcceptanceOutcome(
    () => readCombobox(page, "export.image.resolution"),
    session.controlAction("export.image.resolution", (control) =>
      chooseOption(control, page, "2K"),
    ),
    {
      evidenceType: "command-side-effect",
      requirementId: "export.resolution",
      ...bannerStableProof,
    },
  );
});
