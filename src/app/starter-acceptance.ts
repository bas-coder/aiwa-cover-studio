import { starterPerformance } from "./starter-performance";
import {
  getToolcraftControlKeyframeCapability,
  type ResolvedToolcraftAppSchema,
} from "@repo/toolcraft-runtime";

import { getRequiredToolcraftControlPartCoverage } from "./acceptance/control-parts";
export type { ToolcraftExportRequestEvidence } from "./acceptance/types";
export {
  getToolcraftApplicabilitySelectorDomain,
  getToolcraftControlApplicabilityErrors,
  type ToolcraftApplicabilitySelectorDomain,
  type ToolcraftApplicabilitySelectorValue,
} from "./acceptance/control-applicability";
export {
  getToolcraftApplicabilityRequirementId,
  getToolcraftControlApplicabilityCases,
  type ToolcraftControlApplicabilityCase,
} from "./acceptance/control-applicability-cases";
import {
  createToolcraftFeatureVerificationSelection,
  type ToolcraftFeatureVerificationSelection,
  type ToolcraftFeatureVerificationRequest,
} from "./acceptance/feature-verification-selection";
import {
  getToolcraftControlOrder as getToolcraftControlOrderForSchema,
  getToolcraftControlOrderTargets as getToolcraftControlOrderTargetsForSchema,
  inferToolcraftControlOrderRole,
} from "./acceptance/control-order";
import type {
  ToolcraftAcceptanceEvidence,
  ToolcraftAnimationIntent,
  ToolcraftAutonomousAnimationCoverage,
  ToolcraftBuiltInControlType,
  ToolcraftBuiltInFitCheck,
  ToolcraftBackgroundOutputCoverage,
  ToolcraftCanvasSizingCoverage,
  ToolcraftComponentAcceptance,
  ToolcraftControlOrderItem,
  ToolcraftControlPartCoverage,
  ToolcraftControlSectionInventoryEntry,
  ToolcraftFiniteSelectorInventoryEntry,
  ToolcraftCustomControlCoverage,
  ToolcraftExportArtifactCoverage,
  ToolcraftLayerCoverage,
  ToolcraftInteractionCapability,
  ToolcraftInteractionEvidenceSource,
  ToolcraftInteractionOwnershipEntry,
  ToolcraftInteractionSurface,
  ToolcraftInfinityCanvasCoverage,
  ToolcraftInfinityOverflowCoverage,
  ToolcraftMediaLifecycleCoverage,
  ToolcraftModelImportCoverage,
  ToolcraftOrientationGizmoCoverage,
  ToolcraftMotionReferenceBehavior,
  ToolcraftMotionReferenceCoverage,
  ToolcraftMotionReferenceEvent,
  ToolcraftMotionReferenceEvidence,
  ToolcraftMotionReferenceEvidenceEvent,
  ToolcraftMotionReferenceInput,
  ToolcraftMotionReferenceOrdinalFrame,
  ToolcraftMotionReferencePhase,
  ToolcraftMotionReferenceSourceKind,
  ToolcraftMotionReferenceStudy,
  ToolcraftMotionReferenceTimedFrame,
  ToolcraftMotionReferenceTimingClaim,
  ToolcraftMotionReferenceTimingMode,
  ToolcraftPersistenceCoverage,
  ToolcraftProductReadiness,
  ToolcraftReferenceCoverage,
  ToolcraftReferenceFeatureInventoryItem,
  ToolcraftReferenceFeatureStatus,
  ToolcraftReferenceInput,
  ToolcraftReferenceStudyEvidence,
  ToolcraftReferenceStudyStatus,
  ToolcraftReferenceTimelineContract,
  ToolcraftReferenceTimelineCoverage,
  ToolcraftReferenceTimelineMode,
  ToolcraftRenderScaleCoverage,
  ToolcraftRenderScaleState,
  ToolcraftSettingsTransferCoverage,
  ToolcraftSelectionScopeCoverage,
  ToolcraftTimelineLoopDurationIntent,
  ToolcraftTimelineLoopDurationSource,
  ToolcraftTimelinePlaybackCoverage,
  ToolcraftTransferMode,
  ToolcraftViewInteractionAuthority,
  ToolcraftViewInteractionIntent,
  ToolcraftVisibleControl,
} from "./acceptance/types";
import { TOOLCRAFT_REQUIRED_MODEL_IMPORT_COVERAGE } from "./acceptance/types";
import {
  collectToolcraftVisibleAcceptanceControls,
  validateToolcraftAcceptanceDiagnostics as validateToolcraftAcceptanceDiagnosticsInput,
  validateToolcraftAcceptanceCoverage as validateToolcraftAcceptanceInput,
  type ToolcraftAcceptanceValidationInput,
} from "./acceptance/validate-coverage";
import type { ToolcraftAcceptanceDiagnostic } from "./acceptance/validation-pipeline";
import {
  starterAcceptance,
  starterControlSectionInventory,
  starterProductReadiness,
  starterTransferMode,
} from "./starter-acceptance-data";
import { starterSchema } from "./starter-schema";

export {
  createToolcraftFeatureVerificationSelection,
  getRequiredToolcraftControlPartCoverage,
  inferToolcraftControlOrderRole,
  starterAcceptance,
  starterControlSectionInventory,
  starterProductReadiness,
  starterTransferMode,
  TOOLCRAFT_REQUIRED_MODEL_IMPORT_COVERAGE,
};
export type {
  ToolcraftAcceptanceEvidence,
  ToolcraftAcceptanceDiagnostic,
  ToolcraftAnimationIntent,
  ToolcraftAutonomousAnimationCoverage,
  ToolcraftBuiltInControlType,
  ToolcraftBuiltInFitCheck,
  ToolcraftBackgroundOutputCoverage,
  ToolcraftCanvasSizingCoverage,
  ToolcraftComponentAcceptance,
  ToolcraftControlOrderItem,
  ToolcraftControlPartCoverage,
  ToolcraftControlSectionInventoryEntry,
  ToolcraftFiniteSelectorInventoryEntry,
  ToolcraftCustomControlCoverage,
  ToolcraftExportArtifactCoverage,
  ToolcraftFeatureVerificationRequest,
  ToolcraftFeatureVerificationSelection,
  ToolcraftLayerCoverage,
  ToolcraftInteractionCapability,
  ToolcraftInteractionEvidenceSource,
  ToolcraftInteractionOwnershipEntry,
  ToolcraftInteractionSurface,
  ToolcraftInfinityCanvasCoverage,
  ToolcraftInfinityOverflowCoverage,
  ToolcraftMediaLifecycleCoverage,
  ToolcraftModelImportCoverage,
  ToolcraftOrientationGizmoCoverage,
  ToolcraftMotionReferenceBehavior,
  ToolcraftMotionReferenceCoverage,
  ToolcraftMotionReferenceEvent,
  ToolcraftMotionReferenceEvidence,
  ToolcraftMotionReferenceEvidenceEvent,
  ToolcraftMotionReferenceInput,
  ToolcraftMotionReferenceOrdinalFrame,
  ToolcraftMotionReferencePhase,
  ToolcraftMotionReferenceSourceKind,
  ToolcraftMotionReferenceStudy,
  ToolcraftMotionReferenceTimedFrame,
  ToolcraftMotionReferenceTimingClaim,
  ToolcraftMotionReferenceTimingMode,
  ToolcraftPersistenceCoverage,
  ToolcraftProductReadiness,
  ToolcraftReferenceCoverage,
  ToolcraftReferenceFeatureInventoryItem,
  ToolcraftReferenceFeatureStatus,
  ToolcraftReferenceInput,
  ToolcraftReferenceStudyEvidence,
  ToolcraftReferenceStudyStatus,
  ToolcraftReferenceTimelineContract,
  ToolcraftReferenceTimelineCoverage,
  ToolcraftReferenceTimelineMode,
  ToolcraftRenderScaleCoverage,
  ToolcraftRenderScaleState,
  ToolcraftSettingsTransferCoverage,
  ToolcraftSelectionScopeCoverage,
  ToolcraftTimelineLoopDurationIntent,
  ToolcraftTimelineLoopDurationSource,
  ToolcraftTimelinePlaybackCoverage,
  ToolcraftTransferMode,
  ToolcraftViewInteractionAuthority,
  ToolcraftViewInteractionIntent,
  ToolcraftVisibleControl,
};

export function createToolcraftFeaturePlanFromCurrentApp(
  request: ToolcraftFeatureVerificationRequest,
): ToolcraftFeatureVerificationSelection {
  return createToolcraftFeatureVerificationSelection({
    acceptance: starterAcceptance,
    request,
    schema: starterSchema,
    sectionInventory: starterControlSectionInventory,
  });
}

export function validateToolcraftAcceptanceDiagnostics(
  input: ToolcraftAcceptanceValidationInput,
): ToolcraftAcceptanceDiagnostic[] {
  return validateToolcraftAcceptanceDiagnosticsInput(input);
}

export function collectToolcraftVisibleControls(
  schema: ResolvedToolcraftAppSchema = starterSchema,
): ToolcraftVisibleControl[] {
  return collectToolcraftVisibleAcceptanceControls(schema);
}

export function collectToolcraftKeyframeableControls(
  schema: ResolvedToolcraftAppSchema = starterSchema,
): ToolcraftVisibleControl[] {
  return collectToolcraftVisibleControls(schema).filter(
    ({ control }) => getToolcraftControlKeyframeCapability(control).capable,
  );
}

export function getToolcraftControlOrder(
  schema: ResolvedToolcraftAppSchema = starterSchema,
): ToolcraftControlOrderItem[] {
  return getToolcraftControlOrderForSchema(schema);
}

export function getToolcraftControlOrderTargets(
  schema: ResolvedToolcraftAppSchema = starterSchema,
): string[] {
  return getToolcraftControlOrderTargetsForSchema(schema);
}

function isToolcraftAcceptanceValidationInput(
  value: ToolcraftAcceptanceValidationInput | ResolvedToolcraftAppSchema,
): value is ToolcraftAcceptanceValidationInput {
  return (
    "acceptance" in value &&
    "productReadiness" in value &&
    "schema" in value &&
    "sectionInventory" in value &&
    "transferMode" in value
  );
}

export function validateToolcraftAcceptanceCoverage(
  input: ToolcraftAcceptanceValidationInput,
): string[];
export function validateToolcraftAcceptanceCoverage(
  schema?: ResolvedToolcraftAppSchema,
  acceptance?: readonly ToolcraftComponentAcceptance[],
  transferMode?: ToolcraftTransferMode,
  sectionInventory?: readonly ToolcraftControlSectionInventoryEntry[],
  productReadiness?: ToolcraftProductReadiness,
): string[];
export function validateToolcraftAcceptanceCoverage(
  inputOrSchema: ToolcraftAcceptanceValidationInput | ResolvedToolcraftAppSchema = starterSchema,
  acceptance: readonly ToolcraftComponentAcceptance[] = starterAcceptance,
  transferMode: ToolcraftTransferMode = starterTransferMode,
  sectionInventory: readonly ToolcraftControlSectionInventoryEntry[] =
    starterControlSectionInventory,
  productReadiness: ToolcraftProductReadiness = starterProductReadiness,
): string[] {
  const input = isToolcraftAcceptanceValidationInput(inputOrSchema)
    ? inputOrSchema
    : {
        acceptance,
        productReadiness,
        rendererPipeline: starterPerformance.rendererPipeline,
        schema: inputOrSchema,
        sectionInventory,
        transferMode,
      };

  return validateToolcraftAcceptanceInput(input);
}

export function validateProductAcceptanceCoverage(): string[] {
  return validateToolcraftAcceptanceCoverage({
    acceptance: starterAcceptance,
    productReadiness: starterProductReadiness,
    rendererPipeline: starterPerformance.rendererPipeline,
    schema: starterSchema,
    sectionInventory: starterControlSectionInventory,
    transferMode: starterTransferMode,
  });
}
