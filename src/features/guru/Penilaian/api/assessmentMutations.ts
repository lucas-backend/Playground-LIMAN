import { useAppMutation } from "../../../../shared/server-state/useAppMutation";
import { queryKeys } from "../../../../shared/server-state/queryKeys";
import {
  createAssessment,
  upsertScore,
  type AssessmentInput,
} from "./assessmentApi";

export function useCreateAssessment() {
  return useAppMutation(createAssessment, {
    invalidateKeys: [queryKeys.assessment.all],
  });
}

export function useUpsertScore(assessmentId: string) {
  return useAppMutation(
    (variables: { studentUserId: string; score: number }) =>
      upsertScore(assessmentId, variables.studentUserId, { score: variables.score }),
    {
      invalidateKeys: [
        queryKeys.assessment.all,
        queryKeys.assessment.detail(assessmentId),
        queryKeys.reports.all,
        queryKeys.reports.grades(),
      ],
    },
  );
}

export type CreateAssessmentVariables = AssessmentInput;
