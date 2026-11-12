export type ListFilters = Record<string, string | number | boolean | null | undefined>;

function normalizedFilters(filters: ListFilters = {}) {
  return Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .sort(([left], [right]) => left.localeCompare(right)),
  );
}

export const queryKeys = {
  masterData: {
    all: ["master-data"] as const,
    list: (filters?: ListFilters) => ["master-data", "list", normalizedFilters(filters)] as const,
    detail: (id: string | number) => ["master-data", "detail", id] as const,
  },
  schedule: {
    all: ["schedule"] as const,
    list: (filters?: ListFilters) => ["schedule", "list", normalizedFilters(filters)] as const,
    detail: (id: string | number) => ["schedule", "detail", id] as const,
  },
  quiz: {
    all: ["quiz"] as const,
    list: (filters?: ListFilters) => ["quiz", "list", normalizedFilters(filters)] as const,
    detail: (id: string | number) => ["quiz", "detail", id] as const,
    result: (id: string | number) => ["quiz", "result", id] as const,
    attempts: (filters?: ListFilters) => ["quiz", "attempts", normalizedFilters(filters)] as const,
  },
  questionBank: {
    all: ["question-bank"] as const,
    list: (filters?: ListFilters) => ["question-bank", "list", normalizedFilters(filters)] as const,
    questions: (bankId: string) => ["question-bank", "questions", bankId] as const,
  },
  tasks: {
    all: ["tasks"] as const,
    list: (filters?: ListFilters) => ["tasks", "list", normalizedFilters(filters)] as const,
    detail: (id: string | number) => ["tasks", "detail", id] as const,
    submissions: (assignmentId: string | number, filters?: ListFilters) =>
      ["tasks", "submissions", assignmentId, normalizedFilters(filters)] as const,
  },
  assessment: {
    all: ["assessment"] as const,
    list: (filters?: ListFilters) => ["assessment", "list", normalizedFilters(filters)] as const,
    detail: (id: string | number) => ["assessment", "detail", id] as const,
  },
  reports: {
    all: ["reports"] as const,
    list: (filters?: ListFilters) => ["reports", "list", normalizedFilters(filters)] as const,
    detail: (id: string | number) => ["reports", "detail", id] as const,
    attendance: (filters?: ListFilters) =>
      ["reports", "attendance", normalizedFilters(filters)] as const,
    grades: (filters?: ListFilters) =>
      ["reports", "grades", normalizedFilters(filters)] as const,
    reportCard: (studentId: string | number, period?: string) =>
      ["reports", "report-card", studentId, period ?? ""] as const,
  },
  counseling: {
    all: ["counseling"] as const,
    list: (filters?: ListFilters) => ["counseling", "list", normalizedFilters(filters)] as const,
    detail: (id: string | number) => ["counseling", "detail", id] as const,
    followups: (noteId: string | number) => ["counseling", "followups", noteId] as const,
  },
  aptitude: {
    all: ["aptitude"] as const,
    list: (filters?: ListFilters) => ["aptitude", "list", normalizedFilters(filters)] as const,
    detail: (id: string | number) => ["aptitude", "detail", id] as const,
  },
  passingGrade: {
    all: ["passing-grade"] as const,
    list: (filters?: ListFilters) => ["passing-grade", "list", normalizedFilters(filters)] as const,
    detail: (id: string | number) => ["passing-grade", "detail", id] as const,
  },
  notification: {
    all: ["notification"] as const,
    list: (filters?: ListFilters) => ["notification", "list", normalizedFilters(filters)] as const,
    detail: (id: string | number) => ["notification", "detail", id] as const,
  },
} as const;
