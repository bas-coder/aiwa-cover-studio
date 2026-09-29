import { ToolcraftApp, ToolcraftDefaultsAuthoringProvider } from "@repo/toolcraft-runtime/react";

import { useAppDefaultsAuthoring } from "../toolcraft/app-defaults-authoring";
import { starterComposition } from "../app/starter-composition";

export function StarterHome(): React.JSX.Element {
  const authoring = useAppDefaultsAuthoring();
  return (
    <ToolcraftDefaultsAuthoringProvider value={authoring}>
      <ToolcraftApp
        canvasContent={starterComposition.canvasContent}
        className="h-dvh min-h-dvh"
        controlRenderers={starterComposition.controlRenderers}
        exportRenderer={starterComposition.exportRenderer}
        infiniteCanvasContent={starterComposition.infiniteCanvasContent}
        modelPresentation={starterComposition.modelPresentation}
        onPanelAction={starterComposition.onPanelAction}
        renderDefaultCanvasMedia={starterComposition.renderDefaultCanvasMedia}
        rendererPipelineRegistration={starterComposition.rendererPipelineRegistration}
        sceneBoundsProvider={starterComposition.sceneBoundsProvider}
        schema={starterComposition.schema}
        svgExportRenderer={starterComposition.svgExportRenderer}
      />
    </ToolcraftDefaultsAuthoringProvider>
  );
}
