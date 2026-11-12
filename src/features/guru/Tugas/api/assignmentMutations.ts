import { useAppMutation } from "../../../../shared/server-state/useAppMutation";
import { queryKeys } from "../../../../shared/server-state/queryKeys";
import {
  createAssignment,
  gradeSubmission,
  type AssignmentInput,
  type SubmissionGrade,
} from "./assignmentsApi";

export function useCreateAssignment() {
  return useAppMutation(createAssignment, {
    invalidateKeys: [queryKeys.tasks.all],
  });
}

export function useGradeSubmission(assignmentId: string) {
  return useAppMutation(
    (variables: { studentUserId: string; body: SubmissionGrade }) =>
      gradeSubmission(assignmentId, variables.studentUserId, variables.body),
    {
      invalidateKeys: [
        queryKeys.tasks.all,
        queryKeys.tasks.detail(assignmentId),
        queryKeys.tasks.submissions(assignmentId),
      ],
    },
  );
}

export type CreateAssignmentVariables = AssignmentInput;
