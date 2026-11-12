import {
  useMutation,
  type MutationFunction,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useRef } from "react";
import { appQueryClient } from "./queryClient";

type AppMutationOptions<TData, TError, TVariables, TContext> =
  UseMutationOptions<TData, TError, TVariables, TContext> & {
    invalidateKeys?: readonly (readonly unknown[])[];
  };

export function invalidateQueryKeys(
  queryKeys: readonly (readonly unknown[])[],
) {
  return Promise.all(
    queryKeys.map((queryKey) => appQueryClient.invalidateQueries({ queryKey })),
  );
}

export function useAppMutation<TData, TError = Error, TVariables = void, TContext = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
  options: AppMutationOptions<TData, TError, TVariables, TContext> = {},
) {
  const { invalidateKeys = [], onSuccess, ...mutationOptions } = options;
  const submitting = useRef(false);
  const mutation = useMutation({
    ...mutationOptions,
    mutationFn,
    onSuccess: async (data, variables, context, mutationContext) => {
      await invalidateQueryKeys(invalidateKeys);
      await onSuccess?.(data, variables, context, mutationContext);
    },
  });

  const mutateOnce = (variables: TVariables) => {
    if (submitting.current) return;
    submitting.current = true;
    mutation.mutate(variables, {
      onSettled: () => {
        submitting.current = false;
      },
    });
  };

  return { ...mutation, mutateOnce };
}
