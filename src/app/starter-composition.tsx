import { composeToolcraftApp } from "@repo/toolcraft-runtime/react";

import { starterSchema } from "./starter-schema";

export const starterComposition = composeToolcraftApp(starterSchema, {});
