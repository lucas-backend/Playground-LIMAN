import { afterEach, describe, expect, it, vi } from "vitest";
import { queryKeys } from "./queryKeys";
import { appQueryClient } from "./queryClient";
import { invalidateQueryKeys } from "./useAppMutation";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("server-state conventions", () => {
  it("creates distinct keys when filters or pages change", () => {
    expect(queryKeys.tasks.list({ status: "open", page: 1 }))
      .not.toEqual(queryKeys.tasks.list({ status: "open", page: 2 }));
    expect(queryKeys.tasks.list({ status: "open", page: 1 }))
      .toEqual(queryKeys.tasks.list({ page: 1, status: "open" }));
    expect(queryKeys.tasks.submissions("assignment-1", { page: 1 }))
      .not.toEqual(queryKeys.tasks.submissions("assignment-2", { page: 1 }));
    expect(queryKeys.reports.reportCard("student-1", "2026/2027"))
      .not.toEqual(queryKeys.reports.reportCard("student-2", "2026/2027"));
  });

  it("invalidates only the query keys declared by a mutation", async () => {
    const invalidateQueries = vi.spyOn(appQueryClient, "invalidateQueries");
    const tasksKey = queryKeys.tasks.list({ page: 1 });
    const reportKey = queryKeys.reports.list({ page: 1 });

    await invalidateQueryKeys([tasksKey]);

    expect(invalidateQueries).toHaveBeenCalledTimes(1);
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: tasksKey });
    expect(invalidateQueries).not.toHaveBeenCalledWith({ queryKey: reportKey });
  });
});
