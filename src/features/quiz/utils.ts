import type { UserAnswerValue } from "./types";

export function isAnswerCompleted(answer: UserAnswerValue) {
  if (answer === null) {
    return false;
  }

  if (typeof answer === "string") {
    return answer.trim().length > 0;
  }

  if (Array.isArray(answer)) {
    return answer.length > 0;
  }

  return true;
}

export function toggleNumberSelection(
  currentSelection: (string | number)[],
  optionId: string | number,
) {
  if (currentSelection.includes(optionId)) {
    return currentSelection.filter((id) => id !== optionId);
  }

  return [...currentSelection, optionId];
}

export function replaceBooleanAtIndex(
  currentSelection: boolean[],
  index: number,
  value: boolean,
) {
  const nextSelection = [...currentSelection];
  nextSelection[index] = value;
  return nextSelection;
}
