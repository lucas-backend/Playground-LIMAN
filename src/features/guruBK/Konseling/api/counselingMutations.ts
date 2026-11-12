import { useAppMutation } from "../../../../shared/server-state/useAppMutation";
import { queryKeys } from "../../../../shared/server-state/queryKeys";
import {
  createCounselingNote,
  createFollowup,
  updateCounselingNote,
} from "./counselingApi";

const counselingListKey = queryKeys.counseling.list();

export function useCreateCounselingNote() {
  return useAppMutation(createCounselingNote, {
    invalidateKeys: [queryKeys.counseling.all, counselingListKey],
  });
}

export function useUpdateCounselingNote(noteId: string) {
  return useAppMutation(
    (body: { note: string }) => updateCounselingNote(noteId, body),
    {
      invalidateKeys: [
        queryKeys.counseling.all,
        counselingListKey,
        queryKeys.counseling.detail(noteId),
        queryKeys.counseling.followups(noteId),
      ],
    },
  );
}

export function useCreateFollowup(noteId: string) {
  return useAppMutation(
    (body: { note: string }) => createFollowup(noteId, body),
    {
      invalidateKeys: [
        queryKeys.counseling.all,
        counselingListKey,
        queryKeys.counseling.detail(noteId),
        queryKeys.counseling.followups(noteId),
      ],
    },
  );
}
