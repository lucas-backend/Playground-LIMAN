import { request } from "../../../shared/api/client";

export type JsonAnswer = number | (string | number)[] | boolean | boolean[] | string | null;
export type QuizStatus = "draft" | "published" | "active" | "ended";
export type AttemptStatus = "in_progress" | "submitted" | "graded";
export type QuestionBankScope = "latihan" | "ujian";

export interface PageResponse<T> {
  items: T[];
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface QuizSummary {
  id: string;
  title: string;
  subjectId?: string;
  description?: string | null;
}

export interface QuizOption {
  id: string | number;
  label: string;
}

export interface QuizQuestion {
  id: string;
  questionNumber: number;
  type: string;
  question: string;
  options?: QuizOption[];
}

export interface QuizDetail extends QuizSummary {
  startTime: string | null;
  endTime: string | null;
  questions: QuizQuestion[];
}

export interface Attempt {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  startedAt: string;
  submittedAt: string | null;
  status: AttemptStatus;
  score: number | null;
}

export interface AttemptAnswer {
  answerId: string;
  questionId: string;
  userAnswer: JsonAnswer;
  isCorrect: boolean | null;
  score?: number | null;
}

export interface AttemptResult extends Attempt {
  essayPending: boolean;
  answers: AttemptAnswer[];
}

export interface SavedAnswer {
  questionId: number;
  userAnswer: JsonAnswer;
  isCompleted: boolean;
  updatedAt: string;
}

export interface QuestionBank {
  id: string;
  subjectId: string;
  scope: QuestionBankScope;
  ownerId: string;
  questionCount: number;
}

export interface BankQuestion {
  id: string;
  bankId: string;
  type: string;
  body: string;
  options: unknown;
  answerKey?: unknown;
}

function query(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const result = search.toString();
  return result ? `?${result}` : "";
}

export function listQuizzes(params: {
  subjectId?: string;
  classId?: string;
  status?: QuizStatus;
  page?: number;
  pageSize?: number;
} = {}) {
  return request<PageResponse<QuizSummary>>(`/quizzes${query(params)}`);
}

export function getQuiz(quizId: string, attemptId?: string) {
  return request<QuizDetail>(`/quizzes/${encodeURIComponent(quizId)}${query({ attemptId })}`);
}

export function startAttempt(quizId: string) {
  return request<Attempt>(`/quizzes/${encodeURIComponent(quizId)}/attempts`, { method: "POST" });
}

export function listAttempts(params: {
  quizId?: string;
  studentUserId?: string;
  status?: AttemptStatus;
  page?: number;
  pageSize?: number;
} = {}) {
  return request<PageResponse<Attempt>>(`/quiz-attempts${query(params)}`);
}

export function getAttempt(attemptId: string) {
  return request<AttemptResult>(`/quiz-attempts/${encodeURIComponent(attemptId)}`);
}

export function saveAnswer(attemptId: string, questionNumber: number, userAnswer: JsonAnswer) {
  return request<SavedAnswer, { userAnswer: JsonAnswer }>(
    `/quiz-attempts/${encodeURIComponent(attemptId)}/answers/${questionNumber}`,
    { method: "PATCH", body: { userAnswer } },
  );
}

export function submitAttempt(attemptId: string) {
  return request<AttemptResult>(`/quiz-attempts/${encodeURIComponent(attemptId)}/submit`, { method: "POST" });
}

export function gradeAnswer(
  attemptId: string,
  answerId: string,
  body: { isCorrect?: boolean; score?: number; feedback?: string },
) {
  return request<{ answerId: string; isCorrect: boolean; score: number; gradedBy: string; gradedAt: string }, typeof body>(
    `/quiz-attempts/${encodeURIComponent(attemptId)}/answers/${encodeURIComponent(answerId)}/grade`,
    { method: "PUT", body },
  );
}

export function listQuestionBanks(params: {
  scope?: QuestionBankScope;
  subjectId?: string;
  ownerId?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  return request<PageResponse<QuestionBank>>(`/question-banks${query(params)}`);
}

export function listBankQuestions(bankId: string, params: { page?: number; pageSize?: number } = {}) {
  return request<PageResponse<BankQuestion>>(
    `/question-banks/${encodeURIComponent(bankId)}/questions${query(params)}`,
  );
}
