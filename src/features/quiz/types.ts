interface BaseQuestion {
  id: number;
  question_number: number;
  question: string;
}

interface Option {
  id: number;
  label: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "pilihan_ganda" | "pilihan_ganda_kompleks";
  options: Option[];
  answer: number | number[];
}

// Range Value Question memang ga ada jawaban benarnya
export interface RangeValueQuestion extends BaseQuestion {
  type: "rentang_nilai";
  min_val: number;
  max_val: number;
  min_val_label?: string;
  max_val_label?: string;
}

// Interface untuk 'satu' baris pertanyaan benar atau salah pada tabel
interface TrueFalseQuestionItem {
  id: number;
  question: string;
  answer: boolean;
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
  id: number;
  title: string;
  description?: string;
  startTime: string | null;
  endTime: string | null;
  questions: QuizQuestion[];
}
