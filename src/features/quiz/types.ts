interface BaseQuestion {
  id: string | number;
  question_number: number;
  question: string;
}

interface Option {
  id: string | number;
  label: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "pilihan_ganda" | "pilihan_ganda_kompleks";
  options: Option[];
  answer?: number | number[];
}

export interface RangeValueQuestion extends BaseQuestion {
  type: "rentang_nilai";
  min_val: number;
  max_val: number;
  min_val_label?: string;
  max_val_label?: string;
}

interface TrueFalseQuestionItem {
  id: number;
  question: string;
  answer?: boolean;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: "benar_salah";
  question_table: TrueFalseQuestionItem[];
}

export interface EssayQuestion extends BaseQuestion {
  type: "essay";
  answer_reference?: string;
}

export type QuizQuestion =
  | MultipleChoiceQuestion
  | RangeValueQuestion
  | TrueFalseQuestion
  | EssayQuestion;

export interface QuizData {
  id: string | number;
  title: string;
  description?: string;
  startTime: string | null;
  endTime: string | null;
  questions: QuizQuestion[];
}

export type UserAnswerValue =
  | number
  | number[]
  | (string | number)[]
  | boolean
  | boolean[]
  | string
  | null;

export interface QuestionResponse {
  questionId: string | number;
  type: QuizQuestion["type"];
  userAnswer: UserAnswerValue;
  isCompleted: boolean;
  updatedAt: string;
}

export interface QuizProgress {
  quizId: string | number;
  startTime: string;
  lastSaved: string;
  responses: Record<string, QuestionResponse>;
}
