import { parseToolcraftAppDefaults } from "@repo/toolcraft-runtime";
import { starterSchema } from "../app/starter-schema";

export function validateAppDefaults(value: unknown) {
  return parseToolcraftAppDefaults(starterSchema, value);
}
