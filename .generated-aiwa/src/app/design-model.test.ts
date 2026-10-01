import { describe, expect, it } from "vitest";

import {
  boxesFor,
  composeDesign,
  motionWave,
  sampleBrief,
  sampleDesign,
} from "./design-model";

describe("composeDesign", () => {
  it("turns the sample brief into an editorial feature poster", () => {
    expect(sampleDesign.issues).toEqual([]);
    expect(sampleDesign.copy.claim).toBe("Every conversation in one shared inbox");
    expect(sampleDesign.copy.proof).toBe(
      "Replies, assignments, and context stay in one place.",
    );
    expect(sampleDesign.copy.ask).toBe("Try the shared inbox");
    expect(sampleDesign.copy.eyebrow).toBe("New feature");
    expect(sampleDesign.arrangement).toBe("editorial");
    expect(composeDesign(sampleBrief).arrangement).toBe("editorial");
  });

  it("picks a different arrangement for a short claim and a long claim", () => {
    const short = composeDesign("Claim: Shared inbox");
    const long = composeDesign(
      "Claim: One shared inbox for the whole support team today",
    );
    expect(short.arrangement).toBe("poster");
    expect(long.arrangement).toBe("split");
    expect(boxesFor(short.arrangement).claim.x).not.toBe(
      boxesFor("editorial").claim.x,
    );
  });

  it("rests at both ends of the motion cycle", () => {
    expect(motionWave(0)).toBe(0);
    expect(motionWave(1)).toBe(0);
  });
});
